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
  Dropdown,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "flowbite-react";

interface Message {
  id: string;
  type: string;
  subject: string;
  relatedGroupId: string;
  relatedApplicationId: string;
  status: string;
  timestamp: string;
  content: string;
  direction: string;
}

const statusColors: Record<string, string> = {
  unread: "failure",
  read: "success",
};

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [replyModal, setReplyModal] = useState<{
    msg: Message;
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/v1/admin/inbox");
        if (!res.ok) throw new Error("Failed to fetch inbox");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch (err) {
        setError("Could not load inbox.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleMarkRead = async (msg: Message, read: boolean) => {
    setActionLoading(msg.id);
    try {
      // In real app, call PATCH/POST to update status
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? { ...m, status: read ? "read" : "unread" } : m,
        ),
      );
      setSuccessMsg(read ? "Marked as read" : "Marked as unread");
      setTimeout(() => setSuccessMsg(null), 1500);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredMessages = filter
    ? messages.filter((m) => m.type === filter)
    : messages;

  return (
    <div className="space-y-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
        Admin Inbox
      </h1>
      {successMsg && <Alert color="success">{successMsg}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}
      <div className="mb-4 flex items-center gap-4">
        <Dropdown label={filter || "Filter by Type"} inline>
          <DropdownItem onClick={() => setFilter(null)}>All</DropdownItem>
          <DropdownItem onClick={() => setFilter("Loan Request")}>
            Loan Request
          </DropdownItem>
          <DropdownItem onClick={() => setFilter("Disbursement")}>
            Disbursement
          </DropdownItem>
          <DropdownItem onClick={() => setFilter("Certificate")}>
            Certificate
          </DropdownItem>
        </Dropdown>
      </div>
      {loading ? (
        <div className="my-8 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <Table hoverable>
          <TableHead>
            <TableHeadCell>Subject</TableHeadCell>
            <TableHeadCell>Type</TableHeadCell>
            <TableHeadCell>Group</TableHeadCell>
            <TableHeadCell>Application</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Timestamp</TableHeadCell>
            <TableHeadCell>Direction</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            {filteredMessages.map((msg) => {
              const isExpanded = expanded === msg.id;
              return (
                <>
                  <TableRow key={msg.id}>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleExpand(msg.id)}
                      >
                        {msg.subject}
                      </button>
                    </TableCell>
                    <TableCell>{msg.type}</TableCell>
                    <TableCell>{msg.relatedGroupId}</TableCell>
                    <TableCell>{msg.relatedApplicationId}</TableCell>
                    <TableCell>
                      <Badge color={statusColors[msg.status] || "gray"}>
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(msg.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {msg.direction === "in" ? "Incoming" : "Outgoing"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        color={msg.status === "read" ? "warning" : "success"}
                        onClick={() =>
                          handleMarkRead(msg, msg.status !== "read")
                        }
                        disabled={actionLoading === msg.id}
                      >
                        {msg.status === "read" ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button
                        size="xs"
                        color="info"
                        className="ml-2"
                        onClick={() => setReplyModal({ msg, text: "" })}
                      >
                        Reply
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="p-4">
                          <h3 className="mb-2 font-semibold">
                            Message Content
                          </h3>
                          <div>{msg.content}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      )}
      {/* Reply Modal */}
      <Modal show={!!replyModal} onClose={() => setReplyModal(null)}>
        <ModalHeader>Reply to Message</ModalHeader>
        <ModalBody>
          <textarea
            className="w-full rounded border p-2"
            rows={4}
            value={replyModal?.text || ""}
            onChange={(e) =>
              setReplyModal((rm) =>
                rm ? { ...rm, text: e.target.value } : null,
              )
            }
            placeholder="Type your reply here..."
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="info"
            onClick={async () => {
              if (replyModal) {
                setActionLoading(replyModal.msg.id);
                await fetch("/api/v1/admin/inbox", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "Reply",
                    subject: "Re: " + replyModal.msg.subject,
                    relatedGroupId: replyModal.msg.relatedGroupId,
                    relatedApplicationId: replyModal.msg.relatedApplicationId,
                    content: replyModal.text,
                    direction: "out",
                  }),
                });
                setReplyModal(null);
                setActionLoading(null);
                setSuccessMsg("Reply sent!");
                setTimeout(() => setSuccessMsg(null), 1500);
              }
            }}
            disabled={!replyModal?.text}
          >
            Send Reply
          </Button>
          <Button color="gray" onClick={() => setReplyModal(null)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
