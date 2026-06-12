"use client";

import { useClerk } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => openUserProfile()}
      className="shrink-0"
    >
      <Settings className="h-4 w-4" />
      Manage Account
    </Button>
  );
}
