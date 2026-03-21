'use client';
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, Input, Badge, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar } from "@/components/HeroUI";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

export const Navbar = () => {
  const { itemCount, openDrawer } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <HeroNavbar maxWidth="xl" className="border-b border-[--c-border] bg-[--c-bg] h-16" position="sticky">
      <NavbarBrand>
        <Link href="/" className="font-display font-medium text-2xl tracking-tight text-[--c-primary]">
          MARKETPLACE
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4 w-full justify-center max-w-md" justify="center">
        <Input
          classNames={{
            base: "w-full",
            mainWrapper: "h-11",
            input: "text-sm text-[--c-primary]",
            inputWrapper: "bg-[--c-surface] border-transparent hover:bg-white focus-within:bg-white focus-within:border-[--c-primary] transition-all rounded-full h-11"
          }}
          placeholder="Search products, brands..."
          startContent={<Icon icon="lucide:search" className="text-[--c-muted] text-xl" />}
          type="search"
        />
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button isIconOnly variant="light" aria-label="Wishlist" className="rounded-full text-[--c-secondary] hover:bg-[--c-surface]">
            <Icon icon="lucide:heart" className="text-xl" />
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Badge content={itemCount} color="danger" shape="circle" isInvisible={itemCount === 0}>
            <Button isIconOnly variant="light" aria-label="Cart" onPress={openDrawer} className="rounded-full text-[--c-secondary] hover:bg-[--c-surface]">
              <Icon icon="lucide:shopping-bag" className="text-xl" />
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
                  className="transition-transform"
                  color="default"
                  size="sm"
                  src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026024d"}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2 text-[--c-primary]">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" href="/vendor/dashboard" className="text-[--c-primary]">Dashboard</DropdownItem>
                <DropdownItem key="orders" href="/orders" className="text-[--c-primary]">Orders</DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={logout} className="text-danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
             <Button as={Link} href="/login" variant="flat" className="rounded-full bg-[--c-primary] text-white font-medium text-sm px-6 h-10">
               Login
             </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
};
