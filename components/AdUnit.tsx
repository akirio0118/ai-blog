'use client'
import { useEffect } from 'react'

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({ slot, format = 'auto', className = '' }: Props) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (!clientId) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [clientId])

  if (!clientId) {
    return (
      <div className={`bg-gray-100 rounded-2xl h-20 flex items-center justify-center text-gray-400 text-sm border border-gray-200 ${className}`}>
        広告スペース
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
