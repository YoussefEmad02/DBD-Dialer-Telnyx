"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { TelnyxRTCProvider } from "@telnyx/react-client"
import { Dialpad } from "./Dialpad"

interface TelnyxProviderProps {
  children: ReactNode
}

export function TelnyxProvider({ children }: TelnyxProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const sipUsername = process.env.NEXT_PUBLIC_TELNYX_SIP_USERNAME || ""
  const sipPassword = process.env.NEXT_PUBLIC_TELNYX_SIP_PASSWORD || ""
  const hasSipCreds = !!sipUsername && !!sipPassword

  useEffect(() => {
    setMounted(true)

    // Only fetch a JWT token if SIP credentials are not available
    if (!hasSipCreds) {
      fetch("/api/telnyx/token", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) setToken(data.token)
        })
        .catch((err) => console.error("Failed to fetch Telnyx token:", err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (!mounted || loading) return <>{children}</>

  // Prefer SIP credentials; fall back to JWT token
  const credential = hasSipCreds
    ? { login: sipUsername, password: sipPassword }
    : token
    ? { login_token: token }
    : null

  if (!credential) {
    console.warn("TelnyxProvider: No credentials available. Calls will not work.")
    return <>{children}</>
  }

  return (
    <TelnyxRTCProvider credential={credential}>
      {children}
      <Dialpad />
    </TelnyxRTCProvider>
  )
}
