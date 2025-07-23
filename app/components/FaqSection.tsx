"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is LOKSamarth?",
    answer:
      "LOKSamarth is a comprehensive platform designed to empower Self-Help Groups (SHGs) by digitizing their records, activities, and financial transactions. It aims to centralize data, improve transparency, and facilitate easier access to government schemes and financial support for sustainable livelihoods.",
  },
  {
    question: "Who can use the LOKSamarth platform?",
    answer:
      "The platform is primarily for members of Self-Help Groups (SHGs), Village Organisations (VOs), and Cluster Level Federations (CLFs). It also serves government officials and administrators who manage and monitor the National Rural Livelihoods Mission (NRLM).",
  },
  {
    question: "How does LOKSamarth help in getting financial assistance?",
    answer:
      "By maintaining a digital, transparent record of an SHG's savings, meetings, and financial health, LOKSamarth makes it easier for banks and government agencies to assess creditworthiness. This streamlines the process of applying for and receiving loans, grants, and other forms of financial aid.",
  },
  {
    question: "Is my data secure on the LOKSamarth platform?",
    answer:
      "Yes, data security is a top priority. The platform uses robust security measures, including encryption and access controls, to ensure that all personal and financial information of SHG members is kept safe and confidential.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.</p>
        </div>
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
              <button
                type="button"
                className="flex w-full items-center justify-between p-5 font-medium text-gray-900 rtl:text-right dark:text-white"
                onClick={() => toggleFaq(index)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-6 w-6 shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-gray-200 p-5 dark:border-gray-700">
                  <p className="mb-2 text-gray-500 dark:text-gray-400">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}