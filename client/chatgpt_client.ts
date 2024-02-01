import OpenAI from "openai";


async function isAppropriate (productReview: string){
        const openai = new OpenAI({
            apiKey: '--',
            organization: '--'
        })
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'Rate the following product review as true if it contains no swear words and as false if it contains swear words.' },
                { role: 'user', content: productReview }
            ]
        })
        return response.choices[0].message.content?.toLowerCase() ?? 'false';
}
  
export { isAppropriate }
  
