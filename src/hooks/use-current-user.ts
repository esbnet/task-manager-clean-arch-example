import { auth } from "@/auth"
import { cache } from "react"

export const getCurrentUser = cache(async () => {
  const session = await auth()
  return session?.user
})

export const getCurrentUserId = cache(async () => {
  const user = await getCurrentUser()
  return user?.id
})