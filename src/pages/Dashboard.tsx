
import React from "react";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TodaysWords } from "@/components/dashboard/TodaysWords";
import { GameChallenges } from "@/components/dashboard/GameChallenges";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Track your progress and continue learning new words.
      </p>
      
      <ProgressOverview />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaysWords />
        <RecentActivity />
      </div>
      
      <GameChallenges />
    </div>
  );
};

export default Dashboard;
