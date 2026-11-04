import Link from "next/link";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({
  href = "/",
  label = "Back To Home",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`group hidden z-10 absolute top-5 left-5 items-center gap-2 rounded-md font-poppins text-sm font-medium text-[#243D35] transition-colors hover:text-[#1a2d27] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#243D35] sm:text-base ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#243D35]/20 bg-white transition-colors duration-300 group-hover:border-[#243D35] group-hover:bg-[#243D35] group-hover:text-white">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        >
          <path d="M14 8H2M7 3L2 8l5 5" />
        </svg>
      </span>
      {label}
    </Link>
  );
}