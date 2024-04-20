import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="">
      <SignedIn>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </SignedIn>
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
      </SignedOut>
    </div>
  );
}
