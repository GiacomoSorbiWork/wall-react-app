import React from "react";
import { X } from "lucide-react";

interface FullscreenImageModalProps {
  src: string;
  onClose: () => void;
}

const FullscreenImageModal: React.FC<FullscreenImageModalProps> = ({ src, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
    <button
      onClick={onClose}
      className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
      aria-label="Close fullscreen image"
    >
      <X className="w-6 h-6" />
    </button>
    <img
      src={src}
      alt="Fullscreen view"
      className="max-w-[98vw] max-h-[98vh] object-contain rounded-lg shadow-2xl bg-black"
      style={{ display: 'block', margin: 'auto' }}
      onClick={e => e.stopPropagation()}
    />
  </div>
);

export default FullscreenImageModal; 