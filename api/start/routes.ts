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
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

/* Guests only */
Route.group(() => {
  // Users
  Route.post('sessions', 'SessionsController.store')
  Route.post('users', 'UsersController.store')
}).middleware('guest')

/* Auth only */
Route.group(() => {
  // Users
  Route.get('me', 'UsersController.current')
  Route.delete('sessions', 'SessionsController.destroy')
}).middleware('auth')

/* Rest only */
Route.group(() => {
  Route.post('balance', 'Rest/UsersController.balance')
  Route.post('withdraw', 'Rest/UsersController.withdraw')
  Route.post('deposit', 'Rest/UsersController.deposit')
  Route.post('transfer', 'Rest/UsersController.transfer')
}).prefix('rest').middleware('rest')

/* All users */

// Posts
Route.group(() => {
  Route.get('/c/', 'PostsController.index')
  Route.get('/c/:id', 'PostsController.view')
}).prefix('posts')

// Shop
Route.group(() => {
  Route.get('/c/', 'ShopController.index')
  Route.get('/c/:id', 'ShopController.view')
}).prefix('shop')

/* Cloudflare cached pages */

Route.group(() => {
  // Posts
  Route.get('/posts', 'PostsController.index')
  Route.get('/posts/:id', 'PostsController.view')

  // Shop
  Route.get('/shop', 'ShopController.index')
  Route.get('/shop/:id', 'ShopController.view')
}).prefix('c')
