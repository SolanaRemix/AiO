import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-12">
      <Card className="w-full p-8">
        <h1 className="text-2xl font-semibold">Create enterprise account</h1>
        <p className="mt-2 text-sm text-foreground/60">Verify identity, create workspace, and enter dashboard.</p>
        <div className="mt-6 space-y-3">
          <Input placeholder="Full name" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button className="w-full">Create account</Button>
        </div>
        <p className="mt-4 text-sm text-foreground/60">
          Already registered? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      </Card>
    </main>
  );
}
