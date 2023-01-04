const express = require('express')
const bugService = require('./services/bug.service')
const cookieParser = require('cookie-parser')
const userService = require('./services/user.service')



const app = express()
const IS_PREMIUM = false

//App configuration
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//Routing in express
//List
app.get('/api/bug/', (req, res) => {
    const filterBy = req.query
    const sortBy = req.query
    return bugService.query(filterBy, sortBy).then((bugs) => {
        res.send(bugs)
    })
})

// Update (restApi)
app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch((err) => res.status(401).send('Cannot update bug: ' + err.message))
})

// Create (restApi)
app.post('/api/bug/', (req, res) => {
    const bug = req.body
    bugService.save(bug)
        .then((savedBug) => res.send(savedBug))
        .catch(err => res.status(401).send('Cannot create bug: ' + err.message))
})


//Remove (restApi)
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId).then(() => {
        res.send({ msg: 'Bug removed successfully', bugId })
    })
})

// Create PDF
app.get('/api/bug/save_pdf', (req, res) => {
    bugService.createPDF()
    res.send()
})


// Read + cookies (restApi)
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let readBugsId = req.cookies.readBugsId || []
    if (!readBugsId.includes(bugId)) {
        if (readBugsId.length >= 3 && !IS_PREMIUM) {
            return res.status(401).send('Wait for a bit')
        }
        readBugsId.push(bugId)
    }

    bugService.get(bugId)
        .then((bug) => {
            res.cookie('readBugsId', readBugsId, { maxAge: 1000 * 7 })
            res.send(bug)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('Cannot read bug')
        })
})


// User API:
// List:
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => res.send(users))
})

// Read
app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    console.log(userId)
    userService.get(userId)
        .then((user) => {
            res.send(user)
        })
})

//Login
app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('Cannot login')
        })
})

// Sign up
app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then((user) => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log(err)
            res.status(400).send('Cannot create user')
        })
})

//Logout
app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})


app.listen(3030, () => console.log('Server ready at port 3030!')) 