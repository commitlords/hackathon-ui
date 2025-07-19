"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Label,
  Spinner,
  TextInput,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Simulate API call for admin login
    setTimeout(() => {
      if (username === "admin" && password === "adminpassword") {
        setSuccess("Login successful! You will be redirected shortly.");
      } else {
        setError("Invalid admin username or password. Please try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
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
            Admin
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
              placeholder="admin"
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
                placeholder="••••••••"
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
        </form>
      </Card>
    </div>
  );
}
