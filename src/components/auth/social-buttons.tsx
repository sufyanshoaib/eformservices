import { signInWithGoogle, signInWithFacebook } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"

export function SocialButtons() {
    return (
        <div className="flex flex-col gap-3">
            <form action={signInWithGoogle} className="w-full">
                <Button
                    variant="outline"
                    className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-medium transition-all hover:shadow-sm"
                >
                    <svg className="mr-3 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Continue with Google
                </Button>
            </form>
            <form action={signInWithFacebook} className="w-full">
                <Button
                    variant="outline"
                    className="w-full h-11 bg-[#1877F2] hover:bg-[#166fe5] border-transparent text-white font-medium transition-all hover:shadow-md"
                >
                    <Facebook className="mr-3 h-4 w-4 fill-current" />
                    Continue with Facebook
                </Button>
            </form>
        </div>
    )
}
