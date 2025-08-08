// server/models/User.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  poids: {
    type: Object, // Format : { 'yyyy-mm-dd': poids }
    default: {}
  },
  journal: {
    type: Object, // Format : { 'yyyy-mm-dd': { apports, dépenses, séance... } }
    default: {}
  },
  profil: {
    poids: Number,
    taille: Number,
    age: Number,
    sexe: String,
    activite: Number,
    objectifPoids: Number,
  }
})




// 🔐 Méthode d'instance pour comparer le mot de passe fourni au hash
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
