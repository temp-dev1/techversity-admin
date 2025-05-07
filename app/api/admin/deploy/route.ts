import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = await fetch(process.env.VERCEL_DEPLOY_HOOK_URL!, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to trigger deployment');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to trigger deployment' },
      { status: 500 }
    );
  }
}