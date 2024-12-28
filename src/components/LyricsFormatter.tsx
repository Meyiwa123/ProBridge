import { useState, useEffect } from "react";

export default function LyricsFormatter({ lyrics }: { lyrics: string }) {
  const [boldWords, setBoldWords] = useState<string[]>([]);
  const [precision, setPrecision] = useState<number>(50);
  const [lyricsState, setLyricsState] = useState<string>("");
  const [formattedLyrics, setFormattedLyrics] = useState<string>("");

  // Update input field when new lyrics are selected
  useEffect(() => {
    if (lyrics) {
      setLyricsState(lyrics);
    }
  }, [lyrics]);

  // Detects and removes repeated lines based on precision
  const detectRepetition = (text: string): string => {
    const lines = text.split("\n");
    const lineCounts: Record<string, number> = {};
    const maxLinesPerSlide = Math.ceil(100 / precision); // Dynamically adjust the number of lines per slide

    lines.forEach((line) => {
      const trimmedLine = line.trim().toLowerCase();
      lineCounts[trimmedLine] = (lineCounts[trimmedLine] || 0) + 1;
    });

    let currentSlide: string[] = [];
    const slides: string[] = [];
    lines.forEach((line) => {
      const trimmedLine = line.trim().toLowerCase();
      const isRepetitive = lineCounts[trimmedLine] > Math.ceil(100 / precision);

      if (currentSlide.length < maxLinesPerSlide && !isRepetitive) {
        currentSlide.push(line);
      } else {
        slides.push(currentSlide.join("\n"));
        currentSlide = isRepetitive ? [] : [line];
      }
    });

    if (currentSlide.length > 0) {
      slides.push(currentSlide.join("\n"));
    }

    // Add blank line between slides and remove extra blank lines
    return slides.join("\n\n").replace(/\n{3,}/g, "\n\n");
  };

  // Converts specified words to uppercase
  const handleUppercase = (text: string): string => {
    let formattedText = text;
    boldWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      formattedText = formattedText.replace(regex, (match) =>
        match.toUpperCase()
      );
    });
    return formattedText;
  };

  const addBoldWord = (word: string): void => {
    if (word && !boldWords.includes(word)) {
      setBoldWords([...boldWords, word]);
    }
  };

  const removeBoldWord = (word: string): void => {
    setBoldWords(boldWords.filter((w) => w !== word));
  };

  const formatLyrics = (): void => {
    const repetitionHandled = detectRepetition(lyricsState);
    const fullyFormatted = handleUppercase(repetitionHandled);
    setFormattedLyrics(fullyFormatted);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Input Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Paste Your Lyrics
        </h2>
        <textarea
          id="lyrics"
          value={lyricsState}
          onChange={(e) => setLyricsState(e.target.value)}
          placeholder="Paste your lyrics here..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-64 resize-none"
        ></textarea>
      </div>

      {/* Format Options */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Format Options
        </h2>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-4">
            <label htmlFor="precision" className="text-gray-700">
              Precision:
            </label>
            <input
              type="range"
              id="precision"
              min={1}
              max={100}
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value))}
              className="w-full"
            />
            <span>{precision}</span>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700">
              Capitalize Words
            </h3>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Add a word..."
                id="add-bold-word"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addBoldWord(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {boldWords.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center bg-orange-100 text-orange-600 px-3 py-1 rounded-lg shadow-sm"
                >
                  <span>{word}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    onClick={() => removeBoldWord(word)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={formatLyrics}
          >
            Format
          </button>
        </div>
      </div>

      {/* Output Section */}
      <div className="col-span-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Formatted Output
        </h2>
        <textarea
          id="formatted-output"
          value={formattedLyrics}
          onChange={(e) => setFormattedLyrics(e.target.value)}
          placeholder="Formatted lyrics will appear here..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-64 resize-none"
        ></textarea>
      </div>
    </div>
  );
}
