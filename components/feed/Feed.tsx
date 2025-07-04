import React, { useState } from "react";
import FeedItem from "./FeedItem";
import FullscreenImageModal from "./FullscreenImageModal";
import { Post } from "../../types/post";
import { SidebarData } from "../../types/sidebar";
import { List, Expand } from "lucide-react";

interface FeedProps {
  posts: Post[];
  sidebar: SidebarData;
  loading: boolean;
}

const Feed: React.FC<FeedProps> = ({ posts, sidebar, loading }) => {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'contain' | 'cover'>('contain');

  const openFullscreenImage = (imageUrl: string) => setFullscreenImage(imageUrl);
  const closeFullscreenImage = () => setFullscreenImage(null);

  return (
    <>
      <div className="flex justify-end mb-4 gap-2">
        <button
          className={`px-3 py-2 rounded-l border flex items-center justify-center ${imageMode === 'contain' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          onClick={() => setImageMode('contain')}
          title="Full View"
        >
          <Expand className="w-5 h-5" />
        </button>
        <button
          className={`px-3 py-2 rounded-r border flex items-center justify-center ${imageMode === 'cover' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
          onClick={() => setImageMode('cover')}
          title="List View"
        >
          <List className="w-5 h-5" />
        </button>
      </div>
      <div className={`w-full ${
        imageMode === 'contain'
          ? 'flex flex-col gap-6'
          : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      }`}>
        {fullscreenImage && (
          <FullscreenImageModal src={fullscreenImage} onClose={closeFullscreenImage} />
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          posts.map(post => (
            <FeedItem
              key={post.id}
              post={post}
              sidebar={sidebar}
              onImageClick={openFullscreenImage}
              mode={imageMode}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Feed; 