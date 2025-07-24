"use client";

import {
  Alert,
  Button,
  Card,
  Checkbox,
  Label,
  Select,
  Spinner,
  TextInput,
  DarkThemeToggle,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function RegisterPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [username, setUsername] = useState("");
  const [district, setDistrict] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions to register.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/groups/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          groupName,
          district,
          phoneNumber: countryCode + phoneNumber,
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess("Registration successful! Redirecting to login page...");
        setTimeout(() => {
          router.push("/user-login");
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        "A network error occurred. Please check your connection and try again.",
      );
      console.error("An error occurred during registration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900">
      <div className="relative w-full max-w-md md:max-w-lg">
        <div className="absolute top-4 right-4 z-10"></div>
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
              Create an Account
            </h3>
            {success && <Alert color="success">{success}</Alert>}
            {error && (
              <Alert color="failure" onDismiss={() => setError(null)}>
                {error}
              </Alert>
            )}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="groupName">Group Name</Label>
              </div>
              <TextInput
                id="groupName"
                placeholder="Group name"
                required
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username">Username</Label>
              </div>
              <TextInput
                id="username"
                placeholder="Username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="district">District</Label>
              </div>
              <TextInput
                id="district"
                placeholder="District"
                required
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phoneNumber">Phone Number</Label>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  id="countryCode"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={isLoading}
                  className="w-24"
                >
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                  <option>+61</option>
                </Select>
                <TextInput
                  id="phoneNumber"
                  placeholder="9876543210"
                  required
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Your email</Label>
              </div>
              <TextInput
                id="email"
                placeholder="group-name@email.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Enter Password</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword">Confirm password</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            <div className="flex items-center gap-2">
              <Checkbox
                id="agree"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <a
                  href="/terms-and-conditions"
                  className="text-cyan-700 hover:underline dark:text-cyan-500"
                >
                  terms and conditions
                </a>
              </Label>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500"
            >
              {isLoading ? (
                <>
                  <Spinner aria-label="Registering..." size="sm" />
                  <span className="pl-3">Registering...</span>
                </>
              ) : (
                "Register new account"
              )}
            </Button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                href="/user-login"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Login here
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
