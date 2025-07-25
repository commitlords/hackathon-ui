"use client";

// Define a type for Group
interface Group {
  groupId: string;
  businessInterest: string;
  loanAmount: string;
  members: Member[];
  applications?: Array<{
    applicationID: string;
    status: string;
    loanAmount: string;
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
  // Optionally add other fields if needed
}

// Backend response types
// Update BackendMember to match backend fields
type BackendMember = {
  name: string;
  dob: string;
  sex: string;
  aadharNumber: string;
  panNumber: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  email: string;
  phoneNumber: number;
  photoID: string;
  memberID: number;
  createdAt: string;
  updatedAt: string;
};

interface BackendApplication {
  applicationID?: number;
  appicationID?: number; // typo support
  status: string;
  loanAmount: string;
}

interface BackendGroup {
  groupID: number;
  members: BackendMember[];
  applications?: BackendApplication[];
  // ...other fields
}

// Business interest type
interface BackendInterest {
  name: string;
  loanAmount: number;
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

// Type guard for applicationID typo
function getApplicationID(a: BackendApplication): string {
  if (a.applicationID !== undefined) return String(a.applicationID);
  if (a.appicationID !== undefined) return String(a.appicationID);
  return "";
}

export default function SubmitApplicationPage() {
  const [groups, setGroups] = useState<Group[]>([]);
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
  const [businessInterests, setBusinessInterests] = useState<BackendInterest[]>(
    [],
  );
  const [maxLoanAmount, setMaxLoanAmount] = useState<number | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [loadingInterests, setLoadingInterests] = useState(true);
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
    const fetchGroups = async () => {
      try {
        const res = await fetchWithAuth("groups");
        if (!res.ok)
          throw new Error(
            `Failed to fetch groups: ${res.status} ${res.statusText}`,
          );
        const data: BackendGroup[] = await res.json();
        // Map backend group structure to expected frontend structure
        const mappedGroups = (data || []).map((g) => ({
          groupId: String(g.groupID),
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
          applications: (g.applications || []).map((a) => ({
            applicationID: getApplicationID(a),
            status: a.status,
            loanAmount: a.loanAmount,
          })),
        }));
        setGroups(mappedGroups);
      } catch (err) {
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  // Fetch business interests
  useEffect(() => {
    const fetchInterests = async () => {
      setLoadingInterests(true);
      try {
        const res = await fetchWithAuth("business/interests");
        if (!res.ok) throw new Error("Failed to fetch business interests");
        const data = await res.json();
        console.log("Fetched business interests:", data); // Debug
        setBusinessInterests(data || []);
      } catch {
        setBusinessInterests([]);
      } finally {
        setLoadingInterests(false);
      }
    };
    fetchInterests();
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
        if (!res.ok)
          throw new Error(
            `Failed to fetch group members: ${res.status} ${res.statusText}`,
          );
        const data = await res.json();
        // Accept both { members: [...] } and [...]
        const members = Array.isArray(data) ? data : data.members;
        setExpandedMembers((prev) => ({ ...prev, [groupId]: members }));
      } catch (err) {
        setExpandedError((prev) => ({
          ...prev,
          [groupId]:
            err instanceof Error ? err.message : "Could not load members.",
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

  // On submit, POST to /applications
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
          businessInterest: modalGroup.businessInterest,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit application");
      const data = await res.json();
      console.log("Submit response:", data); // Debug
      setSubmitResult({
        success: true,
        message: data.message,
        applicationId:
          data.applicationId || data.applicationID || data.appicationID, // Support all variants
      });
      setShowAppIdBanner(
        data.applicationId || data.applicationID || data.appicationID,
      );
      // Refetch groups to get the new application ID
      const groupsRes = await fetchWithAuth("groups");
      if (groupsRes.ok) {
        const groupsData: BackendGroup[] = await groupsRes.json();
        // Remap as before
        const mappedGroups = (groupsData || []).map((g) => ({
          groupId: String(g.groupID),
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
          applications: (g.applications || []).map((a) => ({
            applicationID: getApplicationID(a),
            status: a.status,
            loanAmount: a.loanAmount,
          })),
        }));
        setGroups(mappedGroups);
      }
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
        message: err instanceof Error ? err.message : String(err),
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
              <TableRow>
                <TableHeadCell>Group ID</TableHeadCell>
                <TableHeadCell>Business Interest</TableHeadCell>
                <TableHeadCell>Loan Amount</TableHeadCell>
                <TableHeadCell>Application ID</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Action</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {groups.map((group) => {
                const canSubmit =
                  group.businessInterest &&
                  group.loanAmount &&
                  !isNaN(Number(group.loanAmount)) &&
                  Number(group.loanAmount) > 0;
                const firstApp =
                  group.applications && group.applications.length > 0
                    ? group.applications[0]
                    : null;
                // Use a unique key for each TableRow and expanded row
                const rows = [
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
                      ) : (
                        <select
                          className="w-40 rounded border px-2 py-1"
                          value={group.businessInterest}
                          onChange={(e) => {
                            handleBusinessInterestChange(
                              group.groupId,
                              e.target.value,
                            );
                            const found = businessInterests.find(
                              (i) => i.name === e.target.value,
                            );
                            setMaxLoanAmount(found ? found.loanAmount : null);
                            setSelectedInterest(e.target.value);
                          }}
                          disabled={loadingInterests}
                        >
                          <option value="">
                            {loadingInterests
                              ? "Loading..."
                              : "Select interest"}
                          </option>
                          {businessInterests.map((interest) => (
                            <option key={interest.name} value={interest.name}>
                              {interest.name} (Max: {interest.loanAmount})
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
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            maxLoanAmount !== null &&
                            Number(value) > maxLoanAmount
                          )
                            return;
                          handleLoanAmountChange(group.groupId, value);
                        }}
                        placeholder="Enter amount"
                        max={maxLoanAmount !== null ? maxLoanAmount : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      {firstApp ? firstApp.applicationID : "-"}
                    </TableCell>
                    <TableCell>{firstApp ? firstApp.status : "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        disabled={!canSubmit}
                        onClick={() => handleSubmitApplication(group)}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>,
                ];
                if (expandedGroup === group.groupId) {
                  rows.push(
                    <TableRow key={group.groupId + "-expanded"}>
                      <TableCell
                        colSpan={6}
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
                                <TableRow>
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
                                </TableRow>
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
                                      <TableCell>{m.bankName || "-"}</TableCell>
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
                    </TableRow>,
                  );
                }
                return rows;
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
