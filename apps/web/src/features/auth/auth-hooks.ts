import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/store"
import { setCredentials, setUser, logout } from "@/features/auth/auth-slice"
import { login, signup, getMe, logoutApi } from "@/services/auth-service"

const ME_QUERY_KEY = ["auth", "me"] as const

export function useLogin() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      )
      queryClient.setQueryData(ME_QUERY_KEY, data.user)
      navigate("/dashboard")
    },
  })
}

export function useSignup() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      )
      queryClient.setQueryData(ME_QUERY_KEY, data.user)
      navigate("/dashboard")
    },
  })
}

export function useMe() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const user = await getMe()
      dispatch(setUser(user))
      return user
    },
    enabled: isAuthenticated,
    retry: false,
  })
}

export function useLogout() {
  const dispatch = useAppDispatch()
  const refreshToken = useAppSelector((state) => state.auth.refreshToken)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      if (refreshToken) {
        return logoutApi(refreshToken)
      }
      return Promise.resolve()
    },
    onSettled: () => {
      dispatch(logout())
      queryClient.clear()
      navigate("/login")
    },
  })
}
