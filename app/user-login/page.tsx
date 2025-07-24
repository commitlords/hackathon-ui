"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Label,
  Spinner,
  TextInput,
  DarkThemeToggle,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { IoEyeOff, IoEye } from "react-icons/io5";

export default function UserLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/groups/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Optionally store token/user info here (e.g., localStorage)
        setSuccess("Login successful! Redirecting to dashboard...");
        router.push("/user-dashboard");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            "Invalid username or password. Please try again.",
        );
      }
    } catch (err) {
      setError(
        "A network error occurred. Please check your connection and try again.",
      );
      console.error("An error occurred during the login request:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="relative w-full max-w-sm">
        <div className="absolute top-4 right-4 z-10">
        </div>
        <Card>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <span className="flex items-center justify-center gap-1 text-xl font-semibold whitespace-nowrap dark:text-white">
              <Image
                src="/Logo.png"
                alt="LOKSamarth Logo"
                width={90}
                height={90}
              />
              LOKSamarth
            </span>
            <h3 className="text-center text-xl font-medium text-gray-900 dark:text-white">
              User Login
            </h3>
            {success && <Alert color="success">{success}</Alert>}
            {error && (
              <Alert color="failure" onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username">Username</Label>
              </div>
              <TextInput
                id="username"
                placeholder="user"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <IoEyeOff className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <IoEye className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a
                href="#"
                className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Forgot Password?
              </a>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500"
            >
              {isLoading ? (
                <>
                  <Spinner aria-label="Logging in..." size="sm" />
                  <span className="pl-3">Logging In...</span>
                </>
              ) : (
                "Log In"
              )}
            </Button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <Link
                href="/register"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Register Now
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
