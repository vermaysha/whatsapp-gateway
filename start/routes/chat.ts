import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/sendMessage', 'ChatController.sendMessage')
  Route.post('/sendMessageGroup', 'ChatController.sendMessageGroup')
})
  .middleware('auth:jwt')
  .prefix('chat')
