"use client"

import React, { useState, useEffect, useContext } from "react"
import { useNotification, Audio, useCallbacks, TelnyxRTCContext } from "@telnyx/react-client"
import { Phone, PhoneOff, MicOff, Pause, Book, Delete, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Dialpad() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const client = useContext(TelnyxRTCContext)
  const notification = useNotification()
  const activeCall = notification && notification.call
  const [isMuted, setIsMuted] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const [callStatus, setCallStatus] = useState<string>("READY")

  useCallbacks({
    onReady: () => {
      console.log("Telnyx WebRTC client ready")
      setCallStatus("READY")
    },
    onError: (error) => {
      console.error("Telnyx Error:", error)
      setCallStatus("ERROR")
    },
    onNotification: (notification) => {
      console.log("Telnyx Notification:", notification)
      if (notification.type === "callUpdate" && notification.call) {
        const state = notification.call.state
        setCallStatus(state.toUpperCase())
        if (state === "destroy") {
          setCallStatus("READY")
        }
      }
    },
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      const key = e.key

      if (/[0-9]/.test(key)) {
        handleNumberClick(key)
      } else if (key === "*" || key === "#") {
        handleNumberClick(key)
      } else if (key === "+") {
        handleNumberClick("+")
      } else if (key === "Backspace") {
        handleBackspace()
      } else if (key === "Enter") {
        if (activeCall) {
          handleHangup()
        } else {
          handleCall()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [phoneNumber, activeCall, client]) // We need current state to handle Enter correctly

  const handleNumberClick = (num: string) => {
    if (activeCall) {
      activeCall.dtmf(num)
    } else {
      setPhoneNumber((prev) => prev + num)
    }
  }

  const handleBackspace = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = () => {
    if (!phoneNumber || !client) return

    // Normalize to E.164 format
    let normalized = phoneNumber.replace(/\D/g, "") // strip non-digits

    if (normalized.startsWith("+")) {
      // Already E.164 — keep as-is
    } else if (normalized.startsWith("00")) {
      // International dialing prefix (e.g. 002010...) → replace 00 with +
      normalized = "+" + normalized.slice(2)
    } else if (normalized.startsWith("0") && normalized.length === 11) {
      // Egyptian local format: 01xxxxxxxxx (11 digits) → +201xxxxxxxxx
      normalized = "+20" + normalized.slice(1)
    } else if (normalized.length === 10) {
      // US 10-digit number → +1XXXXXXXXXX
      normalized = "+1" + normalized
    } else {
      // Assume caller knows what they're doing — just prepend +
      normalized = "+" + normalized
    }

    console.log("Initiating call to:", normalized, "with caller ID:", process.env.NEXT_PUBLIC_TELNYX_CALLER_ID)
    
    setCallStatus("DIALING")
    client.newCall({
      destinationNumber: normalized,
      callerNumber: process.env.NEXT_PUBLIC_TELNYX_CALLER_ID || "",
    })
  }

  const handleHangup = () => {
    if (activeCall) {
      activeCall.hangup()
    }
  }

  const handleToggleMute = () => {
    if (activeCall) {
      activeCall.toggleMute()
      setIsMuted(!isMuted)
    }
  }

  const handleToggleHold = () => {
    if (activeCall) {
      activeCall.toggleHold()
      setIsOnHold(!isOnHold)
    }
  }

  const keypad = [
    { num: "1", sub: "" },
    { num: "2", sub: "ABC" },
    { num: "3", sub: "DEF" },
    { num: "4", sub: "GHI" },
    { num: "5", sub: "JKL" },
    { num: "6", sub: "MNO" },
    { num: "7", sub: "PQRS" },
    { num: "8", sub: "TUV" },
    { num: "9", sub: "WXYZ" },
    { num: "*", sub: "" },
    { num: "0", sub: "+" },
    { num: "#", sub: "" },
  ]

  return (
    <div className="fixed bottom-12 right-6 z-50 w-80 bg-[#f0f0f0] border border-gray-300 rounded-lg shadow-2xl p-2 font-sans select-none overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Audio element for Telnyx */}
      {activeCall && <Audio stream={activeCall.remoteStream} />}

      <div className="flex gap-2">
        {/* Left: Keypad */}
        <div className="grid grid-cols-3 gap-1 flex-grow">
          {keypad.map((key) => (
            <button
              key={key.num}
              onClick={() => handleNumberClick(key.num)}
              className="h-14 flex flex-col items-center justify-center bg-[#d1d1d1] hover:bg-[#c1c1c1] active:bg-[#b1b1b1] border border-gray-400 rounded transition-colors"
            >
              <span className="text-xl font-bold leading-none">{key.num}</span>
              <span className="text-[10px] text-gray-600 font-medium">{key.sub}</span>
            </button>
          ))}
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col gap-1 w-20">
          <button
            onClick={handleToggleHold}
            disabled={!activeCall}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded border border-gray-400 text-[10px] font-bold transition-colors",
              isOnHold ? "bg-amber-200" : "bg-[#e5e1d5] hover:bg-[#d5d1c5]",
              !activeCall && "opacity-50 cursor-not-allowed"
            )}
          >
            <Pause className="h-3 w-3 mb-0.5" />
            Hold
          </button>
          <button
            onClick={handleToggleMute}
            disabled={!activeCall}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded border border-gray-400 text-[10px] font-bold transition-colors",
              isMuted ? "bg-blue-300" : "bg-[#7ea8d8] hover:bg-[#6e98c8]",
              !activeCall && "opacity-50 cursor-not-allowed"
            )}
          >
            {isMuted ? <MicOff className="h-3 w-3 mb-0.5" /> : <Volume2 className="h-3 w-3 mb-0.5" />}
            Mute
          </button>
          <button
            onClick={handleHangup}
            disabled={!activeCall}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded border border-gray-400 text-[10px] font-bold bg-[#e89e9e] hover:bg-[#d88e8e] text-white transition-colors",
              !activeCall && "opacity-50 cursor-not-allowed"
            )}
          >
            <PhoneOff className="h-3 w-3 mb-0.5" />
            End Call
          </button>
          <button className="flex-1 flex flex-col items-center justify-center rounded border border-gray-400 text-[10px] font-bold bg-[#fbb143] hover:bg-[#eba133] transition-colors">
            <Book className="h-3 w-3 mb-0.5" />
            Directory
          </button>
          <button
            onClick={handleCall}
            disabled={!!activeCall}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded border border-gray-400 text-[10px] font-bold bg-[#a8d8a8] hover:bg-[#98c898] transition-colors",
              activeCall && "opacity-50 cursor-not-allowed"
            )}
          >
            <Phone className="h-3 w-3 mb-0.5" />
            Call
          </button>
        </div>
      </div>

      {/* Bottom: Number Display */}
      <div className="mt-2 bg-white border border-gray-400 rounded p-1 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase">Number to dial:</span>
          <div className="h-6 flex items-center font-mono text-sm overflow-hidden">
            {phoneNumber || <span className="text-gray-400 italic">Enter a number</span>}
          </div>
        </div>
        <button
          onClick={handleBackspace}
          className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
        >
          <Delete className="h-4 w-4" />
        </button>
      </div>
      
      {/* Footer info */}
      <div className="mt-1 flex items-center justify-between px-1">
         <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 border border-emerald-600 shadow-sm" />
            <Book className="h-3 w-3 text-gray-500 cursor-pointer" />
         </div>
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-[10px] font-bold",
              callStatus === "ACTIVE" ? "text-emerald-500" : 
              callStatus === "ERROR" ? "text-red-500" : "text-gray-400"
            )}>
              {callStatus}
            </span>
            <div className="h-2 w-8 bg-gray-300 rounded-full overflow-hidden">
               <div className={cn(
                 "h-full transition-all duration-500",
                 callStatus === "ACTIVE" ? "w-full bg-emerald-500" : 
                 callStatus === "DIALING" ? "w-1/2 bg-blue-500 animate-pulse" :
                 callStatus === "READY" ? "w-1/3 bg-gray-400" : "w-0"
               )} />
            </div>
          </div>
      </div>
    </div>
  )
}
