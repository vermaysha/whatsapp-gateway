import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'GroupsController.index')
  Route.get('/:id', 'GroupsController.show')
})
  .middleware('auth:jwt')
  .prefix('group')
