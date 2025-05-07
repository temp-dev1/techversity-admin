import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import ExpertModel from '@/lib/models/expert';

export async function GET() {
  try {
    await connectToDatabase();
    const experts = await ExpertModel.find().sort({ id: 1 });
    return NextResponse.json(experts);
  } catch (error) {
    console.error('Failed to fetch experts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const companyLogo = formData.get('companyLogo') as File;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const company = formData.get('company') as string;
    const experience = formData.get('experience') as string;
    const linkedin = formData.get('linkedin') as string;

    if (!image || !companyLogo || !name || !role || !company || !experience || !linkedin) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload images to Vercel Blob
    const [imageBlob, logoBlob] = await Promise.all([
      put(image.name, image, { access: 'public' }),
      put(companyLogo.name, companyLogo, { access: 'public' }),
    ]);

    await connectToDatabase();
    
    // Get the highest existing id
    const highestId = await ExpertModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    const newExpert = new ExpertModel({
      id: nextId,
      name,
      role,
      company,
      experience,
      linkedin,
      image: imageBlob.url,
      companyLogo: logoBlob.url,
    });

    await newExpert.save();

    return NextResponse.json({ success: true, expert: newExpert });
  } catch (error) {
    console.error('Failed to create expert:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create expert' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const image = formData.get('image') as File;
    const companyLogo = formData.get('companyLogo') as File;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const company = formData.get('company') as string;
    const experience = formData.get('experience') as string;
    const linkedin = formData.get('linkedin') as string;

    if (!id || !name || !role || !company || !experience || !linkedin) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: any = {
      name,
      role,
      company,
      experience,
      linkedin,
    };

    if (image && image.size > 0) {
      const imageBlob = await put(image.name, image, { access: 'public' });
      updateData.image = imageBlob.url;
    }

    if (companyLogo && companyLogo.size > 0) {
      const logoBlob = await put(companyLogo.name, companyLogo, { access: 'public' });
      updateData.companyLogo = logoBlob.url;
    }

    const updatedExpert = await ExpertModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedExpert) {
      return NextResponse.json(
        { success: false, message: 'Expert not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, expert: updatedExpert });
  } catch (error) {
    console.error('Failed to update expert:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update expert' },
      { status: 500 }
    );
  }
}