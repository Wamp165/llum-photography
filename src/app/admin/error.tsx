"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Covers the admin panel and login. Never shows error.message.
export default function AdminError({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Button onClick={() => retry()}>Try again</Button>
          <Link href="/admin" className="text-sm underline">
            Back to the admin
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
