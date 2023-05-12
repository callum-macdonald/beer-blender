// api/brew.js
import { OpenAIStream } from "../../utils/OpenAIStream";
//import axios from 'axios';

// Your OpenAI API Key
//const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Configure axios for the OpenAI API
//const openaiApi = axios.create({
//  baseURL: 'https://api.openai.com/v1/chat/completions',
//  headers: {
//    'Content-Type': 'application/json',
//    'Authorization': `Bearer ${OPENAI_API_KEY}`,
//  },
//});

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {

  const { beerDescription, beerVolume, units, brewType } = (await req.json()) as {
    beerDescription?: string,
    beerVolume?: string,
    units?: string,
    brewType?: string
    ;}
  //console.log("running brew api");
  //console.log(units);

  // Table of approximate losses due to boil off and grain absorption
  //const lossTable = {
  //  'extract': ,
  //  'all grain': ,
  //  'brew in a bag': ,
  //}

  // Construct the prompt for the OpenAI GPT API
  const sysprompt = `You are a brewing assistant bot, you take a request from a user and return a concise response formatted as an ingredients list with a title of "Ingredients:", followed by a concise set of brewing instructions, with a title "Instructions:", followed by a list which contains the estimates of the ABV, SRM, and IBU of the final beer, with the title "Estimates:". Each new ingredient and each new instruction should begin with a new line.`
  const prompt = `Generate a homebrewing beer recipe with this description: ${beerDescription}. I want the recipe to use the ${brewType} method, and result in a beer with a final volume of ${beerVolume} liters. Please give the answer in ${units} units.`
  // ^^ Legacy prompts
  //const sysprompt = `You are a brewing assistant bot, you take a recipe request from a user and return a concise response formatted as follows: A concise ingredients list with a title of "Ingredients:", followed by a concise set of brewing instructions with a title "Instructions:", followed by a list which contains the estimates of the ABV, SRM, and IBU of the final beer, with the title "Estimates:". Each new ingredient and each new instruction should begin with a new line. Assume a loss of 1 Litre of water per kg of grain ingredients, and a loss of about 100mL per Liter of water per hour due to boil off, you must account for these losses to reach the user requested final volume of beer.`
  //const prompt = `Generate a homebrewing beer recipe with this description: ${beerDescription}. I want the recipe to use the ${brewType} method. Please ensure the instructions will result in a final volume of ${beerVolume} liters. Please use ${units} units in your response.`
  
  //console.log(beerDescription);
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: sysprompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  //console.log(payload);

  //const responseText = openaiRes.data.choices[0].message.content;
  //const temp = responseText.split("Ingredients:")[1];
  //const temp2 = temp.split("Instructions:");
  //const recipe = temp2[0];
  //const instructions = temp2[1];

  // You can parse and format the responseText to create separate recipe and instructions as needed
  //res.status(200).json({
  //  recipe: recipe,
  //  instructions: instructions, // Update this to separate instructions if necessary
  //});

  const stream = await OpenAIStream(payload);
  return new Response(stream);
  //catch (error) {
  //  console.error('Error generating recipe:', error);
  //  res.status(500).json({ message: 'An error occurred while generating the recipe', error: error.message });
  //}
}; // else {
      // If the request method is not POST, return an error
    //  res.setHeader('Allow', 'POST');
    //  res.status(405).end('Method Not Allowed');
    //}
  //}

export default handler