import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jozi Dairy CRM — Lead Management",
  description: "Internal lead and contact management for the Jozi Dairy team.",
  // Staff tool: keep it out of search results entirely.
  robots: { index: false, follow: false, nocache: true },
};

export default function CrmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-jozi-tint">{children}</div>;
}
