const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.post('/users', userController.addUser);
router.get('/users', userController.getUsers);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;