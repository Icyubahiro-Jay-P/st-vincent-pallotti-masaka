"use client"

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { signOutAdmin } from "@/app/admin/actions"

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOutAdmin()}
      className="h-8 gap-1.5 px-3 text-[0.65rem]"
    >
      Sign out
      <LogOut data-icon="inline-end" className="size-3.5" />
    </Button>
  )
}
