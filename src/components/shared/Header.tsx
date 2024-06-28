import { logo1, logo2 } from "@/Images";
import Image from "next/image";
import Link from "next/link";
import HeaderDropdown from "./HeaderDropdown";
const Header = () => {
  return (
    <header id="header" className="w-full">
      <nav className="max-w-[1300px] mx-auto py-2 px-[10px] sm:px-[20px] flex justify-between items-center">
        <Link href="/">
          <Image
            src={logo2}
            className="h-16"
            alt="Trimrr Logo"
            height={80}
            width={80}
          />
        </Link>
        <HeaderDropdown />
      </nav>
    </header>
  );
};

export default Header;
