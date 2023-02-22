const express = require('express');
const { createUser, longinUser, getMe, verifyOtp, forgetPass, changePass, verifyMail } = require('../controller/user.controller');
const { VerifyToken } = require('../middleware/verifyToken');
const sendMail = require('../utils/email');

const router = express.Router();

router.route('/signin')
    .post(createUser)

router.route('/signin/verify')
    .post(verifyOtp)

router.route('/login')
    .post(longinUser)

router.route('/profile')
    .get(VerifyToken,getMe)

router.route('/forgetpassword')
    .post(forgetPass)

router.route('/changepass')
    .post(changePass)

router.route(`/confirm/:id`)
    .get(verifyMail)
    

module.exports = router;
