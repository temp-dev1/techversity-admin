import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import CourseModel from '@/lib/models/course';
import mongoose from 'mongoose';

// GET all courses
export async function GET() {
  try {
    await connectToDatabase();
    const courses = await CourseModel.find().sort({ id: 1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST: Add a new course
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const data = JSON.parse(formData.get('data') as string);

    if (!image || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const imageBlob = await put(`courses/${timestamp}-${image.name}`, image, {
      access: 'public',
    });

    await connectToDatabase();

    const highestId = await CourseModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    // Upload mentor images and company logos
    if (data.mentors && Array.isArray(data.mentors)) {
      for (let i = 0; i < data.mentors.length; i++) {
        const mentorImage = formData.get(`mentorImage_${i}`) as File;
        const companyLogo = formData.get(`companyLogo_${i}`) as File;

        if (mentorImage && mentorImage.size > 0) {
          const mentorImageBlob = await put(`mentors/${timestamp}-${mentorImage.name}`, mentorImage, { access: 'public' });
          data.mentors[i].image = mentorImageBlob.url;
        }

        if (companyLogo && companyLogo.size > 0) {
          const companyLogoBlob = await put(`companies/${timestamp}-${companyLogo.name}`, companyLogo, { access: 'public' });
          data.mentors[i].companyLogo = companyLogoBlob.url;
        }
      }
    }

    const courseData = {
      id: nextId,
      ...data,
      image: imageBlob.url,
    };

    const newCourse = new CourseModel(courseData);
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

// PUT: Update existing course
// Inside the route.ts file, update the PUT function:

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const image = formData.get('image') as File;
    const data = JSON.parse(formData.get('data') as string);

    console.log('Updating course with ID:', id);

    if (!id || !data) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const timestamp = Date.now();
    const updateData = { ...data };

    // Upload course image if provided
    if (image && image.size > 0) {
      const imageBlob = await put(`courses/${timestamp}-${image.name}`, image, {
        access: 'public',
      });
      updateData.image = imageBlob.url;
    }

    // Upload updated mentor images and logos
    if (updateData.mentors && Array.isArray(updateData.mentors)) {
      for (let i = 0; i < updateData.mentors.length; i++) {
        const mentorImage = formData.get(`mentorImage_${i}`) as File;
        const companyLogo = formData.get(`companyLogo_${i}`) as File;

        if (mentorImage && mentorImage.size > 0) {
          const mentorImageBlob = await put(`mentors/${timestamp}-${mentorImage.name}`, mentorImage, { access: 'public' });
          updateData.mentors[i].image = mentorImageBlob.url;
        }

        if (companyLogo && companyLogo.size > 0) {
          const companyLogoBlob = await put(`companies/${timestamp}-${companyLogo.name}`, companyLogo, { access: 'public' });
          updateData.mentors[i].companyLogo = companyLogoBlob.url;
        }
      }
    }

    // Find and update the course using MongoDB's _id
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      id,
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
    const message = error instanceof Error ? error.message : 'Failed to update course';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
