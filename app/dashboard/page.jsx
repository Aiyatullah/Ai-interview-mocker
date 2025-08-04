import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import Interview from "./_components/Interview";

function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-balance">Dashboard</h1>
        <p className="text-muted-foreground text-balance">
          Create and start your AI Mockup interview
        </p>
      </div>

      <div className="dashboard-grid">
        <AddNewInterview />
      </div>

      <Interview />
    </div>
  );
}

export default Dashboard;
