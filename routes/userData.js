const express = require('express')
const router = express.Router()
const User = require('../models/User')

// Middleware d’auth simplifié (à adapter avec token plus tard si besoin)
const getUser = async (req, res, next) => {
  const { email } = req.body
  console.log('🔍 Recherche utilisateur par email:', email)
  if (!email) return res.status(400).json({ message: 'Email requis.' })

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' })

  req.user = user
  next()
}

// 🧠 GET user data
router.post('/get-data', getUser, (req, res) => {
  res.json({
    profil: req.user.profil,
    poids: req.user.poids,
    journal: req.user.journal,
    objectifPoids: req.user.profil.objectifPoids || 0,
  })
})

// 💾 UPDATE profil complet
router.post('/save-data', getUser, async (req, res) => {
  const { profil, journal } = req.body
  const user = req.user

  try {
    
  if (profil !== undefined) user.profil = profil
  if (journal !== undefined) user.journal = journal
    await user.save()
    res.json({ message: 'Données sauvegardées.' })
  } catch (e) {
    res.status(500).json({ message: 'Erreur lors de la sauvegarde.' })
  }
})

router.post('/save-poids', getUser, async (req, res) => {
  const { date, valeur } = req.body
  const user = req.user

  if (!date || typeof valeur !== 'number') {
    return res.status(400).json({ message: 'Date et poids requis.' })
  }

  if (!user.journal[date]) {
    user.journal[date] = {}
  }

  user.journal[date].poids = valeur

  await user.save()
  res.json({ message: 'Poids du jour sauvegardé.', journal: user.journal[date] })
})



module.exports = router
