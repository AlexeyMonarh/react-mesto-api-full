const router = require('express').Router();
const controllers = require('../controllers/users');

router.get('/', controllers.getUsers);
router.get('/me', controllers.getUser);
router.get('/:_id', controllers.getUserId);
router.patch('/me', controllers.patchUser);
router.patch('/me/avatar', controllers.patchAva);

module.exports = router;
