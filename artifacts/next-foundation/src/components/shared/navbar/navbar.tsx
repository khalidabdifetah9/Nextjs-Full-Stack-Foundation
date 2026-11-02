import Link from "next/link";
import Image from "next/image";

interface NavLink {
  key: string;
  label: string;
  ref: string;
}

const Links: NavLink[] = [
  { key: "home", label: "Home", ref: "/" },
  { key: "about", label: "About", ref: "/about" },
  { key: "get_start", label: "Get Started", ref: "/get-started" },
  { key: "signin", label: "Sign In", ref: "/signin" },
];

export default function NavBar() {
  return (
    <nav className="flex justify-between max-w-450 mx-auto">
      <ul className="space-x-4 shadow-lg text-white bg-grey-400 rounded-lg px-3">
        {Links.map(({ label, key, ref }) => (
          <li key={key}>
            <Link className="px-5 py-3 bg-black rounded-lg" href={ref}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <Image src={"/Logo.svg"} width={150} height={150} alt="Logo SVG" />
      </div>
      <div>
        <Link
          className="px-12 py-4 bg-black rounded-lg text-white"
          href={"/contact-us"}
        >
          Contact Us
        </Link>
      </div>
    </nav>
  );
}