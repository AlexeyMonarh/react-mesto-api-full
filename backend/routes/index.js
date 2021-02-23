const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const registerRoutes = require('./register');
const loginRoutes = require('./login');
const registerValidator = require('../middlewares/validators/register');
const authMiddleware = require('../middlewares/auth');

router.use('/signup', registerValidator, registerRoutes);
router.use('/signin', loginRoutes);
router.use(authMiddleware);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use('*', (req, res) => {
  res.status(500).send({ message: 'На сервере произошла ошибка!' });
});

module.exports = router;
