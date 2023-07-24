export interface IAuthContext {
  isAuthenticated: boolean
  loginToAccount: (body: ILogin) => Promise<Response | undefined>
  logoutUser: () => Promise<void>
}

export interface ILogin {
  username: string
  password: string
}
