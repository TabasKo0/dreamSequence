'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ScannerClient() {
  const supabase = createClient()
  const router = useRouter()
  
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const lastCodeRef = useRef('')
  const startInProgressRef = useRef(false)
  const lastDeviceIdRef = useRef('')

  const [userProfile, setUserProfile] = useState<any>(null)
  
  const [supported, setSupported] = useState(true)
  const [permissionError, setPermissionError] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  
  const [secureContext, setSecureContext] = useState(true)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [autoStartAttempted, setAutoStartAttempted] = useState(false)

  // Confirmation state
  const [confirmingUser, setConfirmingUser] = useState<string | null>(null)
  const [marking, setMarking] = useState(false)
  
  // Feedback state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'error', message: string } | null>(null)

  // Access is now guaranteed by layout.tsx's enforceScannerAccess
  const [userEmail, setUserEmail] = useState<string>('Scanner Authorized')
  
  useEffect(() => {
    const getEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserEmail(user.email || 'Scanner Authorized')
    }
    getEmail()
  }, [supabase])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.isSecureContext) {
      setSecureContext(false)
      setPermissionError('Camera access requires HTTPS or localhost.')
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setSupported(false)
      setPermissionError('Camera access is not available on this device/browser.')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!navigator.mediaDevices?.enumerateDevices) return

    const loadDevices = async () => {
      try {
        const list = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = list.filter((device) => device.kind === 'videoinput')
        setDevices(videoInputs)
        if (!selectedDeviceId && videoInputs.length) {
          setSelectedDeviceId(videoInputs[0].deviceId)
        }
      } catch (error) {
        setPermissionError('Unable to list camera devices. Check permissions.')
      }
    }

    loadDevices()
  }, [selectedDeviceId, permissionRequested])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (permissionRequested) return
    if (!secureContext || !supported) return
    if (!navigator.mediaDevices?.getUserMedia) return

    setPermissionRequested(true)

    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())
        setPermissionError('')
      } catch (error: any) {
        if (error?.name === 'NotAllowedError') {
          setPermissionError('Camera permission blocked. Allow camera access in the browser settings.')
        } else if (error?.name === 'NotFoundError') {
          setPermissionError('No camera found or it is already in use by another app.')
        } else {
          setPermissionError(`Unable to request camera permission: ${error.message || 'Unknown error'}`)
        }
      }
    }

    requestPermission()
  }, [permissionRequested, secureContext, supported])

  const onScanDetected = useCallback((decodedText: string) => {
    const trimmedValue = decodedText.trim()
    if (!trimmedValue) return
    
    // Check if we are already confirming someone
    if (confirmingUser) return

    // Avoid scanning the same code multiple times rapidly
    if (trimmedValue !== lastCodeRef.current) {
      lastCodeRef.current = trimmedValue
      
      // Pause scanner
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.pause()
      }
      
      setConfirmingUser(trimmedValue)
      setFeedback(null)
    }
  }, [confirmingUser])

  const startScanning = useCallback(async () => {
    if (startInProgressRef.current) return
    const cameraIdOrConfig = selectedDeviceId ? selectedDeviceId : { facingMode: 'environment' }

    startInProgressRef.current = true
    setCameraEnabled(true)
    setFeedback(null)
    setConfirmingUser(null)
    lastCodeRef.current = ''

    setTimeout(async () => {
      try {
        if (html5QrCodeRef.current?.isScanning) {
          await html5QrCodeRef.current.stop()
        }

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode('qr-reader')
        }

        await html5QrCodeRef.current.start(
          cameraIdOrConfig,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          onScanDetected,
          () => {} // ignore errors
        )

        setCameraReady(true)
        setPermissionError('')
      } catch (error: any) {
        console.error('Scanner error:', error)
        if (error?.name === 'NotAllowedError') {
          setPermissionError('Camera permission blocked. Allow camera access in the browser settings.')
        } else if (error?.name === 'NotFoundError') {
          setPermissionError('No camera found or it is already in use by another app.')
        } else {
          setPermissionError(`Unable to start scanner: ${error.message || 'Unknown error'}`)
        }
        setCameraEnabled(false)
      } finally {
        startInProgressRef.current = false
      }
    }, 0)
  }, [selectedDeviceId, onScanDetected])

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current?.isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current = null
        setCameraReady(false)
        setCameraEnabled(false)
      } catch (error) {
        console.error('Error stopping scanner:', error)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current?.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error)
      }
    }
  }, [])

  useEffect(() => {
    if (!cameraEnabled || !selectedDeviceId) return
    if (lastDeviceIdRef.current === selectedDeviceId) return

    lastDeviceIdRef.current = selectedDeviceId
    stopScanning().then(() => {
      startScanning()
    })
  }, [selectedDeviceId, cameraEnabled, startScanning, stopScanning])

  useEffect(() => {
    if (autoStartAttempted) return
    if (!secureContext || !supported) return
    if (!selectedDeviceId) return

    setAutoStartAttempted(true)
    startScanning()
  }, [autoStartAttempted, secureContext, supported, selectedDeviceId, startScanning])

  const handleConfirm = async () => {
    if (!confirmingUser) return

    setMarking(true)
    try {
      const response = await fetch('/api/scanner/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: confirmingUser }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setFeedback({ type: 'error', message: data.message || data.error || 'Failed to mark attendance.' })
      } else if (data.status === 'already_present') {
        setFeedback({ type: 'warning', message: `⚠️ ${data.message}` })
      } else if (data.status === 'newly_marked') {
        setFeedback({ type: 'success', message: `✅ ${data.message}` })
      } else {
        setFeedback({ type: 'success', message: `✅ ${data.message || 'Success'}` })
      }
    } catch (error: any) {
      setFeedback({ type: 'error', message: `Error: ${error.message}` })
    } finally {
      setMarking(false)
      setConfirmingUser(null)
    }
  }

  const handleCancel = () => {
    setConfirmingUser(null)
    lastCodeRef.current = ''
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.resume()
    }
  }

  const handleClearUI = () => {
    setFeedback(null)
    lastCodeRef.current = ''
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.resume()
    }
  }



  return (
    <main className="min-h-screen flex flex-col p-6 md:p-10 relative overflow-y-auto bg-black text-white">
      <div className="mx-auto w-full max-w-3xl flex-1 flex flex-col">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight montserrat-bold text-red-500 drop-shadow-[0_0_25px_rgba(0,0,0,2.7)] uppercase text-center md:text-left">
            Scanner
          </h1>
        </header>

        {/* Status Messages */}
        <div className="w-full">
          {!secureContext && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-200 mb-6 text-sm">
              Camera access requires HTTPS or localhost. Please open this page on a secure origin.
            </div>
          )}

          {!supported && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-amber-200 mb-6 text-sm">
              QR scanning is unavailable. Allow camera permissions or use a supported device/browser.
            </div>
          )}

          {permissionError && (
            <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200 text-sm">
              {permissionError}
            </div>
          )}
        </div>

        {/* Scanner Container */}
        <div className="rounded-[2rem] bg-white/5 border border-white/50 backdrop-blur-xs p-6 md:p-8 shadow-xl relative flex flex-col w-full flex-1">
          
          {devices.length > 1 && (
            <div className="mb-4 flex flex-col gap-2 text-sm text-slate-300">
              <label className="text-xs uppercase tracking-[0.18em] text-slate-400">Camera Source</label>
              <select
                value={selectedDeviceId}
                onChange={(event) => setSelectedDeviceId(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#23e6ff]/50 transition-colors"
              >
                {devices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 mx-auto max-w-sm w-full">
            <div className="relative aspect-square">
              <div id="qr-reader" className="w-full h-full" />
              <div className="pointer-events-none absolute inset-0 border-2 border-[#23e6ff]/40" />
            </div>

            {!cameraEnabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-sm text-slate-300 z-10">
                <p>Camera preview is paused.</p>
                <button
                  type="button"
                  onClick={startScanning}
                  className="rounded-lg border border-[#23e6ff]/40 bg-[#23e6ff]/10 px-4 py-2 text-sm font-semibold text-[#9ff6ff] hover:bg-[#23e6ff]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Enable camera
                </button>
              </div>
            )}
            
            {cameraEnabled && !confirmingUser && !feedback && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-2 text-xs bg-black/50 px-2 py-1 rounded border border-white/10 backdrop-blur-md">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-300">Scanning</span>
                </div>
              </div>
            )}
          </div>

          {cameraEnabled && !confirmingUser && !feedback && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={stopScanning}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Pause Camera
              </button>
            </div>
          )}

          {/* CONFIRMATION OVERLAY */}
          {confirmingUser && (
            <div className="mt-8 rounded-2xl border border-white/20 bg-black/40 p-6 text-center shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Participant Detected</h3>
              <p className="text-sm md:text-base text-slate-300 font-mono break-all mb-4 px-4 py-3 bg-black/60 rounded-xl border border-white/10">
                {confirmingUser}
              </p>
              <p className="text-sm text-slate-300 mb-6">Log attendance for this participant?</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={marking}
                  className="px-6 py-3 rounded-xl font-semibold text-sm border border-white/20 text-white hover:bg-white/10 transition-colors disabled:opacity-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={marking}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all disabled:opacity-50 w-full sm:w-auto shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                >
                  {marking ? 'Logging...' : 'Confirm'}
                </button>
              </div>
            </div>
          )}

          {/* FEEDBACK OVERLAY */}
          {feedback && (
            <div className={`mt-8 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 border ${
              feedback.type === 'success' ? 'bg-emerald-900/40 border-emerald-500/50' :
              feedback.type === 'warning' ? 'bg-amber-900/40 border-amber-500/50' :
              'bg-red-900/40 border-red-500/50'
            }`}>
              <div className={`text-xl font-bold mb-3 ${
                feedback.type === 'success' ? 'text-emerald-400' :
                feedback.type === 'warning' ? 'text-amber-400' :
                'text-red-400'
              }`}>
                {feedback.type === 'success' ? 'Attendance Marked' :
                 feedback.type === 'warning' ? 'Attention Needed' :
                 'Error Logging Attendance'}
              </div>
              <p className="text-sm md:text-base text-white/80 mb-6">{feedback.message}</p>
              
              <button
                type="button"
                onClick={handleClearUI}
                className="px-8 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                Scan Next Participant
              </button>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center text-xs text-slate-500 font-medium tracking-wide">
          Logged in as {userEmail}
        </footer>
      </div>
    </main>
  )
}
