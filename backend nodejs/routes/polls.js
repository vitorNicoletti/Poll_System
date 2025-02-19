const express = require('express')
const router = express.Router()
const {createPoll,getAllPolls,getPoll,vote,updatePoll,deletePoll} = require('../controllers/polls')

router.route('/').post(createPoll).get(getAllPolls);
router.route('/:id').get(getPoll).put(updatePoll).delete(deletePoll);
router.route('/:id/vote').put(vote);
module.exports = router

