import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Sparkles, X, Mail, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. ABSTRACTED IMAGE DATA
// Ensure these files are placed in your /public folder exactly as named
const MEMORIES = [
  { id: 1, url: 'input_file_4.png', title: 'A Special Moment' },
  { id: 2, url: 'input_file_5.png', title: 'Beach Days' },
  { id: 3, url: 'input_file_6.png', title: 'Pure Love' },
  { id: 4, url: 'input_file_7.png', title: 'Sweet Memories' },
  { id: 5, url: 'input_file_8.png', title: 'Hugs & Smiles' },
  { id: 6, url: 'input_file_9.png', title: 'Through the Years' },
];

export default function App() {
  const [view, setView] = useState<'home' | 'grid'>('home');
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleReveal = (id: number) => {
    const newRevealed = new Set(revealedIds).add(id);
    setRevealedIds(newRevealed);

    if (newRevealed.size === MEMORIES.length) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#f43f5e', '#ffffff']
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#4a041f] text-pink-50 selection:bg-pink-500/30 font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,#db2777_0%,transparent_50%)]" />

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <HomeView key="home" onStart={() => setView('grid')} />
        ) : (
          <GridView 
            key="grid"
            revealedIds={revealedIds}
            onReveal={handleReveal}
            onZoom={setSelectedPhoto}
            onBack={() => setView('home')}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {selectedPhoto && (
          <Modal url={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function HomeView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
      className="relative z-10 h-screen flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div 
        animate={{ y: [0, -15, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
      >
        <Heart className="w-16 h-16 text-pink-400 fill-pink-400/20" strokeWidth={1.5} />
      </motion.div>
      
      <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-tight">Mummy</h1>
      <p className="text-xl text-pink-200/80 mb-12 font-light max-w-sm">
        Thank you so much for supporting and guiding me in right path . And Sorry for sometime irritating you .
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full text-xl font-bold shadow-[0_0_40px_rgba(219,39,119,0.3)]"
      >
        <Mail className="w-6 h-6" />
        Open It With Smile
      </motion.button>
    </motion.div>
  );
}

function GridView({ revealedIds, onReveal, onZoom, onBack }: any) {
  const allRevealed = revealedIds.size === MEMORIES.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="relative z-10 max-w-4xl mx-auto p-6 pt-12 min-h-screen"
    >
      <header className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-serif text-pink-100 italic">For the best Mom...</h2>
        <button onClick={onBack} className="text-pink-300/60 hover:text-white transition-colors"><X /></button>
      </header>

      <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto">
        {MEMORIES.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => !revealedIds.has(photo.id) ? onReveal(photo.id) : onZoom(photo.url)}
            className="group relative aspect-[3/4] cursor-pointer"
            style={{ perspective: 1000 }}
          >
            <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${revealedIds.has(photo.id) ? 'rotate-y-180' : ''}`}>
              {/* Front: Envelope */}
              <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center">
                <Gift className="w-8 h-8 text-pink-400/50 mb-2" strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-widest text-pink-200/40">Memory {photo.id}</span>
              </div>
              
              {/* Back: Image */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <img src={photo.url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {allRevealed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20 text-center pb-20">
          <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <p className="text-3xl font-serif italic text-white leading-relaxed">
            "It doesn't matter how much I grow , <br/> I will always be your little boy!"
          </p>
          <p className="mt-4 text-pink-300 font-light">— Love you, Mom!</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function Modal({ url, onClose }: { url: string, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.img 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        src={url} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl ring-1 ring-white/20" 
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}