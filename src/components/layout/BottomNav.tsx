"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCcw, BarChart3, Settings, Mic } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/pronunciation", label: "Phát âm", icon: Mic },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-lg mx-auto flex justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-2 text-xs transition-colors ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
