"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactUsSection() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t("contactUs")}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {t("contactUsDescription")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-900">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              {t("sendMessage")}
            </h3>
            <form>
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("yourName")}
                </label>
                <input
                  type="text"
                  id="name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                  placeholder={t("namePlaceholder")}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("yourEmail")}
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t("yourMessage")}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                  placeholder={t("messagePlaceholder")}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 focus:outline-none dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
              >
                {t("sendMessage")}
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t("ourContactInfo")}
            </h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <Mail className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("email")}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("supportText")}
                </p>
                <a
                  href="mailto:support@loksamarth.gov.in"
                  className="text-orange-500 hover:underline dark:text-orange-400"
                >
                  support@loksamarth.gov.in
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("phone")}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("phoneTime")}
                </p>
                <a
                  href="tel:+91-11-23456789"
                  className="text-orange-500 hover:underline dark:text-orange-400"
                >
                  +91-11-23456789
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("officeAddress")}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("ministry")},<br />
                  {t("krishiBhavan")}, {t("newDelhiIndia")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
