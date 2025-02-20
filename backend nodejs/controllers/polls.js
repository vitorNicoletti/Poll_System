const Poll = require('../models/poll')
const Option = require('../models/option')
const {DateTime} = require('luxon')


pollFieldList = ['title','start_date','end_date']

const deletePoll = async (req,res) => {
    const {id:pollId} = req.params
    error = await checkIfPollExists(res, pollId)
    if (error){return error}
    Poll.deletePoll(pollId)
    return res.status(200).json({
        sucess:true,
        message: 'poll deleted!',
    })
}

const formatBodyToUpdate = (body,keysAllowed)=>{

    const update = Object.keys(body)
    .filter(key => keysAllowed.includes(key))
    .reduce((obj,key)=>{
        obj[key] = body[key]
        return obj
    },{})
    return update
}
const updatePoll = async (req, res) => {
    const {id:pollId} = req.params

    const currentPoll = await Poll.getPollByID(pollId)

    if(currentPoll.length == 0){
        return badRequest(res,'this poll dont exist')
    }

    const update = formatBodyToUpdate(req.body,pollFieldList)
    if (Object.keys(update).length == 0 ){
        return badRequest(res,'No Valid Fields')
    }
    if(update.start_date || update.end_date){
        
        const startDate = update.start_date || currentPoll[0].start_date.toISOString()
        const endDate = update.end_date || currentPoll[0].end_date.toISOString()
        console.log("Raw dates from DB:", currentPoll[0].start_date, currentPoll[0].end_date)
        const dates = isValidEndStartDates(startDate,endDate)
        
        if(dates.length == 0){
            
            return badRequest(res,'Please Provide valid dates')
        }
        update.start_date = dates[0];
        update.end_date = dates[1];
    }
    await Poll.updatePoll(update,pollId)
    const updatedPoll = await Poll.getPollByID(pollId)
    return res.status(200).json({
        sucess:true,
        message: updatedPoll,
    })
}
const vote = async (req,res) =>{
    const {optionId} = req.body
    const {id:pollId} = req.params;
    if(!optionId){
        return badRequest(res,'Please Provide the option ID')
    }
    let option = await Option.getOptionById(optionId)

    if(!option.length){
        return badRequest(res,"This option don't exist")
    }
  
    if(option[0].id_poll != pollId){
        return badRequest(res,"Option provided is not from poll")
    }
    
    const pollInfo = await Poll.getPollByID(pollId)
    console.log(pollInfo)
    const pollOptions = await Option.getPollOptions(pollId)
    if(pollInfo.length == 0){
        return badRequest(res,'poll dont exist')
    }
    if (!isPollActive(pollInfo[0].start_date,pollInfo[0].end_date)){
        return res.status(400).json({
            success: false,
            message: 'Poll has either not started or has finished.'
        });
    }
    Option.voteOnOption(optionId)
    console.log(option[0].votes)
    req.io.emit("updateVotes",{ optionId:optionId, votes:option[0].votes+1})
    res.status(200).json({
        sucess:true,
        message: pollOptions,
    })
}
const getPoll = async (req,res)=>{
    const {id:pollId} = req.params
    let pollInfo = await Poll.getPollByID(pollId);
    pollInfo = pollInfo[0]
    if(!pollInfo){
        return badRequest(res,'this poll doesnt exist')
    }
    pollOptions = await Option.getPollOptions(pollId)
    res.status(200).json({
        title: pollInfo.title,
        start_date: pollInfo.start_date,
        end_date:pollInfo.end_date,
        options: pollOptions
    })
}
const getAllPolls = async (req,res)=>{
    const polls =  await Poll.getAllPolls(); 
    res.status(200).json(polls)
}
const createPoll = async (req,res)=>{

    const {title, start_date, end_date, options} = req.body

    if (!title) {
        return badRequest(res,'Please provide a title for the poll.')
    }

    if (!start_date) {
        return badRequest(res,'Please provide a start date for the poll.')
    }

    if (!end_date) {
        return badRequest(res,'Please provide an end date for the poll.')
    }
    if (isValidEndStartDates(start_date,end_date).length == 0){
        return badRequest(res,'Please provide a valid intervall.')
    }
    if (!options || !(Array.isArray(options)) || options.length < 3) {
        return badRequest(res,'Please provide at least tree options for the poll.')
    }
    pollId =  await Poll.createPoll(title, start_date, end_date)
    //if created correctly, create the options too

    if(pollId != undefined){
        for(option of options){
            Option.createOption(option,pollId)
        }

        res.status(201).json({
            success: true,
            message: 'Poll created successfully!'
        });
    }else{
        res.status(500).json({
            sucess:false,
            message: 'unexpected error occured'
        })
    };


}
const checkIfPollExists = async (res,idPoll)=>{
    const currentPoll = await Poll.getPollByID(idPoll)

    if(currentPoll.length == 0){
        return badRequest(res,'this poll dont exist')
    }

}
const StringToDateTime = (dateStart, dateEnd) => {

    let date1 = DateTime.fromISO(dateStart);
    let date2 = DateTime.fromISO(dateEnd);

    if(!date1.isValid){
        date1 = DateTime.fromFormat(dateStart,'yyyy-MM-dd HH:mm:ss')
    }
    if(!date2.isValid){
        date2 = DateTime.fromFormat(dateEnd,'yyyy-MM-dd HH:mm:ss')
    }
    if(!(date1.isValid && date2.isValid)){
        return []
    }
    console.log(date1);
    console.log(date2);
    return [date1, date2];
};

const isValidEndStartDates = (dateStart, dateEnd) => {
    let [date1, date2] = StringToDateTime(dateStart, dateEnd);
    console.log('is valid')
    if(!(date1 && date2)){
        console.log('is valid2')
        return []
    }
    if (date1.isValid && date2.isValid && (date1 < date2)) {
        date1 = date1.toFormat('yyyy-MM-dd HH:mm:ss');
        date2 = date2.toFormat('yyyy-MM-dd HH:mm:ss');
        return [date1, date2];
    } else {
        console.log('is valid3')
        return [];
    }
};

const isPollActive = (dateStart,dateEnd)=>{
    return ((dateStart <= DateTime.now()) && (DateTime.now() < dateEnd))
}
const badRequest = (res, msg)=>{
    return res.status(400).json({
        success: false,
        message: msg
    });
}

module.exports = {
    createPoll,
    getAllPolls,
    getPoll,
    vote,
    updatePoll,
    deletePoll,
    badRequest,
    formatBodyToUpdate
}