'use client';
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Input, Badge, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@/components/HeroUI";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

export const Navbar = () => {
  const { itemCount, openDrawer } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: "Menswear", href: "/category/men" },
    { label: "Womenswear", href: "/category/women" },
    { label: "Electronics", href: "/category/electronics" }
  ];

  return (
    <HeroNavbar maxWidth="xl" className="border-b border-gray-100 bg-white h-20" position="sticky" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-display font-black text-2xl tracking-tighter text-black flex items-center gap-1.5">
            <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
              <span className="text-white text-lg font-bold">tm.</span>
            </div>
            themrktplace
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8 w-full justify-center max-w-lg" justify="center">
        <NavbarItem>
            <Link href="/" className="font-body font-semibold text-sm text-gray-500 hover:text-black transition-colors">Home</Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent font-body font-semibold text-sm text-gray-500 hover:text-black transition-colors"
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                radius="sm"
                variant="light"
              >
                Categories
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="Shop categories"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="all"
              description="Browse the entire collection"
              startContent={<Icon icon="lucide:layout-grid" className="text-xl text-[#84D347]" />}
              href="/products"
            >
              All Products
            </DropdownItem>
            <DropdownItem
              key="men"
              description="Styles designed for men"
              startContent={<Icon icon="lucide:shirt" className="text-xl text-[#84D347]" />}
              href="/category/men"
            >
              Menswear
            </DropdownItem>
            <DropdownItem
              key="women"
              description="Styles designed for women"
              startContent={<Icon icon="lucide:shopping-bag" className="text-xl text-[#84D347]" />}
              href="/category/women"
            >
              Womenswear
            </DropdownItem>
            <DropdownItem
              key="electronics"
              description="Latest gadgets and accessories"
              startContent={<Icon icon="lucide:laptop" className="text-xl text-[#84D347]" />}
              href="/category/electronics"
            >
              Electronics
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
            <Link href="/about" className="font-body font-semibold text-sm text-gray-500 hover:text-black transition-colors">About Us</Link>
        </NavbarItem>
        <NavbarItem>
            <Link href="/contact" className="font-body font-semibold text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex w-full max-w-[200px]">
          <Input
            classNames={{
              base: "w-full",
              mainWrapper: "h-10",
              input: "text-sm text-black font-medium",
              inputWrapper: "bg-[#F5F5F5] border-transparent hover:bg-[#EBEBEB] focus-within:bg-[#EBEBEB] focus-within:border-black transition-all rounded-full h-10 px-4"
            }}
            placeholder="Search..."
            startContent={<Icon icon="lucide:search" className="text-gray-400 text-sm mr-1" />}
            type="search"
          />
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          <Button isIconOnly variant="light" aria-label="Wishlist" as={Link} href="/wishlist" className="rounded-full text-black hover:bg-[#F5F5F5]">
            <Icon icon="mdi:heart-outline" className="text-xl" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Badge content={itemCount} shape="circle" isInvisible={itemCount === 0} classNames={{ badge: "bg-[#84D347] text-white font-bold border-white" }}>
            <Button isIconOnly variant="light" aria-label="Cart" onPress={openDrawer} className="rounded-full text-black hover:bg-[#F5F5F5]">
              <Icon icon="mdi:cart-outline" className="text-xl" />
            </Button>
          </Badge>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          {isAuthenticated ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform ring-black"
                  color="default"
                  size="sm"
                  src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2 text-black">
                  <p className="font-semibold text-xs text-gray-500">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" href="/user/dashboard" className="text-black">Dashboard</DropdownItem>
                <DropdownItem key="orders" href="/user/orders" className="text-black">My Orders</DropdownItem>
                <DropdownItem key="wishlist" href="/wishlist" className="text-black">Wishlist</DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={logout} className="text-red-500 font-medium">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
             <Button as={Link} href="/login" variant="solid" className="rounded-full bg-black text-white font-semibold text-sm px-6 h-10 hover:scale-105 transition-transform">
               Login
             </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-6 bg-white">
        <Input
          classNames={{
            base: "w-full mb-6",
            mainWrapper: "h-12",
            input: "text-sm text-black font-medium",
            inputWrapper: "bg-[#F5F5F5] border-transparent rounded-full h-12 px-6"
          }}
          placeholder="Search items..."
          startContent={<Icon icon="lucide:search" className="text-gray-400 text-lg mr-2" />}
          type="search"
        />
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full font-display text-2xl font-semibold tracking-tight text-black hover:text-[#84D347] py-2 block transition-colors"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
        <div className="mt-auto pb-8 flex flex-col gap-4">
          <Link href="/wishlist" className="flex items-center gap-3 font-body text-black text-lg font-medium p-2 rounded-xl hover:bg-[#F5F5F5]">
             <Icon icon="mdi:heart-outline" className="text-2xl" /> My Wishlist
          </Link>
          {!isAuthenticated ? (
            <Button as={Link} href="/login" fullWidth className="bg-[#84D347] text-white font-bold h-14 rounded-2xl text-lg mt-4 shadow-md">
              Log In / Sign Up
            </Button>
          ) : (
            <Button variant="flat" fullWidth onPress={logout} className="bg-red-50 text-red-500 font-bold h-14 rounded-2xl text-lg mt-4">
              Log Out
            </Button>
          )}
        </div>
      </NavbarMenu>
    </HeroNavbar>
  );
};
