import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import PartnerModel from '@/lib/models/partner';

export async function GET() {
  try {
    await connectToDatabase();
    const partners = await PartnerModel.find().sort({ id: 1 });
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const logo = formData.get('logo') as File;
    const name = formData.get('name') as string;

    if (!logo || !name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload logo to Vercel Blob
    const blob = await put(logo.name, logo, {
      access: 'public',
    });

    await connectToDatabase();
    
    // Get the highest existing id
    const highestId = await PartnerModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    const newPartner = new PartnerModel({
      id: nextId,
      name,
      logo: blob.url,
    });

    await newPartner.save();

    return NextResponse.json({ success: true, partner: newPartner });
  } catch (error) {
    console.error('Failed to create partner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create partner' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const logo = formData.get('logo') as File;
    const name = formData.get('name') as string;

    if (!id || !name) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: any = { name };

    if (logo && logo.size > 0) {
      const blob = await put(logo.name, logo, {
        access: 'public',
      });
      updateData.logo = blob.url;
    }

    const updatedPartner = await PartnerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedPartner) {
      return NextResponse.json(
        { success: false, message: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, partner: updatedPartner });
  } catch (error) {
    console.error('Failed to update partner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update partner' },
      { status: 500 }
    );
  }
}