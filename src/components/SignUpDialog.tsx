
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
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const signUpSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInClick: () => void;
}

const SignUpDialog: React.FC<SignUpDialogProps> = ({ open, onOpenChange, onSignInClick }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      // Here you would typically connect to your authentication service
      console.log("Sign up data:", data);
      
      // Mock successful registration for demonstration
      toast({
        title: "Registration successful",
        description: "Welcome to CyberAnime! You can now sign in.",
      });
      
      // Close the dialog
      onOpenChange(false);
      
      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-cyber-background border border-cyber-accent/30 shadow-[0_0_25px_rgba(255,217,90,0.2)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron text-cyber-accent">
            CREATE ACCOUNT
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Join CyberAnime to track your favorite anime and discover new ones
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        className="pl-10 bg-cyber-background border border-cyber-accent/30"
                        {...field}
                      />
                    </FormControl>
                    <User className="absolute left-3 top-3 h-4 w-4 text-cyber-accent/60" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
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
            
            <div className="flex justify-end items-center pt-2">
              <div className="text-sm">
                <span className="text-gray-400">Already have an account? </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-cyber-accent hover:text-cyber-accent/80 transition-colors"
                  onClick={onSignInClick}
                >
                  Sign In
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
                  "Creating Account..."
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
