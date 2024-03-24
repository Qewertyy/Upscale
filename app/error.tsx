"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <div className="flex flex-col gap-3 items-center pt-[19rem] content-center flex-wrap">
      <h2 className="text-2xl font-semibold">Something went wrong!</h2>
      <Button
        onClick={
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
