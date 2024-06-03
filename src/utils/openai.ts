import OpenAI from 'openai';
import { AISystemMessage } from '~/utils/constants';
import ChatCompletionUserMessageParam = OpenAI.ChatCompletionUserMessageParam;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getHelp(messages: ChatCompletionUserMessageParam[]) {
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [AISystemMessage, ...messages],
        stream: false,
    });

    console.log(response);
    console.log(response.object);
    console.log(response.object.length);
    console.log(response.choices);
    console.log(response.choices[0].message.content);

    return response.choices[0].message.content ?? '';
}
