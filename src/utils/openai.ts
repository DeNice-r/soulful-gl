import OpenAI from 'openai';
import { AISystemMessage } from '~/utils/constants';
import ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getHelp(
    messages: (
        | ChatCompletionUserMessageParam
        | ChatCompletionSystemMessageParam
    )[],
) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [AISystemMessage, ...messages],
        stream: false,
    });

    return response.choices[0].message.content ?? '';
}
