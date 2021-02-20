const router = require('express').Router();
const controllers = require('../controllers/auth');

router.post('/', controllers.registerUser);

module.exports = router;
