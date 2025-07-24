"use client";

import {
  Button,
  Card,
  Label,
  Select,
  TextInput,
  FileInput,
  Spinner,
  Toast,
} from "flowbite-react";
import {
  useState,
  type FormEvent,
  type KeyboardEvent,
  ChangeEvent,
  useEffect,
} from "react";
import { HiChevronDown, HiChevronUp, HiUserAdd, HiX } from "react-icons/hi";
import Image from "next/image";

export interface NewMemberData {
  name: string;
  dob: string;
  sex: string;
  phone: string;
  email: string;
  aadhar: string;
  pan: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  photo?: string; // This will be an object URL for preview
}

interface AddMemberSidebarProps {
  onAddMember: (memberData: NewMemberData) => void;
  groupId: string; // Add groupId prop
}

export function AddMemberSidebar({
  onAddMember,
  groupId,
}: AddMemberSidebarProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("Female");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [pan, setPan] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [photoFileId, setPhotoFileId] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Clean up the previous object URL to avoid memory leaks
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    if (file) {
      // Create a new object URL and update the state
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      setIsUploadingPhoto(true);
      setApiError(null);
      // Upload photo to API
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/v1/uploads", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Photo upload failed");
        const data = await res.json();
        setPhotoFileId(data.fileId);
      } catch (err) {
        setApiError("Photo upload failed.");
        setPhotoFileId(null);
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
      // If no file is selected (e.g., user clicked cancel), clear the preview
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoFileId(null);
    }
  };

  const validate = () => {
    if (
      !name ||
      !email ||
      !dob ||
      !phone ||
      !aadhar ||
      !pan ||
      !bankName ||
      !bankAccount ||
      !ifsc
    ) {
      setFormError("Please fill all required fields.");
      return false;
    }
    // Add more validation as needed (e.g., regex for aadhar, phone, etc.)
    setFormError(null);
    return true;
  };

  const handlePhotoRemove = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoFileId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    if (!validate()) return;
    if (!photoFileId) {
      setApiError("Please upload a photo before submitting.");
      return;
    }
    try {
      const res = await fetch(`/api/v1/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          sex,
          phone,
          email,
          aadhar,
          pan,
          bankName,
          accountNumber: bankAccount,
          ifsc,
          photoFileId,
        }),
      });
      if (!res.ok) throw new Error("Failed to add member");
      const data = await res.json();
      onAddMember(data.member);
      setShowSuccess(true);
      // Reset form
      setName("");
      setDob("");
      setSex("Female");
      setPhone("");
      setEmail("");
      setAadhar("");
      setPan("");
      setBankName("");
      setBankAccount("");
      setIfsc("");
      setPhotoFile(null);
      setPhotoPreview(null);
      setPhotoFileId(null);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      setApiError("Failed to add member.");
    }
  };

  const handleToggleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsAddMemberOpen((prev) => !prev);
    }
  };

  return (
    <aside className="w-full shrink-0 lg:w-96">
      <div className="sticky top-4">
        <Card>
          <div
            className="flex cursor-pointer items-center justify-between"
            onClick={() => setIsAddMemberOpen(!isAddMemberOpen)}
            onKeyDown={handleToggleKeyDown}
            role="button"
            tabIndex={0}
            aria-expanded={isAddMemberOpen}
            aria-controls="add-member-form"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <HiUserAdd /> Add New Member
            </h2>
            {isAddMemberOpen ? (
              <HiChevronUp className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            ) : (
              <HiChevronDown className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            )}
          </div>
          {isAddMemberOpen && (
            <form
              id="add-member-form"
              className="mt-4 flex flex-col gap-6"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              {/* Success Toast */}
              {showSuccess && (
                <Toast className="mb-2 bg-green-100 text-green-800">
                  Member added successfully!
                </Toast>
              )}
              {/* Error Message */}
              {formError && (
                <div className="mb-2 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}
              {/* Personal Info */}
              <div>
                <Label htmlFor="name">Full Name (as per Aadhar)</Label>
                <TextInput
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                  required
                  className="px-4 py-3 text-base"
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="px-4 py-3 text-base"
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                  className="px-4 py-3 text-base"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <TextInput
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 9876543210"
                  required
                  className="px-4 py-3 text-base"
                />
                <span className="text-xs text-gray-500">
                  10 digits, Indian mobile number
                </span>
              </div>
              <div>
                <Label htmlFor="email">Email ID</Label>
                <TextInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="px-4 py-3 text-base"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <Label htmlFor="photo">Photo</Label>
                <FileInput
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="px-4 py-3 text-base"
                />
                {isUploadingPhoto ? (
                  <Spinner size="sm" className="mt-2" />
                ) : photoPreview ? (
                  <>
                    <Image
                      src={photoPreview}
                      alt="Member preview"
                      width={48}
                      height={48}
                      className="mt-2 rounded-full border object-cover shadow"
                    />
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={handlePhotoRemove}
                      aria-label="Remove photo"
                    >
                      <HiX />
                    </button>
                  </>
                ) : (
                  <span className="mt-2 text-xs text-gray-400">No photo</span>
                )}
                {apiError && (
                  <div className="mt-2 text-xs text-red-500">{apiError}</div>
                )}
              </div>
              {/* Aadhar, PAN, Bank Info */}
              <div>
                <Label htmlFor="aadhar">Aadhar Card Number</Label>
                <TextInput
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  placeholder="e.g., 1234 5678 9012"
                  required
                  className="px-4 py-3 text-base"
                />
                <span className="text-xs text-gray-500">
                  12 digits, as per UIDAI
                </span>
              </div>
              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <TextInput
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  placeholder="e.g., ABCDE1234F"
                  required
                  className="px-4 py-3 text-base"
                />
                <span className="text-xs text-gray-500">
                  10 characters, as per Income Tax Dept.
                </span>
              </div>
              <div>
                <Label htmlFor="bankName">Name of the Bank</Label>
                <TextInput
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g., State Bank of India"
                  required
                  className="px-4 py-3 text-base"
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">Account Number</Label>
                <TextInput
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="e.g., 12345678901"
                  required
                  className="px-4 py-3 text-base"
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <TextInput
                  id="ifsc"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder="e.g., SBIN0001234"
                  required
                  className="px-4 py-3 text-base"
                />
                <span className="text-xs text-gray-500">
                  11 characters, as per your bank
                </span>
              </div>
              {/* Submit/Cancel Buttons */}
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  color="gray"
                  onClick={() => setIsAddMemberOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500"
                >
                  Add Member
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </aside>
  );
}
