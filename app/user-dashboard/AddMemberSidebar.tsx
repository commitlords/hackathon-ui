"use client";

import {
  Button,
  Card,
  Label,
  Select,
  TextInput,
  FileInput,
  Spinner,
  Alert,
} from "flowbite-react";
import {
  useState,
  type FormEvent,
  type KeyboardEvent,
  ChangeEvent,
} from "react";
import { HiChevronDown, HiChevronUp, HiUserAdd, HiX } from "react-icons/hi";
import Image from "next/image";
import { fetchWithAuth } from "../utils";

// This interface now reflects the full member object returned by the backend
export interface NewMemberData {
  memberID: number;
  name: string;
  dob: string;
  sex: string;
  phoneNumber: string;
  email: string;
  aadharNumber: string;
  panNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  photoID: string;
}

interface AddMemberSidebarProps {
  onAddMember: (memberData: NewMemberData) => void;
  groupID: string;
}

export function AddMemberSidebar({
  onAddMember,
  groupID,
}: AddMemberSidebarProps) {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [photoFileId, setPhotoFileId] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setIsUploadingPhoto(true);
      setApiError(null);

      try {
        const formData = new FormData();
        formData.append("attachment", file);
        const res = await fetchWithAuth("uploads", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Photo upload failed");
        const data = await res.json();
        setPhotoFileId(data.guid);
      } catch (err) {
        setApiError("Photo upload failed.");
        setPhotoFileId(null);
      } finally {
        setIsUploadingPhoto(false);
      }
    } else {
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
      setApiError("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handlePhotoRemove = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    setPhotoFileId(null);
    const fileInput = document.getElementById("photo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const clearForm = () => {
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
    handlePhotoRemove();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    if (!validate() || !photoFileId) {
      if (!photoFileId) setApiError("Please upload a photo before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`groups/${groupID}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          sex,
          phoneNumber: phone,
          email,
          aadharNumber: aadhar,
          panNumber: pan,
          bankName,
          bankAccountNumber: bankAccount,
          bankIfscCode: ifsc,
          photoID: photoFileId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add member");
      }
      const newMember = await res.json();

      onAddMember(newMember); // Pass the new member data to the parent

      clearForm();
      setIsAddMemberOpen(false); // Close sidebar on success
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to add member.");
    } finally {
      setIsSubmitting(false);
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
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <HiUserAdd /> Add New Member
            </h2>
            {isAddMemberOpen ? <HiChevronUp /> : <HiChevronDown />}
          </div>
          {isAddMemberOpen && (
            <form
              className="mt-4 flex flex-col gap-6"
              onSubmit={handleSubmit}
              noValidate
            >
              {apiError && (
                <Alert color="failure" onDismiss={() => setApiError(null)}>
                  {apiError}
                </Alert>
              )}
              {/* Form fields remain the same */}
              <div>
                <Label htmlFor="name">Full Name (as per Aadhar)</Label>
                <TextInput
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
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
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Select
                  id="sex"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
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
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email ID</Label>
                <TextInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photo" className="mb-2 block text-center">
                  Photo
                </Label>
                <FileInput
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {isUploadingPhoto ? (
                  <Spinner className="mx-auto mt-2" />
                ) : (
                  photoPreview && (
                    <div className="mt-2 flex items-center justify-center">
                      <Image
                        src={photoPreview}
                        alt="Preview"
                        width={48}
                        height={48}
                        className="rounded-full border object-cover shadow"
                      />
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={handlePhotoRemove}
                      >
                        <HiX />
                      </button>
                    </div>
                  )
                )}
              </div>
              <div>
                <Label htmlFor="aadhar">Aadhar Card Number</Label>
                <TextInput
                  id="aadhar"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <TextInput
                  id="pan"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bankName">Name of the Bank</Label>
                <TextInput
                  id="bankName"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">Account Number</Label>
                <TextInput
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <TextInput
                  id="ifsc"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="button"
                  color="gray"
                  onClick={() => setIsAddMemberOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Member"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </aside>
  );
}
