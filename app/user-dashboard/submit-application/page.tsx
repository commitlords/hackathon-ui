"use client";

// Define a type for Group
interface Group {
  groupId: string;
  businessInterest: string;
  loanAmount: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
  }>;
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

import { useState, useEffect } from "react";
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
} from "flowbite-react";
import { fetchWithAuth } from "@/app/utils";

const mockGroups = [
  {
    groupId: "GRP-12345",
    businessInterest: "",
    loanAmount: "",
    members: [
      {
        id: "MEM-001",
        name: "Jaya Patil",
        email: "jaya.patil@example.com",
        phone: "1234567890",
      },
      {
        id: "MEM-002",
        name: "Sunita Sharma",
        email: "sunita.sharma@example.com",
        phone: "0987654321",
      },
    ],
  },
  {
    groupId: "GRP-67890",
    businessInterest: "",
    loanAmount: "",
    members: [
      {
        id: "MEM-003",
        name: "Kavita Singh",
        email: "kavita.singh@example.com",
        phone: "1122334455",
      },
      {
        id: "MEM-004",
        name: "Meena Kumari",
        email: "meena.kumari@example.com",
        phone: "5566778899",
      },
    ],
  },
];

export default function SubmitApplicationPage() {
  const [groups, setGroups] = useState(mockGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedMembers, setExpandedMembers] = useState<
    Record<string, Member[]>
  >({});
  const [expandedLoading, setExpandedLoading] = useState<
    Record<string, boolean>
  >({});
  const [expandedError, setExpandedError] = useState<
    Record<string, string | null>
  >({});
  const [businessInterests, setBusinessInterests] = useState<
    { id: number; name: string }[]
  >([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [errorInterests, setErrorInterests] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalGroup, setModalGroup] = useState<Group | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    applicationId?: string;
  } | null>(null);
  const [showAppIdBanner, setShowAppIdBanner] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessInterests = async () => {
      setLoadingInterests(true);
      setErrorInterests(null);
      try {
        const res = await fetchWithAuth("business/interests");
        if (!res.ok) throw new Error("Failed to fetch business interests");
        const data = await res.json();
        setBusinessInterests(data.interests || []);
      } catch (err) {
        setErrorInterests("Could not load business interests.");
      } finally {
        setLoadingInterests(false);
      }
    };
    fetchBusinessInterests();
  }, []);

  const handleLoanAmountChange = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId === groupId ? { ...g, loanAmount: value } : g,
      ),
    );
  };

  const handleBusinessInterestChange = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId === groupId ? { ...g, businessInterest: value } : g,
      ),
    );
  };

  const handleExpandGroup = async (groupId: string) => {
    if (expandedGroup === groupId) {
      setExpandedGroup(null);
      return;
    }
    setExpandedGroup(groupId);
    if (!expandedMembers[groupId]) {
      setExpandedLoading((prev) => ({ ...prev, [groupId]: true }));
      setExpandedError((prev) => ({ ...prev, [groupId]: null }));
      try {
        const res = await fetchWithAuth(`groups/${groupId}`);
        if (!res.ok) throw new Error("Failed to fetch group members");
        const data = await res.json();
        setExpandedMembers((prev) => ({ ...prev, [groupId]: data.members }));
      } catch (err) {
        setExpandedError((prev) => ({
          ...prev,
          [groupId]: "Could not load members.",
        }));
      } finally {
        setExpandedLoading((prev) => ({ ...prev, [groupId]: false }));
      }
    }
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
    const applicationId = "APP-" + Math.floor(Math.random() * 100000);
    try {
      const res = await fetchWithAuth(
        `groups/${modalGroup.groupId}/applications/${applicationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessInterest: modalGroup.businessInterest,
            loanAmount: modalGroup.loanAmount,
            members: modalGroup.members,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to submit application");
      const data = await res.json();
      setSubmitResult({
        success: true,
        message: data.message,
        applicationId: data.applicationId,
      });
      setShowAppIdBanner(data.applicationId);
      // Optionally reset the group loan amount and business interest
      setGroups((prev) =>
        prev.map((g) =>
          g.groupId === modalGroup.groupId
            ? { ...g, loanAmount: "", businessInterest: "" }
            : g,
        ),
      );
    } catch (err) {
      setSubmitResult({
        success: false,
        message: "Failed to submit application. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {showAppIdBanner && (
        <div className="mb-4 flex items-center justify-between rounded border border-green-300 bg-green-100 px-4 py-3 text-green-800 shadow">
          <span className="font-semibold">
            Application submitted! Application ID:{" "}
            <span className="font-mono">{showAppIdBanner}</span>
          </span>
          <button
            className="ml-4 rounded bg-green-200 px-3 py-1 font-semibold text-green-900 hover:bg-green-300"
            onClick={() => setShowAppIdBanner(null)}
          >
            Close
          </button>
        </div>
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
              <TableHeadCell>Group ID</TableHeadCell>
              <TableHeadCell>Business Interest</TableHeadCell>
              <TableHeadCell>Loan Amount</TableHeadCell>
              <TableHeadCell>Action</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {groups.map((group) => {
                const canSubmit =
                  group.businessInterest &&
                  group.loanAmount &&
                  !isNaN(Number(group.loanAmount)) &&
                  Number(group.loanAmount) > 0;
                return (
                  <>
                    <TableRow key={group.groupId}>
                      <TableCell>
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleExpandGroup(group.groupId)}
                        >
                          {group.groupId}
                        </button>
                      </TableCell>
                      <TableCell>
                        {loadingInterests ? (
                          <span>Loading...</span>
                        ) : errorInterests ? (
                          <span className="text-red-500">{errorInterests}</span>
                        ) : (
                          <select
                            className="w-40 rounded border px-2 py-1"
                            value={group.businessInterest}
                            onChange={(e) =>
                              handleBusinessInterestChange(
                                group.groupId,
                                e.target.value,
                              )
                            }
                          >
                            <option value="">Select interest</option>
                            {businessInterests.map((interest) => (
                              <option key={interest.id} value={interest.name}>
                                {interest.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </TableCell>
                      <TableCell>
                        <input
                          type="number"
                          className="w-32 rounded border px-2 py-1"
                          value={group.loanAmount}
                          onChange={(e) =>
                            handleLoanAmountChange(
                              group.groupId,
                              e.target.value,
                            )
                          }
                          placeholder="Enter amount"
                        />
                      </TableCell>
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
                    {expandedGroup === group.groupId && (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="p-4">
                            <h3 className="mb-2 font-semibold">
                              Members in {group.groupId}
                            </h3>
                            {expandedLoading[group.groupId] ? (
                              <Spinner />
                            ) : expandedError[group.groupId] ? (
                              <Alert color="failure">
                                {expandedError[group.groupId]}
                              </Alert>
                            ) : (
                              <Table>
                                <TableHead>
                                  <TableHeadCell>Member ID</TableHeadCell>
                                  <TableHeadCell>Name</TableHeadCell>
                                  <TableHeadCell>Email</TableHeadCell>
                                  <TableHeadCell>Phone</TableHeadCell>
                                  <TableHeadCell>DOB</TableHeadCell>
                                  <TableHeadCell>Sex</TableHeadCell>
                                  <TableHeadCell>Aadhar</TableHeadCell>
                                  <TableHeadCell>PAN</TableHeadCell>
                                  <TableHeadCell>Bank Name</TableHeadCell>
                                  <TableHeadCell>Account No.</TableHeadCell>
                                  <TableHeadCell>IFSC</TableHeadCell>
                                  <TableHeadCell>Photo</TableHeadCell>
                                </TableHead>
                                <TableBody>
                                  {(expandedMembers[group.groupId] || []).map(
                                    (m) => (
                                      <TableRow key={m.id}>
                                        <TableCell>{m.id}</TableCell>
                                        <TableCell>{m.name}</TableCell>
                                        <TableCell>{m.email}</TableCell>
                                        <TableCell>{m.phone}</TableCell>
                                        <TableCell>{m.dob || "-"}</TableCell>
                                        <TableCell>{m.sex || "-"}</TableCell>
                                        <TableCell>{m.aadhar || "-"}</TableCell>
                                        <TableCell>{m.pan || "-"}</TableCell>
                                        <TableCell>
                                          {m.bankName || "-"}
                                        </TableCell>
                                        <TableCell>
                                          {m.bankAccount || "-"}
                                        </TableCell>
                                        <TableCell>{m.ifsc || "-"}</TableCell>
                                        <TableCell>
                                          {m.photo ? (
                                            <img
                                              src={m.photo}
                                              alt="Member"
                                              className="h-10 w-10 rounded-full object-cover"
                                            />
                                          ) : (
                                            <span>-</span>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      {/* Confirmation Modal */}
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalHeader>Confirm Application Submission</ModalHeader>
        <ModalBody>
          {modalGroup && (
            <div>
              <p>
                Are you sure you want to submit the application for{" "}
                <b>{modalGroup.groupId}</b>?
              </p>
              <p className="mt-2">
                Business Interest: <b>{modalGroup.businessInterest}</b>
              </p>
              <p>
                Loan Amount: <b>{modalGroup.loanAmount}</b>
              </p>
              <p>
                Members: <b>{modalGroup.members.length}</b>
              </p>
            </div>
          )}
          {submitting && (
            <div className="mt-4 flex justify-center">
              <Spinner />
            </div>
          )}
          {submitResult && (
            <Alert
              color={submitResult.success ? "success" : "failure"}
              className="mt-4"
            >
              {submitResult.message}
              {submitResult.success && submitResult.applicationId && (
                <div className="mt-2">
                  Application ID: <b>{submitResult.applicationId}</b>
                </div>
              )}
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          {!submitResult && (
            <>
              <Button onClick={handleConfirmSubmit} disabled={submitting}>
                Confirm & Submit
              </Button>
              <Button
                color="gray"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </>
          )}
          {submitResult && (
            <Button color="gray" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
