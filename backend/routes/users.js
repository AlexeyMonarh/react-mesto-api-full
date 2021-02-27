const router = require('express').Router();
const controllers = require('../controllers/users');
const validId = require('../middlewares/validators/id');
const validUpUsInfo = require('../middlewares/validators/upUsInfo');
const validUpAva = require('../middlewares/validators/upUsAva');

router.get('/', controllers.getUsers);
router.get('/me', controllers.getUser);
router.get('/:_id', validId, controllers.getUserId);
router.patch('/me', validUpUsInfo, controllers.patchUser);
router.patch('/me/avatar', validUpAva, controllers.patchAva);

module.exports = router;
