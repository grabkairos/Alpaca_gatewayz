import { NextResponse } from 'next/server';
import { modelService } from '@/lib/database';
import { topModels } from '@/lib/data';
import { models } from '@/lib/models-data';

export async function POST() {
  try {
    // Initialize models collection with current mock data
    const results = [];
    
    for (const model of models) {
      const result = await modelService.addModel({
        name: model.name,
        isFree: model.isFree,
        tokens: model.tokens,
        category: model.category,
        description: model.description,
        developer: model.developer,
        context: model.context,
        inputCost: model.inputCost,
        outputCost: model.outputCost,
        modalities: model.modalities,
        series: model.series,
        supportedParameters: model.supportedParameters
      });
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        modelsAdded: results.length,
        modelIds: results.map(r => r.id)
      }
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      message: 'Database initialization failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

