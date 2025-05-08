import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import CourseModel from '@/lib/models/course';
import mongoose from 'mongoose';


export async function GET() {
  try {
    // Ensure database connection is successful
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected.');

    // Fetch courses sorted by 'id'
    const courses = await CourseModel.find().sort({ id: 1 });

    // Check if courses were returned
    if (!courses.length) {
      console.log('No courses found');
    }

    return NextResponse.json(courses);
  } catch (error: unknown) {
    // Check if the error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Detailed error logging
    console.error('Failed to fetch courses:', errorMessage);
    
    // Return specific error response
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses', error: errorMessage },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const rating = Number(formData.get('rating'));
    const reviews = Number(formData.get('reviews'));
    const duration = formData.get('duration') as string;
    const level = formData.get('level') as string;
    const price = Number(formData.get('price'));
    const discountedPrice = Number(formData.get('discountedPrice'));
    const nextBatch = formData.get('nextBatch') as string;
    const description = formData.get('description') as string;
    
    // Parse JSON strings back to arrays/objects
    const features = JSON.parse(formData.get('features') as string);
    const learningOutcomes = JSON.parse(formData.get('learningOutcomes') as string);
    const careerOpportunities = JSON.parse(formData.get('careerOpportunities') as string);
    const targetAudience = JSON.parse(formData.get('targetAudience') as string);
    const mentors = JSON.parse(formData.get('mentors') as string);
    const programFees = JSON.parse(formData.get('programFees') as string);

    if (!image || !title || !category || !rating || !reviews || !duration || !level || 
        !price || !discountedPrice || !nextBatch || !description) {
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
    const highestId = await CourseModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    const newCourse = new CourseModel({
      id: nextId,
      title,
      image: blob.url,
      category,
      rating,
      reviews,
      duration,
      level,
      price,
      discountedPrice,
      nextBatch,
      description,
      features,
      learningOutcomes,
      careerOpportunities,
      targetAudience,
      mentors,
      programFees,
    });

    await newCourse.save();

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = Number(formData.get('id'));
    const image = formData.get('image') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const rating = Number(formData.get('rating'));
    const reviews = Number(formData.get('reviews'));
    const duration = formData.get('duration') as string;
    const level = formData.get('level') as string;
    const price = Number(formData.get('price'));
    const discountedPrice = Number(formData.get('discountedPrice'));
    const nextBatch = formData.get('nextBatch') as string;
    const description = formData.get('description') as string;
    
    // Parse JSON strings back to arrays/objects
    const features = JSON.parse(formData.get('features') as string);
    const learningOutcomes = JSON.parse(formData.get('learningOutcomes') as string);
    const careerOpportunities = JSON.parse(formData.get('careerOpportunities') as string);
    const targetAudience = JSON.parse(formData.get('targetAudience') as string);
    const mentors = JSON.parse(formData.get('mentors') as string);
    const programFees = JSON.parse(formData.get('programFees') as string);

    if (!id || !title || !category || !rating || !reviews || !duration || !level || 
        !price || !discountedPrice || !nextBatch || !description) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateData: any = {
      title,
      category,
      rating,
      reviews,
      duration,
      level,
      price,
      discountedPrice,
      nextBatch,
      description,
      features,
      learningOutcomes,
      careerOpportunities,
      targetAudience,
      mentors,
      programFees,
    };

    if (image && image.size > 0) {
      const blob = await put(image.name, image, {
        access: 'public',
      });
      updateData.image = blob.url;
    }

    const updatedCourse = await CourseModel.findOneAndUpdate(
      { id }, // id is now a number
      updateData,
      { new: true }
    );
    

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update course' },
      { status: 500 }
    );
  }
}
