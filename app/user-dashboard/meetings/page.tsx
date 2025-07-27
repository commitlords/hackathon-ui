"use client";

import { Card, Spinner, Alert, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiCalendar,
  HiClock,
  HiInformationCircle,
  HiVideoCamera,
} from "react-icons/hi";
import { fetchWithAuth } from "@/app/utils";

// Interface to define the structure of a meeting object
interface Meeting {
  id: number;
  topic: string;
  notes: string;
  meeting_date: string;
  meeting_time: string;
  meeting_link?: string; // Add the optional meeting_link property
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groupID, setGroupID] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("groupID");
    setGroupID(id);
  }, []);

  useEffect(() => {
    if (!groupID) return;

    const fetchMeetings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`groups/${groupID}/meetings`);
        if (!res.ok) {
          throw new Error("Failed to fetch meetings from the server.");
        }
        const data = await res.json();
        setMeetings(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
          Upcoming Meetings
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Stay updated with your group&apos;s schedule and reminders from the
          admin.
        </p>
      </header>

      {loading && (
        <div className="flex justify-center py-10">
          <Spinner size="xl" aria-label="Loading meetings..." />
        </div>
      )}

      {error && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Error!</span> {error}
        </Alert>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <Card key={meeting.id} className="flex flex-col">
                <div className="flex-grow">
                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {meeting.topic}
                  </h5>
                  <p className="mt-2 font-normal text-gray-700 dark:text-gray-400">
                    {meeting.notes}
                  </p>
                </div>

                {/* --- NEW: Conditionally render Join Meeting Button --- */}
                {meeting.meeting_link && (
                  <div className="mt-4">
                    <Button
                      as="a"
                      href={meeting.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                      color="blue"
                    >
                      <HiVideoCamera className="mr-2 h-5 w-5" />
                      Join Meeting
                    </Button>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <HiCalendar className="h-5 w-5" />
                    <span>{formatDate(meeting.meeting_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <HiClock className="h-5 w-5" />
                    <span>{meeting.meeting_time}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming meetings scheduled. Please check back later.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
