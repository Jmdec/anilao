"use client"

let deferredPrompt: any = null

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("[v0] PWA install prompt available")
    e.preventDefault()
    deferredPrompt = e

    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent("pwa-install-available"))
  })

  window.addEventListener("appinstalled", (e) => {
    console.log("[v0] PWA was installed")
    deferredPrompt = null
    window.dispatchEvent(new CustomEvent("pwa-installed"))
  })
}

export async function installPWA() {
  console.log("[v0] Install PWA called, deferredPrompt:", !!deferredPrompt)

  if (!deferredPrompt) {
    console.log("[v0] PWA install prompt not available")
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("[v0] PWA is already installed")
    }
    return
  }

  try {
    console.log("[v0] Showing PWA install prompt")
    const result = await deferredPrompt.prompt()
    console.log("[v0] PWA install prompt result:", result)

    // Dispatch custom event with result
    window.dispatchEvent(
      new CustomEvent("pwa-install-result", {
        detail: { outcome: result.outcome },
      }),
    )

    deferredPrompt = null
  } catch (error) {
    console.error("[v0] Error during PWA installation:", error)
  }
}
