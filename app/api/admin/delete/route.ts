import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import QueryModel from '@/lib/models/query';
import EnquiryModel from '@/lib/models/enquiry';
import PartnerModel from '@/lib/models/partner';
import ExpertModel from '@/lib/models/expert';
import TestimonialModel from '@/lib/models/testimonial';
import CertPartnerModel from '@/lib/models/certpartner';
import CourseModel from '@/lib/models/course';

export async function DELETE(req: NextRequest) {
  try {
    const { id, type } = await req.json();
    
    if (!id || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    let result;
    switch (type) {
      case 'query':
        result = await QueryModel.findByIdAndDelete(id);
        break;
      case 'enquiry':
        result = await EnquiryModel.findByIdAndDelete(id);
        break;
      case 'partner':
        result = await PartnerModel.findByIdAndDelete(id);
        break;
      case 'expert':
        result = await ExpertModel.findByIdAndDelete(id);
        break;
      case 'testimonial':
        result = await TestimonialModel.findByIdAndDelete(id);
        break;
      case 'certpartner':
        result = await CertPartnerModel.findByIdAndDelete(id);
        break;
      case 'course':
        result = await CourseModel.findByIdAndDelete(id);
        break;
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type specified' },
          { status: 400 }
        );
    }
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: `${type} not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete ${req.body?.type}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete item' },
      { status: 500 }
    );
  }
}