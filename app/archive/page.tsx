import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { LuArrowLeft } from "react-icons/lu";
import ArchiveTable from "../(components)/ArchiveTable";
import archiveProjects from "@/public/project.json";

export const metadata: Metadata = {
  title: "Archive | Vivek Chaturvedi",
  description: "A full list of projects Vivek Chaturvedi has worked on.",
  alternates: { canonical: "/archive" },
};

export default function Archive() {
  const years = archiveProjects.map((p) => Number(p.year));

  return (
    <main className="pt-[4.5rem]">
      <div className="mx-auto w-full max-w-[1240px] px-[var(--gutter)] py-20 md:py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-dim transition-colors hover:text-signal"
        >
          <LuArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <header className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-rule pb-4">
          <h1 className="text-3xl font-medium tracking-tightest md:text-4xl">
            Archive
          </h1>
          <p className="tnum font-mono text-xs text-dim">
            {archiveProjects.length} projects   {Math.min(...years)} - {Math.max(...years)}
          </p>
        </header>

        <ArchiveTable />
      </div>
    </main>
  );
}
