import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.ts';

import AccessTokenController from "#controllers/access_token_controller";
import NewAccountController from '#controllers/new_account_controller';
import PurchasesController from '#controllers/purchases_controller';
import UsersController from '#controllers/users_controller';
import ProductsController from '#controllers/products_controller';
import ClientsController from '#controllers/clients_controller';
import TransactionsController from '#controllers/transactions_controller';
import GatewaysController from '#controllers/gateways_controller';

//Public
router.post('/login', [AccessTokenController, 'store'])
router.post('/register', [NewAccountController, 'store'])
router.post('/purchase', [PurchasesController, 'store'])

//Private
router.group(() =>{

  //Users
  router.get('/users', [UsersController, 'index'])
  router.post('/users', [UsersController, 'store'])
  router.get('/users/:id', [UsersController, 'show'])
  router.put('/users/:id', [UsersController, 'update'])
  router.delete('/users/:id', [UsersController, 'destroy'])

  // Produtos
  router.get('/products', [ProductsController, 'index'])
  router.post('/products', [ProductsController, 'store'])
  router.get('/products/:id', [ProductsController, 'show'])
  router.put('/products/:id', [ProductsController, 'update'])
  router.delete('/products/:id', [ProductsController, 'destroy'])

  // Clientes
  router.get('/clients', [ClientsController, 'index'])
  router.get('/clients/:id', [ClientsController, 'show'])

  // Transações
  router.get('/transactions', [TransactionsController, 'index'])
  router.get('/transactions/:id', [TransactionsController, 'show'])
  router.post('/transactions/:id/refund', [TransactionsController, 'refund'])

  // Gateways
  router.patch('/gateways/:id/active', [GatewaysController, 'setActive'])
  router.patch('/gateways/:id/priority', [GatewaysController, 'updatePriority'])

}).use(middleware.auth())
