import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('refreshToken', 'AuthController.refreshToken')
}).prefix('auth')
