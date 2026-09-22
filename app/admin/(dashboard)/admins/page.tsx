import { asc } from "drizzle-orm"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { db } from "@/lib/db"
import { admin } from "@/lib/db/schema"
import { requireAdmin } from "@/lib/require-admin"
import { deleteAdmin } from "@/app/admin/(dashboard)/admins/actions"
import { CreateAdminForm } from "@/components/admin/create-admin-form"

export default async function AdminAdminsPage() {
  const { user } = await requireAdmin()
  const admins = await db.select().from(admin).orderBy(asc(admin.createdAt))

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Admins
      </h1>

      <div className="overflow-hidden border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {admins.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 text-foreground">
                  <div className="flex items-center gap-2">
                    {row.name}
                    {row.id === user.id && (
                      <Badge variant="secondary">You</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.createdAt.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {row.id === user.id || admins.length <= 1 ? null : (
                      <Dialog>
                        <DialogTrigger
                          render={<Button variant="destructive" size="xs" />}
                        >
                          Remove
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove this admin?</DialogTitle>
                            <DialogDescription>
                              &ldquo;{row.name}&rdquo; ({row.email}) will lose
                              access immediately and be signed out. This
                              can&apos;t be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose render={<Button variant="outline" />}>
                              Cancel
                            </DialogClose>
                            <form action={deleteAdmin}>
                              <input type="hidden" name="id" value={row.id} />
                              <Button type="submit" variant="destructive">
                                Remove
                              </Button>
                            </form>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Add an admin
        </h2>
        <CreateAdminForm />
      </div>
    </div>
  )
}
