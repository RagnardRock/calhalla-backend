const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ⏺ Enregistrement
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà existant.' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).json({ message: 'Utilisateur créé avec succès.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur.' })
  }
})

// 🔐 Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })

    const isValid = await user.comparePassword(password)
    if (!isValid) return res.status(401).json({ message: 'Mot de passe incorrect.' })

    console.log('Utilisateur connecté:', user.email)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur.' })
  }
})

module.exports = router
