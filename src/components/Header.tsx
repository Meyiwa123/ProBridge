import React, { useState } from "react";

type HeaderProps = {
  onImportLyrics: (lyrics: string) => void;
};

export default function Header({ onImportLyrics }: HeaderProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string } | null>(null);

  const handleSearch = async () => {
    const [artist, title] = query.split(" - ").map((str) => str.trim());
    if (artist && title) {
      setLoading(true);

      // Timeout to handle long loading times
      const controller = new AbortController();
      const timeout = setTimeout(() => {
        controller.abort();
        showAlert("The search timed out. Please try again later.");
        setLoading(false);
      }, 10000);

      try {
        const response = await fetch(
          `https://api.lyrics.ovh/v1/${artist}/${title}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        const data = await response.json();

        if (data.lyrics) {
          onImportLyrics(data.lyrics); // Send lyrics to parent component
        } else {
          showAlert("Lyrics not found.");
        }
      } catch (error) {
        showAlert("Error fetching lyrics.");
      } finally {
        setLoading(false);
      }
    } else {
      showAlert("Please enter both artist and song title in the format: Artist - Title.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const showAlert = (message: string) => {
    setAlert({ message });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <>
      <header className="relative bg-black bg-opacity-70 text-black px-4 py-4">
        <div className="flex items-center space-x-4">
          <img
            src="/logo.png"
            alt="ProBridge Logo"
            className="h-10 w-10 rounded-full"
          />
          <h1 className="text-2xl font-semibold text-white">ProBridge</h1>

          {/* Search bar */}
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none ps-3.5">
              <svg
                className="shrink-0 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="py-2 ps-10 pe-4 block w-full border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-orange-500"
              placeholder="Enter artist and song title (e.g., Artist - Title)"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-gray-500"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.964 7.964 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Alert Box at the Bottom */}
      {alert && (
        <div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-1/3 flex items-center p-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <p>{alert.message}</p>
          </div>
        </div>
      )}
    </>
  );
}
