import { useState } from "react";
import { generateImage } from "../api";

function ImageUpload({ image, onImageChange, id }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="cursor-pointer block">
        <div className="aspect-square w-full bg-white/50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center hover:border-indigo-500 hover:bg-white/75 transition-colors duration-300">
          {image ? (
            <img
              src={image}
              alt="Upload preview"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span className="mt-2 block font-medium">
                Upload Person Photo
              </span>
            </div>
          )}
        </div>
      </label>
      <input
        id={id}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
}

// The form component for generating the image.
function ImageGeneratorForm() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [gesture, setGesture] = useState("handshake");
  const [background, setBackground] = useState("beach");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e, setImage) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGenerate = async () => {
    if (!image1 || !image2) {
      alert("Please upload both photos before generating.");
      return;
    }
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const outputImage = await generateImage(
        image1,
        image2,
        gesture,
        background
      );
      setGeneratedImage(outputImage);
    } catch (error) {
      alert("Failed to generate image: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 max-w-4xl mx-auto my-12 p-6 sm:p-8 rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload
          image={image1}
          onImageChange={(e) => handleImageChange(e, setImage1)}
          id="file-upload-1"
        />
        <ImageUpload
          image={image2}
          onImageChange={(e) => handleImageChange(e, setImage2)}
          id="file-upload-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div>
          <label
            htmlFor="gesture"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Choose Gesture
          </label>
          <select
            id="gesture"
            value={gesture}
            onChange={(e) => setGesture(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="handshake">Handshake</option>
            {/* More options can be added later */}
          </select>
        </div>
        <div>
          <label
            htmlFor="background"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Choose Background
          </label>
          <select
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="beach">Beach</option>
            <option value="theatre">Theatre</option>
            <option value="office">Office</option>
            <option value="playground">Playground</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-4 px-8 bg-indigo-600 text-white font-bold text-lg rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {isLoading ? "Generating Your Picture..." : "Generate"}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isLoading || generatedImage ? "max-h-[1000px] mt-8" : "max-h-0 mt-0"
        }`}
      >
        <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          {isLoading && (
            <p className="text-gray-500">Processing, please wait...</p>
          )}
          {generatedImage && (
            <img
              src={generatedImage}
              alt="Generated"
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGeneratorForm;
