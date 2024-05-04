import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";

const ToolCard = ({
  title,
  description,
  href,
  enabled = false,
}: {
  title: string;
  description: string;
  href: string;
  enabled: boolean;
}) => {
  if (!enabled) {
    return (
      <div className="relative rounded-md border border-gray-600 p-2 text-center">
        <Badge className="absolute right-0 top-0 -translate-y-2 translate-x-2">
          Coming Soon
        </Badge>
        <h3 className=" text-xl font-semibold">{title}</h3>
        <p>{description}</p>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="rounded-md border border-gray-600 p-2 text-center hover:bg-neutral-900"
    >
      <h3 className=" text-xl font-semibold">{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default function HomePage() {
  const tools = [
    {
      title: "TTS",
      description: "Convert text to speech",
      href: "/tts",
      enabled: true,
    },
    {
      title: "STT",
      description: "Convert speech to text",
      href: "/stt",
      enabled: false,
    },
    {
      title: "TTI",
      description: "Convert text to image",
      href: "/tti",
      enabled: false,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-4xl font-semibold">Welcome to ai-tools</h2>
      <p>
        You will find a collection of AI tools to increase your productivity.
      </p>

      <SignedOut>
        <SignInButton>
          <span className="inline-flex h-10 w-fit items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:cursor-pointer hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Sign In
          </span>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <h3 className="pt-8 text-2xl font-semibold">Tools</h3>
        <div className="grid grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.title}
              title={tool.title}
              description={tool.description}
              href={tool.href}
              enabled={tool.enabled}
            />
          ))}
        </div>
      </SignedIn>
    </div>
  );
}
