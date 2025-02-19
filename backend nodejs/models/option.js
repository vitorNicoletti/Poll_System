

const connection = require('../db/connect')
class Option{
    static async updateOption(body,optionId){
        const mysqlSetString = Object.keys(body).map((key)=>{return `${key}= ?`}).join(', ')

        const setValues = Object.values(body)
        setValues.push(optionId)

        try {
            const [result] = await connection.promise().query(`UPDATE options SET ${mysqlSetString} WHERE id = ?`, setValues)
            return result
        }
        catch (err) {
            console.log('Failed to update poll: ', err)
            throw err
        }
    }
    
    static async deleteOption(optionId){
        try{
            const [result] = await connection.promise().query('DELETE FROM `options` WHERE id = ?',[optionId])
            return result
        }catch(err){
            console.log('failed to retrieve options information: ',err)
            throw err
        }
    }
    static async voteOnOption(optionId){
        try{
            const [result] = await connection.promise().query('UPDATE options SET votes = votes+1 WHERE id = ?',[optionId])
            return result
        }catch(err){
            console.log('failed to retrieve options information: ',err)
            throw err
        }
    }
    static async getOptionById(optionId){
        try{
            const [result] = await connection.promise().query('SELECT * FROM options WHERE id = ? ',[optionId])
            return result
        }catch(err){
            console.log('failed to retrieve options information: ',err)
            throw err
        }
    }
    static async getPollOptions(pollId){
        try{
            const [result] = await connection.promise().query('SELECT id,option_text,votes FROM options WHERE id_poll = ? ',[pollId])
            return result
        }catch(err){
            console.log('failed to retrieve options information: ',err)
            throw err
        }
    }
    static async createOption(optionText,pollId){
        try{
            const [result] = await connection.promise().query('INSERT INTO options (option_text,id_poll) VALUES (?,?)',[optionText,pollId])
            return result
        }catch(err){
            console.log('falha ao criar a opcao: ',err)
            throw err
        }
        

    }   
}
module.exports = Option
