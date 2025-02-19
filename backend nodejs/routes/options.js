const express = require('express')
const router = express.Router()

const {deleteOption,createOption,updateOption} = require('../controllers/options')

router.route('/').post(createOption)
router.route('/:id').delete(deleteOption).put(updateOption)


module.exports = router