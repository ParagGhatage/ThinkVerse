"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

/**
 * Renders the article analysis page with summary, perspectives, and fact checks in a historic archive style.
 */
export default function AnalyzePage() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const router = useRouter();
  const isRedirecting = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData = sessionStorage.getItem("analysisResult");
    if (storedData) {
      setIsLoading(false);
    } else {
      console.warn("No analysis result found");
    }
  }, []);

  useEffect(() => {
    if (isRedirecting.current) {
      return;
    }

    const storedData = sessionStorage.getItem("analysisResult");

    if (storedData) {
      setAnalysisData(JSON.parse(storedData));
      setIsLoading(false);
    } else {
      console.warn("No data found. Redirecting...");
      if (!isRedirecting.current) {
        isRedirecting.current = true;
        router.push("/analyze"); // 🔹 You can also add a toast here
      }
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#e6dcc8] font-serif">
        <div className="text-[#8b7355] text-xl animate-pulse font-bold tracking-widest uppercase">Consulting the Archives...</div>
      </div>
    );
  }

  const {
    cleaned_text = "",
    facts = [],
    perspective,
  } = analysisData || {};

  return (
    <div className="min-h-screen bg-[#e6dcc8] text-[#2c1e16] font-serif p-4 md:p-8 relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/old-wall.png')" }}></div>
      <main className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10 pt-4 md:pt-8">
        
        {/* Dossier Header */}
        <header className="border-b-4 border-double border-[#8b7355] pb-6 mb-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-[#4a3424] mb-2 drop-shadow-sm flex justify-center items-center gap-4">
            <span className="text-[#8b7355] pb-2 text-2xl">❖</span>
            Archival Record
            <span className="text-[#8b7355] pb-2 text-2xl">❖</span>
          </h1>
          <p className="text-sm italic text-[#5c4433] uppercase tracking-widest font-semibold mt-3">Classification: Verified & Analyzed Document</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Document Body */}
          <div className="xl:col-span-8 space-y-8">
            <section className="bg-[#f4ebd8] shadow-2xl border border-[#a68a64] p-8 md:p-14 relative before:absolute before:inset-0 before:border-[3px] before:border-[#c1ae99] before:m-2">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b7355] to-transparent opacity-30"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8 border-b-2 border-dashed border-[#8b7355] pb-4 text-[#3a281c] uppercase tracking-wide">
                  I. Document Transcript
                </h2>
                
                <div className="prose prose-stone max-w-none text-[#2c1e16] leading-[2.2] text-lg lg:text-xl selection:bg-[#8b7355] selection:text-white">
                  {cleaned_text.split("\n\n").map((para: string, idx: number) => (
                    <p key={idx} className="mb-6 indent-12 text-justify font-medium">{para}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* Fact Checks - Stamped Appendices */}
            <section className="bg-[#efe7d3] shadow-lg border-l-8 border-[#8b7355] p-6 md:p-10 relative mt-12">
              <h2 className="text-2xl font-bold mb-8 text-[#4a3424] border-b border-[#a68a64] pb-2 uppercase tracking-widest">
                II. Fact-Checker's Addendum
              </h2>
              <div className="space-y-8">
                {facts.length > 0 ? (
                  facts.map((fact: any, idx: number) => {
                    const hasError = fact.explanation?.includes("Failed to parse") || fact.verdict?.includes("Failed to parse");
                    const displayExplanation = hasError ? "Archival record unreadable. The consulting archivist was unable to verify this specific claim due to corrupted source documents." : fact.explanation;
                    const displayVerdict = hasError ? "Unverified" : fact.verdict;

                    return (
                    <div key={idx} className="relative bg-[#fbf6ec] p-6 md:p-8 border border-[#c1ae99] shadow-sm group hover:shadow-md transition-shadow">
                      {/* Paper pin effect */}
                      <div className="absolute top-[-10px] left-8 w-4 h-8 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm shadow-sm rotate-3 border border-gray-500 z-20"></div>

                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                        <h3 className="font-bold text-xl text-[#3a281c] flex-1 leading-snug">"{fact.original_claim}"</h3>
                        
                        {/* Stamp effect */}
                        <div className={`
                          shrink-0 px-4 py-2 font-black text-lg uppercase tracking-[0.2em] border-4 transform
                          ${displayVerdict === "True" ? "text-[#1e5631] border-[#1e5631] rotate-[-4deg] opacity-80" 
                          : displayVerdict === "False" ? "text-[#8b0000] border-[#8b0000] rotate-[3deg] opacity-80" 
                          : "text-[#b87333] border-[#b87333] rotate-[-2deg] opacity-80"}
                        `} title={displayVerdict}>
                          {displayVerdict}
                        </div>
                      </div>
                      
                      <div className="bg-[#f0e6d2] p-4 border border-[#d6c7b3] mb-5">
                        <p className="text-[#4a3a2e] font-serif text-lg leading-relaxed"><span className="font-bold uppercase text-sm tracking-wider mr-2 text-[#8b7355]">Evaluation:</span> {displayExplanation}</p>
                      </div>
                      
                      {!hasError && fact.source_link && (
                        <Link
                          href={fact.source_link}
                          target="_blank"
                          className="inline-flex items-center text-sm font-bold text-[#6b4c31] hover:text-[#8b0000] hover:underline decoration-2 underline-offset-4 transition-colors uppercase tracking-wider"
                        >
                          <LinkIcon className="mr-2 h-4 w-4" /> Consult Archival Source
                        </Link>
                      )}
                    </div>
                  )})
                ) : (
                  <div className="text-center italic text-[#8b7355] py-10 font-medium text-lg border-2 border-dashed border-[#c1ae99]">
                    ~ No notable claims flagged for verification within this text ~
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / Margin Notes */}
          <div className="xl:col-span-4 space-y-10">
            
            {/* Counter-Perspective */}
            <aside className="bg-[#ede4d0] shadow-xl border border-[#a68a64] p-8 relative">
              {/* Paperclip effect */}
              <div className="absolute top-[-8px] right-12 w-6 h-16 border-2 border-gray-400 rounded-full shadow-sm bg-transparent rotate-12 z-20"></div>
              
              <h2 className="text-xl font-bold mb-6 text-[#4a3424] uppercase tracking-widest border-b-2 border-dotted border-[#8b7355] pb-2">
                Attached Note: Dissenting View
              </h2>
              {perspective ? (
                <div className="space-y-6 text-[#3a281c]">
                   <blockquote className="border-l-[6px] border-[#8b7355] pl-5 italic bg-[#e0d6c0] p-4 text-lg text-[#2c1e16] shadow-inner font-medium">
                    "{perspective.perspective}"
                  </blockquote>
                  <div className="bg-[#f4ebd8] p-4 border border-[#c1ae99]">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-[#5c4433] mb-2 border-b border-[#d6c7b3] pb-1">Archival Reasoning</h3>
                    <p className="text-base text-justify leading-relaxed">{perspective.reasoning}</p>
                  </div>
                </div>
              ) : (
                <div className="italic text-center text-[#8b7355] py-6 border border-[#d6c7b3] bg-[#f4ebd8]">
                  ~ No contradictory records discovered ~
                </div>
              )}
            </aside>
            
          </div>
        </div>
      </main>
    </div>
  );
}