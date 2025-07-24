"use client";

import Image from "next/image";

// NOTE: Create a `/public/gallery` folder and add your images there.
const galleryImages = [
  {
    src: "/farming.jpeg",
    alt: "Woman working in an agricultural field",
    sector: "Agriculture",
  },
  {
    src: "/textile.jpeg",
    alt: "Woman working in a textile factory",
    sector: "Textiles",
  },
  {
    src: "/technology.jpeg",
    alt: "Woman working on a laptop in a tech office",
    sector: "Technology",
  },
  {
    src: "/handicrafts.jpeg",
    alt: "Woman making handicrafts",
    sector: "Handicrafts",
  },
  {
    src: "/construction.jpeg",
    alt: "Woman working at a construction site",
    sector: "Construction",
  },
  {
    src: "/pottery.jpeg",
    alt: "Female healthcare worker with a patient",
    sector: "Pottery",
  },
  {
    src: "/nursery.jpeg",
    alt: "Teacher in a classroom with students",
    sector: "Nursery",
  },
  {
    src: "/shop.jpeg",
    alt: "Woman managing her small local shop",
    sector: "Shop",
  },
];

export default function EventGallery() {
  return (
    <section className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Glimpses of Empowerment</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Celebrating the contribution of women across various sectors in India.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
              <Image src={image.src} alt={image.alt} width={400} height={400} className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-sm font-semibold text-white">{image.sector}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}