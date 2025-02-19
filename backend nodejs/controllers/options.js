const Option = require('../models/option')
const Poll = require('../models/poll')
const { badRequest, formatBodyToUpdate } = require('./polls')

const updateOption = async (req, res) => {
    const { id: optionId } = req.params
    let idStatus = await checkOptionId(res, optionId);
    if (idStatus) {

        return idStatus
    }
    const update = formatBodyToUpdate(req.body, ['option_text', 'votes'])
    console.log(update)
    if (Object.keys(update).length == 0) {

        return badRequest(res, 'Please insert a valid field(option_text, votes).')
    }
    if (update.votes < 0) {

        return badRequest(res, 'invalid number of votes')
    }

    await Option.updateOption(update, optionId)
    const updateOption = await Option.getOptionById(optionId)
    res.status(200).json({
        success: true,
        message: updateOption
    })
}
const deleteOption = async (req, res) => {
    const { id: optionId } = req.params
    if (!optionId) {
        return badRequest(res, 'Please Provide the option ID')
    }
    let option = await Option.getOptionById(optionId)
    if (!option.length) {
        return badRequest(res, "This option don't exist")
    }
    const options = await Option.getPollOptions(option[0].id_poll)

    if (options.length == 3) { return badRequest(res, "The pool need to have at least 3 options") }
    Option.deleteOption(optionId)
    res.status(200).json({
        success: true,
        message: 'Option deleted.'
    })
}
const createOption = async (req, res) => {
    const { pollId, option_text } = req.body
    if (!pollId) {
        return badRequest(res, "'Please provide the Poll's ID")
    }
    let poll = await Poll.getPollByID(pollId)
    if (!poll.length) {
        return badRequest(res, "'this poll don't exists'")
    }
    if (!option_text) {
        return badRequest(res, "Please provide the option text")
    }
    Option.createOption(option_text, pollId)
    res.status(200).json({
        success: true,
        message: 'Option created successfuly.'
    })
}
const checkOptionId = async (res, optionId) => {
    if (!optionId) {
        return badRequest(res, 'Please Provide the option ID')
    }
    let option = await Option.getOptionById(optionId)
    if (!option.length) {
        return badRequest(res, "This option don't exist")
    }
    return;
}
module.exports = { deleteOption, createOption, updateOption }