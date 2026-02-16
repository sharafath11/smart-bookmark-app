"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { io, Socket } from "socket.io-client"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { userAuthMethods } from "@/services/methods/userMethods"
import { bookmarkMethods } from "@/services/methods/bookmarkMethods"
import { User } from "@/types/user/authTypes"
import { Bookmark } from "@/types/bookmark"
import { validateBookmark } from "@/lib/validation/bookmark.validation"
import { showSuccessToast, showErrorToast } from "@/utils/toast"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ title: "", url: "" })
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({})

  const socketUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL
    if (process.env.NEXT_PUBLIC_BASEURL) {
      try {
        return new URL(process.env.NEXT_PUBLIC_BASEURL).origin
      } catch {
        return undefined
      }
    }
    return undefined
  }, [])

  const fetchBookmarks = async () => {
    const res = await bookmarkMethods.list()
    if (res && res.ok) {
      setBookmarks(res.data || [])
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const res = await userAuthMethods.me()
      if (res && res.ok) {
        setUser(res.data)
        await fetchBookmarks()
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    if (!socketUrl) return
    let socket: Socket | null = null

    socket = io(socketUrl, { withCredentials: true })
    socket.on("bookmarks:changed", () => {
      fetchBookmarks()
    })

    return () => {
      socket?.disconnect()
    }
  }, [socketUrl])

  const handleLogout = async () => {
    const res = await userAuthMethods.logout()
    if (res && res.ok) {
      showSuccessToast("Logged out successfully")
      router.push("/login")
    } else {
      showErrorToast("Logout failed")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as "title" | "url"]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateBookmark(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showErrorToast("Please fix the errors and try again")
      return
    }

    setIsSaving(true)
    const res = await bookmarkMethods.create({ title: formData.title, url: formData.url })
    setIsSaving(false)

    if (res && res.ok) {
      setFormData({ title: "", url: "" })
      showSuccessToast("Bookmark added")
      await fetchBookmarks()
    }
  }

  const handleDelete = async (id: string) => {
    const res = await bookmarkMethods.remove(id)
    if (res && res.ok) {
      showSuccessToast("Bookmark deleted")
      await fetchBookmarks()
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 rounded-full bg-accent mx-auto"></div>
          <div className="h-4 w-32 bg-accent rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Welcome, {user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="secondary">
            Log out
          </Button>
        </div>

        <form onSubmit={handleAddBookmark} className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-card-foreground">Add a bookmark</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My favorite site"
              error={errors.title}
            />
            <Input
              label="URL"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              error={errors.url}
            />
          </div>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Add bookmark"}
          </Button>
        </form>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Your bookmarks</h2>
          {bookmarks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No bookmarks yet. Add your first one above.
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-card-foreground truncate">{bookmark.title}</p>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-muted-foreground hover:underline break-all"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  <Button variant="secondary" onClick={() => handleDelete(bookmark._id)}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
