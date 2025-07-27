"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  Spinner,
  Alert,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import { fetchWithAuth } from "@/app/utils";
import Image from "next/image";
import { API_BASE_URL } from "@/app/utils";

// --- Type Definitions ---

interface Application {
  applicationID: string;
  status: string;
  loanAmount: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  sex: string;
  aadhar: string;
  pan: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  photo: string;
}

interface Group {
  groupId: string;
  groupName: string;
  businessInterest: string;
  loanAmount: string;
  members: Member[];
  applications: Application[];
}

interface BackendInterest {
  name: string;
  loanAmount: number;
}

// Backend data structures
interface BackendMember {
  memberID: number;
  name: string;
  email: string;
  phoneNumber: string;
  dob: string;
  sex: string;
  aadharNumber: string;
  panNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  photoID: string;
}

interface BackendApplication {
  appicationID?: string;
  applicationID?: string;
  status: string;
  loanAmount: string;
}

interface BackendGroup {
  groupID: number;
  groupName: string;
  members: BackendMember[];
  applications: BackendApplication[];
}

// --- Component ---

export default function SubmitApplicationPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [businessInterest, setBusinessInterest] = useState<BackendInterest[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState<Group | null>(null);
  const [comment, setComment] = useState("");
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);

  const [successBanner, setSuccessBanner] = useState<{
    id: string;
    message: string;
  } | null>(null);

  // --- Data Fetching ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupsRes, interestsRes] = await Promise.all([
        fetchWithAuth("groups"),
        fetchWithAuth("business/interests"),
      ]);

      if (!groupsRes.ok) throw new Error("Failed to fetch groups");
      if (!interestsRes.ok)
        throw new Error("Failed to fetch business interests");

      const groupsData = await groupsRes.json();
      const interestsData = await interestsRes.json();

      const mappedGroups = (groupsData || []).map((g: BackendGroup) => ({
        groupId: String(g.groupID),
        groupName: g.groupName,
        businessInterest: "",
        loanAmount: "",
        members: (g.members || []).map((m: BackendMember) => ({
          id: String(m.memberID),
          name: m.name,
          email: m.email,
          phone: String(m.phoneNumber),
          dob: m.dob,
          sex: m.sex,
          aadhar: m.aadharNumber,
          pan: m.panNumber,
          bankName: m.bankName,
          bankAccount: m.bankAccountNumber,
          ifsc: m.bankIfscCode,
          photo: m.photoID,
        })),
        applications: (g.applications || []).map((a: BackendApplication) => ({
          applicationID: String(a.appicationID || a.applicationID),
          status: a.status,
          loanAmount: a.loanAmount,
        })),
      }));

      setGroups(mappedGroups);
      setBusinessInterest(interestsData || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---

  const handleExpandGroup = async (groupId: string) => {
    const newExpandedGroupId = expandedGroupId === groupId ? null : groupId;
    setExpandedGroupId(newExpandedGroupId);

    if (newExpandedGroupId) {
      const group = groups.find((g) => g.groupId === newExpandedGroupId);
      if (group && group.members.length === 0) {
        // Fetch members if they are not already loaded
        try {
          const res = await fetchWithAuth(`groups/${groupId}/members`);
          if (!res.ok) throw new Error("Failed to fetch members");
          const data = await res.json();
          setGroups((prev) =>
            prev.map((g) =>
              g.groupId === groupId ? { ...g, members: data } : g,
            ),
          );
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Could not load members.",
          );
        }
      }
    }
  };

  const handleValueChange = (
    groupId: string,
    field: "loanAmount" | "businessInterest",
    value: string,
  ) => {
    setGroups((prev) =>
      prev.map((g) => (g.groupId === groupId ? { ...g, [field]: value } : g)),
    );
  };

  const handleSubmitApplication = (group: Group) => {
    setModalGroup(group);
    setModalOpen(true);
    setSubmitResult(null);
  };

  const handleConfirmSubmit = async () => {
    if (!modalGroup) return;

    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetchWithAuth(`applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupID: Number(modalGroup.groupId),
          loanAmount: Number(modalGroup.loanAmount),
          comment,
          businessInterest: modalGroup.businessInterest,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const data = await res.json();

      setGroups((prev) =>
        prev.map((g) => {
          if (g.groupId === modalGroup.groupId) {
            return {
              ...g,
              loanAmount: "",
              businessInterest: "",
              applications: [
                ...g.applications,
                {
                  applicationID: String(
                    data.applicationID || data.appicationID,
                  ),
                  status: "IN_PROGRESS",
                  loanAmount: modalGroup.loanAmount,
                },
              ],
            };
          }
          return g;
        }),
      );

      setSuccessBanner({
        id: String(data.applicationID || data.appicationID),
        message: "Application submitted successfully!",
      });
      setModalOpen(false);
    } catch (err) {
      setSubmitResult({
        success: false,
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return <Alert color="failure">{error}</Alert>;
  }

  return (
    <div className="space-y-8">
      {successBanner && (
        <Alert color="success" onDismiss={() => setSuccessBanner(null)}>
          <span className="font-semibold">{successBanner.message}</span>{" "}
          Application ID: <span className="font-mono">{successBanner.id}</span>
        </Alert>
      )}
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Submit Application
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Apply for a loan for your group. Expand a group to view its members.
        </p>
      </header>
      <Card>
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Group</TableHeadCell>
                <TableHeadCell>Business Interest</TableHeadCell>
                <TableHeadCell>Loan Amount</TableHeadCell>
                <TableHeadCell>Existing Application ID</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {groups.map((group) => {
                const latestApp =
                  group.applications?.[group.applications.length - 1];
                const interestInfo = businessInterest.find(
                  (i) => i.name === group.businessInterest,
                );
                const maxLoan = interestInfo?.loanAmount;
                const canSubmit =
                  group.businessInterest &&
                  Number(group.loanAmount) > 0 &&
                  (maxLoan === undefined ||
                    Number(group.loanAmount) <= maxLoan);

                return (
                  <React.Fragment key={group.groupId}>
                    <TableRow>
                      <TableCell>
                        <button
                          className="font-semibold text-cyan-600 hover:underline"
                          onClick={() => handleExpandGroup(group.groupId)}
                        >
                          {group.groupName} ({group.groupId})
                        </button>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={group.businessInterest}
                          onChange={(e) =>
                            handleValueChange(
                              group.groupId,
                              "businessInterest",
                              e.target.value,
                            )
                          }
                        >
                          <option value="">Select interest</option>
                          {businessInterest.map((interest) => (
                            <option key={interest.name} value={interest.name}>
                              {interest.name} (Max: ₹
                              {interest.loanAmount.toLocaleString()})
                            </option>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div>
                          <TextInput
                            type="number"
                            value={group.loanAmount}
                            onChange={(e) =>
                              handleValueChange(
                                group.groupId,
                                "loanAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Enter amount"
                            max={maxLoan}
                            color={
                              maxLoan && Number(group.loanAmount) > maxLoan
                                ? "failure"
                                : "gray"
                            }
                          />
                          {maxLoan && (
                            <p className="mt-1 text-sm text-gray-500">
                              Max: ₹{maxLoan.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{latestApp?.applicationID || "-"}</TableCell>
                      <TableCell>{latestApp?.status || "-"}</TableCell>
                      <TableCell>
                        <Button
                          size="xs"
                          disabled={!canSubmit}
                          onClick={() => handleSubmitApplication(group)}
                        >
                          Submit
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* --- NEW: Member Details Table View --- */}
                    {expandedGroupId === group.groupId && (
                      <TableRow key={`${group.groupId}-expanded`}>
                        <TableCell
                          colSpan={6}
                          className="bg-gray-50 p-4 dark:bg-gray-800"
                        >
                          <div>
                            <h3 className="mb-4 text-lg font-semibold">
                              Members of {group.groupName} (
                              {group.members.length})
                            </h3>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableHeadCell>Photo</TableHeadCell>
                                  <TableHeadCell>Name</TableHeadCell>
                                  <TableHeadCell>Contact</TableHeadCell>
                                  <TableHeadCell>Identity</TableHeadCell>
                                  <TableHeadCell>Bank Details</TableHeadCell>
                                </TableRow>
                              </TableHead>
                              <TableBody className="divide-y">
                                {group.members.map((member) => (
                                  <TableRow key={member.id}>
                                    <TableCell>
                                      <Image
                                        src={`${API_BASE_URL}/uploads/${member.photo}`}
                                        alt={`${member.name}'s photo`}
                                        width={48}
                                        height={48}
                                        unoptimized
                                        className="h-12 w-12 rounded-full object-cover"
                                      />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 dark:text-white">
                                      {member.name}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      <p>{member.email}</p>
                                      <p>{member.phone}</p>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      <p>
                                        <b>Aadhar:</b> {member.aadhar}
                                      </p>
                                      <p>
                                        <b>PAN:</b> {member.pan}
                                      </p>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                      <p>{member.bankName}</p>
                                      <p>
                                        <b>Acct:</b> {member.bankAccount}
                                      </p>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>Confirm Application Submission</ModalHeader>
        <ModalBody>
          {modalGroup && (
            <div className="space-y-4">
              <div>
                <p>
                  Are you sure you want to submit the application for{" "}
                  <b>{modalGroup.groupName}</b>?
                </p>
                <p>
                  <b>Business Interest:</b> {modalGroup.businessInterest}
                </p>
                <p>
                  <b>Loan Amount:</b> ₹
                  {Number(modalGroup.loanAmount).toLocaleString()}
                </p>
                <p>
                  <b>Members:</b> {modalGroup.members.length}
                </p>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Comment
                </label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any comments for the application..."
                />
              </div>
            </div>
          )}
          {submitResult && (
            <Alert
              color={submitResult.success ? "success" : "failure"}
              className="mt-4"
            >
              {submitResult.message}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleConfirmSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Confirm & Submit"}
          </Button>
          <Button
            color="gray"
            onClick={() => setModalOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
