import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Image from "next/image";

export default function Home() {
  return (
    <Navbar
      fluid
      rounded
      className="shadow-md"
      style={{ backgroundColor: "white" }}
    >
      <NavbarBrand href="https://flowbite-react.com">
        <Image
          src="/ministry-logo.svg"
          className="h-8 sm:h-12"
          alt="Ministry of Rural Development"
          width={122}
          height={41}
        />
        <Image
          src="/lokos-logo.png"
          className="mr-3 h-6 sm:h-9"
          alt="LokOS Logo"
          width={156}
          height={62}
        />
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button color="dark">Login</Button>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active className="text-blue-600">
          Home
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-700 hover:text-blue-600">
          About Us
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-700 hover:text-blue-600">
          Services
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-700 hover:text-blue-600">
          Resource Center
        </NavbarLink>
        <NavbarLink href="#" className="text-gray-700 hover:text-blue-600">
          Advisory and Guidelines
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
