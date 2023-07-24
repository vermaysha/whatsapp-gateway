export interface IAuthContext {
  isAuthenticated: Boolean
  isLoading: Boolean
  setIsLoading: (flag: boolean) => void
  loginToAccount: (body: ILogin) => Promise<Response | undefined>
  logoutUser: () => Promise<void>
}

export interface ILogin {
  username: string
  password: string
}
