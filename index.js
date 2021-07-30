const express = require('express')
const data = require('./data')
const bcrypt = require('bcryptjs')
const ejs = require('ejs')
const app = express()

//Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//EJS config
app.set('view engine', 'ejs')
app.set('views', './views')

//set 'public' folder as static folder
app.use(express.static('./public'))


//Port specified
const PORT = 3000

//ROUTES
//Part 1
app.get('/', (req, res) => {
    res.render('pages/home')
})

//all users
app.get('/users', (req, res) => {
    res.render('pages/users', {
        users: data.users
    })
})

//all schedules
app.get('/schedules', (req, res) => {
    res.render('pages/schedules', {
        schedules: data.schedules
    })

})

//Part 2
//for specific users
app.get('/users/:id', (req, res) => {
    const id = req.params.id
    const error = '404 Page cannot be displayed'
    if (id < data.users.length) {
        res.render('pages/usersid', {
            usersid: data.users[id],
        })
    }
    else if (id == 'new') {
        res.render('pages/usersnew')
    } else {
        res.render('pages/error', {
            errorid: error
        })
    }

})

//for specific schedules
app.get('/schedules/:id', (req, res) => {
    const id = req.params.id
    const error = '404 Page cannot be displayed'
    if (id < data.schedules.length) {
        res.render('pages/schedulesid', {
            schedulesid: data.schedules[id],
        })
    }
    else if (id == 'new') {
        res.render('pages/schedulesnew', {
            newUserData: data.users,
            newSchedules: data.schedules
        })
    } else {
        res.render('pages/error', {
            errorid: error
        })
    }
})


//for specific schedules for each users

app.get('/users/:id/schedules', (req, res) => {
    const newSched = []
    const userId = req.params.id
    const error = '404 Page cannot be displayed'
    for (let i = 0; i < data.schedules.length; i++) {
        if (userId == data.schedules[i].user_id) {
            newSched.push(data.schedules[i])
        }
    }
    if (newSched.length == 0 || userId > data.users.length) {
        res.render('pages/error', {
            errorid: error
        })
    } else {
        res.render('pages/useridsched', {
            newSchedId: newSched
        })
    }
})

//Add new schedule
app.post('/schedules', (req, res) => {
    data.schedules.push(req.body)
    res.render('pages/schedules', {
        schedules: data.schedules
    })
})


//Add new user
app.post('/users', (req, res) => {
    const password = req.body.password
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    const newUser = {
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: req.body.emailAddress,
        password: hash
    }

    data.users.push(newUser)
    res.render('pages/users', {
        users: data.users
    })

})

//Making sure that we are connected to a local host
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})


