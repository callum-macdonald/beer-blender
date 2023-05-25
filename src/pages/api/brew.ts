// api/brew.js
// based on gihub.com/Nutlope/twitterbio
import { OpenAIStream } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

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
  

  // Construct the prompt for the OpenAI GPT API
  const sysprompt = `You are a brewing assistant bot, you take a request from a user and return a concise response formatted as an ingredients list with a title of "Ingredients:", followed by a concise set of brewing instructions, with a title "Instructions:", followed by a list which contains the estimates of the ABV, SRM, and IBU of the final beer, with the title "Estimates:". Each new ingredient and each new instruction should begin with a new line.`
  const prompt = `Generate a homebrewing beer recipe with this description: ${beerDescription}. I want the recipe to use the ${brewType} method, and result in a beer with a final volume of ${beerVolume} liters. Please give the answer in ${units} units.`
  // ^^ Legacy prompts
  //const sysprompt = `You are a brewing assistant bot, you take a recipe request from a user and return a concise response formatted as follows: A concise ingredients list with a title of "Ingredients:", followed by a concise set of brewing instructions with a title "Instructions:", followed by a list which contains the estimates of the ABV, SRM, and IBU of the final beer, with the title "Estimates:". Each new ingredient and each new instruction should begin with a new line. Assume a loss of 1 Litre of water per kg of grain ingredients, and a loss of about 100mL per Liter of water per hour due to boil off, you must account for these losses to reach the user requested final volume of beer.`
  //const prompt = `Generate a homebrewing beer recipe with this description: ${beerDescription}. I want the recipe to use the ${brewType} method. Please ensure the instructions will result in a final volume of ${beerVolume} liters. Please use ${units} units in your response.`
  
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

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}; 
export default handler