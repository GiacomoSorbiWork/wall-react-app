import React from "react";

interface FeedImageProps {
  src: string;
  onClick: () => void;
  mode: 'contain' | 'cover';
}

const FeedImage: React.FC<FeedImageProps> = ({ src, onClick, mode }) => (
  <div className="w-full flex justify-center items-center bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 mt-auto p-2">
    <img
      src={src}
      alt="Post image"
      className={`max-h-96 w-auto h-auto rounded-lg shadow cursor-pointer object-${mode}`}
      style={{ background: '#f3f4f6', maxWidth: '100%' }}
      loading="lazy"
      onClick={onClick}
    />
  </div>
);

export default FeedImage; 