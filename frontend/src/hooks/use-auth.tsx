import { useNavigate } from '@tanstack/react-router'
// import { useAuth } from '@/context/auth' // if you have an auth context

export function useLogout() {
  const navigate = useNavigate()
  // const { setUser } = useAuth() // or your actual user clearing logic

  return () => {
    // setUser(null) // or your actual logout logic
    navigate({ to: '/sign-in' })
  }
}
