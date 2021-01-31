const express = require('express')
const { getBoard, addBoard, getBoards, deleteBoard, updateBoard } = require('./board.controller')
const { verifyAccessToken } = require('../../middlewares/requireAuth.middleware')

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', verifyAccessToken, getBoards)
router.get('/:_id', verifyAccessToken, getBoard)
router.post('/', verifyAccessToken, addBoard)
router.put('/:_id', verifyAccessToken, updateBoard)
router.delete('/:_id', verifyAccessToken, deleteBoard)

module.exports = router
