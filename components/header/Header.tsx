import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  function nextTheme() {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  }
  
  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 py-6 px-8 shadow-2xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold tracking-tight">
              Wall - Social Media
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-white/80 text-sm">
            <span>Share your thoughts</span>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <span>Connect with ideas</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextTheme} 
            className="cursor-pointer bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            {mounted && theme === "light" && <Sun key="sun" className="h-[1.2rem] w-[1.2rem]" />}
            {mounted && theme === "dark" && <Moon key="moon" className="h-[1.2rem] w-[1.2rem]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
} 