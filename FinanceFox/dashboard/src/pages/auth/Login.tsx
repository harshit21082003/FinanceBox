import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { _post } from "@/utils/network";
import { LOGIN_ROUTE } from "@/constants/urls";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/Auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    _post(LOGIN_ROUTE, { email, password }).then((resp) => {
      const data = resp.data;
      if (data.success) {
        login(data.data.token);
        navigate("/");
      } else {
        toast({
          title: "Login Error",
          description: data.errors[0],
          variant: "destructive",
        });
      }
      setIsLoading(false);
    });
  };
  return (
    <>
      {!isAuthenticated ? (
        <>
          <Toaster />
          <div className="relative min-h-screen w-full lg:max-w-none flex flex-row lg:px-0">
            <Link
              to="/register"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "absolute left-4 top-4 md:left-8 md:top-8"
              )}
            >
              Register
            </Link>
            <div className="p-8 flex items-center flex-1">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Login to your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your details below
                  </p>
                </div>
                <div className="grid-gap-6">
                  <form onSubmit={submitHandler}>
                    <div className="grid gap-2">
                      <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                          Email
                        </Label>
                        <Input
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
                          autoCorrect="off"
                          disabled={isLoading}
                        />
                        <Label className="sr-only" htmlFor="password">
                          Password
                        </Label>
                        <Input
                          id="password"
                          required
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          autoCapitalize="none"
                          autoComplete="none"
                          autoCorrect="off"
                          disabled={isLoading}
                        />
                      </div>
                      <Button disabled={isLoading}>
                        {!isLoading ? "Sign In with Email" : "Working..."}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="relative hidden h-screen flex-col bg-muted text-white dark:border-r lg:flex flex-[2_0_0%]">
              <div className="bg-gradient-to-b from-[rgb(17,17,17)] to-[rgb(25,25,25)] h-full" />
            </div>
          </div>
        </>
      ) : (
        <Navigate to={"/"} />
      )}
    </>
  );
}
