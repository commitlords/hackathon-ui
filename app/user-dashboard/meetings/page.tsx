"use client";

import {
  Card,
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";

const mockMeetings = [
  {
    id: 1,
    date: "2024-06-10",
    time: "15:00",
    topic: "Monthly Group Review",
    notes: "Bring your passbooks. Admin will discuss new loan policies.",
  },
  {
    id: 2,
    date: "2024-06-20",
    time: "11:00",
    topic: "Business Interest Workshop",
    notes: "External expert session on handicrafts business.",
  },
];

export default function MeetingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Meetings
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          View your upcoming group meetings and admin reminders.
        </p>
      </header>
      <Card>
        <h2 className="mb-4 text-xl font-semibold">Upcoming Meetings</h2>
        {mockMeetings.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No meetings scheduled. Please check back later.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Time</TableHeadCell>
                <TableHeadCell>Topic</TableHeadCell>
                <TableHeadCell>Notes / Reminder</TableHeadCell>
              </TableHead>
              <TableBody>
                {mockMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>{meeting.date}</TableCell>
                    <TableCell>{meeting.time}</TableCell>
                    <TableCell>{meeting.topic}</TableCell>
                    <TableCell>{meeting.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
