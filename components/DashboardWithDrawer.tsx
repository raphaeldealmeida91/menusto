"use client";

import DashboardPage from "@/app/views/DashboardPage";

interface Props {
  userEmail: string;
}

export default function DashboardWithDrawer(props: Props) {
  return <DashboardPage {...props} />;
}
