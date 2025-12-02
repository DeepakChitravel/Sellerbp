"use client";

import { setCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import PhoneInput from "../ui/phone-input";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();

  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      if (!user || !password) {
        toast.error("Enter phone and password");
        return;
      }

      const cleanPhone = user.replace(/^\+91/, "").trim();

      const userData = {
        phone: cleanPhone,
        password: password,
      };

      const response = await loginUser(userData);

      console.log("LOGIN RESPONSE ===>", response); // ⭐ Correct logging

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      // ⭐ Save token
      if (response.token) {
        setCookie("token", response.token, {
          path: "/",
          sameSite: "lax",
        });
      }

      // ⭐⭐ Save USER ID — but correct key depends on API response!
      if (response.user?.id) {
        setCookie("user_id", response.user.id, {
          path: "/",
          sameSite: "lax",
        });
      } else if (response.data?.user?.id) {
        setCookie("user_id", response.data.user.id, {
          path: "/",
          sameSite: "lax",
        });
      } else if (response.data?.id) {
        setCookie("user_id", response.data.id, {
          path: "/",
          sameSite: "lax",
        });
      } else {
        console.error("❌ USER ID NOT FOUND IN LOGIN RESPONSE");
      }

      // Redirect
      if (response.data?.site_slug) {
        router.push(`/${response.data.site_slug}`);
      } else {
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Label>Phone</Label>
        <PhoneInput
          placeholder="Phone Number"
          value={user}
          onChange={(value) => setUser(value)}
          className="h-12 px-4 [&_input]:!text-base"
          autoFocus={true}
        />
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label>Password</Label>
          <Link href="/forgot-password" className="text-center text-sm underline">
            Forgot Password
          </Link>
        </div>

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 px-4 text-base"
        />
      </div>

      <Button className="w-full h-12 text-base" onClick={handleLogin}>
        Login
      </Button>

      <div className="text-center text-sm">
        Don&apos;t have an account? <Link href="/register" className="underline">Register</Link>
      </div>
    </div>
  );
};

export default LoginForm;
