import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getAuthSession } from "~/lib/auth.server";
import { RegisterForm } from "~/components/auth/register-form";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up - Sunnah.com" },
    { name: "description", content: "Create a new account on Sunnah.com" },
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

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-gray-600">
            Join Sunnah.com to access authentic Islamic texts
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 