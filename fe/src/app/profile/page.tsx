"use client";

import { ProtectedRoute } from "fe/components/auth/protected-route";
import { useAuth } from "fe/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "fe/components/ui/avatar";
import {
  getPrimaryDisplayValue,
  getSecondaryDisplayValue,
  getPrimaryDisplayInitials,
} from "fe/lib/user-display-utils";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <div className="bg-card text-card-foreground rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={`${getPrimaryDisplayValue(user)} Avatar`}
                />
                <AvatarFallback className="text-2xl">
                  {getPrimaryDisplayInitials(user)}
                </AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-xl font-semibold">
              {getPrimaryDisplayValue(user)}
            </h2>
            <p className="text-muted-foreground">
              {getSecondaryDisplayValue(user)}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-medium mb-4">Account Information</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user?.username || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.Email || "Not set"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Created
                  </p>
                  <p className="font-medium">Unknown</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">Today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-6 pt-6">
            <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
            <p className="text-muted-foreground">
              {user ? "Connected account" : "No connected accounts"}
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
