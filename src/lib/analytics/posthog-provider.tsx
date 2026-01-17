'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

                // PRIVACY SETTINGS
                // Mask all text inputs by default to protect PII (names, emails, PDF content)
                mask_all_element_attributes: true,
                mask_all_text: true,

                // While useful, we want to be careful with session recording in sensitive apps
                disable_session_recording: false, // Enable recording but rely on masking

                // Ensure we don't capture local dev sessions unless intended
                loaded: (posthog) => {
                    if (process.env.NODE_ENV === 'development') {
                        posthog.opt_out_capturing() // Opt out by default in dev
                    }
                }
            })
        }
    }, [])

    return (
        <PHProvider client={posthog}>
            {children}
        </PHProvider>
    )
}
