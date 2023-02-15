var express = require('express');
var bcrypt = require('bcryptjs');
var axios = require('axios');
const {google} = require('googleapis');
var db = require('../database/config');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'csv' });
});
router.get('/signin', function(req, res) {
  res.render('signin', { title: 'signin' });
});
router.get('/singup', function(req, res) {
  res.render('singup', { title: 'singup' });
});
router.get('/curriculo', function(req, res) {
  res.render('index', { title: 'cv' });
});
router.post('/validate-account',  function(req, res) {
  var {email, password} = req.body;
  var sql = 'SELECT * FROM  user WHERE email = ?';
  var params = [email];

  db.get(sql, params, async (err, row) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    if(row){
      var encrypted_password = row.password;
      var result_compare =  await bcrypt.compare(password, encrypted_password)

      if(result_compare){
        req.session.user = true;
        return res.redirect('/contactos');

      }      
    }
    res.redirect('/signin');
    
  });
});
router.post('/account-created', async function(req, res) {
  console.log(req.body)
  const rond = 10;
  var {name, surname, email, password} = req.body;
  
  password = await bcrypt.hash(password, rond);
  console.log("password", password);

  var sql = 'INSERT INTO user (name, surname, email, password) VALUES (?,?,?,?)';
  db.run(sql, [name, surname, email, password]);
  res.redirect('/signin');
});

router.post('/singin-ggole', async function(req, res) {
  req.session.user = true;
  return res.redirect('/contactos');
});


module.exports = router;
