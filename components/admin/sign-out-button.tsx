"use client"

import { LogOut } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
    <AlertDialog>
      <AlertDialogTrigger
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
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You&rsquo;ll need to log in again to access the admin dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => signOutAdmin()}>
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
