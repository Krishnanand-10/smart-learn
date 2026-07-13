export async function callGemini(bodyPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }

  const models = [
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-3-flash-preview'
  ];

  let lastError = null;
  let lastStatus = 500;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const maxRetries = 2;
    let delay = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini Request] Attempting call to model: ${model} (Attempt ${attempt + 1}/${maxRetries + 1})`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyPayload)
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonErr) {
          throw new Error(`Failed to parse JSON response from Gemini API: ${jsonErr.message}`);
        }

        if (response.ok) {
          console.log(`[Gemini Request] Successful response from model: ${model}`);
          return { response, data, modelUsed: model };
        }

        lastStatus = response.status;
        const errMessage = data?.error?.message || `Gemini API error (Status ${response.status})`;
        lastError = new Error(errMessage);

        console.warn(`[Gemini Request] Model ${model} returned error status ${response.status}: ${errMessage}`);

        // If the error is 503 (High Demand), 429 (Rate Limit), or 5xx (Internal Server Errors), we can retry.
        if (response.status === 503 || response.status === 429 || response.status >= 500) {
          if (attempt < maxRetries) {
            console.warn(`[Gemini Request] Retrying model ${model} in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
            continue;
          }
        }
        
        break;
      } catch (err) {
        lastError = err;
        lastStatus = 500;
        console.warn(`[Gemini Request] Fetch error for model ${model}: ${err.message}`);
        
        if (attempt < maxRetries) {
          console.warn(`[Gemini Request] Retrying model ${model} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        break;
      }
    }

    console.warn(`[Gemini Request] Model ${model} failed all attempts. Falling back to the next model...`);
  }

  const finalError = new Error(lastError?.message || 'All Gemini models failed to generate content');
  finalError.status = lastStatus;
  throw finalError;
}
