import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DevicesController.index')
})
  .middleware('auth:jwt')
  .prefix('devices')
