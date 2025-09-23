import React from "react";
import AppSidebar from "@/components/app-sidebar";
import DashboardBody from "./DashboardBody";

function Dashboard() {
  return (
    <>
      <AppSidebar children={<DashboardBody />}></AppSidebar>
    </>
  );
}

export default Dashboard;
