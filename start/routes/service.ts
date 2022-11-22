import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/start', 'ServicesController.start')
  Route.get('/stop', 'ServicesController.stop')
  Route.get('/restart', 'ServicesController.restart')
  Route.get('/logout', 'ServicesController.logout')
})
  .prefix('services')
  .middleware('auth:jwt')
