
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
      // Simulasi panggilan API login
      console.log("Login data:", data);
      
      // Simulasi penundaan respons server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulasi user data yang akan disimpan ke localStorage
      const userData = {
        id: "user123",
        username: "CyberFan22",
        email: data.email,
        avatar: "https://i.pravatar.cc/300",
        token: "simulated_jwt_token_12345"
      };
      
      // Simpan token dan data user ke localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
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
        description: "Email atau password tidak valid",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-cyber-background text-white border border-cyber-accent/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron text-cyber-accent">
              Sign In
            </DialogTitle>
            <DialogDescription>
              Masuk ke akun Anda untuk mengakses fitur tambahan
            </DialogDescription>
          </DialogHeader>
          
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
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-cyber-accent text-cyber-background hover:bg-cyber-accent/80"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
          
          <div className="text-center text-sm">
            Belum punya akun?{" "}
            <Button 
              variant="link" 
              onClick={() => {
                onOpenChange(false);
                setSignUpOpen(true);
              }}
              className="text-cyber-accent p-0 h-auto"
              aria-label="Sign up"
            >
              Daftar di sini
            </Button>
          </div>
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
