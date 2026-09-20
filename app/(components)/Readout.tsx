import React from "react";

/** One labelled instrument reading. Label left, value right, hairline between. */
export default function Readout({
  label,
  value,
  live = false,
}: {
  label: string;
  value: React.ReactNode;
  live?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5 last:border-b-0">
      <dt className="font-mono text-xs text-dim2">{label}</dt>
      <dd
        className={`tnum text-right font-mono text-xs ${
          live ? "text-signal" : "text-text"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
