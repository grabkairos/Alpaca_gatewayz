import { NextResponse } from 'next/server';
import { modelService } from '@/lib/database';

export async function GET() {
  try {
    // Test database connection
    const models = await modelService.getAllModels();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        modelsCount: models.length,
        models: models.slice(0, 3) // Return first 3 models as sample
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

