import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  await updateSession(request);
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user == null) {
    const newUrl = new URL("/auth", request.url);
    return NextResponse.redirect(newUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/link:path*"],
};
