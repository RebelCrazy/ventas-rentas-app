import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageGallery({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const displayImages = images?.length > 0 ? images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80'
  ];

  const next = () => setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  const prev = () => setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 h-[500px]">
        <div 
          className="lg:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={displayImages[selectedIndex]}
            alt="Principal"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Expand className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {displayImages.length > 1 && (
          <div className="hidden lg:grid grid-rows-3 gap-3">
            {displayImages.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden cursor-pointer ${
                  selectedIndex === idx + 1 ? 'ring-2 ring-amber-500' : ''
                }`}
                onClick={() => setSelectedIndex(idx + 1)}
              >
                <img src={img} alt={`Imagen ${idx + 2}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                {idx === 2 && displayImages.length > 4 && (
                  <div 
                    className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                  >
                    <span className="text-white font-semibold text-lg">+{displayImages.length - 4} más</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl p-0 bg-black/95 border-none">
          <div className="relative h-[80vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                src={displayImages[selectedIndex]}
                alt={`Imagen ${selectedIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full object-contain"
              />
            </AnimatePresence>

            {displayImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  onClick={prev}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                  onClick={next}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {displayImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === selectedIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}