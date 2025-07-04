import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, GraduationCap, Briefcase, Star } from "lucide-react";

interface SidebarData {
  name: string;
  subtitle: string;
  photo: string;
  networks: string[];
  city: string;
}

export default function RightSidebar({ sidebar }: { sidebar: SidebarData }) {
  return (
    <Card className="rounded-2xl shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 overflow-hidden">
      <div className="p-6">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 ring-4 ring-purple-200 dark:ring-purple-800 shadow-xl">
              <AvatarImage src={sidebar.photo} alt="Profile photo" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold">
                {sidebar.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
            {sidebar.name}
          </h2>
          <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
            {sidebar.subtitle}
          </p>
          <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{sidebar.city}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant="outline" 
          className="w-full mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-800/30 dark:hover:to-blue-800/30 font-semibold"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          View Portfolio
        </Button>

        {/* Stats Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Education</span>
            </div>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
              {sidebar.networks[0]}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Certification</span>
            </div>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
              {sidebar.networks[1]}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">127</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Thoughts Shared</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">89</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Days Active</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Building the future, one thought at a time ✨
          </p>
        </div>
      </div>
    </Card>
  );
} 