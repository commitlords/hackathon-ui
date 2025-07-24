"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function EventGallery() {
  const { t } = useTranslation();
  const galleryImages = [
    {
      src: "/farming.jpeg",
      alt: t("gallery.agricultureAlt"),
      sector: t("gallery.agriculture"),
    },
    {
      src: "/textile.jpeg",
      alt: t("gallery.textilesAlt"),
      sector: t("gallery.textiles"),
    },
    {
      src: "/technology.jpeg",
      alt: t("gallery.technologyAlt"),
      sector: t("gallery.technology"),
    },
    {
      src: "/handicrafts.jpeg",
      alt: t("gallery.handicraftsAlt"),
      sector: t("gallery.handicrafts"),
    },
    {
      src: "/construction.jpeg",
      alt: t("gallery.constructionAlt"),
      sector: t("gallery.construction"),
    },
    {
      src: "/pottery.jpeg",
      alt: t("gallery.potteryAlt"),
      sector: t("gallery.pottery"),
    },
    {
      src: "/nursery.jpeg",
      alt: t("gallery.nurseryAlt"),
      sector: t("gallery.nursery"),
    },
    {
      src: "/shop.jpeg",
      alt: t("gallery.shopAlt"),
      sector: t("gallery.shop"),
    },
  ];
  return (
    <section className="bg-white py-16 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t("gallery.title")}</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{t("gallery.description")}</p>
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