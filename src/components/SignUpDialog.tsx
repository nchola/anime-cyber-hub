
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

// Validasi skema pendaftaran
const signupSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password harus sama",
  path: ["confirmPassword"],
});

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBackToLogin: () => void;
}

const SignUpDialog = ({ open, onOpenChange, onBackToLogin }: SignUpDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    
    try {
      // Simulasi panggilan API pendaftaran
      console.log("Signup data:", data);
      
      // Simulasi penundaan respons server
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi user data yang akan disimpan ke localStorage
      const userData = {
        id: "user" + Math.floor(Math.random() * 10000),
        username: data.username,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${data.username}`,
        token: "simulated_jwt_token_" + Math.random().toString(36).substr(2, 9)
      };
      
      // Simpan token dan data user ke localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Sukses pendaftaran
      toast({
        title: "Pendaftaran Berhasil",
        description: "Akun Anda telah berhasil dibuat. Selamat datang di CyberAnime!",
      });
      
      // Tutup dialog
      onOpenChange(false);
      
      // Refresh halaman untuk memperbarui state di Navbar
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Pendaftaran Gagal",
        description: "Terjadi kesalahan saat mendaftarkan akun Anda",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cyber-background text-white border border-cyber-accent/30 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron text-cyber-accent">
            Sign Up
          </DialogTitle>
          <DialogDescription>
            Buat akun baru untuk menjelajahi dunia anime
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username" 
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-cyber-background/50 border-cyber-accent/30 focus-visible:ring-cyber-accent/50 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleShowConfirmPassword}
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-cyber-accent"
                      >
                        {showConfirmPassword ? (
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
                    Mendaftarkan...
                  </>
                ) : (
                  "Daftar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        
        <div className="text-center text-sm">
          Sudah punya akun?{" "}
          <Button 
            variant="link" 
            onClick={onBackToLogin}
            className="text-cyber-accent p-0 h-auto"
          >
            Login di sini
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
