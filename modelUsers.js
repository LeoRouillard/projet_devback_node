const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    prenom : String,
    nom : String,
    civilite : Number,
    email : String,
    dateNaissance : Date,
    image : String
});

module.exports = mongoose.model('Users', usersSchema);