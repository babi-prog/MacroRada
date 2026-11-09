import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !isOpen && document.activeElement?.tagName !== 'INPUT') {
        // Shift + /
        // open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '/', desc: 'Focus keyword search bar' },
    { key: 'Cmd / Ctrl + K', desc: 'Alternative quick search shortcut' },
    { key: 'M', desc: 'Toggle Data Source (Live FF Feed <-> Simulator)' },
    { key: 'R', desc: 'Force sync live feed (bypasses 15m cache)' },
    { key: 'Esc', desc: 'Close macro intelligence drawer / modal' },
    { key: 'T', desc: 'Toggle active timezone (New York <-> Addis Ababa)' },
    { key: 'S', desc: 'Toggle simulated imminent news test alert' },
    { key: '1 / 2 / 3', desc: 'Quick switch day (Yesterday / Today / Tomorrow)' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-5 shadow-2xl max-w-md w-full z-10"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">
                MacroRadar Hotkeys & Navigation
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {shortcuts.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs"
              >
                <span className="text-zinc-300 font-sans">{sc.desc}</span>
                <kbd className="font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 border border-zinc-700">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-zinc-800 text-right">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
