const checkPastDate = (date)=>{
 const eventDate = new Date(date)
        const today = new Date()

        console.log("DATEE,", eventDate, today, eventDate <= today)
        if (eventDate <= today) {
            return true
        }
}
module.exports = {
    checkPastDate
}