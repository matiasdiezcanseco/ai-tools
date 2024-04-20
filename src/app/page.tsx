import { SignUp, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="">
      <SignedIn>
        <SignOutButton>Sign Out</SignOutButton>
      </SignedIn>
      <SignedOut>
        <SignUp routing="hash" forceRedirectUrl="tts" />
      </SignedOut>
    </div>
  );
}
