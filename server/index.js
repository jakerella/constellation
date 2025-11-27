// Pull in a .env file if present
require('dotenv').config()

const express = require('express')
const AppError = require('./AppError')

// Require the routes
const game = require('./routes/game')

// set default env vars
const PORT = process.env.PORT || 80

// Express app setup
const app = express()
app.use(express.static('static'))
app.use(express.json())

// Add in our routes
app.use('/', game)


// 404 catcher, then error catchall
app.use((req, res, next) => {
    next(new AppError('Sorry, but I could not find route.', 404))
})
app.use(async (err, req, res, next) => {
    let status = err.status || 500
    let msg = err.message || err.toString()
    if (status > 499) {
        msg = 'Sorry, but there was a problem on the server.'
        if (process.env.NODE_ENV === 'production') {
            console.error(err.message)
        } else {
            console.error(err)
        }
    }
    res.status(status)
    res.json({ status, msg })
})


// here we go...
app.listen(PORT, () => {
    console.info(`Constellation app listening at http://localhost:${PORT}`)
})
