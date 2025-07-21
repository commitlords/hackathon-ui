import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-3xl font-bold">
        Welcome to the Admin Dashboard
      </h1>
      <p className="mb-2 text-lg text-gray-600 dark:text-gray-300">
        Use the sidebar to navigate between Applications, Inbox, Issue
        Certificate, Loan Disbursement, and Meetings.
      </p>
      <p className="text-md text-gray-500 dark:text-gray-400">
        Manage group applications, assign meetings, and process loan
        disbursements efficiently.
      </p>
    </div>
  );
}
