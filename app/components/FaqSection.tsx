"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const { t } = useTranslation();
  const faqData = [
    {
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
  ];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t("faq.title")}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("faq.description")}</p>
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