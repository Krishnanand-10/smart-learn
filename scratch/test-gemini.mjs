import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
  console.log("Loading callGemini wrapper...");
  const { callGemini } = await import('../src/lib/gemini.js');

  console.log("Testing callGemini with a basic prompt:");
  try {
    const result = await callGemini({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Hello, respond with exactly "Gemini is online."' }]
        }
      ]
    });
    console.log("\n====================================");
    console.log("SUCCESS!");
    console.log("Model Used:", result.modelUsed);
    console.log("Response text:", result.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    console.log("====================================\n");
  } catch (err) {
    console.error("\n====================================");
    console.error("TEST FAILED!");
    console.error("Error Message:", err.message);
    console.error("Status:", err.status);
    console.error("====================================\n");
  }
}

runTest();
