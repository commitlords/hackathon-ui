"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineMail, HiOutlineCheckCircle } from "react-icons/hi";

interface Application {
  applicationId: string;
  groupId: string;
  groupName: string;
  status: string;
}

const statusColors: Record<string, string> = {
  Pending: "warning",
  Validated: "success",
  "Review Application": "failure",
  "Training Assigned": "info",
  Rejected: "failure",
  "Training Completed": "purple",
  "Loan Request Sent": "cyan",
  "Loan Disbursed": "success",
};

export default function LoanStatusPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (
    applicationId: string,
    status: "Loan Request Sent" | "Loan Disbursed",
  ) => {
    setActionLoading(applicationId);
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await fetch(`/api/v1/applications/${applicationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");

      // Refetch applications to show the latest status
      await fetchApplications();
      setSuccessMsg(
        `Application ${applicationId} status updated to "${status}".`,
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Loan Disbursement - Status
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Track and update the status of all loan applications in the pipeline.
        </p>
      </header>

      {successMsg && (
        <Alert color="success" className="mb-4">
          {successMsg}
        </Alert>
      )}
      {error && <Alert color="failure">{error}</Alert>}

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-8">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Application ID</TableHeadCell>
                <TableHeadCell>Group Name</TableHeadCell>
                <TableHeadCell>Current Status</TableHeadCell>
                <TableHeadCell>Update Status</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {applications.map((app) => (
                  <TableRow key={app.applicationId}>
                    <TableCell className="font-mono">
                      {app.applicationId}
                    </TableCell>
                    <TableCell>{app.groupName}</TableCell>
                    <TableCell>
                      <Badge color={statusColors[app.status] || "gray"}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {actionLoading === app.applicationId ? (
                        <Spinner size="sm" />
                      ) : (
                        <div className="flex gap-2">
                          {/* Loan Request Sent Icon */}
                          <button
                            title="Mark as Loan Request Sent"
                            onClick={() =>
                              handleUpdateStatus(
                                app.applicationId,
                                "Loan Request Sent",
                              )
                            }
                            // disabled={
                            //   app.status !== "Training Completed" &&
                            //   app.status !== "Loan Request Sent" &&
                            //   app.status !== "Loan Disbursed"
                            // }
                            className={`rounded p-1 transition-colors duration-150 ${
                              app.status === "Loan Request Sent" ||
                              app.status === "Loan Disbursed"
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            } disabled:opacity-50`}
                            aria-label="Loan Request Sent"
                          >
                            <HiOutlineMail className="h-5 w-5" />
                          </button>
                          {/* Loan Disbursed Icon */}
                          <button
                            title="Mark as Loan Disbursed"
                            onClick={() =>
                              handleUpdateStatus(
                                app.applicationId,
                                "Loan Disbursed",
                              )
                            }
                            // disabled={
                            //   app.status !== "Loan Request Sent" &&
                            //   app.status !== "Loan Disbursed"
                            // }
                            className={`rounded p-1 transition-colors duration-150 ${
                              app.status === "Loan Disbursed"
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            } disabled:opacity-50`}
                            aria-label="Loan Disbursed"
                          >
                            <HiOutlineCheckCircle className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
