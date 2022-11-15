//Include the express library
const express = require("express")
//Include the morgan middleware
const morgan = require("morgan")
//Include the cors middleware
const cors = require("cors")

//Create a new express application
const app = express()

//Tell express we want to use the morgan library
app.use(morgan("dev"))
//Tell express we want to use the cors library
app.use(cors())
//Tell express to parse JSON in the request body
app.use(express.json())
const contacts = require('./data/contacts').contacts
const meetings = require("./data/meetings").meetings


//Start up our server
const port = 3030


app.get("/", (req, res) => {
    console.log("got request!")
    console.log('contacts is', contacts)
    res.json({ msg: 'hello!' })
})

app.get("/contacts", (req, res) => {
    contacts.forEach((contact) => {
        contact.meetings = []
        meetings.forEach((meeting) => {
            if (contact.id === Number(meeting.contactId)) {
                contact.meetings.push(meeting)
            }
        })
        console.log(contact)
    })
    res.json({ contacts })
})

app.post("/contacts", (req, res) => {
    const newContact = { ...req.body, id: contacts.length + 1 }
    contacts.push(newContact)
    res.json({ ...req.body })
})


app.get("/contacts/:id", (req, res) => {
    const { id } = req.params
    const contact = contacts.find((eachContact) => eachContact.id === Number(id))
    console.log("found contact", contact)
    if (!contact) {
        return res.status(404).json({ message: `id ${id} not found` })
    }
    res.json({ contact })
})

app.delete("/contacts/:id", (req, res) => {
    const id = req.params
    const contact = contacts.find((item) => item.id === id)
    console.log("deleting contact", contact)
    contacts.splice(contacts.indexOf(contact), 1)
    res.json({ contacts: contacts })
})

app.put("/contacts/:id", (req, res) => {
    const { id } = req.params
    let contact = contacts.find((item) => item.id === Number(id))
    console.log("editing contact", contact)
    contact = { ...req.body }
    res.json({ contacts: contacts })
})

app.get("/contacts/:id/meetings", (req, res) => {
    const id = req.params
    const contact = contacts.find((eachContact) => eachContact.id === Number(id))
    console.log("found meetings", contact.meetings)
    if (!contact) {
        return res.status(404).json({ message: `id ${id} not found` })
    }
    res.json({ meetings: contact.meetings })
})

app.post("/contacts/:id/meetings", (req, res) => {
    const meetingInfo = req.body
    const id = req.params.id
    const contact = contacts.find((eachContact) => eachContact.id === Number(id))
    const newMeeting = { contactId: String(contact.id), id: meetings.length + 1, ...meetingInfo }
    contact.meetings = []
    contact.meetings.push(newMeeting)
    res.json({ meeting: newMeeting })
})

app.put("/contacts/:id/meetings/:meetingId", (req, res) => {
    const { id, meetingId } = req.params
    let meeting = meetings.find((item) => item.contactId === id)
    if (!meeting) {
        return res.status(404).json({ message: `meetingId ${meetingId} not found` })
    }
    meeting = { ...meeting, name: req.body.name }
    res.json(meeting)
})
// add check to meeting and contacts to see that the input parameters are correct

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/`)
})