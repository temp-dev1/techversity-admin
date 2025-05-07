import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import EnquiryModel from '@/lib/models/enquiry';

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await EnquiryModel.find().sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Failed to fetch enquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}