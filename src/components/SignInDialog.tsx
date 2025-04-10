import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SignUpDialog from "@/components/SignUpDialog";
import { signInWithEmail } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { Separator } from "@/components/ui/separator";

// Validasi skema login
const loginSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (userData: any) => void;
}

const SignInDialog = ({ open, onOpenChange, onLoginSuccess }: SignInDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { data: authData, error } = await signInWithEmail(
        data.email,
        data.password
      );
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!authData || !authData.user) {
        throw new Error("Login gagal: Data user tidak ditemukan");
      }
      
      // Get user metadata
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        username: authData.user.user_metadata.username || 'User',
        avatar: authData.user.user_metadata.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${authData.user.user_metadata.username}`,
        token: authData.session.access_token
      };
      
      // Sukses login
      toast({
        title: "Login Berhasil",
        description: "Anda telah berhasil masuk ke akun Anda",
      });
      
      // Panggil callback onLoginSuccess jika ada
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      
      // Tutup dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Email atau password tidak valid",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://wufknidkprsagfpejrsu.supabase.co/auth/v1/callback',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error);
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Gagal login dengan Google",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-cyber-background text-white border border-cyber-accent/30 sm:max-w-md">          
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          {...field} 
                          className="bg-cyber-background/50 border-cyber-accent/30 focus-visible:ring-cyber-accent/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                            className="bg-cyber-background/50 border-cyber-accent/30 focus-visible:ring-cyber-accent/50 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={toggleShowPassword}
                            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyber-accent"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            
          
          <div className="text-center text-sm">
            New Here?{" "}
            <Button 
              variant="link" 
              onClick={() => {
                onOpenChange(false);
                setSignUpOpen(true);
              }}
              className="text-cyber-accent p-0 h-auto"
              aria-label="Sign up"
            >
              Register Here
            </Button>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cyber-background px-2 text-cyber-accent/70">Or continue with</span>
              </div>
          <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full bg-cyber-background/10 border-cyber-accent"
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
        </DialogContent>
      </Dialog>
      
      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen} 
        onBackToLogin={() => {
          setSignUpOpen(false);
          onOpenChange(true);
        }}
      />
    </>
  );
};

export default SignInDialog;
