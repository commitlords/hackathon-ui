"use client";

import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUsSection() {
  return (
    <section id="contact" className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            We'd love to hear from you. Please fill out the form below or reach out to us through other channels.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-lg bg-gray-50 p-8 shadow-md dark:bg-gray-900">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Send us a message</h3>
            <form action="#" className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your Name</label>
                <input type="text" id="name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500" placeholder="John Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your Email</label>
                <input type="email" id="email" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500" placeholder="name@company.com" required />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300">Your Message</label>
                <textarea id="message" rows={6} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-orange-500 dark:focus:ring-orange-500" placeholder="Let us know how we can help..."></textarea>
              </div>
              <button type="submit" className="w-full rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">Send Message</button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Contact Information</h3>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <Mail className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
                <p className="text-gray-600 dark:text-gray-400">For support or any questions:</p>
                <a href="mailto:support@loksamarth.gov.in" className="text-orange-500 hover:underline dark:text-orange-400">support@loksamarth.gov.in</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h4>
                <p className="text-gray-600 dark:text-gray-400">Mon-Fri from 9am to 5pm.</p>
                <a href="tel:+91-11-23456789" className="text-orange-500 hover:underline dark:text-orange-400">+91-11-23456789</a>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-full bg-orange-100 p-3 dark:bg-orange-900/50">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Office Address</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Ministry of Rural Development,
                  <br />
                  Krishi Bhavan, New Delhi, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}