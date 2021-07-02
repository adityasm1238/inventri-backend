const router = require("express").Router();

const authContoller = require('../../controllers/authController');

router.post('/signup', authContoller.signup);
router.post('/signin', authContoller.signin);

module.exports = router;