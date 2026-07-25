import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-12">
      <Card className="w-full p-8">
        <h1 className="text-2xl font-semibold">Sign in to AiO Enterprise</h1>
        <p className="mt-2 text-sm text-foreground/60">Use email/password or connect an OAuth provider.</p>
        <div className="mt-6 space-y-3">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Sign in</Button>
        </div>
        <p className="mt-4 text-sm text-foreground/60">
          Need an account? <Link href="/register" className="text-primary">Register</Link>
        </p>
      </Card>
    </main>
  );
}
