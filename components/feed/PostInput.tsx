import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface PostInputProps {
  message: string;
  imagePreview: string | null;
  error: string;
  maxChars: number;
  charsLeft: number;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleShare: (e: React.FormEvent) => void;
  handleRemoveImage: () => void;
  handleMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sharing: boolean;
}

const PostInput: React.FC<PostInputProps> = ({
  message,
  imagePreview,
  error,
  maxChars,
  charsLeft,
  handleImageChange,
  handleShare,
  handleRemoveImage,
  handleMessageChange,
  sharing,
}) => (
  <form onSubmit={handleShare} className="mb-8 border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 flex flex-col gap-6">
    <Label htmlFor="message" className="text-lg font-semibold text-slate-700 dark:text-slate-200">
      Share your thoughts...
    </Label>
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
    <div className="flex items-center justify-between mt-2">
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
        >
          {sharing ? "Sharing..." : "Share Thought"}
        </Button>
      </div>
    </div>
    {error && (
      <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800 mt-2">
        {error}
      </div>
    )}
  </form>
);

export default PostInput; 