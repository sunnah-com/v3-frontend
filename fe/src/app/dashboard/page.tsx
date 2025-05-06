'use client';

import { ProtectedRoute } from 'fe/components/auth/protected-route';
import { useAuth } from 'fe/hooks/use-auth';

export default function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username || 'User'}!</h2>
          <p className="mb-4">This is a protected dashboard page. Only authenticated users can see this content.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-secondary p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Account Overview</h3>
              <p className="text-sm text-muted-foreground">View and manage your account details</p>
            </div>
            
            <div className="bg-secondary p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Activity</h3>
              <p className="text-sm text-muted-foreground">Track your recent activity and history</p>
            </div>
            
            <div className="bg-secondary p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">Configure your preferences and notifications</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
