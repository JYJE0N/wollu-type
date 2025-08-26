import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TypingStats } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as {
      userId?: string;
      language: string;
      textType: string;
      textContent: string;
      stats: TypingStats;
    };

    const record = await prisma.typingRecord.create({
      data: {
        userId: data.userId || null,
        language: data.language,
        textType: data.textType,
        textContent: data.textContent,
        wpm: data.stats.wpm,
        cpm: data.stats.cpm,
        accuracy: data.stats.accuracy,
        duration: data.stats.duration,
        totalChars: data.stats.totalChars,
        correctChars: data.stats.correctChars,
        incorrectChars: data.stats.incorrectChars,
      },
    });

    return NextResponse.json({ success: true, recordId: record.id });
  } catch (error) {
    console.error('Error saving typing record:', error);
    return NextResponse.json(
      { error: 'Failed to save typing record' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const language = searchParams.get('language');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: { userId?: string; language?: string } = {};
    if (userId) where.userId = userId;
    if (language) where.language = language;

    const records = await prisma.typingRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching typing records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch typing records' },
      { status: 500 }
    );
  }
}