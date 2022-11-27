import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'MessagesController.index')
  Route.get('/:id', 'MessagesController.show')
})
  .middleware('auth:jwt')
  .prefix('message')
