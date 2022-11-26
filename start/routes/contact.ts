import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ContactController.index')
  Route.get('/:id', 'ContactController.show')
})
  .middleware('auth:jwt')
  .prefix('contact')
