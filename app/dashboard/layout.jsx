import React from "react";
import Header from "./_components/Header";

function Dashboardlayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container-responsive section-padding">{children}</div>
    </div>
  );
}

export default Dashboardlayout;
