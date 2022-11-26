import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ChatController.index')
  Route.get('/:id', 'ChatController.show')

  Route.post('/sendMessage', 'ChatController.sendMessage')
  Route.post('/sendMessageGroup', 'ChatController.sendMessageGroup')
})
  .middleware('auth:jwt')
  .prefix('chat')
