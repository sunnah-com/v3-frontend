import type { ActionFunctionArgs } from "@remix-run/node";
import { destroyAuthSession } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return destroyAuthSession(request);
} 