import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { _get, _post } from "@/utils/network";
import { OTP_ROUTE, PRE_SIGNUP_ROUTE, SIGNUP_ROUTE } from "@/constants/urls";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/Auth";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState("");
  const [validateOtp, setValidateOtp] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const getOtp = async () => {
    _post(OTP_ROUTE, { email }).then((e) => {
      const resp = e.data;
      if (resp.success) {
        setValidateOtp(resp.data.otp);
      } else {
        toast({
          title: "Failed to send OTP",
          description: "Please try again",
          variant: "destructive",
        });
      }
    });
  };
  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);

    _post(PRE_SIGNUP_ROUTE, { email, password }).then(async (resp) => {
      const data = resp.data;
      if (data.success) {
        await getOtp();
        setStep(1);
      } else {
        toast({
          title: "Registering Error",
          description: data.errors[0],
          variant: "destructive",
        });
      }
      setIsLoading(false);
    });
  };

  const reset = () => {
    setOtp("");
    setValidateOtp("");
    setEmail("");
    setPassword("");
    setStep(0);
  };

  const finalize = () => {
    if (otp !== validateOtp) {
      toast({
        title: "OTP does not match",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      _post(SIGNUP_ROUTE, { email, password }).then((e) => {
        const resp = e.data;
        if (resp.success) {
          login(resp.data.token);
          navigate("/");
        } else {
          toast({
            title: "Some error occurred",
            description: resp.errors[0],
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <>
      {!isAuthenticated ? (
        <>
          <Toaster />
          <div className="relative min-h-screen w-full lg:max-w-none flex flex-row lg:px-0">
            <Link
              to="/login"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "absolute left-4 top-4 md:left-8 md:top-8"
              )}
            >
              Login
            </Link>
            <div className="p-8 flex items-center flex-1">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Register your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Enter your details below
                  </p>
                </div>
                <div className="flex flex-col">
                  {step === 0 ? (
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
                          {!isLoading ? "Continue" : "Working..."}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        onChange={(e) => setOtp(e)}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button onClick={finalize} className="w-full mt-8">
                        Verify
                      </Button>
                      <div className="flex gap-8 mt-12">
                        <Button onClick={reset} variant={"ghost"}>
                          Go back
                        </Button>
                        <Button variant={"ghost"} onClick={getOtp}>
                          Resend OTP
                        </Button>
                      </div>
                    </div>
                  )}
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
