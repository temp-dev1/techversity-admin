import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import connectToDatabase from '@/lib/mongodb';
import CourseModel from '@/lib/models/course';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await CourseModel.find().sort({ id: 1 });
    return NextResponse.json(courses);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Failed to fetch courses:', errorMessage);
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

    const courseImageBlob = await put(image.name, image, { access: 'public' });

    // Upload mentor images and logos
    for (let i = 0; i < mentors.length; i++) {
      const mentorImage = formData.get(`mentor_image_${i}`) as File;
      const mentorLogo = formData.get(`mentor_logo_${i}`) as File;

      if (mentorImage instanceof File && mentorImage.size > 0) {
        const blob = await put(mentorImage.name, mentorImage, { access: 'public' });
        mentors[i].image = blob.url;
      }

      if (mentorLogo instanceof File && mentorLogo.size > 0) {
        const blob = await put(mentorLogo.name, mentorLogo, { access: 'public' });
        mentors[i].companyLogo = blob.url;
      }
    }

    await connectToDatabase();

    const highestId = await CourseModel.findOne().sort('-id');
    const nextId = highestId ? highestId.id + 1 : 1;

    const newCourse = new CourseModel({
      id: nextId,
      title,
      image: courseImageBlob.url,
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

    // Upload mentor images and logos if provided
    for (let i = 0; i < mentors.length; i++) {
      const mentorImage = formData.get(`mentor_image_${i}`) as File;
      const mentorLogo = formData.get(`mentor_logo_${i}`) as File;

      if (mentorImage instanceof File && mentorImage.size > 0) {
        const blob = await put(mentorImage.name, mentorImage, { access: 'public' });
        mentors[i].image = blob.url;
      }

      if (mentorLogo instanceof File && mentorLogo.size > 0) {
        const blob = await put(mentorLogo.name, mentorLogo, { access: 'public' });
        mentors[i].companyLogo = blob.url;
      }
    }

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

    if (image instanceof File && image.size > 0) {
      const blob = await put(image.name, image, { access: 'public' });
      updateData.image = blob.url;
    }

    const updatedCourse = await CourseModel.findOneAndUpdate(
      { id },
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
