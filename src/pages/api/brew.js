// api/brew.js
import axios from 'axios';

// Your OpenAI API Key
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Configure axios for the OpenAI API
const openaiApi = axios.create({
  baseURL: 'https://api.openai.com/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { beerDescription, beerVolume, units, brewType } = req.body;
  
        // Construct the prompt for the OpenAI GPT API
        const sysprompt = `You are a brewing assistant bot, you take a request from a user and return a concise response formatted as an ingredients list with a title of 'Ingredients:', followed by a concise set of brewing instructions, with a title 'Instructions:', followed by a numpy array of floats which contains the estimates of the ABV, SRM, and IBU of the final beer, with the title 'Estimates:'. Each new ingredient and each new instruction should begin with a new line.`
        const prompt = `Generate a homebrewing beer recipe with this description: '${beerDescription}'. I want the recipe to use the ${brewType} method, and result in a beer with a final volume of ${beerVolume} liters. Please give the answer in ${units} units.`
        const summaryprompt = `Given this recipe, can you please provide me with an array of three numbers inside square brackets which approximate the ABV of the final beer, the approximate SRM color of the final beer, and the IBU of the final beer.`
        
        const openaiRes = await openaiApi.post('', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: sysprompt },
                { role: "user", content: prompt }],
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            n: 1,
        });
  
        const responseText = openaiRes.data.choices[0].message.content;
        const temp = responseText.split("Ingredients:")[1];
        const temp2 = temp.split("Instructions:");
        const recipe = temp2[0];
        const instructions = temp2[1];

        //const openaiRes2 = await openaiApi.post('', {
        //    model: "gpt-3.5-turbo",
        //    messages: [
        //        { role: "system", content: sysprompt },
        //        { role: "user", content: prompt },
        //        { role: "assistant", content: responseText}],
        //    temperature: 0.7,
        //    top_p: 1,
        //    frequency_penalty: 0,
        //    presence_penalty: 0,
        //    n: 1,
        //});

        //const responseText2 = openaiRes2.data.choices[0].message.content;
        //console.log(responseText2);
        
        // You can parse and format the responseText to create separate recipe and instructions as needed
        res.status(200).json({
          recipe: recipe,
          instructions: instructions, // Update this to separate instructions if necessary
        });
      } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ message: 'An error occurred while generating the recipe', error: error.message });
      }
    } else {
      // If the request method is not POST, return an error
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }
  