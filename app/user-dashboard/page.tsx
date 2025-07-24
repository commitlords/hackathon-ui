"use client";

import {
  Button,
  Card,
  Spinner,
  Table,
  Pagination,
  Modal,
  Label,
  TextInput,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import {
  HiClipboardList,
  HiUsers,
  HiOutlineIdentification,
  HiOutlineExclamationCircle,
  HiEye, // Add this import for the view icon
  HiPencilAlt, // Optionally for edit icon
  HiTrash, // Optionally for delete icon
  HiCalendar, // For meetings quick action
  HiCheckCircle, // For status card
  HiMap, // For district card
} from "react-icons/hi";

// Member interface
interface Member {
  id: string;
  name: string;
  dob: string;
  sex: string;
  phone: string;
  email: string;
  aadhar: string;
  pan: string;
  bankName: string;
  bankAccount: string;
  ifsc: string;
  businessInterest: string;
}

// GroupStats interface
interface GroupStats {
  totalMembers: number;
  groupName: string;
  groupId: string;
}

// Add mock data for groups and their members
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

export default function UserDashboardPage() {
  const [stats, setStats] = useState<GroupStats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editableMember, setEditableMember] = useState<Member | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const membersPerPage = 5;
  const [groups, setGroups] = useState(mockGroups);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  // Combined useEffect to fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadingError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockStats: GroupStats = {
          totalMembers: 5,
          groupName: "Awesome Coders",
          groupId: "GRP-12345",
        };
        setStats(mockStats);

        const mockMembers: Member[] = [
          {
            id: "MEM-001",
            name: "Jaya Patil",
            dob: "1990-01-15",
            sex: "Female",
            phone: "1234567890",
            email: "jaya.patil@example.com",
            aadhar: "1234 5678 9012",
            pan: "ABCDE1234F",
            bankName: "Bank of Example",
            bankAccount: "9876543210",
            ifsc: "EXAM0001234",
            businessInterest: "Tailoring",
          },
          {
            id: "MEM-002",
            name: "Sunita Sharma",
            dob: "1985-05-20",
            sex: "Female",
            phone: "0987654321",
            email: "sunita.sharma@example.com",
            aadhar: "9876 5432 1098",
            pan: "FGHIJ5678K",
            bankName: "Another Bank",
            bankAccount: "0123456789",
            ifsc: "ANOT0005678",
            businessInterest: "Handicrafts",
          },
          {
            id: "MEM-003",
            name: "Kavita Singh",
            dob: "1993-03-22",
            sex: "Female",
            phone: "1122334455",
            email: "kavita.singh@example.com",
            aadhar: "1122 3344 5566",
            pan: "QWERT1234Y",
            bankName: "Example Credit Union",
            bankAccount: "1122334455",
            ifsc: "EXCU0001122",
            businessInterest: "Pottery",
          },
          {
            id: "MEM-004",
            name: "Meena Kumari",
            dob: "1988-11-10",
            sex: "Female",
            phone: "5566778899",
            email: "meena.kumari@example.com",
            aadhar: "5566 7788 9900",
            pan: "ZXCVB5678N",
            bankName: "National Bank",
            bankAccount: "5566778899",
            ifsc: "NATB0005566",
            businessInterest: "Spice Making",
          },
          {
            id: "MEM-005",
            name: "Rekha Devi",
            dob: "1995-07-30",
            sex: "Female",
            phone: "9988776655",
            email: "rekha.devi@example.com",
            aadhar: "9988 7766 5544",
            pan: "ASDFG9876M",
            bankName: "Community Bank",
            bankAccount: "9988776655",
            ifsc: "COMB0009988",
            businessInterest: "Weaving",
          },
        ];
        setMembers(mockMembers);
      } catch (error) {
        setLoadingError(
          error instanceof Error ? error.message : "An unknown error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setEditableMember({ ...member }); // Initialize editable state
    setOpenModal(true);
    setIsEditMode(false); // Ensure it opens in view mode
  };

  const handleSaveChanges = () => {
    if (editableMember) {
      setMembers(
        members.map((m) => (m.id === editableMember.id ? editableMember : m)),
      );
      setIsEditMode(false);
      setSelectedMember(editableMember); // Update the view with saved data
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setOpenDeleteModal(false);
      setOpenModal(false);
      setSelectedMember(null);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (editableMember) {
      setEditableMember({ ...editableMember, [e.target.id]: e.target.value });
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * membersPerPage;
    return members.slice(startIndex, startIndex + membersPerPage);
  }, [members, currentPage]);

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

  // Add mock applicationId and businessInterest for the dashboard summary
  const applicationId = "APP-98765";
  const dashboardBusinessInterest =
    stats?.groupId === "GRP-12345" ? "Tailoring" : "Handicrafts";

  // Add mock status value
  const dashboardStatus = "Active";

  // Add mock district value
  const dashboardDistrict = "Pune";

  return (
    <div className="w-full overflow-y-auto">
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            Group Dashboard
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Here&apos;s a quick overview of your group&apos;s status and
            activity.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-800">
                <HiUsers className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    (stats?.totalMembers ?? "N/A")
                  )}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                <HiClipboardList className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Group Name</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? (
                    <Spinner size="sm" />
                  ) : (
                    (stats?.groupName ?? "N/A")
                  )}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                <HiOutlineIdentification className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Group ID</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? <Spinner size="sm" /> : (stats?.groupId ?? "N/A")}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
                <HiClipboardList className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Application ID
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {applicationId}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-800">
                <HiClipboardList className="h-6 w-6 text-pink-600 dark:text-pink-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">
                  Business Interest
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardBusinessInterest}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                <HiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Application Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardStatus}
                </p>
              </div>
            </div>
          </Card>
          <Card className="w-full">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <HiMap className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">District</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardDistrict}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button as={Link} href="/user-dashboard/members">
              <HiUsers className="mr-2 h-5 w-5" />
              Add Members
            </Button>
            <Button
              as={Link}
              href="/user-dashboard/submit-application"
              color="teal"
            >
              <HiClipboardList className="mr-2 h-5 w-5" />
              Submit Application
            </Button>
            <Button as={Link} href="/user-dashboard/meetings" color="purple">
              <HiCalendar className="mr-2 h-5 w-5" />
              Meetings
            </Button>
          </div>
        </div>

        {/* Members List with Flowbite Table */}
        <div className="flex flex-col">
          <h2 className="mb-4 flex items-center text-xl font-semibold text-gray-900 md:text-2xl dark:text-white">
            <HiUsers className="mr-2 inline h-6 w-6" />
            Group Members Overview
          </h2>
          {loading && (
            <div className="flex h-72 items-center justify-center rounded-lg border dark:border-gray-700">
              <Spinner aria-label="Loading members..." size="xl" />
            </div>
          )}
          {loadingError && (
            <div className="flex h-72 items-center justify-center rounded-lg border border-red-500 bg-red-50 dark:border-red-600 dark:bg-gray-800">
              <p className="text-red-700 dark:text-red-400">{loadingError}</p>
            </div>
          )}
          {!loading && !loadingError && (
            <Card className="w-full">
              <div className="w-full overflow-x-auto">
                <Table className="w-full min-w-max" hoverable>
                  <TableHead>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell className="hidden md:table-cell">
                      Email
                    </TableHeadCell>
                    <TableHeadCell className="hidden lg:table-cell">
                      Phone
                    </TableHeadCell>
                    <TableHeadCell>
                      <span className="sr-only">Actions</span>
                    </TableHeadCell>
                  </TableHead>
                  <TableBody className="divide-y">
                    {paginatedMembers.map((member) => (
                      <TableRow
                        key={member.id}
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          {member.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {member.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {member.phone}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="View Member Overview"
                            onClick={() => handleViewDetails(member)}
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          {/* Optionally, you can add edit and delete icons here for quick actions */}

                          <button
                            className="text-green-600 hover:text-green-800"
                            title="Edit Member"
                            onClick={() => {
                              setSelectedMember(member);
                              setEditableMember({ ...member });
                              setOpenModal(true);
                              setIsEditMode(true);
                            }}
                          >
                            <HiPencilAlt className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Delete Member"
                            onClick={() => {
                              setSelectedMember(member);
                              setOpenDeleteModal(true);
                            }}
                          >
                            <HiTrash className="h-5 w-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {members.length > membersPerPage && (
                <div className="flex items-center justify-center pt-4 text-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(members.length / membersPerPage)}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Delete Confirmation Modal */}
      </div>

      {/* Member Details Modal */}
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false);
          setIsEditMode(false);
        }}
      >
        <ModalHeader>
          {isEditMode ? "Edit Member Details" : selectedMember?.name}
        </ModalHeader>
        <ModalBody>
          {isEditMode && editableMember ? (
            // Edit Form
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <TextInput
                  id="name"
                  value={editableMember.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <TextInput
                  id="email"
                  type="email"
                  value={editableMember.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <TextInput
                  id="phone"
                  type="tel"
                  value={editableMember.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <TextInput
                  id="dob"
                  type="date"
                  value={editableMember.dob}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <TextInput
                  id="sex"
                  value={editableMember.sex}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="aadhar">Aadhar</Label>
                <TextInput
                  id="aadhar"
                  value={editableMember.aadhar}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pan">PAN</Label>
                <TextInput
                  id="pan"
                  value={editableMember.pan}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <TextInput
                  id="bankName"
                  value={editableMember.bankName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">Bank Account No.</Label>
                <TextInput
                  id="bankAccount"
                  value={editableMember.bankAccount}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <TextInput
                  id="ifsc"
                  value={editableMember.ifsc}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          ) : (
            // View Details
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.dob}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Sex
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.sex}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Aadhar
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.aadhar}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    PAN
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.pan}
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Business & Bank Details
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Name
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bank Account No.
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.bankAccount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    IFSC Code
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {selectedMember?.ifsc}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {isEditMode ? (
            <>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
              <Button color="gray" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditMode(true)}>Edit</Button>
              <Button color="failure" onClick={() => setOpenDeleteModal(true)}>
                Delete
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Close
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this member?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteMember}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
