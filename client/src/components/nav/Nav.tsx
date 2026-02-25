import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BsCart4 } from "react-icons/bs";
import { GoFoldUp } from "react-icons/go";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { useCartStore } from "../../store/cartStore";
import { useUserStore } from "../../store/useStore";
import { Avatar } from "../common/Avatar";
import { Logo } from "../common/Logo";

import cn from "../../utils/cn";

const LINKS = [
  { name: "Product", to: "/products" },
  { name: "About us", to: "/about" },
  { name: "Orders", to: "/orders" },
];

export default function Nav() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  );
  const matchScreen = () => {
    const matches = window.matchMedia("(max-width: 768px)");
    if (matches.matches) {
      setIsMobileNavOpen(true);
    } else {
      setIsMobileNavOpen(false);
    }
  };

  useEffect(() => {
    // Define the resize handler outside of the event listener setup
    const handleResize = () => {
      matchScreen();
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobileNavOpen) {
    return <MobileNav />;
  } else {
    return <DesktopNav />;
  }
}

function MobileNav() {
  const { cartItem } = useCartStore();
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useUserStore();
  return (
    <nav className="h-24 bg-white">
      <div className="container h-full mx-auto p-4 relative z-40 bg-inherit">
        <div className="navbar relative h-full flex items-center justify-between">
          <div>
            <button
              className="cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            >
              <HiOutlineMenuAlt1 size={32} className="text-zinc-400" />
            </button>
          </div>
          <div>
            <Link
              to={"/"}
              className="text-3xl text-primary font-bold flex items-center gap-4"
            >
              <Logo />
              <p className="capitalize">Nou shoe</p>
            </Link>
          </div>

          <div className="nav-right flex gap-10 h-full items-center">
            <Link to={"/cart"} className="cart relative">
              <span className="absolute -top-4 -right-4 rounded-full bg-rose-600 text-white text-xs h-7 w-7 grid place-items-center font-sans">
                {cartItem.reduce((acc, val) => {
                  return acc + val.quantity;
                }, 0)}
              </span>
              <BsCart4 size={28} />
            </Link>
            <div className="user grid place-items-center">
              <Link to={"/profile"}>
                <Avatar />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className="menu w-full z-10 absolute bg-white p-4 shadow-md transition-all"
        style={{
          transform: showMenu ? "translateY(0)" : "translateY(-200%)",
        }}
      >
        <div className="container mx-auto p-4 relative pb-4">
          <ul>
            {LINKS.map((link) => (
              <li
                key={link.name}
                className="hover:bg-zinc-50 transition-all py-1 px-2 rounded-md"
              >
                <Link
                  className=" font-semibold text-zinc-700"
                  to={link.to}
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {user.role === "admin" && (
              <li className="hover:bg-zinc-50 transition-all py-1 px-2 rounded-md">
                <Link
                  className="font-semibold text-zinc-700"
                  to="/admin"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <button
              className="cursor-pointer"
              onClick={() => setShowMenu(false)}
            >
              <GoFoldUp size={32} className="text-zinc-400" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
function DesktopNav() {
  const { cartItem } = useCartStore();
  const { user } = useUserStore();
  const location = useLocation();
  const currentPage = location.pathname;

  return (
    <nav className="h-24 bg-slate-50">
      <div className="container h-full mx-auto p-4">
        <div className="navbar h-full flex items-center">
          <Link
            to={"/"}
            className="text-3xl text-primary font-bold flex items-center gap-4"
          >
            <Logo />
            <p className="capitalize">Nou shoe</p>
          </Link>
          <div className="navbar ml-20">
            <ul className="flex gap-2">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    className={cn(
                      "capitalize text-md hover:text-primary transition-all tracking-wider  px-4 py-2 rounded-md hover:bg-zinc-200",
                      currentPage == link.to
                        ? "text-white bg-primary hover:bg-primary hover:text-white"
                        : "",
                    )}
                    to={link.to}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {user.role == "admin" && (
                <>
                  <li>
                    <Link
                      className="text-md capitalize text-zinc-800 hover:text-primary transition-all"
                      to="/admin/products"
                    >
                      Admin
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="ml-auto nav-right flex gap-10 h-full items-center">
            <Link to={"/cart"} className="cart relative">
              <span className="absolute -top-4 -right-4 rounded-full bg-rose-600 text-white text-xs h-7 w-7 grid place-items-center font-sans">
                {cartItem.reduce((acc, val) => {
                  return acc + val.quantity;
                }, 0)}
              </span>
              <BsCart4 size={28} />
            </Link>
            <div className="user grid place-items-center">
              <Link to={"/profile"}>
                <Avatar />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
