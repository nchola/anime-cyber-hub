import React from "react";
import { UserPlus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  isLoggedIn: boolean;
  username: string;
  avatar: string;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ 
  isLoggedIn, 
  username, 
  avatar, 
  onSignInClick,
  onSignUpClick
}) => {
  const { toast } = useToast();
  
  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Logout Gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
      return;
    }
    
    // Clear bookmarks from localStorage
    localStorage.removeItem('bookmarks');
    localStorage.removeItem('bookmarkedManga');
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
    
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun",
    });
  };
  
  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden border border-cyber-accent/50 focus:ring-0 focus:ring-offset-0"
            >
              {avatar ? (
                <img src={avatar} alt={username} className="h-full w-full object-cover" />
              ) : (
                <User className="h-3 w-3 md:h-4 md:w-4 text-cyber-accent" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-cyber-background/95 border border-cyber-accent/30 backdrop-blur-md">
            <DropdownMenuLabel className="font-orbitron text-cyber-accent">
              {username}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-cyber-accent/20" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-red-500 cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={onSignInClick}
        variant="default"
        className="py-1 px-3 md:px-4 bg-cyber-accent text-cyber-background rounded-md text-xs md:text-sm font-medium hover:bg-opacity-80 transition-colors"
      >
        Sign In
      </Button>
      
      <Button
        onClick={onSignUpClick}
        variant="outline"
        className="hidden md:flex py-1 px-3 md:px-4 border-cyber-accent text-cyber-accent rounded-md text-xs md:text-sm font-medium hover:bg-cyber-accent/10 transition-colors gap-1 items-center"
      >
        <UserPlus className="h-3 w-3 md:h-3.5 md:w-3.5" />
        Sign Up
      </Button>
    </div>
  );
};

export default UserMenu;
