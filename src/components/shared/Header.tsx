"use client";
import { logo1 } from "@/Images";
//   import {logout} from "@/db/apiAuth";
//   import useFetch from "@/hooks/use-fetch";
//   import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import { LinkIcon, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
//   import {Link, useNavigate} from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
const Header = () => {
  // const {loading, fn: fnLogout} = useFetch(logout);
  // const navigate = useNavigate();

  // const {user, fetchUser} = UrlState();
  const user: any = false;
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src={logo1}
            className="h-16"
            alt="Trimrr Logo"
            height={200}
            width={200}
          />
        </Link>
        <div className="flex gap-4">
          {!user ? (
            <Button
            // onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                {/* <Avatar>
                  <AvatarImage src={user?.user_metadata?.profile_pic} />
                  <AvatarFallback>PA</AvatarFallback>
                </Avatar> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {/* {user?.user_metadata?.name} */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    My Links
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  // onClick={() => {
                  //   fnLogout().then(() => {
                  //     fetchUser();
                  //     navigate("/auth");
                  //   });
                  // }}
                  className="text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {/* {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />} */}
    </>
  );
};

export default Header;
