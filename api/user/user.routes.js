const express = require('express')
const { verifyAccessToken, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, deleteUser } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/users/:q', verifyAccessToken, getUsers)
router.get('/:id', verifyAccessToken, getUser)
router.delete('/:id', verifyAccessToken, requireAdmin, deleteUser)

module.exports = router
