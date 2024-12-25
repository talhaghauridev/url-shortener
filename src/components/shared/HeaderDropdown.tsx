"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlContext } from "@/context/UrlContext";
import { signout } from "@/lib/actions/user.actions";
import { actionErrorHandler } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const HeaderDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isAuthenticated, fetchUser } = useUrlContext();
  const { executeAsync, isExecuting, result } = useAction(signout);
  useEffect(() => {
    actionErrorHandler(result);
  }, [result]);
  return (
    <div className="flex gap-4">
      {loading || isExecuting ? (
        <Skeleton className="w-[70px] h-[2.5rem] rounded-[6px] !bg-[#111827]" />
      ) : !user ? (
        <Link href={"/auth"}>
          <Button>Login</Button>
        </Link>
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
                executeAsync({ path: pathname });
                fetchUser();
                if (isAuthenticated === false && !user) {
                  router.push("/auth");
                }
              }}
              className="text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default memo(HeaderDropdown);
