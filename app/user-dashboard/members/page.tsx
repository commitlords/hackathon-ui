"use client";

import {
  Alert,
  Button,
  Card,
  Modal,
  Label,
  TextInput,
  Spinner,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FileInput,
} from "flowbite-react";
import { useState, ChangeEvent, useEffect } from "react";
import { HiUsers, HiOutlineExclamationCircle, HiX } from "react-icons/hi";
import { AddMemberSidebar, type NewMemberData } from "../AddMemberSidebar";
import Image from "next/image";
import { fetchWithAuth } from "@/app/utils";
import { API_BASE_URL } from "@/app/utils";

// Use the same interface as the sidebar
type Member = NewMemberData;

export default function MembersPage() {
  const [groupID, setGroupID] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editableMember, setEditableMember] = useState<Member | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // State for handling photo updates in the modal
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    setGroupID(localStorage.getItem("groupID"));
    setGroupName(localStorage.getItem("groupName"));
  }, []);

  useEffect(() => {
    if (groupID) {
      fetchMembers(groupID);
    }
  }, [groupID]);

  const fetchMembers = async (id: string) => {
    setLoadingMembers(true);
    setMembersError(null);
    try {
      const res = await fetchWithAuth(`groups/${id}/members`);
      if (!res.ok) throw new Error("Failed to fetch members");
      const data = await res.json();
      setMembers(data || []);
    } catch (err) {
      setMembersError(
        err instanceof Error ? err.message : "Could not load members.",
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAddMember = (newMember: NewMemberData) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
    setSuccessMessage(
      `Member "${newMember.name}" has been added successfully!`,
    );
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setEditableMember({ ...member });
    setNewPhotoFile(null);
    setNewPhotoPreview(null);
    setOpenModal(true);
    setIsEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!editableMember) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const updatedDetails = { ...editableMember };

    try {
      if (newPhotoFile) {
        setIsUploadingPhoto(true);
        const formData = new FormData();
        formData.append("attachment", newPhotoFile);

        const uploadRes = await fetchWithAuth("uploads", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Photo upload failed");

        const uploadData = await uploadRes.json();
        updatedDetails.photoID = uploadData.guid;
        setIsUploadingPhoto(false);
      }

      const res = await fetchWithAuth(
        `groups/${groupID}/members/${editableMember.memberID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedDetails),
        },
      );
      if (!res.ok) throw new Error("Failed to update member details");

      const updatedMemberFromServer = await res.json();

      setMembers(
        members.map((m) =>
          m.memberID === updatedMemberFromServer.memberID
            ? updatedMemberFromServer
            : m,
        ),
      );

      setOpenModal(false);
      setIsEditMode(false);
      setSuccessMessage("Member details updated successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setIsSubmitting(false);
      setIsUploadingPhoto(false);
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetchWithAuth(
          `groups/${groupID}/members/${selectedMember.memberID}`,
          {
            method: "DELETE",
          },
        );
        if (!res.ok) throw new Error("Failed to delete member");
        setMembers(
          members.filter((m: Member) => m.memberID !== selectedMember.memberID),
        );
        setOpenDeleteModal(false);
        setOpenModal(false);
        setSelectedMember(null);
        setSuccessMessage("Member deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setSubmitError("Failed to delete member.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (editableMember) {
      setEditableMember({ ...editableMember, [e.target.id]: e.target.value });
    }
  };

  const handleNewPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (newPhotoPreview) {
      URL.revokeObjectURL(newPhotoPreview);
    }
    if (file) {
      setNewPhotoFile(file);
      setNewPhotoPreview(URL.createObjectURL(file));
    } else {
      setNewPhotoFile(null);
      setNewPhotoPreview(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-2 sm:px-4">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <main className="lg:col-span-8">
          <h1 className="mt-4 mb-2 text-3xl font-bold">Group Members</h1>
          <div className="mb-4 text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Group Name:</span> {groupName}
            <br />
            <span className="font-semibold">Group ID:</span> {groupID}
          </div>

          {successMessage && (
            <Alert
              color="success"
              onDismiss={() => setSuccessMessage(null)}
              className="mb-4"
            >
              {successMessage}
            </Alert>
          )}
          {submitError && (
            <Alert
              color="failure"
              onDismiss={() => setSubmitError(null)}
              className="mb-4"
            >
              {submitError}
            </Alert>
          )}

          {loadingMembers ? (
            <div className="my-8 flex justify-center">
              <Spinner />
            </div>
          ) : membersError ? (
            <Alert color="failure">{membersError}</Alert>
          ) : (
            <>
              <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
                <HiUsers /> Members List ({members.length})
              </h2>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {members.map((member: Member, index: number) => (
                  <Card key={member.memberID}>
                    <div className="flex flex-col items-center pb-4">
                      <Image
                        src={`${API_BASE_URL}/uploads/${member.photoID}`}
                        alt={`${member.name}'s photo`}
                        width={96}
                        height={96}
                        unoptimized
                        className="mb-3 h-24 w-24 rounded-full object-cover shadow-lg"
                        priority={index === 0}
                      />
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </h5>
                      <div className="mt-4 flex space-x-3">
                        <Button
                          size="sm"
                          onClick={() => handleViewDetails(member)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
        {groupID && (
          <aside className="lg:col-span-4">
            <AddMemberSidebar onAddMember={handleAddMember} groupID={groupID} />
          </aside>
        )}
      </div>

      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsEditMode(false);
        }}
      >
        <ModalHeader>
          {isEditMode ? "Edit Member Details" : selectedMember?.name}
        </ModalHeader>
        <ModalBody>
          {submitError && (
            <Alert color="failure" onDismiss={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}
          {isEditMode && editableMember ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4">
                  <Image
                    src={
                      newPhotoPreview ||
                      `${API_BASE_URL}/uploads/${editableMember.photoID}`
                    }
                    alt="Member photo"
                    width={96}
                    height={96}
                    unoptimized
                    className="rounded-full object-cover shadow-lg"
                  />
                  <div>
                    <Label htmlFor="newPhoto" className="mb-2 block">
                      Update Photo
                    </Label>
                    <FileInput
                      id="newPhoto"
                      accept="image/*"
                      onChange={handleNewPhotoChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <TextInput
                    id="name"
                    value={editableMember.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <TextInput
                    id="email"
                    type="email"
                    value={editableMember.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone</Label>
                  <TextInput
                    id="phoneNumber"
                    type="tel"
                    value={editableMember.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <TextInput
                    id="dob"
                    type="date"
                    value={
                      new Date(editableMember.dob).toISOString().split("T")[0]
                    }
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="sex">Sex</Label>
                  <TextInput
                    id="sex"
                    value={editableMember.sex}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="aadharNumber">Aadhar</Label>
                  <TextInput
                    id="aadharNumber"
                    value={editableMember.aadharNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="panNumber">PAN</Label>
                  <TextInput
                    id="panNumber"
                    value={editableMember.panNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <TextInput
                    id="bankName"
                    value={editableMember.bankName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccountNumber">Bank Account No.</Label>
                  <TextInput
                    id="bankAccountNumber"
                    value={editableMember.bankAccountNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bankIfscCode">IFSC Code</Label>
                  <TextInput
                    id="bankIfscCode"
                    value={editableMember.bankIfscCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image
                  src={`${API_BASE_URL}/uploads/${selectedMember?.photoID}`}
                  alt={`${selectedMember?.name}'s photo`}
                  width={128}
                  height={128}
                  unoptimized
                  className="rounded-full object-cover shadow-lg"
                />
              </div>
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedMember?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p>{selectedMember?.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </p>
                  <p>{selectedMember?.dob}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Sex</p>
                  <p>{selectedMember?.sex}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Aadhar</p>
                  <p>{selectedMember?.aadharNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PAN</p>
                  <p>{selectedMember?.panNumber}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold">Bank Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bank Name</p>
                  <p>{selectedMember?.bankName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account No.
                  </p>
                  <p>{selectedMember?.bankAccountNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                  <p>{selectedMember?.bankIfscCode}</p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isEditMode ? (
            <>
              <Button
                onClick={handleSaveChanges}
                disabled={isSubmitting || isUploadingPhoto}
              >
                {isUploadingPhoto
                  ? "Uploading..."
                  : isSubmitting
                    ? "Saving..."
                    : "Save Changes"}
              </Button>
              <Button
                color="gray"
                onClick={() => setIsEditMode(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditMode(true)}>Edit</Button>
              <Button color="failure" onClick={() => setOpenDeleteModal(true)}>
                Delete
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Close
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this member?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteMember}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => setOpenDeleteModal(false)}
                disabled={isSubmitting}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
