const express = require('express')
const data = require('./data')
const bcrypt = require('bcryptjs')
const app = express()

//Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 3000

//ROUTES
//Part 1
//Welcome message to users
app.get('/', (req, res) => {
    res.send('Welcome to our schedule website.')
})

//all users
app.get('/users', (req, res) => {
    res.send(data.users)
})

//all schedules
app.get('/schedules', (req, res) => {
    res.send(data.schedules)
})

//Part 2
//for specific users
app.get('/users/:id', (req, res) => {
    res.send(data.users[req.params.id])
})

//for specific schedules
app.get('/schedules/:id', (req, res) => {
    res.send(data.schedules[req.params.id])
})


//for specific schedules for each users
app.get('/users/:id/schedules', (req, res) => {
    const newSched = []
    for (let i = 0; i < data.schedules.length; i++) {
        if (req.params.id == data.schedules[i].user_id) {
            newSched.push(data.schedules[i])
        }
    }
    if (newSched.length == 0 || req.params.id > data.users.length) {
        res.send('There are no schedules for this user.')
    } else {
        res.send(newSched)
    }
})

//Add new schedule
app.post('/schedules', (req, res) => {
    data.schedules.push(req.body)
    res.send(req.body)
})

//Add new user
app.post('/users', (req, res) => {
    const password = req.body.password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash
    }
    data.users.push(newUser)
    res.send(newUser)
})

//Making sure that we are connected to a local host
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})


