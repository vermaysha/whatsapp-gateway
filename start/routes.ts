/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

/**
 * Private API
 */
Route.group(() => {
  /**
   * Authentication Routes
   */
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('refreshToken', 'AuthController.refreshToken')
  }).prefix('auth')

  /**
   * Chat Controller
   */
  Route.group(() => {
    Route.get('/', 'ChatController.index')
    Route.get('/:id', 'ChatController.show')
  })
    .middleware('auth:jwt')
    .prefix('chat')

  /**
   * Contact Controller
   */
  Route.group(() => {
    Route.get('/', 'ContactController.index')
    Route.get('/:id', 'ContactController.show')
  })
    .middleware('auth:jwt')
    .prefix('contact')

  /**
   * Devices Controller
   */
  Route.group(() => {
    Route.get('/', 'DevicesController.index')
    Route.get('/:id', 'DevicesController.show')
  })
    .middleware('auth:jwt')
    .prefix('devices')

  /**
   * Group Controller
   */
  Route.group(() => {
    Route.get('/', 'GroupsController.index')
    Route.get('/:id', 'GroupsController.show')
  })
    .middleware('auth:jwt')
    .prefix('group')

  /**
   * Messages Controller
   */
  Route.group(() => {
    Route.get('/', 'MessagesController.index')
    Route.get('/:id', 'MessagesController.show')
  })
    .middleware('auth:jwt')
    .prefix('message')

  /**
   * Services Controller
   */
  Route.group(() => {
    Route.get('/start', 'ServicesController.start')
    Route.get('/stop', 'ServicesController.stop')
    Route.get('/restart', 'ServicesController.restart')
    Route.get('/logout', 'ServicesController.logout')
  })
    .prefix('services')
    .middleware('auth:jwt')

  /**
   * Token Controller
   */
  Route.group(() => {
    Route.get('/', 'TokensController.index')
    Route.post('/generate', 'TokensController.generate')
  })
    .middleware('auth:jwt')
    .prefix('token')
}).prefix('private')

/**
 * Public API
 */
Route.group(() => {
  /**
   * Chat Controller
   */
  Route.group(() => {
    Route.post('/sendMessage', 'ChatController.sendMessage')
    Route.post('/sendMessageGroup', 'ChatController.sendMessageGroup')
  })
    .middleware('auth:api')
    .prefix('chat')
}).prefix('public')

Route.get('/', async () => {
  return { hello: 'world' }
})
