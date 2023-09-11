const router = require('express').Router();
const { celebrate } = require('celebrate');
const validation = require('../middlewares/validation');
const {
  getUsers,
  getUserId,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', celebrate(validation.userSchema), getUserId);
router.get('/me', getUserInfo);
router.patch('/me', celebrate(validation.updateProfileSchema), updateProfile);
router.patch('/me/avatar', celebrate(validation.updateAvatarSchema), updateAvatar);

module.exports = router;
