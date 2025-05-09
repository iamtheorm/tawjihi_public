"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-banking-50 to-white">
      {/* Header */}
      <header className="w-full flex h-16 items-center justify-between px-6 border-b bg-white shadow-sm">
        <div className="flex items-center gap-2 font-semibold">
          <Image 
            src="/Logo_No_Bg-Name.png" 
            alt="TAWJIH AI" 
            width={40}
            height={40}
            className="h-9 w-auto object-contain"
          />
          <span className="text-xl font-semibold tracking-tight text-banking-800 mr-4">TAWJIH AI</span>
        </div>
        <div>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content - Absolutely Centered */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
          <Card className="border-2 shadow-lg">
            <CardHeader className="space-y-2 text-center px-8 pt-8 pb-4">
              <CardTitle className="text-2xl font-bold">Welcome to TAWJIH AI</CardTitle>
              <CardDescription className="text-sm">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-8 py-2">
                {/* Username Field */}
                <div className="space-y-1">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="mohammed.a"
                      className="pl-9 w-full h-9 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link href="#" className="text-xs text-banking-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-9 w-full h-9 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Language Selector */}
                <div className="space-y-1">
                  <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language" className="w-full h-9 text-sm">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en" className="text-sm">English</SelectItem>
                      <SelectItem value="ar" className="text-sm">Arabic</SelectItem>
                      <SelectItem value="fr" className="text-sm">French</SelectItem>
                      <SelectItem value="ur" className="text-sm">Urdu</SelectItem>
                      <SelectItem value="hi" className="text-sm">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="remember" className="h-4 w-4" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>
              </CardContent>

              {/* Sign In Button */}
              <CardFooter className="px-8 pb-8 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-banking-500 hover:bg-banking-600 h-9 text-sm font-medium"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}