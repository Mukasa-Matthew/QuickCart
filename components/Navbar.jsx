"use client";
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  const renderUserSection = () => (
    user ? (
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action
            label="Home"
            labelIcon={<HomeIcon />}
            onClick={() => router?.push("/")}
          />
          <UserButton.Action
            label="Products"
            labelIcon={<BoxIcon />}
            onClick={() => router?.push("/all-products")}
          />
          <UserButton.Action
            label="Cart"
            labelIcon={<CartIcon />}
            onClick={() => router?.push("/cart")}
          />
          <UserButton.Action
            label="My Orders"
            labelIcon={<BagIcon />}
            onClick={() => router?.push("/my-orders")}
          />
        </UserButton.MenuItems>
      </UserButton>
    ) : (
      <button
        onClick={openSignIn}
        className="flex items-center gap-2 hover:text-gray-900 transition"
        aria-label="Sign in to your account"
      >
        <Image src={assets.user_icon} alt="user icon" width={16} height={16} />
        Account
      </button>
    )
  );

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router?.push("/")}
        src={assets.logo}
        alt="logo"
        width={128}
        height={32}
        priority={true}
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>
        {isSeller && (
          <button
            onClick={() => router?.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4">
        <Image
          className="w-4 h-4"
          src={assets.search_icon}
          alt="search icon"
          width={16}
          height={16}
        />
        {renderUserSection()}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router?.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
        {renderUserSection()}
      </div>
    </nav>
  );
};

export default Navbar;