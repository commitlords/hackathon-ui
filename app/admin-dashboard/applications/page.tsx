"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextInput,
  Card,
} from "flowbite-react";
import {
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineEye,
  HiOutlineXCircle,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
} from "react-icons/hi";

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
  photo?: string;
}

interface Application {
  applicationId: string;
  groupId: string;
  groupName: string;
  businessInterest: string;
  createdAt: string;
  status: string;
  reason: string;
  members: Member[];
}

const statusColors: Record<string, string> = {
  Pending: "warning",
  Validated: "success",
  "Review Application": "failure",
  "Training Assigned": "info",
  Rejected: "failure",
  "Training Completed": "success",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<null | {
    type: "reject";
    app: Application;
  }>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/applications");
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (err) {
        setError("Could not load applications.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const updateApplication = async (
    applicationId: string,
    updates: Partial<Application>,
  ) => {
    setActionLoading(applicationId);
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update application");
      const data = await res.json();
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId ? { ...app, ...updates } : app,
        ),
      );
      setSuccessMsg(data.message || "Application updated successfully");
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError("Failed to update application.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleExpand = (applicationId: string) => {
    setExpanded((prev) => (prev === applicationId ? null : applicationId));
  };

  const handleAssignTraining = (app: Application) => {
    updateApplication(app.applicationId, { status: "Training Assigned" });
  };

  const handleTrainingCompleted = (app: Application) => {
    updateApplication(app.applicationId, { status: "Training Completed" });
  };

  const handleReject = (app: Application) => {
    setModal({ type: "reject", app });
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (modal) {
      await updateApplication(modal.app.applicationId, {
        status: "Rejected",
        reason: rejectReason,
      });
      setModal(null);
    }
  };

  const handleValidateAadhar = (app: Application, member: Member) => {
    // Stub: In real app, call validation API
    setSuccessMsg(`Aadhar for ${member.name} validated!`);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleValidateBank = (app: Application, member: Member) => {
    // Stub: In real app, call validation API
    setSuccessMsg(`Bank for ${member.name} validated!`);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  return (
    <div className="space-y-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
        Applications
      </h1>
      {successMsg && (
        <Alert color="success" className="mb-4">
          {successMsg}
        </Alert>
      )}
      {error && <Alert color="failure">{error}</Alert>}
      {loading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Application ID</TableHeadCell>
                <TableHeadCell>Group ID</TableHeadCell>
                <TableHeadCell>Group Name</TableHeadCell>
                <TableHeadCell>Business Interest</TableHeadCell>
                <TableHeadCell>Created At</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
                <TableHeadCell>Reason</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {applications.map((app) => {
                  const isExpanded = expanded === app.applicationId;
                  return (
                    <>
                      <TableRow key={app.applicationId}>
                        <TableCell>
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleExpand(app.applicationId)}
                          >
                            {app.applicationId}
                          </button>
                        </TableCell>
                        <TableCell>{app.groupId}</TableCell>
                        <TableCell>{app.groupName}</TableCell>
                        <TableCell>{app.businessInterest}</TableCell>
                        <TableCell>
                          {new Date(app.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge color={statusColors[app.status] || "gray"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.status === "Pending" && (
                            <div className="flex gap-2">
                              <button
                                title="Validate"
                                className="rounded p-1 text-green-600 hover:bg-green-100"
                                onClick={() =>
                                  updateApplication(app.applicationId, {
                                    status: "Validated",
                                  })
                                }
                                disabled={actionLoading === app.applicationId}
                              >
                                <HiOutlineCheckCircle className="h-5 w-5" />
                              </button>
                              <button
                                title="Reject"
                                className="rounded p-1 text-red-600 hover:bg-red-100"
                                onClick={() => handleReject(app)}
                                disabled={actionLoading === app.applicationId}
                              >
                                <HiOutlineXCircle className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                          {app.status === "Validated" && (
                            <button
                              title="Assign Training"
                              className="rounded p-1 text-blue-600 hover:bg-blue-100"
                              onClick={() => handleAssignTraining(app)}
                              disabled={actionLoading === app.applicationId}
                            >
                              <HiOutlineCalendar className="h-5 w-5" />
                            </button>
                          )}
                          {app.status === "Training Assigned" && (
                            <button
                              title="Training Completed"
                              className="rounded p-1 text-green-600 hover:bg-green-100"
                              onClick={() => handleTrainingCompleted(app)}
                              disabled={actionLoading === app.applicationId}
                            >
                              <HiOutlineClipboardCheck className="h-5 w-5" />
                            </button>
                          )}
                          {app.status === "Rejected" && (
                            <span className="text-red-500">Rejected</span>
                          )}
                          {app.status === "Training Completed" && (
                            <span className="text-green-600">Done</span>
                          )}
                          {app.status === "Review Application" && (
                            <span className="text-yellow-600">Review</span>
                          )}
                        </TableCell>
                        <TableCell>{app.reason || "-"}</TableCell>
                      </TableRow>
                      {isExpanded && (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="bg-gray-50 dark:bg-gray-800"
                          >
                            <div className="p-4">
                              <h3 className="mb-2 font-semibold">
                                Group Members
                              </h3>
                              <Table>
                                <TableHead>
                                  <TableHeadCell>Member ID</TableHeadCell>
                                  <TableHeadCell>Name</TableHeadCell>
                                  <TableHeadCell>Email</TableHeadCell>
                                  <TableHeadCell>Phone</TableHeadCell>
                                  <TableHeadCell>DOB</TableHeadCell>
                                  <TableHeadCell>Sex</TableHeadCell>
                                  <TableHeadCell>Aadhar</TableHeadCell>
                                  <TableHeadCell>Bank</TableHeadCell>
                                  <TableHeadCell>PAN</TableHeadCell>
                                  <TableHeadCell>Account No.</TableHeadCell>
                                  <TableHeadCell>IFSC</TableHeadCell>
                                  <TableHeadCell>Photo</TableHeadCell>
                                  <TableHeadCell>
                                    Aadhar Validation
                                  </TableHeadCell>
                                  <TableHeadCell>Bank Validation</TableHeadCell>
                                </TableHead>
                                <TableBody>
                                  {app.members.map((m) => (
                                    <TableRow key={m.id}>
                                      <TableCell>{m.id}</TableCell>
                                      <TableCell>{m.name}</TableCell>
                                      <TableCell>{m.email}</TableCell>
                                      <TableCell>{m.phone}</TableCell>
                                      <TableCell>{m.dob}</TableCell>
                                      <TableCell>{m.sex}</TableCell>
                                      <TableCell>{m.aadhar}</TableCell>
                                      <TableCell>{m.bankName}</TableCell>
                                      <TableCell>{m.pan}</TableCell>
                                      <TableCell>{m.bankAccount}</TableCell>
                                      <TableCell>{m.ifsc}</TableCell>
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
                                      <TableCell>
                                        <button
                                          title="Validate Aadhar"
                                          className="rounded p-1 text-blue-600 hover:bg-blue-100"
                                          onClick={() =>
                                            handleValidateAadhar(app, m)
                                          }
                                        >
                                          <HiOutlineShieldCheck className="h-5 w-5" />
                                        </button>
                                      </TableCell>
                                      <TableCell>
                                        <button
                                          title="Validate Bank"
                                          className="rounded p-1 text-green-600 hover:bg-green-100"
                                          onClick={() =>
                                            handleValidateBank(app, m)
                                          }
                                        >
                                          <HiOutlineCreditCard className="h-5 w-5" />
                                        </button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
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
      )}
      {/* Reject Modal */}
      <Modal show={!!modal} onClose={() => setModal(null)}>
        <ModalHeader>Reject Application</ModalHeader>
        <ModalBody>
          <div>
            <p className="mb-2">Please enter the reason for rejection:</p>
            <TextInput
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="failure"
            onClick={handleConfirmReject}
            disabled={
              !rejectReason || actionLoading === modal?.app.applicationId
            }
          >
            Reject
          </Button>
          <Button color="gray" onClick={() => setModal(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
