const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const app = express();

const Users = require('./modelUsers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

mongoose.connect('mongodb://localhost/projet_devback_node', (err) => {
  if (err) { throw err; }
  console.log("Connectée à la base de donnée");
});

app.get('/users', (req, res) => {
    Users.find((err, users) => {
        if(err) { throw err; }
        res.json(users);
    });
});

app.get('/users/:id', (req, res) => {
    Users.findById(req.params.id, (err, user) => {
        if (err) { throw err; }
        res.json(user);
    });
});

app.put('/users/:id', (req, res) => {
    Users.updateOne({_id: req.params.id}, req.body, (err, user) => {
        if(err) { throw err; }
        res.send('Utilisateur modifié');
    });
});

app.delete('/users/:id', (req, res) => {
    Users.findById(req.params.id, (err, user) => {
        if (err) { throw err; }
        Users.deleteOne({_id: req.params.id}, (err, response) => {
            if(err) { throw err; }
            if(fs.existsSync('./uploads/'+user.image)) {
                fs.unlinkSync('./uploads/'+user.image)
            }
            res.send("Utilisateur supprimé");
        });
    });
});

app.post('/users', (req, res) => {
    const user = new Users(req.body);
    if(req.files) {
        const name = Date.now()+req.files.image.name;
        req.files.image.mv('./uploads/'+name);
        user.image = name;
    }
    user.save(err => {
        if(err) { throw err; }
        res.send("Utilisateur ajouté");
    });
});

app.listen(3000);
