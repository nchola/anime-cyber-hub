import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import SignInDialog from "@/components/SignInDialog";
import { useToast } from "@/hooks/use-toast";
import NavbarBrand from "./navbar/NavbarBrand";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";
import { signOut } from "@/lib/supabase";

const Navbar = () => {
  const [signInOpen, setSignInOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setIsLoggedIn(true);
            setUsername(user.user_metadata.username || 'User');
            setAvatar(user.user_metadata.avatar || '');
          }
        } else {
          // Ensure state is reset when no session exists
          setIsLoggedIn(false);
          setUsername('');
          setAvatar('');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };
    
    checkUserLogin();
    
    // Listen for auth state changes
    const handleAuthStateChange = () => {
      checkUserLogin();
    };
    
    window.addEventListener('auth-state-changed', handleAuthStateChange);
    
    return () => {
      window.removeEventListener('auth-state-changed', handleAuthStateChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleLogout = async () => {
    try {
      // Update UI state immediately
      setIsLoggedIn(false);
      setUsername('');
      setAvatar('');
      setMobileMenuOpen(false);
      
      // Clear bookmarks
      localStorage.removeItem('bookmarks');
      localStorage.removeItem('bookmarkedManga');
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new Event('storage'));
      
      // Perform the actual logout
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      // Force a re-render of the entire navbar
      window.dispatchEvent(new Event('auth-state-changed'));
      
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari akun",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Gagal",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    }
  };
  
  const handleSignUpClick = () => {
    setSignInOpen(true);
    setTimeout(() => {
      document.querySelector('[aria-label="Sign up"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cyber-background/80 backdrop-blur-md border-b border-cyber-accent/20">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden mr-2 text-white hover:text-cyber-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <NavbarBrand />
            
            <div className="hidden md:flex ml-6 lg:ml-8">
              <NavLinks isLoggedIn={isLoggedIn} />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar />
            
            <div className="hidden md:block">
              <UserMenu 
                isLoggedIn={isLoggedIn}
                username={username}
                avatar={avatar}
                onSignInClick={() => setSignInOpen(true)}
                onSignUpClick={handleSignUpClick}
              />
            </div>
          </div>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isLoggedIn={isLoggedIn}
        username={username}
        onItemClick={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        onSignInClick={() => {
          setMobileMenuOpen(false);
          setSignInOpen(true);
        }}
        onSignUpClick={() => {
          setMobileMenuOpen(false);
          handleSignUpClick();
        }}
      />
      
      <SignInDialog 
        open={signInOpen} 
        onOpenChange={setSignInOpen} 
        onLoginSuccess={(userData) => {
          setIsLoggedIn(true);
          setUsername(userData.username || 'User');
          setAvatar(userData.avatar || '');
          toast({
            title: "Login Berhasil",
            description: `Selamat datang kembali, ${userData.username || 'User'}!`,
          });
        }}
      />
    </nav>
  );
};

export default Navbar;
