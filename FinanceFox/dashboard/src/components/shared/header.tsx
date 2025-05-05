import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import "./header.scss";
import { /*Coin,*/ Gear, Person, SignOut, ThreeLineHorizontal } from "akar-icons";
import { useAuth } from "@/context/Auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useRef } from "react";

export default function HeaderComponnet() {
  const { pathname } = useLocation();

  const routes = [
    {
      title: "Overview",
      route: "/",
    },
    {
      title: "Transactions",
      route: "/transactions",
    },
    {
      title: "Accounts",
      route: "/accounts",
    },
    {
      title: "Categories",
      route: "/categories",
    },
  ];

  const btnRef = useRef(null as any);

  const { user, logout } = useAuth();
  return (
    <div className="w-full flex flex-row justify-between items-center mb-12">
      <div className="hidden lg:flex gap-20">
        <div className="flex flex-row items-center">
          <img src="/fox-removebg-preview.png" className="w-12.2 h-11" />
          <div className="text-3xl font-semibold">FinanceFox</div>
        </div>
        <nav className="nav">
          {routes.map((el) => {
            return (
              <Link
                to={el.route}
                key={el.route}
                className={`nav-link ${pathname === el.route ? "active" : ""}`}
              >
                {el.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <Sheet>
        <SheetTrigger ref={btnRef} className="lg:hidden">
          <ThreeLineHorizontal />
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Navbar</SheetTitle>
          </SheetHeader>
          <nav className="nav flex-col items-start mt-8">
            {routes.map((el) => {
              return (
                <Link
                  to={el.route}
                  key={el.route}
                  className="text-sm font-semibold h-6 flex items-center px-1 rounded-md bg-[rgba(0,0,0,0.05)] w-full"
                  onClick={() => {
                    btnRef.current.click();
                  }}
                >
                  {el.title}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>
                <Person size={16} color="black" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="flex gap-2 min-w-64 items-center">
                <Avatar>
                  <AvatarFallback>
                    <Person size={16} color="black" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogTrigger asChild>
              <DropdownMenuItem>
                <Gear size={16} />
                &nbsp;Settings
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
              className="text-red-500"
            >
              <SignOut size={16} />
              &nbsp;Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent>
          <div className="flex flex-col gao-4">
            <div className="flex flex-row gap-2 items-center">
              <p className="font-semibold">Email ID:</p>
              {user?.email}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="font-semibold">User ID:</p>
              {user?._id}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
