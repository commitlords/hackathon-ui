"use client";

import { useState } from "react";
import {
  Card,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "flowbite-react";

const mockGroups = [
  {
    groupId: "GRP-12345",
    businessInterest: "Tailoring",
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
    businessInterest: "Handicrafts",
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

  const handleLoanAmountChange = (groupId: string, value: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.groupId === groupId ? { ...g, loanAmount: value } : g,
      ),
    );
  };

  const handleSubmitApplication = (groupId: string) => {
    const group = groups.find((g) => g.groupId === groupId);
    alert(
      `Application submitted for ${group?.groupId} with loan amount: ${group?.loanAmount}`,
    );
  };

  const handleExpandGroup = (groupId: string) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <div className="space-y-8">
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
              {groups.map((group) => (
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
                    <TableCell>{group.businessInterest}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        className="w-32 rounded border px-2 py-1"
                        value={group.loanAmount}
                        onChange={(e) =>
                          handleLoanAmountChange(group.groupId, e.target.value)
                        }
                        placeholder="Enter amount"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        onClick={() => handleSubmitApplication(group.groupId)}
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
                          <Table>
                            <TableHead>
                              <TableHeadCell>Member ID</TableHeadCell>
                              <TableHeadCell>Name</TableHeadCell>
                              <TableHeadCell>Email</TableHeadCell>
                              <TableHeadCell>Phone</TableHeadCell>
                            </TableHead>
                            <TableBody>
                              {group.members.map((m) => (
                                <TableRow key={m.id}>
                                  <TableCell>{m.id}</TableCell>
                                  <TableCell>{m.name}</TableCell>
                                  <TableCell>{m.email}</TableCell>
                                  <TableCell>{m.phone}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
