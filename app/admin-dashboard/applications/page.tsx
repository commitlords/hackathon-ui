"use client";

import { fetchWithAuth, API_BASE_URL } from "@/app/utils";
import {
  Alert,
  Badge,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  Tooltip,
} from "flowbite-react";
import Image from "next/image";
import React, { useEffect, useState, useCallback } from "react";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineCalendar,
  HiShieldCheck,
  HiBanknotes,
  HiQuestionMarkCircle,
  HiExclamationCircle,
} from "react-icons/hi2";

// --- Interfaces ---

interface Member {
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
  photoID?: string;
}

interface Application {
  applicationId: string;
  groupID: number;
  groupName: string;
  businessInterest: { name: string }[];
  createdAt: string;
  status: string;
  comment: string;
  district: string;
  members?: Member[];
}

interface BackendApplication {
  appicationID: string; // Backend typo
  groupID: number;
  groupName: string;
  businessInterest: { name: string }[];
  createdAt: string;
  status: string;
  comment: string;
  district: string;
}

type ValidationStatus = "pending" | "valid" | "invalid" | "loading";

interface MemberValidationStatus {
  aadhar: ValidationStatus;
  bank: ValidationStatus;
  message?: string;
}

const statusColors: Record<string, string> = {
  IN_PROGRESS: "warning",
  REJECTED: "failure",
  Validated: "success",
  "Training Assigned": "info",
  "Training Completed": "purple",
  "Loan Request Sent": "cyan",
  "Loan Disbursed": "success",
};

// --- Component ---

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [modal, setModal] = useState<null | {
    type: "reject";
    app: Application;
  }>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<
    Record<number, MemberValidationStatus>
  >({});

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuth("applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(
        (data || []).map((app: BackendApplication) => ({
          ...app,
          applicationId: app.appicationID,
        })),
      );
    } catch (err) {
      setError("Could not load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (
    appId: string,
    status: string,
    comment?: string,
  ) => {
    setActionLoading(`${appId}-${status}`);
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await fetchWithAuth(`applications/${appId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updatedApp = await res.json();

      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === appId
            ? { ...app, status: updatedApp.status, comment: updatedApp.comment }
            : app,
        ),
      );
      setSuccessMsg(`Application ${appId} has been updated to "${status}".`);
    } catch (err) {
      setError("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (app: Application) => {
    setModal({ type: "reject", app });
    setRejectReason("");
  };

  const handleConfirmReject = async () => {
    if (modal && modal.type === "reject" && rejectReason) {
      await handleUpdateStatus(
        modal.app.applicationId,
        "REJECTED",
        rejectReason,
      );
      setModal(null);
    }
  };

  const handleExpand = async (app: Application) => {
    const newExpandedAppId =
      expandedAppId === app.applicationId ? null : app.applicationId;
    setExpandedAppId(newExpandedAppId);

    if (newExpandedAppId && !app.members) {
      try {
        const res = await fetchWithAuth(`groups/${app.groupID}/members`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();

        setApplications((apps) =>
          apps.map((currentApp) =>
            currentApp.applicationId === app.applicationId
              ? { ...currentApp, members: data }
              : currentApp,
          ),
        );

        const initialStatuses: Record<number, MemberValidationStatus> = {};
        (data || []).forEach((member: Member) => {
          initialStatuses[member.memberID] = {
            aadhar: "pending",
            bank: "pending",
          };
        });
        setValidationStatus((prev) => ({ ...prev, ...initialStatuses }));
      } catch (err) {
        setError(
          `Could not load members for application ${app.applicationId}.`,
        );
      }
    }
  };

  const handleValidation = async (
    app: Application,
    member: Member,
    type: "aadhar" | "bank",
  ) => {
    setValidationStatus((prev) => ({
      ...prev,
      [member.memberID]: { ...prev[member.memberID], [type]: "loading" },
    }));

    let endpoint = "";
    let body = {};

    if (type === "aadhar") {
      endpoint = "aadhar_service/validate";
      body = {
        aadhar_number: member.aadharNumber,
        name: member.name,
        dob: member.dob.split("T")[0],
        address: app.district, // Using district from the application
        gender: member.sex,
        mobile_number: parseInt(member.phoneNumber, 10),
        pan_number: member.panNumber,
      };
    } else {
      endpoint = "bank/validate";
      body = {
        account_number: parseInt(member.bankAccountNumber, 10),
        aadhar_number: parseInt(member.aadharNumber, 10),
        pan_number: member.panNumber,
        ifsc_code: member.bankIfscCode,
        mobile_number: parseInt(member.phoneNumber, 10),
      };
    }

    try {
      const res = await fetchWithAuth(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      const newStatus: ValidationStatus = result.valid ? "valid" : "invalid";

      setValidationStatus((prev) => ({
        ...prev,
        [member.memberID]: {
          ...prev[member.memberID],
          [type]: newStatus,
          message: result.message,
        },
      }));
    } catch (err) {
      setValidationStatus((prev) => ({
        ...prev,
        [member.memberID]: {
          ...prev[member.memberID],
          [type]: "invalid",
          message: "Validation request failed.",
        },
      }));
    }
  };

  const getValidationIcon = (status: ValidationStatus) => {
    switch (status) {
      case "loading":
        return <Spinner size="sm" />;
      case "valid":
        return <HiOutlineCheckCircle className="h-6 w-6 text-green-500" />;
      case "invalid":
        return <HiExclamationCircle className="h-6 w-6 text-red-500" />;
      default:
        return <HiQuestionMarkCircle className="h-6 w-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
        Applications
      </h1>
      {successMsg && (
        <Alert
          color="success"
          onDismiss={() => setSuccessMsg(null)}
          className="mb-4"
        >
          {successMsg}
        </Alert>
      )}
      {error && (
        <Alert
          color="failure"
          onDismiss={() => setError(null)}
          className="mb-4"
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="my-8 flex justify-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Application ID</TableHeadCell>
                  <TableHeadCell>Group Name</TableHeadCell>
                  <TableHeadCell>Business Interest</TableHeadCell>
                  <TableHeadCell>Created At</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Comment</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {applications.map((app) => (
                  <React.Fragment key={app.applicationId}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <button
                          className="font-semibold text-cyan-600 hover:underline"
                          onClick={() => handleExpand(app)}
                        >
                          {app.applicationId}
                        </button>
                      </TableCell>
                      <TableCell>{app.groupName}</TableCell>
                      <TableCell>
                        {app.businessInterest
                          .map((bi) => bi.name.replace(/[{}]/g, ""))
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {new Date(app.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge color={statusColors[app.status] || "gray"}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.comment || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {actionLoading?.startsWith(app.applicationId) ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              {app.status === "IN_PROGRESS" && (
                                <>
                                  <Tooltip content="Validate Application">
                                    <button
                                      onClick={() =>
                                        handleUpdateStatus(
                                          app.applicationId,
                                          "Validated",
                                        )
                                      }
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <HiOutlineCheckCircle className="h-6 w-6" />
                                    </button>
                                  </Tooltip>
                                  <Tooltip content="Reject Application">
                                    <button
                                      onClick={() => handleRejectClick(app)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <HiOutlineXCircle className="h-6 w-6" />
                                    </button>
                                  </Tooltip>
                                </>
                              )}
                              {app.status === "Validated" && (
                                <Tooltip content="Assign Training">
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        app.applicationId,
                                        "Training Assigned",
                                      )
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <HiOutlineCalendar className="h-6 w-6" />
                                  </button>
                                </Tooltip>
                              )}
                              {app.status === "Training Assigned" && (
                                <Tooltip content="Mark Training as Completed">
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(
                                        app.applicationId,
                                        "Training Completed",
                                      )
                                    }
                                    className="text-purple-500 hover:text-purple-700"
                                  >
                                    <HiShieldCheck className="h-6 w-6" />
                                  </button>
                                </Tooltip>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>

                    {expandedAppId === app.applicationId && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="bg-gray-50 p-4 dark:bg-gray-800"
                        >
                          {!app.members ? (
                            <div className="flex justify-center">
                              <Spinner />
                            </div>
                          ) : (
                            <div>
                              <h3 className="mb-4 text-lg font-semibold">
                                Members of {app.groupName} ({app.members.length}
                                )
                              </h3>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableHeadCell>Photo</TableHeadCell>
                                    <TableHeadCell>Name</TableHeadCell>
                                    <TableHeadCell>Contact</TableHeadCell>
                                    <TableHeadCell>Identity</TableHeadCell>
                                    <TableHeadCell>Validation</TableHeadCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody className="divide-y">
                                  {app.members.map((member) => (
                                    <TableRow key={member.memberID}>
                                      <TableCell>
                                        <Image
                                          src={`${API_BASE_URL}/uploads/${member.photoID}`}
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
                                        <p>{member.phoneNumber}</p>
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        <p>
                                          <b>Aadhar:</b> {member.aadharNumber}
                                        </p>
                                        <p>
                                          <b>PAN:</b> {member.panNumber}
                                        </p>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex items-center gap-4">
                                          <Tooltip
                                            content={`Aadhar: ${validationStatus[member.memberID]?.message || "Pending"}`}
                                          >
                                            <Button
                                              size="xs"
                                              color="light"
                                              onClick={() =>
                                                handleValidation(
                                                  app,
                                                  member,
                                                  "aadhar",
                                                )
                                              }
                                              disabled={
                                                validationStatus[
                                                  member.memberID
                                                ]?.aadhar === "loading"
                                              }
                                            >
                                              <HiShieldCheck className="mr-2 h-4 w-4" />
                                              {getValidationIcon(
                                                validationStatus[
                                                  member.memberID
                                                ]?.aadhar,
                                              )}
                                            </Button>
                                          </Tooltip>
                                          <Tooltip
                                            content={`Bank: ${validationStatus[member.memberID]?.message || "Pending"}`}
                                          >
                                            <Button
                                              size="xs"
                                              color="light"
                                              onClick={() =>
                                                handleValidation(
                                                  app,
                                                  member,
                                                  "bank",
                                                )
                                              }
                                              disabled={
                                                validationStatus[
                                                  member.memberID
                                                ]?.bank === "loading"
                                              }
                                            >
                                              <HiBanknotes className="mr-2 h-4 w-4" />
                                              {getValidationIcon(
                                                validationStatus[
                                                  member.memberID
                                                ]?.bank,
                                              )}
                                            </Button>
                                          </Tooltip>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Rejection Modal */}
      <Modal show={modal?.type === "reject"} onClose={() => setModal(null)}>
        <ModalHeader>
          Reject Application {modal?.app.applicationId}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p>
              Please provide a reason for rejecting the application for group{" "}
              <b>{modal?.app.groupName}</b>.
            </p>
            <Textarea
              id="rejectReason"
              placeholder="Enter reason for rejection..."
              required
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="failure"
            onClick={handleConfirmReject}
            disabled={!rejectReason || !!actionLoading}
          >
            {actionLoading ? <Spinner size="sm" /> : "Confirm Rejection"}
          </Button>
          <Button color="gray" onClick={() => setModal(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}