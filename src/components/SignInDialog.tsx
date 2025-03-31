
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SignUpDialog from "./SignUpDialog";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignInDialog: React.FC<SignInDialogProps> = ({ open, onOpenChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [signUpOpen, setSignUpOpen] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      // Here you would typically connect to your authentication service
      console.log("Sign in data:", data);
      
      // Mock successful login for demonstration
      toast({
        title: "Sign in successful",
        description: "Welcome back to CyberAnime!",
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignUpClick = () => {
    onOpenChange(false);
    setTimeout(() => setSignUpOpen(true), 100);
  };

  const handleSignInClick = () => {
    setSignUpOpen(false);
    setTimeout(() => onOpenChange(true), 100);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-cyber-background border border-cyber-accent/30 shadow-[0_0_25px_rgba(255,217,90,0.2)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-orbitron text-cyber-accent">
              SIGN IN
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          className="pl-10 bg-cyber-background border border-cyber-accent/30"
                          {...field}
                        />
                      </FormControl>
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-cyber-accent/60" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 bg-cyber-background border border-cyber-accent/30"
                          {...field}
                        />
                      </FormControl>
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-cyber-accent/60" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <a
                    href="#"
                    className="text-cyber-accent hover:text-cyber-accent/80 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Don't have an account? </span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 text-cyber-accent hover:text-cyber-accent/80 transition-colors"
                    onClick={handleSignUpClick}
                  >
                    Sign up
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-cyber-accent text-cyber-background hover:bg-cyber-accent/80 font-orbitron flex items-center justify-center gap-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    "Signing in..." 
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SignUpDialog 
        open={signUpOpen} 
        onOpenChange={setSignUpOpen}
        onSignInClick={handleSignInClick}
      />
    </>
  );
};

export default SignInDialog;
