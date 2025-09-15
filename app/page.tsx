"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModeToggle } from "@/components/mode-toggle"
import { toast } from "sonner"
import Cookies from 'js-cookie'
import { redirect } from "next/navigation"
import { baseUrl } from "@/lib/api"

export default function LoginPage() {
  // TEMPORARY: Always redirect to dashboard
  redirect("/dashboard");

  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  })

  // Handle mounting state to prevent hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Login failed")
      }

      const data = await response.json()
      
      // Store the token in a cookie that expires in 30 days
      Cookies.set('token', data.access_token, { 
        expires: 30,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-white to-banking-50 p-4">
      <div className="relative w-full max-w-md">
        {/* Mode Toggle */}
        <div className="absolute top-2 right-2 z-10">
          <ModeToggle />
        </div>

        {/* Login Card */}
        <Card className="w-full shadow-md border bg-white dark:bg-gray-950">
          <CardHeader className="text-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Image
                src="/Logo_No_Bg-Name.png"
                alt="TAWJIH AI"
                width={40}
                height={40}
              />
              <span className="text-lg font-semibold text-banking-700 dark:text-white">
                TAWJIH AI
              </span>
            </div>

            <CardTitle className="text-xl font-bold">
              Welcome to TAWJIH AI
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="mohammed.a"
                    className="pl-9"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs text-banking-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-9"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Language Selector */}
              <div className="space-y-1">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="ur">Urdu</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me for 30 days</Label>
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                className="w-full bg-banking-500 hover:bg-banking-600"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}