import { auth } from "@/auth";
import { UserAvatar } from "@/components/auth/user-avatar";
import { MainNav } from "@/components/layout/main-nav";
import { ModeToggleButton } from "@/components/mode-toggle-button";
import { CheckSquare2 } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center m-auto h-16 container">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <CheckSquare2 className="w-6 h-6" />
            <span className="font-bold hidden sm:inline-block">Task Manager</span>
          </Link>

          <MainNav />
        </div>

        <div className="flex items-center gap-4">
          <ModeToggleButton />
          {user && <UserAvatar user={user} />}
        </div>
      </div>
    </header>
  );
}