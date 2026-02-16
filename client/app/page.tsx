import Link from "next/link";
import { Button } from "@/components/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Smart Bookmark App
        </h1>
        <p className="text-muted-foreground">
          Save links, keep them private, and see updates instantly across tabs.
        </p>
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/login">Sign in with Google</Link>
        </Button>
      </div>
    </div>
  );
}
