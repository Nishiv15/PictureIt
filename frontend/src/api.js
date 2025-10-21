function imageToBase64(image) {
  return new Promise((resolve, reject) => {
    const processBlob = (blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1];
        // Resolve with both the data and the detected mimeType
        resolve({ data: base64Data, mimeType: blob.type });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    };

    // If it's a blob URL, fetch it first to get the blob object
    if (typeof image === "string" && image.startsWith("blob:")) {
      fetch(image)
        .then((res) => res.blob())
        .then(processBlob)
        .catch(reject);
    } else if (image instanceof File) {
      // If it's a File object, we can process it directly
      processBlob(image);
    } else {
      reject(
        new Error("Invalid image format. Expected a blob URL or a File object.")
      );
    }
  });
}

export async function generateImage(image1, image2, gesture, background) {
  // This is the endpoint for the Nano-Banana model.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) {
    console.error("Missing VITE_GEMINI_API_KEY in import.meta.env");
    throw new Error(
      "Missing API key. Add VITE_GEMINI_API_KEY to frontend/.env and restart the dev server."
    );
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

  // 1. Construct the detailed text prompt for the model.
  const prompt = `Create a photorealistic image of two people. 
    - The first person is from the first uploaded image.
    - The second person is from the second uploaded image.
    - They are performing a ${gesture}.
    - The setting is a ${background}.
    - Ensure the final image is seamless, well-composed, and naturally blends the two individuals into the new scene.`;

  try {
    // 2. Convert images to base64 and get their MIME types.
    const [imageData1, imageData2] = await Promise.all([
      imageToBase64(image1),
      imageToBase64(image2),
    ]);

    // 3. Construct the API payload using the dynamic MIME types.
    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imageData1.mimeType,
                data: imageData1.data,
              },
            },
            {
              inlineData: {
                mimeType: imageData2.mimeType,
                data: imageData2.data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    // 4. Make the API call with exponential backoff for retries.
    let response;
    let retries = 3;
    let delay = 10000;
    for (let i = 0; i < retries; i++) {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) break;

      if (response.status === 429 || response.status >= 500) {
        const jitter = Math.random() * 1000;
        console.warn(
          `Retry ${i + 1}/${retries}: ${response.status}. Waiting ${
            (delay + jitter) / 1000
          }s...`
        );
        await new Promise((res) => setTimeout(res, delay + jitter));
        delay *= 2;
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    }

    if (!response.ok) {
      throw new Error(
        `API request failed after all retries with status: ${response.status}`
      );
    }

    const result = await response.json();

    // 5. Extract the base64 image data from the response.
    const base64Data = result?.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData
    )?.inlineData?.data;

    if (!base64Data) {
      console.error(
        "API Response was missing image data:",
        JSON.stringify(result, null, 2)
      );
      throw new Error(
        "Failed to generate image. The model did not return image data."
      );
    }

    // 6. Return the image data in a format that can be used directly in an <img> src attribute.
    return `data:image/png;base64,${base64Data}`;
  } catch (error) {
    console.error("Error during image generation:", error);
    throw error; // Propagate the error to be handled by the UI
  }
}
