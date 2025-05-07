import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import TestimonialModel from '@/lib/models/testimonial';

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await TestimonialModel.find().sort({ id: 1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const company = formData.get('company') as string;
    const testimonial = formData.get('testimonial') as string;
    const course = formData.get('course') as string;

    if (!image || !name || !role || !company || !testimonial || !course) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Vercel Blob
    const blob = await put(image.name, image, {
      access: 'public',
    });

    await connectToDatabase();
    
    // Get the highest existing id
    const highestId = await TestimonialModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    const newTestimonial = new TestimonialModel({
      id: nextId,
      name,
      role,
      company,
      testimonial,
      course,
      image: blob.url,
    });

    await newTestimonial.save();

    return NextResponse.json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const image = formData.get('image') as File;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const company = formData.get('company') as string;
    const testimonial = formData.get('testimonial') as string;
    const course = formData.get('course') as string;

    if (!id || !name || !role || !company || !testimonial || !course) {
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
      testimonial,
      course,
    };

    if (image && image.size > 0) {
      const blob = await put(image.name, image, {
        access: 'public',
      });
      updateData.image = blob.url;
    }

    const updatedTestimonial = await TestimonialModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, message: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, testimonial: updatedTestimonial });
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}