import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FaCheck } from "react-icons/fa";

interface Slide {
  text: string;
  background?: string;
}

interface SlideCreatorProps {
  formattedLyrics: string;
}

export default function SlideCreator({ formattedLyrics }: SlideCreatorProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "center"
  );
  const [textVerticalAlign, setTextVerticalAlign] = useState<
    "top" | "center" | "bottom"
  >("center");
  // @ts-ignore
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(24);
  const [fontFamily, setFontFamily] = useState<string>("Arial");

  // Generate slides from formatted lyrics
  useEffect(() => {
    const splitSlides = formattedLyrics
      .split(/\n\n+/) // Split by two or more newlines
      .map((slideText) => ({ text: slideText.trim() }));
    setSlides(splitSlides);
    setCurrentSlideIndex(0);
  }, [formattedLyrics]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);

        // Apply background to all slides
        const updatedSlides = slides.map((slide) => ({
          ...slide,
          background: imageUrl,
        }));
        setSlides(updatedSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);

        // Apply background to all slides
        const updatedSlides = slides.map((slide) => ({
          ...slide,
          background: imageUrl,
        }));
        setSlides(updatedSlides);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const previewNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const previewPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const downloadSlidesAsZip = async () => {
    const zip = new JSZip();
    const slideCanvas = document.createElement("canvas");
    const ctx = slideCanvas.getContext("2d")!;
    slideCanvas.width = 1920; // True slide dimensions
    slideCanvas.height = 1080;

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      ctx.clearRect(0, 0, slideCanvas.width, slideCanvas.height);

      // Draw background
      if (slide.background) {
        const img = new Image();
        img.src = slide.background;
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.drawImage(img, 0, 0, slideCanvas.width, slideCanvas.height);
            resolve(true);
          };
        });
      } else {
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, slideCanvas.width, slideCanvas.height);
      }

      // Draw text
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = "white";
      ctx.textAlign = textAlign;
      ctx.textBaseline = textVerticalAlign === "center" ? "middle" : "top";
      const x = textAlign === "left" ? 50 : textAlign === "right" ? 1870 : 960;
      const y =
        textVerticalAlign === "top"
          ? 50
          : textVerticalAlign === "bottom"
          ? 1030
          : 540;
      slide.text.split("\n").forEach((line, idx) => {
        ctx.fillText(line, x, y + idx * (fontSize + 10));
      });

      const imageData = slideCanvas.toDataURL("image/png");
      zip.file(`slide_${i + 1}.png`, imageData.split(",")[1], { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "slides.zip");
  };

  // Default colors for the grid
  const colors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#FFC0CB",
  ];

  // Toggle color selection
  const toggleColorSelection = (color: string) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const applyColorsToText = (text: string): JSX.Element[] => {
    // Split text into words and newlines, preserving \n as separate elements
    const parts = text.split(/(\s+|\n)/);

    return parts.map((part, index) => {
      // Check if the part is a fully capitalized word (excluding newlines)
      const isCapitalized =
        part === part.toUpperCase() && /^[A-Z]+$/.test(part) && part !== "I";

      const randomColor =
        selectedColors.length > 0
          ? selectedColors[Math.floor(Math.random() * selectedColors.length)]
          : "#FFFFFF"; // Default to white if no color is selected

      return (
        <span
          key={index}
          style={{
            color: isCapitalized ? randomColor : "inherit",
            marginRight: part.trim() !== "" ? "5px" : "0",
          }}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Panel: Settings */}
      <div className="lg:col-span-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Slide Settings
        </h2>

        {/* Font Size */}
        <div className="mb-4">
          <h3 className="font-semibold">Font Size:</h3>
          <input
            type="range"
            min={12}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-gray-700">{fontSize}px</p>
        </div>

        {/* Font Family */}
        <div className="mb-4">
          <h3 className="font-semibold">Font Family:</h3>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        {/* Text Settings */}
        <div className="mb-4">
          <h3 className="font-semibold">Text Alignment:</h3>
          <select
            value={textAlign}
            onChange={(e) =>
              setTextAlign(e.target.value as "left" | "center" | "right")
            }
            className="w-full p-2 border rounded"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>

          <h3 className="font-semibold mt-4">Vertical Alignment:</h3>
          <select
            value={textVerticalAlign}
            onChange={(e) =>
              setTextVerticalAlign(
                e.target.value as "top" | "center" | "bottom"
              )
            }
            className="w-full p-2 border rounded"
          >
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">
            Select Colors for Capitalized Words:
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className="w-10 h-10 rounded-full relative cursor-pointer border-2 border-transparent hover:border-gray-500"
                style={{ backgroundColor: color }}
                onClick={() => toggleColorSelection(color)}
              >
                {selectedColors.includes(color) && (
                  <FaCheck className="absolute inset-0 m-auto text-white text-sm" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drag and Drop for Image */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed p-4 rounded-lg text-center text-gray-500 cursor-pointer"
        >
          Drag and drop an image here, or{" "}
          <label
            htmlFor="image-upload"
            className="text-orange-500 underline cursor-pointer"
          >
            click to upload
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {/* Download Button */}
        <button
          onClick={downloadSlidesAsZip}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download All Slides as ZIP
        </button>
      </div>

      {/* Right Panel: Preview */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Slide Preview
        </h2>
        <p className="text-gray-700 mb-4">
          Slide {currentSlideIndex + 1} of {slides.length}
        </p>
        {slides.length > 0 && (
          <div
            className="relative border rounded-lg bg-cover bg-center mx-auto"
            style={{
              width: "90%",
              paddingTop: "56.25%", // Maintain 16:9 aspect ratio
              backgroundImage: slides[currentSlideIndex].background
                ? `url(${slides[currentSlideIndex].background})`
                : "none",
              backgroundColor: "#f3f4f6",
            }}
          >
            <p
              className="absolute w-full text-white"
              style={{
                textAlign: textAlign,
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
                whiteSpace: "pre-wrap",
                top:
                  textVerticalAlign === "top"
                    ? "10%"
                    : textVerticalAlign === "center"
                    ? "50%"
                    : "90%",
                transform:
                  textVerticalAlign === "center" ? "translateY(-50%)" : "none",
              }}
            >
              {applyColorsToText(slides[currentSlideIndex].text)}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            disabled={currentSlideIndex === 0}
            onClick={previewPreviousSlide}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
            disabled={currentSlideIndex === slides.length - 1}
            onClick={previewNextSlide}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
