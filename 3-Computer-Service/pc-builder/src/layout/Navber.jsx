import FormSearch from "../shared/FormSearch";
import Link from "next/link";
import { FiUser, FiGift } from "react-icons/fi";
import { FcFlashOn } from "react-icons/fc";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingBasket } from "react-icons/fa";
import { BiSolidMessageAltAdd } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };
  return (
    <div className="bg-primary">
      <div className="main-container">
        <div className="py-2 flex justify-between items-center text-white">
          <div onClick={handleToggle}>
            {isOpen ? (
              <MdClose className="w-6 h-6 block lg:hidden" />
            ) : (
              <GiHamburgerMenu className="w-6 h-6 block lg:hidden" />
            )}
          </div>
          <Link className="uppercase" href="/">
            Pc-builder
          </Link>
          <FaShoppingBasket className="w-6 h-6 block lg:hidden" />
          <div className="grow px-10 hidden lg:block">
            <FormSearch />
          </div>
          <div className="hidden lg:flex gap-5 items-center">
            <div className="flex items-center gap-3">
              <FiGift className="w-6 h-6" />
              <div>
                <h2 className="text-[16px] font-normal">Offer</h2>
                <p className="text-[12px]">latest offer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FcFlashOn className="w-6 h-6 animate-pulse" />
              <div>
                <h2 className="text-[16px] font-normal">Desktop Deal</h2>
                <p className="text-[12px]">Special Deals</p>
              </div>
            </div>
            <Link href="/login" className="flex items-center gap-3">
              <FiUser className="w-6 h-6" />
              <div>
                <h2 className="text-[16px] font-normal">Account</h2>
                <p className="text-[12px]">Register or login</p>
              </div>
            </Link>

            <Link
              href="/pcbuilder"
              className="relative inline-flex items-center justify-center p-4 px-5 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out rounded-full shadow-xl group hover:ring-1 hover:ring-purple-500"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-700"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative text-white lg:uppercase">
                pc builder
              </span>
            </Link>
          </div>
          {/* mobile navber */}
          <div className="fixed bottom-0 left-0 px-5 py-2 lg:hidden bg-primary flex justify-between w-full gap-3">
            <div className="flex flex-col items-center">
              <FiGift className="w-4 h-4" />
              <div>
                <h2 className="text-[12px] font-normal">Offer</h2>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <FcFlashOn className="w-4 h-4 animate-pulse" />
              <div>
                <h2 className="text-[12px] font-normal">Desktop Deal</h2>
              </div>
            </div>
            <Link href="/pcbuilder" className="flex flex-col items-center">
              <BiSolidMessageAltAdd className="w-4 h-4" />
              <div>
                <h2 className="text-[12px] font-normal">Pc builder</h2>
              </div>
            </Link>
            <Link href="/login" className="flex flex-col items-center">
              <FiUser className="w-4 h-4" />
              <div>
                <h2 className="text-[12px] font-normal">Account</h2>
              </div>
            </Link>
          </div>
        </div>
        <div
          className={`absolute z-50 lg:hidden  transition-all w-[300px] duration-300 ${
            isOpen ? "-translate-x-1" : "-translate-x-[320px]"
          }`}
        >
          <MobileMenu />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
