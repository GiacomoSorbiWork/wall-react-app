import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FeedImage from "./FeedImage";
import { Post } from "@/types/post";
import { SidebarData } from "../../types/sidebar";
import timeAgo from "@/utils/timeAgo";

interface FeedItemProps {
  post: Post;
  sidebar: SidebarData;
  onImageClick: (src: string) => void;
  mode: 'contain' | 'cover';
}

const FeedItem: React.FC<FeedItemProps> = ({ post, sidebar, onImageClick, mode }) => (
  <Card className="w-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group">
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
        <FeedImage src={post.image} onClick={() => onImageClick(post.image!)} mode={mode} />
      )}
    </CardContent>
  </Card>
);

export default FeedItem; 