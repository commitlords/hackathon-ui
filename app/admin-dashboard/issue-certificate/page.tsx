"use client";

import { Button, Card, Label, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const CertificatePreview = ({
  memberName,
  bankName,
  loanAmount,
  certificateRef,
}: {
  memberName: string;
  bankName: string;
  loanAmount: string;
  certificateRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Add formatter for Indian currency
  function formatIndianNumber(numStr: string) {
    const num = Number(numStr);
    if (isNaN(num)) return numStr || "____";
    return num.toLocaleString("en-IN");
  }

  return (
    <div
      ref={certificateRef}
      className="dark:bg-gray-900" // Dark mode background for the certificate content
      style={{
        width: "600px",
        height: "800px",
        padding: "40px",
        border: "10px solid #d1d5db", // gray-300
        fontFamily: "serif",
        color: "#1f2937", // gray-800
        backgroundColor: "#f9fafb", // gray-50
      }}
    >
      <div
        className="dark:border-gray-600"
        style={{
          border: "2px solid #e5e7eb", // gray-200
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "30px",
          color: "inherit", // Inherit color for text
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Image
              src="/Logo.png"
              alt="LOKSamarth Logo"
              width={80}
              height={80}
              unoptimized
            />
          </div>
          <h1
            className="dark:text-gray-100"
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              marginTop: "20px",
            }}
          >
            CERTIFICATE of LOAN DISBURSEMENT
          </h1>
          <p
            className="dark:text-gray-300"
            style={{ fontSize: "18px", marginTop: "10px" }}
          >
            This certificate is proudly presented to
          </p>
        </div>

        <div style={{ textAlign: "center" }}>
          <h2
            className="dark:text-white"
            style={{ fontSize: "36px", fontWeight: "bold" }}
          >
            {memberName || "Member Name"}
          </h2>
          <p
            className="dark:text-gray-300"
            style={{ fontSize: "18px", marginTop: "20px" }}
          >
            with a loan amount of
          </p>
          <div
            className="dark:text-white"
            style={{ fontSize: "36px", fontWeight: "bold" }}
          >
            ₹{formatIndianNumber(loanAmount)}
          </div>
          <p
            className="dark:text-gray-300"
            style={{ fontSize: "18px", marginTop: "20px" }}
          >
            in recognition of their successful loan disbursement from
          </p>
          <h3
            className="dark:text-gray-200"
            style={{ fontSize: "28px", fontStyle: "italic" }}
          >
            {bankName || "Bank Name"}
          </h3>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p
              className="dark:text-gray-400"
              style={{ borderBottom: "2px solid #d1d5db", paddingTop: "5px" }}
            >
              Date: {today}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              className="dark:text-gray-200"
              style={{
                fontFamily: "cursive",
                fontSize: "24px",
                borderBottom: "2px solid #d1d5db",
                paddingBottom: "5px",
              }}
            >
              Digitally Signed
            </p>
            <p className="dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function IssueCertificatePage() {
  const [memberName, setMemberName] = useState("");
  const [bankName, setBankName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const input = certificateRef.current;
    if (input) {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "px", [600, 800]);
        pdf.addImage(imgData, "PNG", 0, 0, 600, 800);
        pdf.save(`Certificate-${memberName.replace(/\s/g, "-")}.pdf`);
      });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="mb-4 text-2xl font-semibold">Issue Certificate</h2>
      <p className="mb-6">
        Fill in the details to generate a preview and download the certificate
        as a PDF.
      </p>

      <div className="grid grid-cols-1 gap-8">
        {/* Form Section */}
        <div className="mx-auto w-full max-w-md">
          <Card>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="memberName">Member&apos;s Name</Label>
                </div>
                <TextInput
                  id="memberName"
                  type="text"
                  placeholder="Enter the member's full name"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="bankName">Bank Name</Label>
                </div>
                <TextInput
                  id="bankName"
                  type="text"
                  placeholder="Enter the bank's name"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                </div>
                <TextInput
                  id="loanAmount"
                  type="number"
                  placeholder="Enter the loan amount"
                  required
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  min="0"
                />
              </div>
              <Button
                onClick={handleDownload}
                disabled={!memberName || !bankName || !loanAmount}
              >
                Download Certificate as PDF
              </Button>
            </div>
          </Card>
        </div>

        {/* Preview Section */}
        <div>
          <h3 className="mb-2 text-lg font-semibold">Certificate Preview</h3>
          <div className="w-full overflow-x-auto rounded-lg border bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div
              className="mx-auto h-[800px] w-[600px] transform-gpu transition-transform duration-300 md:scale-75 lg:scale-100"
              style={{ transformOrigin: "top left" }}
            >
              <CertificatePreview
                memberName={memberName}
                bankName={bankName}
                loanAmount={loanAmount}
                certificateRef={certificateRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
