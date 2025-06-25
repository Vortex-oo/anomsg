//NEED TO SET UP A BILLING ACCOUNT TO USE THIS FEATURE


import vertex from '../../../../types/vertex-type';
import { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const result = streamText({
            model: vertex('gemini-2.5-flash-preview-04-17'),
            providerOptions: {
                google: {
                    thinkingConfig: {
                        includeThoughts: true,
                    },
                } satisfies GoogleGenerativeAIProviderOptions,
            },
            prompt: 'Explain quantum computing in simple terms.',
        });

        let finalText = '';
        let thoughts = [];

        console.log("Result object:", result);

        for await (const part of result.fullStream) {
            console.log("Stream part:", part);
            if (part.type === 'reasoning') {
                thoughts.push(part.textDelta);
            } else if (part.type === 'text-delta') {
                finalText += part.textDelta;
            }
        }

        return NextResponse.json({
            message: 'Text streamed and captured',
            success: true,
            thoughts,
            text: finalText,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: 'Streaming failed',
            success: false,
            error: (error as Error).message || 'Unknown error'
        }, { status: 500 });
    }
}
