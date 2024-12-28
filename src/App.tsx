import { useState } from "react";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import LyricsFormatter from "./components/LyricsFormatter";
import Header from "./components/Header";

export default function App() {
  const [lyrics, setLyrics] = useState<string | null>(null);

  const handleImportLyrics = (formattedLyrics: string) => {
    setLyrics(formattedLyrics);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="flex-shrink-0 relative z-20">
        <Header onImportLyrics={handleImportLyrics} />
      </header>

      <main className="flex-grow px-4 lg:px-8">
        <div className="relative z-10">
          <Hero />
        </div>

        <div className="max-w-7xl mx-auto pt-8 pb-16 relative z-10">
          <LyricsFormatter lyrics={lyrics ?? ""} />
        </div>
      </main>

      <footer className="flex-shrink-0 relative z-10">
        <Footer />
      </footer>

      {/* The following divs are added to create the background effect */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-auto bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#FF8C00] to-[#FFA500] opacity-80 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
