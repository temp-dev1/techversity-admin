import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import QueryModel from '@/lib/models/query';

export async function GET() {
  try {
    await connectToDatabase();
    const queries = await QueryModel.find().sort({ createdAt: -1 });
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Failed to fetch queries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}