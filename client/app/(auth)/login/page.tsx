"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth-card"
import { Alert } from "@/components/alert"
import { userAuthMethods } from "@/services/methods/userMethods"
import {
  initializeGoogleSignIn,
  loadGoogleScript,
  renderGoogleButton,
} from "@/utils/googleAuth"
import { setAuthCookie } from "@/utils/authCookie"
import { showErrorToast, showSuccessToast } from "@/utils/toast"

export default function LoginPage() {
  const router = useRouter()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGoogleReady, setIsGoogleReady] = useState(false)
  const [alertMessage, setAlertMessage] = useState<string>("")
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  useEffect(() => {
    const setupGoogleAuth = async () => {
      try {
        if (!googleClientId) {
          console.error("[GoogleAuth] NEXT_PUBLIC_GOOGLE_CLIENT_ID missing")
          setAlertMessage("Google auth is not configured.")
          return
        }

        await loadGoogleScript()
        console.log("[GoogleAuth] Script loaded")

        initializeGoogleSignIn(
          googleClientId,
          (token: string) => handleGoogleResponse({ credential: token }),
          (error: string) => {
            console.error("[GoogleAuth] Initialization error:", error)
            setAlertMessage(error)
          }
        )

        renderGoogleButton("google-signin-container")
        console.log("[GoogleAuth] Official button rendered")
        setIsGoogleReady(true)
      } catch (error) {
        console.error("[GoogleAuth] Script setup failed:", error)
        setAlertMessage("Unable to load Google Sign-In. Refresh and try again.")
      }
    }

    setupGoogleAuth()
  }, [googleClientId])

  const handleGoogleResponse = async (response: any) => {
    console.log("[GoogleAuth] Credential callback received")
    if (!response.credential) {
      showErrorToast("Failed to get Google credential")
      return
    }

    setIsGoogleLoading(true)
    setAlertMessage("")

    const res = await userAuthMethods.googleAuth({
      googleToken: response.credential,
    })

    setIsGoogleLoading(false)

    if (!res || !res.ok) {
      const errorMsg = res?.msg || "Google authentication failed"
      setAlertMessage(errorMsg)
      showErrorToast(errorMsg)
      return
    }

    showSuccessToast(res.msg || "Login successful")
    setAuthCookie()
    router.push("/dashboard")
  }

  return (
    <AuthCard title="Sign in" description="Google account required">
      <div className="space-y-4">
        {alertMessage && <Alert type="error" message={alertMessage} onClose={() => setAlertMessage("")} />}

        <div className="relative">
          <div
            id="google-signin-container"
            className={`min-h-11 w-full ${isGoogleLoading ? "pointer-events-none opacity-70" : ""}`}
          />

          {!isGoogleReady && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md border border-border bg-card">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
          )}

          {isGoogleLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md border border-border bg-card/90">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                <span>Signing you in...</span>
              </div>
            </div>
          )}
        </div>

        {!isGoogleReady && (
          <p className="text-center text-xs text-muted-foreground">
            Loading Google Sign-In...
          </p>
        )}

        {isGoogleLoading && (
          <p className="text-center text-xs text-muted-foreground">
            Completing sign in...
          </p>
        )}

        <p className="text-center text-sm text-muted-foreground">
          We only support Google Sign-In for this app.
        </p>
      </div>
    </AuthCard>
  )
}
