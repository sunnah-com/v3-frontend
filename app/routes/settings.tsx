import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAuth } from "~/lib/auth.server";
import { userSettingsApi } from "~/lib/api-client";
import { getThemeWithDefault, setTheme } from "~/lib/theme.server";
import type { Theme } from "~/lib/theme.server";
import { Language } from "@suhaibinator/sunnah-v3-ts-proto/lib/api";

export async function loader({ request }: LoaderFunctionArgs) {
  // Require authentication
  const authSession = await requireAuth(request);
  
  // Get current theme from cookie
  const theme = await getThemeWithDefault(request);
  
  // TODO: Get user settings from API when server-side auth is properly configured
  // For now, just return the theme and user
  
  return json({
    user: authSession.user,
    theme,
    userSettings: null,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  // Require authentication
  const authSession = await requireAuth(request);
  
  const formData = await request.formData();
  const theme = formData.get("theme") as Theme;
  const language = formData.get("language");
  const notifications = formData.get("notifications") === "true";
  
  const headers = new Headers();
  
  // Set theme cookie
  if (theme === "light" || theme === "dark") {
    headers.append("Set-Cookie", await setTheme(theme));
  }
  
  // TODO: Update user settings via API when server-side auth is properly configured
  // For now, just save the theme preference in the cookie
  
  // In the future, uncomment this:
  // try {
  //   await userSettingsApi.updateUserSettings(
  //     {
  //       darkMode: theme === "dark",
  //       notifications,
  //       language: language ? parseInt(language as string) : Language.LANGUAGE_ENGLISH,
  //     }
  //   );
  // } catch (error) {
  //   console.error("Failed to update user settings:", error);
  //   return json({ error: "Failed to save settings" }, { status: 500, headers });
  // }
  
  return redirect("/settings", { headers });
}

export default function Settings() {
  const { user, theme, userSettings } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Form method="post">
        <div className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Sunnah.com looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Theme</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="light"
                        name="theme"
                        value="light"
                        defaultChecked={theme === "light"}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="light" className="font-normal cursor-pointer">
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="dark"
                        name="theme"
                        value="dark"
                        defaultChecked={theme === "dark"}
                        className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="dark" className="font-normal cursor-pointer">
                        Dark
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>
                Set your preferred language for translations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="language">Translation Language</Label>
                  <select 
                    name="language" 
                    id="language"
                    className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue={Language.LANGUAGE_ENGLISH}
                  >
                    <option value={Language.LANGUAGE_ENGLISH}>English</option>
                    <option value={Language.LANGUAGE_ARABIC}>Arabic</option>
                    <option value={Language.LANGUAGE_SPANISH}>Spanish</option>
                    <option value={Language.LANGUAGE_FRENCH}>French</option>
                    <option value={Language.LANGUAGE_URDU}>Urdu</option>
                    <option value={Language.LANGUAGE_INDONESIAN}>Indonesian</option>
                    <option value={Language.LANGUAGE_TURKISH}>Turkish</option>
                    {/* Add more languages as needed */}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notifications"
                    value="true"
                    defaultChecked={false}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="notifications" className="font-normal cursor-pointer">
                    Enable email notifications
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {user.Email}
                </div>
                <div>
                  <span className="font-medium">User ID:</span> {user.id}
                </div>
                <div>
                  <span className="font-medium">Account Type:</span> {user.userType === 2 ? "Admin" : "Regular"}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}