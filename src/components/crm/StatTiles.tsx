"use client";

import React from "react";
import { CalendarClock, CircleAlert, Handshake, TrendingUp, UserPlus } from "lucide-react";
import { CrmStats } from "@/lib/crm/types";
import { formatRand } from "./crmUi";

interface StatTilesProps {
  stats: CrmStats;
  /** Jumps the table to the leads behind a tile. */
  onDrillDown: (view: "all" | "open" | "followups" | "unassigned") => void;
}

export default function StatTiles({ stats, onDrillDown }: StatTilesProps) {
  const openCount =
    stats.byStatus.NEW +
    stats.byStatus.CONTACTED +
    stats.byStatus.QUALIFIED +
    stats.byStatus.QUOTED;

  const tiles = [
    {
      key: "open" as const,
      label: "Open leads",
      value: String(openCount),
      detail: `${stats.newThisWeek} new this week`,
      icon: TrendingUp,
      accent: "text-jozi-cyan",
    },
    {
      key: "followups" as const,
      label: "Follow-ups due",
      value: String(stats.overdueFollowUps),
      detail: stats.overdueFollowUps > 0 ? "Needs a call today" : "All caught up",
      icon: CalendarClock,
      accent: stats.overdueFollowUps > 0 ? "text-red-600" : "text-jozi-green",
    },
    {
      key: "unassigned" as const,
      label: "Unassigned",
      value: String(stats.unassigned),
      detail: stats.unassigned > 0 ? "Nobody is chasing these" : "Everyone has an owner",
      icon: stats.unassigned > 0 ? CircleAlert : UserPlus,
      accent: stats.unassigned > 0 ? "text-jozi-amber" : "text-jozi-green",
    },
    {
      key: "all" as const,
      label: "Won",
      value: String(stats.byStatus.WON),
      detail: `${formatRand(stats.wonValue)} / month`,
      icon: Handshake,
      accent: "text-jozi-green",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <button
            key={tile.key}
            type="button"
            onClick={() => onDrillDown(tile.key)}
            className="group rounded-2xl border border-jozi-navy/10 bg-white p-5 text-left shadow-soft transition hover:border-jozi-cyan/40 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-medium text-jozi-navy/60">
                {tile.label}
              </span>
              <Icon className={`h-5 w-5 ${tile.accent}`} aria-hidden="true" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-jozi-navy">
              {tile.value}
            </p>
            <p className="mt-1 text-xs text-jozi-navy/50">{tile.detail}</p>
          </button>
        );
      })}

      <div className="rounded-2xl border border-jozi-navy/10 bg-jozi-navy p-5 shadow-soft sm:col-span-2 xl:col-span-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-jozi-white/60">
              Open pipeline value
            </p>
            <p className="mt-1 font-display text-3xl font-bold text-jozi-white">
              {formatRand(stats.openPipelineValue)}
              <span className="ml-2 text-sm font-normal text-jozi-white/50">
                est. per month
              </span>
            </p>
          </div>
          <dl className="flex flex-wrap gap-x-8 gap-y-2">
            {(
              [
                ["New", stats.byStatus.NEW],
                ["Contacted", stats.byStatus.CONTACTED],
                ["Qualified", stats.byStatus.QUALIFIED],
                ["Quoted", stats.byStatus.QUOTED],
                ["Lost", stats.byStatus.LOST],
              ] as const
            ).map(([label, count]) => (
              <div key={label}>
                <dt className="text-xs text-jozi-white/50">{label}</dt>
                <dd className="font-display text-lg font-semibold text-jozi-white">
                  {count}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
