import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — KHCWW" }] }),
  component: LoginPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});
const signUpSchema = signInSchema.extend({
  displayName: z.string().trim().min(1, "Name required").max(100),
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const isSignUp = mode === "signup";
  const form = useForm({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });

  const onSubmit = async (values: any) => {
    if (isSignUp) {
      const { error } = await signUp(values.email, values.password, values.displayName);
      if (error) toast.error(error);
      else toast.success("Account created — please check your email if confirmation is required.");
    } else {
      const { error } = await signIn(values.email, values.password);
      if (error) toast.error(error);
    }
  };

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">{isSignUp ? "Create an account" : "Welcome back"}</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {isSignUp ? "Sign up to manage your member profile." : "Sign in to access your dashboard."}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 bg-gradient-card border border-border/60 rounded-2xl p-6 shadow-soft space-y-4">
            {isSignUp && (
              <div>
                <Label htmlFor="displayName">Full name</Label>
                <Input id="displayName" {...form.register("displayName" as any)} className="mt-1.5" />
                {(form.formState.errors as any).displayName && (
                  <p className="mt-1 text-xs text-destructive">{String((form.formState.errors as any).displayName.message)}</p>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} className="mt-1.5" />
              {form.formState.errors.email && (
                <p className="mt-1 text-xs text-destructive">{String(form.formState.errors.email.message)}</p>
              )}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...form.register("password")} className="mt-1.5" />
              {form.formState.errors.password && (
                <p className="mt-1 text-xs text-destructive">{String(form.formState.errors.password.message)}</p>
              )}
            </div>
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-gradient-hero text-primary-foreground shadow-soft">
              {form.formState.isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "New to KHCWW?"}{" "}
            <button onClick={() => setMode(isSignUp ? "signin" : "signup")} className="text-primary font-medium hover:underline">
              {isSignUp ? "Sign in" : "Create account"}
            </button>
          </p>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Looking to register as a welfare member?{" "}
            <Link to="/register" className="text-primary hover:underline">Open the registration form</Link>
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
