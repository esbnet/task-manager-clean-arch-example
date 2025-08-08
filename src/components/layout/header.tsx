import { auth } from "@/auth";
import { UserAvatar } from "@/components/auth/user-avatar";
import { CheckSquare } from "lucide-react";
import Link from "next/link";

export async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="top-0 z-50 sticky bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center m-auto h-14 container">
        <Link href="/" className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6" />
          <span className="font-bold">Task Manager</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && <UserAvatar user={user} />}
        </div>
      </div>
    </header>
  );
}