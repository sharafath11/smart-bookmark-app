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

        <div
          id="google-signin-container"
          className={`min-h-11 w-full ${isGoogleReady ? "" : "opacity-50"}`}
        />

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
