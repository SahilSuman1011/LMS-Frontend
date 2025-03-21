import React from "react";
import AuthLayout from "./layout/AuthLayout";
import LeadDashboard from "./leads/LeadDashboard";

interface HomeProps {
  userRole?: "admin" | "user";
  isAuthenticated?: boolean;
  isLoading?: boolean;
  userName?: string;
  notificationCount?: number;
}

const Home = ({
  userRole = "user",
  isAuthenticated = true,
  isLoading = false,
  userName = "John Doe",
  notificationCount = 3,
}: HomeProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AuthLayout
        userRole={userRole}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        userName={userName}
        notificationCount={notificationCount}
      >
        <LeadDashboard userRole={userRole} />
      </AuthLayout>
    </div>
  );
};

export default Home;
