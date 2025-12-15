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

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!phone || !password) {
        toast.error("Enter phone and password");
        return;
      }

      const cleanPhone = phone.replace(/^\+91/, "").trim();

      const response = await loginUser({
        phone: cleanPhone,
        password,
      });

      console.log("LOGIN RESPONSE ===>", response);

      if (!response?.success) {
        toast.error(response?.message || "Login failed");
        return;
      }

      /* ===============================
         SAVE TOKEN
      ================================ */
      if (response.token) {
        setCookie("token", response.token, {
          path: "/",
          sameSite: "lax",
        });
      }

      /* ===============================
         🔥 NORMALIZE IDs (THIS FIXES YOUR ISSUE)
      ================================ */
      const id =
        response.user?.id ??
        response.data?.user?.id ??
        response.data?.id;

      const user_id =
        response.user?.user_id ??
        response.data?.user?.user_id ??
        response.data?.user_id;

      console.log("NORMALIZED IDS =>", { id, user_id });

      if (!id || !user_id) {
        console.error("❌ id or user_id missing after login", response);
        toast.error("Login response missing user info");
        return;
      }

      setCookie("id", String(id), {
        path: "/",
        sameSite: "lax",
      });

      setCookie("user_id", String(user_id), {
        path: "/",
        sameSite: "lax",
      });

      /* ===============================
         REDIRECT
      ================================ */
      const slug =
        response.data?.site_slug ||
        response.user?.site_slug;

      router.push(slug ? `/${slug}` : "/");

    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      toast.error("Login failed");
    }
  };

  return (
    <div className="grid gap-8">
      <div className="grid gap-3">
        <Label>Phone</Label>
        <PhoneInput
          placeholder="Phone Number"
          value={phone}
          onChange={(value) => setPhone(value || "")}
          className="h-12 px-4 [&_input]:!text-base"
          autoFocus
        />
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <Label>Password</Label>
          <Link
            href="/forgot-password"
            className="text-center text-sm underline"
          >
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
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
