const router = require('express').Router();
const controllers = require('../controllers/cards');
const validId = require('../middlewares/validators/id');
const validCreateCard = require('../middlewares/validators/createCard');

router.get('/', controllers.getCards);
router.post('/', validCreateCard, controllers.postCard);
router.delete('/:_id', validId, controllers.deleteCard);
router.put('/:_id/likes', validId, controllers.likeCard);
router.delete('/:_id/likes', validId, controllers.dislikeCard);

module.exports = router;
