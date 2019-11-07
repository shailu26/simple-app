import { Router } from 'express';
import controller  from './user.controller' 
const router = Router();

router
    .get('/getAllUser', controller.getAllUser)
    .post('/newUser', controller.newUser)
    .patch('/updateUser/:id', controller.updateUser)
    .get('/userById', controller.userById);

module.exports = router;

