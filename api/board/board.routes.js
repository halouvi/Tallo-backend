const express = require('express')
const { getBoard, addBoard, getBoards, deleteBoard, updateBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getBoards)
router.get('/:_id', getBoard)
router.post('/', addBoard)
router.put('/:_id', updateBoard)
router.delete('/:_id', deleteBoard)

module.exports = router
