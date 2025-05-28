import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/auth.server";
import type { User } from "~/proto/api";

export const meta: MetaFunction = () => {
  return [
    { title: "Profile - Sunnah.com" },
    { name: "description", content: "Your profile on Sunnah.com" },
  ];
};

// This route requires authentication
export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await requireAuth(request); // Throws redirect if not authenticated
  
  return json({
    user: authSession.user,
  });
}

export default function ProfilePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="text-lg text-gray-900">
              {user.Email}
            </div>
          </div>
          
          {user.id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <div className="text-sm text-gray-600 font-mono">
                {user.id}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Account Actions
            </h2>
            <div className="space-y-2">
              <a
                href="/settings"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Account Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 