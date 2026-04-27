"use client";

import { useState } from "react";
import { Plus, Minus, Info, Leaf, Heart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  title: string;
  content?: string;
  icon?: React.ReactNode;
}

export default function ProductAccordions({
  ingredients,
  nutrition,
  benefits,
}: {
  ingredients?: string;
  nutrition?: string;
  benefits?: string;
}) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection(openSection === title ? null : title);
  };

  const sections: AccordionProps[] = [
    { title: "Ingredients", content: ingredients, icon: <Leaf className="w-5 h-5 text-brand-primary" /> },
    { title: "Nutritional Information", content: nutrition, icon: <Info className="w-5 h-5 text-brand-primary" /> },
    { title: "Health Benefits", content: benefits, icon: <Heart className="w-5 h-5 text-brand-accent" /> },
  ].filter((s) => s.content && s.content.trim() !== "");

  if (sections.length === 0) return null;

  return (
    <div className="divide-y divide-[#E8E6E1]/60">
      {sections.map((section) => {
        const isOpen = openSection === section.title;
        return (
          <div key={section.title} className="group">
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full flex items-center justify-between text-left py-6 px-1 focus:outline-none transition-colors group-hover:bg-[#fbfbfb]/50"
            >
              <span className="flex items-center gap-4 text-[11px] sm:text-[13px] font-black tracking-[0.15em] text-brand-text uppercase transition-colors group-hover:text-brand-primary">
                <span className="shrink-0 transition-transform group-hover:scale-110">
                  {section.icon}
                </span>
                {section.title}
              </span>
              <span className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-primary" : "text-gray-400 group-hover:text-brand-text"}`}>
                <ChevronDown className="w-5 h-5" />
              </span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pt-2 px-6 sm:px-10 relative">
                    {/* Vertical line indicator */}
                    <div className="absolute left-1 top-2 bottom-6 w-0.5 bg-brand-primary/20 rounded-full" />
                    
                    <p className="text-[13px] sm:text-[14px] font-medium text-brand-text-muted leading-relaxed whitespace-pre-wrap text-justify">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
