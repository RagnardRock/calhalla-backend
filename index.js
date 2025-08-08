const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/auth')
require('dotenv').config()

const userDataRoutes = require('./routes/userData')
const app = express()




// Middlewares

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use('/api/user', userDataRoutes)
// Routes
app.use('/api/auth', authRoutes)

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connectée avec succès.')
    app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'))
  })
  .catch(err => console.error('❌ DB connection error:', err))
