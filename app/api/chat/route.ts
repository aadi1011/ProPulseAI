import { NextResponse } from "next/server";

const BASE_API_URL = "https://api.langflow.astra.datastax.com";
const LANGFLOW_ID = "7e084384-03af-44c8-926d-b906e0c278f9";
const APPLICATION_TOKEN = process.env.APPLICATION_TOKEN;
const ENDPOINT = "propulseai";

const TWEAKS = {
  "ChatInput-NEjMF": {},
  "Prompt-Gp5El": {},
  "ChatOutput-ZZYWJ": {},
  "AstraDBChatMemory-jQY63": {},
  "Memory-vc7xr": {},
  "StoreMessage-cK14r": {},
  "TavilyAISearch-ZSM2N": {},
  "Agent-88rOo": {},
  "File-N3ezi": {},
  "SplitText-eJp4a": {},
  "AstraDB-tBE0t": {},
  "AstraDB-U2ZmI": {},
  "ParseData-VCfLH": {},
};

export const dynamic = "force-dynamic"; // Ensure the route is treated as dynamic

export async function POST(req) {
  try {
    // Parse the request JSON
    const { message } = await req.json();
    console.log("Message received:", message);

    // Prepare the payload
    const payload = {
      input_value: message,
      output_type: "chat",
      input_type: "chat",
      tweaks: TWEAKS,
    };

    // Make the API call
    const apiResponse = await fetch(
      `${BASE_API_URL}/lf/${LANGFLOW_ID}/api/v1/run/${ENDPOINT}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${APPLICATION_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Langflow API error:", apiResponse.status, errorText);
      return NextResponse.json(
        { error: `Langflow API error: ${errorText}` },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    console.log("Langflow API response:", data);

    // Extract the AI message
    const aiMessage =
      data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text;

    if (!aiMessage) {
      throw new Error("Invalid Langflow API response structure.");
    }

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred while contacting the Langflow API." },
      { status: 500 }
    );
  }
}
