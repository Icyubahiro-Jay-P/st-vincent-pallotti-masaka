"use client"

import { LogOut } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { signOutAdmin } from "@/app/admin/actions"

export function SignOutButton({
  className,
  hideLabel,
}: {
  className?: string
  hideLabel?: boolean
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn("h-8 gap-1.5 px-3 text-[0.65rem]", className)}
          />
        }
      >
        <span className={cn(hideLabel && "sr-only")}>Sign out</span>
        <LogOut data-icon="inline-end" className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign out?</DialogTitle>
          <DialogDescription>
            You&rsquo;ll need to log in again to access the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button onClick={() => signOutAdmin()}>Sign out</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
