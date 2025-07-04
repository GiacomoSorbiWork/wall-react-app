"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import RightSidebar from "@/components/sidebar/RightSidebar";
import Feed from "@/components/feed/Feed";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner"
import { Post } from "@/types/post";
import PostInput from "@/components/feed/PostInput";

// Define the Post type for frontend use
interface DatabasePost {
  id: string;
  name: string | null;
  message: string;
  created_at: string;
  image: string | null;
}

const sidebar = {
  name: "Greg Wientjes",
  subtitle: "Wall - Social Feed",
  photo: "/profile-photo.jpg",
  networks: ["Harvard", "CAPM"],
  city: "San Francisco",
  info: "Full Stack Developer",
};

export default function Page() {
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const maxChars = 500; // Increased character limit
  const charsLeft = maxChars - message.length;
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [lastPostId, setLastPostId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("id, name, message, created_at, image")
        .order("created_at", { ascending: false })
        .limit(50);
      setLoading(false);
      if (error) {
        setError("Failed to fetch posts");
      } else if (data) {
        setPosts(
          data.map((p: DatabasePost) => ({
            id: p.id,
            name: p.name || undefined,
            message: p.message,
            timestamp: p.created_at,
            image: p.image || undefined,
          }))
        );
        if (data.length > 0) {
          setLastPostId(data[0].id);
        }
      }
    };
    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('realtime:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const p = payload.new as DatabasePost;
        const newPost: Post = {
          id: p.id,
          name: p.name || undefined,
          message: p.message,
          timestamp: p.created_at,
          image: p.image || undefined,
        };
        
        // Check if this is a new post (not the initial load)
        if (lastPostId && p.id !== lastPostId) {
          setPosts((prev) => [newPost, ...prev]);
          setLastPostId(p.id);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [lastPostId]);

  async function handleShare(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }
    if (message.length > maxChars) {
      setError(`Message must be ${maxChars} characters or less.`);
      return;
    }

    setSharing(true);
    let imageBase64 = null;
    if (image) {
      imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    }

    try {
      // Insert post with base64 image
      const { data, error: insertError } = await supabase.from("posts").insert({
        name: sidebar.name,
        message,
        image: imageBase64,
      });
      
      console.log("Supabase response:", { data, error: insertError });
      
      if (insertError) {
        console.error("Supabase error:", insertError);
        setError(`Failed to share post: ${insertError.message}`);
        toast.error(`Failed to share post: ${insertError.message}`);
        return; // Exit early on error
      }
      
      // Only clear form and show success if no error
      setMessage("");
      setImage(null);
      setImagePreview(null);
      setError("");
      toast.success("Thought shared successfully!");
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setSharing(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  }

  function handleRemoveImage() {
    setImage(null);
    setImagePreview(null);
  }

  function handleMessageChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-6 gap-6 px-4">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`fixed lg:relative top-0 left-0 h-full lg:h-auto w-80 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileSidebarOpen ? 'translate-x-0 bg-background/95 backdrop-blur-md' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-4 lg:p-0">
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <RightSidebar sidebar={sidebar} />
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 lg:max-w-4xl">
          <PostInput
            message={message}
            imagePreview={imagePreview}
            error={error}
            maxChars={maxChars}
            charsLeft={charsLeft}
            handleImageChange={handleImageChange}
            handleShare={handleShare}
            handleRemoveImage={handleRemoveImage}
            handleMessageChange={handleMessageChange}
            sharing={sharing}
          />
          <Feed
            posts={posts}
            sidebar={sidebar}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
