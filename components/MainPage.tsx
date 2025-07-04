import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Grid3X3, List, X } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  message: string;
  timestamp: string;
  image?: string;
  name?: string;
}

interface SidebarData {
  name: string;
  subtitle: string;
  photo: string;
  networks: string[];
  city: string;
}

interface MainPageProps {
  sidebar: SidebarData;
  posts: Post[];
  message: string;
  image: File | null;
  imagePreview: string | null;
  error: string;
  maxChars: number;
  charsLeft: number;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShare: (e: React.FormEvent) => void;
  handleRemoveImage: () => void;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  loading: boolean;
  sharing: boolean;
  hasNewPosts: boolean;
  isScrolledUp: boolean;
  onScrollToTop: () => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

// Helper component for the feed image
function FeedImage({ src, onClick }: { src: string; onClick: () => void }) {
  return (
    <div className="w-full flex justify-center items-center bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 mt-auto p-2">
      <img
        src={src}
        alt="Post image"
        className="object-contain max-h-96 w-auto h-auto rounded-lg shadow cursor-pointer"
        style={{ background: '#f3f4f6', maxWidth: '100%' }}
        loading="lazy"
        onClick={onClick}
      />
    </div>
  );
}

// Helper component for the fullscreen modal
function FullscreenImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
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
}

export default function MainPage({
  sidebar,
  posts,
  message,
  imagePreview,
  error,
  maxChars,
  charsLeft,
  handleImageChange,
  handleShare,
  handleRemoveImage,
  handleMessageChange,
  loading,
  sharing,
  hasNewPosts,
  isScrolledUp,
  onScrollToTop,
  viewMode,
  setViewMode,
}: MainPageProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const openFullscreenImage = (imageUrl: string) => setFullscreenImage(imageUrl);
  const closeFullscreenImage = () => setFullscreenImage(null);

  return (
    <main className="flex-1 w-full">
      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <FullscreenImageModal src={fullscreenImage} onClose={closeFullscreenImage} />
      )}

      {/* New Posts Indicator */}
      {hasNewPosts && isScrolledUp && (
        <div className="sticky top-4 z-10 mb-6">
          <button
            onClick={onScrollToTop}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg backdrop-blur-sm"
            aria-label="View new posts"
          >
            <div className="animate-pulse">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>
            ✨ New thoughts available - Click to explore
          </button>
        </div>
      )}
      
      {/* Post Input */}
      <Card className="mb-8 border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <Label htmlFor="message" className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Share your thoughts...
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Textarea
            id="message"
            placeholder="What's inspiring you today?"
            value={message}
            onChange={handleMessageChange}
            maxLength={maxChars}
            className="resize-none min-h-[120px] max-h-80 w-full break-all overflow-x-hidden focus-visible:ring-2 focus-visible:ring-purple-500 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-lg"
            aria-label="Post message"
            rows={1}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
          
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${
              charsLeft < 0 ? 'text-red-500' : 
              charsLeft < 50 ? 'text-yellow-500' : 
              'text-slate-500 dark:text-slate-400'
            }`}>
              {charsLeft} characters remaining
            </span>
            
            <div className="flex items-center gap-4">
              {!imagePreview ? (
                <label className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    aria-label="Upload image"
                  />
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Add Image</span>
                </label>
              ) : (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={120}
                    height={80}
                    className="rounded-lg border-2 border-slate-200 dark:border-slate-600 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <span className="text-sm font-bold">&times;</span>
                  </button>
                </div>
              )}
              
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                disabled={!message.trim() || sharing}
                onClick={handleShare}
              >
                {sharing ? "Sharing..." : "Share Thought"}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Feed */}
      <div className={`w-full ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-6'}`}>
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <Card key={i} className="w-full border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 mb-2">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2 rounded" />
                      <Skeleton className="h-3 w-20 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full rounded mb-2" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          posts.map(post => (
            <Card
              key={post.id}
              className={`w-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group ${
                viewMode === 'grid' ? 'aspect-square' : ''
              }`}
            >
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center gap-4 mb-2">
                  <Avatar className="w-12 h-12 ring-2 ring-purple-200 dark:ring-purple-800">
                    <AvatarImage src={sidebar.photo} alt="User photo" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {post.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg leading-tight">
                      {post.name || 'Anonymous'}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                      {timeAgo(post.timestamp)}
                    </span>
                  </div>
                </div>
                <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed whitespace-pre-line break-all mb-4 font-normal flex-1">
                  {post.message}
                </div>
                {post.image && (
                  <FeedImage src={post.image} onClick={() => openFullscreenImage(post.image!)} />
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  );
} 