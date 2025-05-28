import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getAuthSession } from "~/lib/auth.server";
import { LoginForm } from "~/components/auth/login-form";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In - Sunnah.com" },
    { name: "description", content: "Sign in to your Sunnah.com account" },
  ];
};

// Redirect to home if already authenticated
export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await getAuthSession(request);
  
  if (authSession) {
    throw redirect("/");
  }
  
  return null;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 