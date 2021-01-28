const express = require('express')
const { getBoard, addBoard, getBoards, deleteBoard, updateBoard } = require('./board.controller')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')

const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', requireAuth, getBoards)
router.get('/:_id', requireAuth, getBoard)
router.post('/', requireAuth, addBoard)
router.put('/:_id', requireAuth, updateBoard)
router.delete('/:_id', requireAuth, deleteBoard)

module.exports = router
