import React from "react";

import { AnimatedBackground } from "@ui/components/dashboard/AnimatedBackground";
import { DashboardGrid } from "@ui/components/dashboard/DashboardGrid";
import { DashboardHeader } from "@ui/components/dashboard/DashboardHeader";
import { useWidgetUrlSync } from "@ui/hooks/useWidgetUrlSync";

export const Dashboard: React.FC = () => {
  useWidgetUrlSync();

  return (
    <React.Fragment>
      <AnimatedBackground />
      <div className="relative min-h-screen">
        <div className="mx-auto flex min-h-screen flex-col p-8">
          <DashboardHeader />
          <DashboardGrid />
        </div>
      </div>
    </React.Fragment>
  );
};
