const {
    Event,
    Attendance,
    Payment,
    Notification,
    Member,
} = require("../../models")
const { checkPastDate } = require("../../utils/helper")

// Add Event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, entryFee } = req.body

       
        const isPastDate = checkPastDate(date)
        if(isPastDate){
            res.status(400).json({
                error: "Cannot create an event in the past. Please select a future date.",
            })
        }
        const event = await Event.create({
            title,
            description,
            date,
            location,
            entryFee,
        })
        await Notification.create({
            eventId: event.id,
            title: "New Event Created",
            message: `The event "${
                event.title
            }" is scheduled to be held on ${new Date(
                event.date
            ).toDateString()}.`,
        })

        res.status(201).json(event)
    } catch (err) {
        res.status(500).json({
            message: "Failed to create event",
            error: err.message,
        })
    }
}

// Edit Event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params
        const { title, description, date, location } = req.body
          const isPastDate = checkPastDate(date)
        if(isPastDate){
            res.status(400).json({
                error: "Cannot create an event in the past. Please select a future date.",
            })
        }
        const updated = await Event.update(
            { title, description, date, location },
            { where: { id } }
        )
        res.status(200).json({ message: "Event updated", updated })
    } catch (err) {
        res.status(500).json({
            message: "Failed to update event",
            error: err.message,
        })
    }
}

// List Events
const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({ order: [["date", "DESC"]] })
        res.status(200).json(events)
    } catch (err) {
        res.status(500).json({
            message: "Failed to get events",
            error: err.message,
        })
    }
}

// Record Attendance
const recordAttendance = async (req, res) => {
    try {
        const { eventId, memberId, attended } = req.body
        const attendance = await Attendance.create({
            eventId,
            memberId,
            attended,
        })
        res.status(201).json(attendance)
    } catch (err) {
        res.status(500).json({
            message: "Failed to record attendance",
            error: err.message,
        })
    }
}
// Make Payment
const makePayment = async (req, res) => {
    try {
        const { eventId, memberId } = req.body
        const paymentExist = await Payment.findOne({
            where: { eventId, memberId },
        })
        if (paymentExist)
            return res.status(404).json({ message: "Payment already exist" })

        const event = await Event.findOne({ where: { id: eventId } })
        if (!event) return res.status(404).json({ message: "Event not found" })

        const amount = event.entryFee
        const attendance = await Payment.create({ eventId, memberId, amount })
        console.log(attendance.eventId, eventId, "event")
        //  Add a notification for the member
        await Notification.create({
            memberId,
            eventId,
            title: `You have registered for the event - ${event.title}`,
            message: `Your payment for the event "${
                event.title
            }" has been received. Please be available on ${new Date(
                event.date
            ).toDateString()}.`,
        })

        res.status(201).json(attendance)
    } catch (err) {
        res.status(500).json({
            message: "Failed to make payment",
            error: err.message,
        })
    }
}

// Event-wise Payment Tracking
const getEventPayments = async (req, res) => {
    try {
        const { eventId } = req.params
        const payments = await Payment.findAll({
            where: { eventId },
            include: [{ model: Member, attributes: ["id", "name"] }],
        })
        res.status(200).json(payments)
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch event payments",
            error: err.message,
        })
    }
}

module.exports = {
    createEvent,
    updateEvent,
    getEvents,
    recordAttendance,
    makePayment,
    getEventPayments,
}
