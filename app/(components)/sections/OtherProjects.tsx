import React from "react";
import Link from "next/link";
import Panel from "../Panel";
import ArchiveTable from "../ArchiveTable";
import archiveProjects from "@/public/project.json";

const SHOWN = 6;

export default function OtherProjects() {
  return (
    <Panel
      title="Everything else"
      readout={`showing ${SHOWN} of ${archiveProjects.length}`}
    >
      <ArchiveTable limit={SHOWN} />
      <Link
        href="/archive"
        className="mt-8 inline-block font-mono text-xs text-dim underline decoration-rule underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
      >
        View the full archive
      </Link>
    </Panel>
  );
}
