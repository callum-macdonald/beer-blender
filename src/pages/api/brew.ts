import { OpenAIStream } from "../../utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "Server misconfiguration: OPENAI_API_KEY is missing." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const { beerDescription, beerVolume, units, brewType } = (await req.json()) as {
    beerDescription?: string;
    beerVolume?: string;
    units?: string;
    brewType?: string;
  };

  const sysprompt =
    'You are a brewing assistant bot, you take a request from a user and return a concise response formatted as an ingredients list with a title of "Ingredients:", followed by a concise set of brewing instructions, with a title "Instructions:", followed by a list which contains the ABV, SRM, and IBU numbers of the final beer, with the title "Estimates:". Each new ingredient and each new instruction should begin with a new line.';
  const prompt = `Generate a homebrewing beer recipe with this description: ${beerDescription}. I want the recipe to use the ${brewType} method, and result in a beer with a final volume of ${beerVolume} US gallons. Please give the answer in ${units} units.`;

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: sysprompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  try {
    const stream = await OpenAIStream(payload);
    return new Response(stream);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown OpenAI error.";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export default handler;
