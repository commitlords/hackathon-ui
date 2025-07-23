"use client";

import { Card } from "flowbite-react";
import { Handshake, Home as HomeIcon, Layers3, Users } from "lucide-react";

const stats = [
  {
    icon: <Users className="h-8 w-8 text-orange-500" />,
    value: "10.43 Crore",
    label: "Households Mobilised",
  },
  {
    icon: <Handshake className="h-8 w-8 text-orange-500" />,
    value: "93.97 Lakh",
    label: "Self Help Groups",
  },
  {
    icon: <HomeIcon className="h-8 w-8 text-orange-500" />,
    value: "5.49 Lakh",
    label: "Village Organisations",
  },
  {
    icon: <Layers3 className="h-8 w-8 text-orange-500" />,
    value: "33,804",
    label: "Cluster Level Federations",
  },
];

export default function StatsSection() {
  return (
    <section className="w-full bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 text-center sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <div className="flex flex-col items-center">
              {stat.icon}
              <h5 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {stat.value}
              </h5>
              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}