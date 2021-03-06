const createError = require('http-errors')
const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
require('dotenv').config()

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')

const app = express()
// esto es un midleware :
// es una funcion que intercepta (detiene)
// la peticion que esta pasando por mi API
// use : sig que cualquier peticion pasara por aca
app.use(express.json())
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
// este metodo (middleware) hace lo mismo que body-parser (no es necesario utilisar body-parser)
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/posts', postsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// NoSql injection
app.use(mongoSanitize())
// securing the header
app.use(helmet())
// XSS atacks
app.use(xss())

// mongoose.connect(process.env.DB_URI)
//   .then(() => console.log('mymerndb connection succussful'))
//   .catch((err) => console.log(err))
mongoose.connect(process.env.DB_URI_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('annuairedb connection succussful!')
  })
  .catch((err) => {
    console.log('OH NO! MONGO CONNECTION ERROR!')
    console.log(err)
  })
module.exports = app
