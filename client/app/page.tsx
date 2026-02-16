import Link from "next/link";

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
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto"
        >
          Sign in with Google
        </Link>
      </div>
    </div>
  );
}
