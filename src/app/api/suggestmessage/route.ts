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
            prompt: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
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
