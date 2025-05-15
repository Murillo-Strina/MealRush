const express = require("express");
const LoginController = require('../Controllers/loginController');

const router = express.Router();

router.post('/user/login', LoginController.Login);
router.post('/user/register', LoginController.Register);
router.put('/user/update', LoginController.Update);

module.exports = router;