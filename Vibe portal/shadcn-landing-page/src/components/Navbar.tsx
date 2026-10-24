import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { Menu, Sparkles, LogIn, LayoutGrid } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#ecosystem",
    label: "Hệ Sinh Thái",
  },
  {
    href: "#features",
    label: "Tính Năng",
  },
  {
    href: "#about",
    label: "Về Vibe Studio",
  },
  {
    href: "#faq",
    label: "Hỏi Đáp",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = () => {
    if (user) {
      setUser(null);
    } else {
      const name = prompt("Nhập tên đăng nhập để thử nghiệm Vibe ID:", "Admin Vibe");
      if (name) {
        setUser(name);
      }
    }
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white/95 backdrop-blur dark:border-b-slate-800 dark:bg-background/95">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-16 px-4 w-screen flex justify-between items-center">
          <NavigationMenuItem className="font-bold flex items-center">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 font-extrabold text-xl flex items-center gap-2"
            >
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <LogoIcon />
              </div>
              <span className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
                Vibe Studio
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                Portal
              </span>
            </a>
          </NavigationMenuItem>

          {/* mobile menu */}
          <span className="flex md:hidden items-center gap-2">
            <ModeToggle />

            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Vibe Studio
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-6">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full text-center ${buttonVariants({ variant: "ghost" })}`}
                    >
                      {label}
                    </a>
                  ))}
                  <button
                    onClick={handleLogin}
                    className={`w-full mt-2 ${buttonVariants({
                      variant: "default",
                    })}`}
                  >
                    <LogIn className="mr-2 w-4 h-4" />
                    {user ? `Chào, ${user}` : "Đăng Nhập Vibe ID"}
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop nav */}
          <nav className="hidden md:flex gap-1 items-center">
            {routeList.map((route: RouteProps, i) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={i}
                className={`text-[15px] font-medium ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#ecosystem"
              className={`text-sm ${buttonVariants({ variant: "outline" })}`}
            >
              <LayoutGrid className="mr-1.5 w-4 h-4" />
              6 Phân Hệ Con
            </a>

            <button
              onClick={handleLogin}
              className={`text-sm ${buttonVariants({ variant: "default" })}`}
            >
              <LogIn className="mr-1.5 w-4 h-4" />
              {user ? `👤 ${user}` : "Đăng Nhập"}
            </button>

            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
