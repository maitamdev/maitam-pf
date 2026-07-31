"use client";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LINKS, NAV_LINKS, SOCIALS } from "@/constants";
import { usePortfolio } from "@/lib/portfolio-context";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language } = usePortfolio();
  const vi = language === "vi";
  const labels = vi
    ? ["Giới thiệu", "Kỹ năng", "Kinh nghiệm", "Dự án"]
    : NAV_LINKS.map((link) => link.title);
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelLogoHold = () => {
    if (logoTimer.current) clearTimeout(logoTimer.current);
    logoTimer.current = null;
  };
  const homeHref = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-0 z-50 h-[65px] w-full bg-[#03001427] px-4 shadow-lg shadow-[#2A0E61]/50 backdrop-blur-md md:px-10"
    >
      <div className="m-auto flex h-full w-full items-center justify-between px-[10px]">
        <Link
          href={homeHref("#about-me")}
          className="flex items-center"
          title={vi ? "Giữ để mở terminal" : "Hold to open terminal"}
          onPointerDown={() => {
            cancelLogoHold();
            logoTimer.current = setTimeout(() => {
              window.dispatchEvent(new Event("maitam-terminal"));
              logoTimer.current = null;
            }, 900);
          }}
          onPointerUp={cancelLogoHold}
          onPointerCancel={cancelLogoHold}
          onPointerLeave={cancelLogoHold}
        >
          <Image
            src="/avatar.png"
            alt="MaiTamDev"
            width={44}
            height={44}
            unoptimized
            draggable={false}
            className="cursor-pointer rounded-full border border-[#7042f88b]"
          />
          <span className="ml-[10px] hidden font-bold text-gray-300 md:flex">
            MaiTamDev
          </span>
        </Link>

        <div className="hidden h-full min-w-0 flex-1 items-center justify-center px-5 md:flex">
          <div className="mr-[15px] flex h-auto w-full items-center justify-between rounded-full border-[rgba(112,66,248,0.38)] bg-[rgba(3,0,20,0.37)] px-[20px] py-[10px] text-gray-200">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.title}
                href={homeHref(link.link)}
                className="cursor-pointer transition hover:text-[rgb(112,66,248)]"
              >
                {labels[index]}
              </Link>
            ))}
            <Link
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="cursor-pointer transition hover:text-[rgb(112,66,248)]"
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className="hidden flex-row gap-5 md:flex">
          {SOCIALS.map(({ link, name, icon: Icon }) => (
            <Link
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={name}
              key={name}
            >
              <Icon className="h-6 w-6 text-white" />
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg text-white transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8bdcff] md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-7 w-7" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-7 w-7" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-[65px] flex w-full flex-col items-center border-b border-white/10 bg-[#030014]/95 p-5 text-gray-300 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center gap-4">
            {NAV_LINKS.map((link, index) => (
              <Link
                key={link.title}
                href={homeHref(link.link)}
                className="cursor-pointer text-center transition hover:text-[rgb(112,66,248)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {labels[index]}
              </Link>
            ))}
            <Link
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="cursor-pointer text-center transition hover:text-[rgb(112,66,248)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GitHub
            </Link>
          </div>

          <div className="mt-6 flex justify-center gap-6">
            {SOCIALS.map(({ link, name, icon: Icon }) => (
              <Link
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={name}
                key={name}
              >
                <Icon className="h-8 w-8 text-white" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
