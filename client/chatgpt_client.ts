import OpenAI from "openai";


async function isAppropriate (productReview: string){
        const openai = new OpenAI({
<<<<<<< HEAD
            apiKey: process.env.api_key,
            organization: process.env.organization_id
=======
            apiKey: '--',
            organization: '--'
>>>>>>> 215bc1cb0dd0a29d92d972cec4c1475f57af9b7c
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
  
