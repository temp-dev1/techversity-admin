import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import CertPartnerModel from '@/lib/models/certpartner';

export async function GET() {
  try {
    await connectToDatabase();
    const certPartners = await CertPartnerModel.find();
    return NextResponse.json(certPartners);
  } catch (error) {
    console.error('Failed to fetch certification partners:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certification partners' },
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

    const newCertPartner = new CertPartnerModel({
      name,
      logo: blob.url,
    });

    await newCertPartner.save();

    return NextResponse.json({ success: true, certPartner: newCertPartner });
  } catch (error) {
    console.error('Failed to create certification partner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create certification partner' },
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

    const updatedCertPartner = await CertPartnerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCertPartner) {
      return NextResponse.json(
        { success: false, message: 'Certification partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, certPartner: updatedCertPartner });
  } catch (error) {
    console.error('Failed to update certification partner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update certification partner' },
      { status: 500 }
    );
  }
}