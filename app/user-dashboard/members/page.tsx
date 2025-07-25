"use client";

import {
  Alert,
  Button,
  Card,
  Modal,
  Label,
  TextInput,
  Select,
  Spinner,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useState, ChangeEvent, useEffect } from "react";
import {
  HiUsers,
  HiOutlineExclamationCircle,
  HiCheckCircle,
} from "react-icons/hi";
import { AddMemberSidebar, type NewMemberData } from "../AddMemberSidebar";
import Image from "next/image";
import { fetchWithAuth } from "@/app/utils";
import { useSearchParams } from "next/navigation";

// The Member interface now includes a photo property and business interest.
interface Member {
  id: number;
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
  photo: string; // URL to the photo
}

export default function MembersPage() {
  const groupID = localStorage.getItem("groupID");
  const groupName = localStorage.getItem("groupName");
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

  const [businessInterestsList, setBusinessInterestsList] = useState<string[]>(
    [],
  );
  const [loadingInterests, setLoadingInterests] = useState(true);

  // Fetch business interests when the component mounts
  useEffect(() => {
    const fetchBusinessInterests = async () => {
      setLoadingInterests(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = [
          "Tailoring",
          "Handicrafts",
          "Pottery",
          "Spice Making",
          "Weaving",
          "Food Processing",
        ];
        setBusinessInterestsList(mockData);
      } catch (error) {
        console.error("Failed to fetch business interests:", error);
      } finally {
        setLoadingInterests(false);
      }
    };

    fetchBusinessInterests();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      setMembersError(null);
      try {
        const res = await fetchWithAuth(`groups/${groupID}/members`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data.members || []);
      } catch (err) {
        setMembersError("Could not load members.");
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchMembers();
  }, [groupID]);

  const handleAddMember = (memberData: NewMemberData) => {
    // memberData may not have id, so refetch members after add
    setSuccessMessage(`Member "${memberData.name}" added successfully!`);
    setTimeout(() => setSuccessMessage(null), 3000);
    // Refetch members
    (async () => {
      setLoadingMembers(true);
      try {
        const res = await fetchWithAuth(`groups/${groupID}/members`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data.members || []);
        }
      } finally {
        setLoadingMembers(false);
      }
    })();
  };

  const handleSubmitAllMembers = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      // In a real app, you would get the group ID from the session or props
      // const groupID = "GRP-12345";
      const response = await fetchWithAuth(`groups/${groupID}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(members),
      });

      if (!response.ok) {
          throw new Error('Failed to submit member data.');
      }

      // Mocking a successful API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Submitting the following data to the backend:", members);

      setSuccessMessage("All member data submitted successfully!");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setEditableMember({ ...member });
    setOpenModal(true);
    setIsEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (editableMember) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetchWithAuth(
          `groups/${groupID}/members/${editableMember.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editableMember),
          },
        );
        if (!res.ok) throw new Error("Failed to update member");
        const data = await res.json();
        setMembers(
          members.map((m) => (m.id === editableMember.id ? data.member : m)),
        );
        setIsEditMode(false);
        setSelectedMember(data.member);
        setSuccessMessage("Member updated successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        setSubmitError("Failed to update member.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const res = await fetchWithAuth(
          `groups/${groupID}/members/${selectedMember.id}`,
          {
            method: "DELETE",
          },
        );
        if (!res.ok) throw new Error("Failed to delete member");
        setMembers(members.filter((m) => m.id !== selectedMember.id));
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

  if (!groupID) {
    return (
      <div className="mx-auto w-full max-w-4xl px-2 sm:px-4 mt-8">
        <h1 className="text-2xl font-bold mb-4">Group Members</h1>
        <p className="text-red-600">No group selected. Please go back and select a group.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-2 sm:px-4">
      <h1 className="mt-4 mb-2 text-3xl font-bold">Group Members</h1>
      <div className="mb-4 text-gray-600">
        <span className="font-semibold">Group Name:</span> {groupName}
        <br />
        <span className="font-semibold">Group ID:</span> {groupID}
      </div>
      {loadingMembers ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : membersError ? (
        <Alert color="failure">{membersError}</Alert>
      ) : (
        <>
          <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
            <HiUsers /> Members List
          </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {members.map((member) => (
              <Card key={member.id}>
                <div className="flex flex-col items-center pb-4">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={`${member.name}'s photo`}
                      width={96}
                      height={96}
                      unoptimized
                      className="mb-3 h-24 w-24 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div
                      className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-3xl font-bold text-gray-700 shadow-lg"
                      aria-label={`Avatar for ${member.name}`}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0]?.toUpperCase() || "")
                        .join("")
                        .slice(0, 2)}
                    </div>
                  )}
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {/* member.businessInterest */}
                  </span>
                  <div className="mt-4 flex space-x-3">
                    <Button
                      size="sm"
                      className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500"
                      onClick={() => handleViewDetails(member)}
                    >
                      View Details
                    </Button>
                    <Button size="sm" color="light">
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
      <div className="mb-8 rounded-lg bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-bold">Add New Member</h3>
        <p className="mb-4 text-sm text-gray-500">
          Fill out the form below to add a new member to your group.
        </p>
        <AddMemberSidebar onAddMember={handleAddMember} groupID={groupID} />
      </div>
      {/* Member Details Modal */}
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
          {isEditMode && editableMember ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <TextInput
                  id="name"
                  value={editableMember?.name ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  type="email"
                  value={editableMember?.email ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <TextInput
                  id="phone"
                  type="tel"
                  value={editableMember?.phone ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="date"
                  value={editableMember?.dob ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <TextInput
                  id="sex"
                  value={editableMember?.sex ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="aadhar">Aadhar</Label>
                <TextInput
                  id="aadhar"
                  value={editableMember?.aadhar ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pan">PAN</Label>
                <TextInput
                  id="pan"
                  value={editableMember?.pan ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <TextInput
                  id="bankName"
                  value={editableMember?.bankName ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">Bank Account No.</Label>
                <TextInput
                  id="bankAccount"
                  value={editableMember?.bankAccount ?? ""}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <TextInput
                  id="ifsc"
                  value={editableMember?.ifsc ?? ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.dob}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sex
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.sex}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Aadhar
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.aadhar}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    PAN
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.pan}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Business & Bank Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Name
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Account No.
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.bankAccount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    IFSC Code
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.ifsc}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isEditMode ? (
            <>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button color="gray" onClick={() => setIsEditMode(false)}>
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
              <Button color="failure" onClick={handleDeleteMember}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

// Default export for Next.js routing, pass a sample groupID for now
// export default function MembersPageWrapper() {
//   // In a real app, get groupID from router, context, or props
//   return <MembersPage groupID={{}} />;
// }
