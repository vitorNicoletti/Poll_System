const connection = require('../db/connect')

class Poll {
    static async deletePoll(idPoll){
        try {
            const [result] = await connection.promise().query(`CALL deletePoll(?)`, idPoll)
            return result
        }
        catch (err) {
            console.log('Failed to delete poll: ', err)
            throw err
        }
    }

    static async updatePoll(body, pollId) {
        const setString = Object.keys(body).map((key)=>{return `${key}= ?`}).join(', ')

        const setValues = Object.values(body)
        setValues.push(pollId)

        try {
            const [result] = await connection.promise().query(`UPDATE polls SET ${setString} WHERE id = ?`, setValues)
            return result
        }
        catch (err) {
            console.log('Failed to update poll: ', err)
            throw err
        }
    }
    static async getAllPolls() {
        try {
            const [result] = await connection.promise().query('SELECT * FROM polls')
            return result
        } catch (err) {
            console.log('Failed to get all polls: ', err)
            throw err
        }
    }
    static async getPollByID(id) {
        try {
            const [result] = await connection.promise().query('SELECT * FROM polls WHERE id = ?', [id])
            return result
        }
        catch (err) {
            console.log('Failed to get the poll: ', err)
            throw err
        }
    }
    static async createPoll(title, start_dt, end_dt) {
        try {
            const [result] = await connection.promise().query('INSERT INTO polls (title,start_date,end_date) VALUES(?,?,?)', [title, start_dt, end_dt]);
            return result.insertId
        }
        catch (err) {
            console.log('falha ao criar a poll: ', err)
            throw err
        }

    }
}

module.exports = Poll