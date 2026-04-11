"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export default function Header({
  title,
  showBack = false,
  rightElement,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-lg mx-auto flex items-center h-14 px-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="mr-3 p-1 -ml-1 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 flex-1 truncate">
          {title}
        </h1>
        {rightElement && <div className="ml-3">{rightElement}</div>}
      </div>
    </header>
  );
}
