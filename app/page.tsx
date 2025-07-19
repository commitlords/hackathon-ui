import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  DarkThemeToggle,
} from "flowbite-react";

export default function Home() {
  return (
    <div>
      <Navbar fluid rounded>
        <NavbarBrand href="https://loksamarth.gov.in" target="/_blank">
          <img
            src="/Logo.png"
            className="mr-1 h-6 sm:h-9"
            alt="LOKSamarth Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            LOKSamarth
          </span>
        </NavbarBrand>
        <div className="flex items-center gap-3 md:order-2">
          <Button className="bg-black text-white hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-500">
            Login
          </Button>
          <DarkThemeToggle />
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          <NavbarLink href="#">Home</NavbarLink>
          <NavbarLink href="#">About Us</NavbarLink>
          <NavbarLink href="#">Our Services</NavbarLink>
          <NavbarLink href="#">Resource Center</NavbarLink>
          <NavbarLink href="#">Advisory and Guidelines</NavbarLink>
          <NavbarLink href="#">Contact</NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
}
