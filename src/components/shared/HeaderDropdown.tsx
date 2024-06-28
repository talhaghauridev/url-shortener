"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useUrlContext } from "@/context/UrlContext";
import Link from "next/link";
import { signout } from "@/lib/actions/user.actions";
const HeaderDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUrlContext();
  return (
    <div className="flex gap-4">
      {!user ? (
        <Button onClick={() => router.push("/auth")}>Login</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.profile_pic} />
              <AvatarFallback>PA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard" className="flex">
                <LinkIcon className="mr-2 h-4 w-4" />
                My Links
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signout(pathname).then(() => {
                  router.push("/auth");
                });
              }}
              className="text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default HeaderDropdown;
