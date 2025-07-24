"use client";

import {
  Alert,
  Button,
  Card,
  FileInput,
  Label,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { HiMail, HiOutlineCheckCircle } from "react-icons/hi";

interface Application {
  applicationId: string;
  groupName: string;
  businessInterest: string;
}

export default function LoanRequestsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAppId, setSelectedAppId] = useState("");
  const [bankEmail, setBankEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [attachments, setAttachments] = useState<FileList | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/v1/applications");
        if (!res.ok) throw new Error("Failed to fetch applications");
        const data = await res.json();
        const validApps = data.applications.filter(
          (app: Application & { status: string }) =>
            app.status === "Training Completed",
        );
        setApplications(validApps || []);
        if (validApps.length > 0) {
          setSelectedAppId(validApps[0].applicationId);
        }
      } catch (err) {
        setError("Could not load applications ready for loan requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  useEffect(() => {
    if (selectedAppId) {
      const app = applications.find((a) => a.applicationId === selectedAppId);
      if (app) {
        setEmailSubject(
          `Loan Request for Group: ${app.groupName} (App ID: ${app.applicationId})`,
        );
        setEmailBody(
          `Dear Bank Team,\n\nPlease find attached the details for a loan request for the group "${app.groupName}" regarding their business interest in "${app.businessInterest}".\n\nThis group has completed all the necessary training and validation steps.\n\nWe kindly request you to process this loan application at your earliest convenience.\n\nThank you,\nLOKSamarth Admin`,
        );
      }
    }
  }, [selectedAppId, applications]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    // Mock API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log({
        applicationId: selectedAppId,
        bankEmail,
        emailSubject,
        emailBody,
        attachments: attachments
          ? Array.from(attachments).map((f) => f.name)
          : [],
      });

      // Update application status
      await fetch(`/api/v1/applications/${selectedAppId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Loan Request Sent" }),
      });

      setSubmitSuccess(
        `Loan request for Application ID ${selectedAppId} has been sent successfully to ${bankEmail}.`,
      );
      // Reset form fields if needed
      setBankEmail("");
      setAttachments(null);
      // Remove the submitted application from the list
      setApplications(
        applications.filter((app) => app.applicationId !== selectedAppId),
      );
      setSelectedAppId(
        applications.length > 1
          ? applications.filter((app) => app.applicationId !== selectedAppId)[0]
              .applicationId
          : "",
      );
    } catch (err) {
      setSubmitError("Failed to send the loan request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Loan Disbursement - Requests
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Send loan requests for validated applications to the designated bank.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {error && <Alert color="failure">{error}</Alert>}

      {!loading && !error && applications.length === 0 && (
        <Alert color="info">
          There are no applications ready for a loan request at this time.
        </Alert>
      )}

      {/* && applications.length > 0 */}
      {!loading && (
        <Card>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <HiMail /> New Loan Request Email
            </h2>

            {submitSuccess && (
              <Alert color="success" icon={HiOutlineCheckCircle}>
                {submitSuccess}
              </Alert>
            )}
            {submitError && <Alert color="failure">{submitError}</Alert>}

            <div>
              <div className="mb-2 block">
                <Label htmlFor="applicationId">Application</Label>
              </div>
              <Select
                id="applicationId"
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                required
              >
                {applications.map((app) => (
                  <option key={app.applicationId} value={app.applicationId}>
                    {app.applicationId} - {app.groupName} (
                    {app.businessInterest})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="bankEmail">Bank Email Address</Label>
              </div>
              <TextInput
                id="bankEmail"
                type="email"
                placeholder="e.g., loans@bank.com"
                required
                value={bankEmail}
                onChange={(e) => setBankEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="emailSubject">Email Subject</Label>
              </div>
              <TextInput
                id="emailSubject"
                type="text"
                readOnly
                value={emailSubject}
                className="bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="emailBody">Email Body</Label>
              </div>
              <Textarea
                id="emailBody"
                rows={8}
                readOnly
                value={emailBody}
                className="bg-gray-100 dark:bg-gray-700"
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="attachments">Attach Certificates</Label>
              </div>
              <FileInput
                id="attachments"
                multiple
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAttachments(e.target.files)
                }
              />
              <p className="text-sm text-gray-500">
                Upload PDF certificates or other relevant documents.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting || !selectedAppId}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Sending Request...</span>
                </>
              ) : (
                "Send Request to Bank"
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
