var express = require('express');
var axios = require('axios');
var router = express.Router();
var db = require('../database/config');
var conect_email = require('../config/email');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user){
    return res.redirect('/signin');
  }
  res.render('contact', { title: 'Pagina Principal', recaptchaKey: process.env.recaptchaKey});
});

router.post('/crear', async function(req, res) {
  var {email, name, comment} = req.body;
  var secret = process.env.secretRecaptcha;
  var recaptcha = req.body['g-recaptcha-response'];
  var ip = req.ip.split(':')[req.ip.split(':').length-1];
  var now= new Date();
  var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour:'numeric', minute:'numeric', second:'numeric'};
  var date = now.toLocaleDateString('es-VE', options)
  var url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptcha}&remoteip=${ip}`;
  var {data} = await axios.post(url);
  
  // Validacion de capcha
  if(!data.success){
    console.log("no selecciono el capcha");
    let data_contact =  {
      email,
      name,
      comment,
      message: 'Seleccione el capcha'
    }
    return res.redirect('/contactos');
    
  }
  // Registrar los contactos en la db
  var sql = 'INSERT INTO contact (email, name, comment, ip, date) VALUES (?,?,?,?,?)';
  db.run(sql, [email,name,comment,ip,date]);

  let userEmail = process.env.userEmail;
  // Enviar informacion de contacto registrado por email
  let info = await conect_email.sendMail({
    from: `"Fred Foo 👻" <${userEmail}>`, // sender address
    to: `${userEmail}`,
    subject: "Contacto Creado ✔",
    text: `Hello world? ${email} ${name} ${comment}`,
    html: `<b>Hello world? ${email} ${name} ${comment}</b>`,
    
  });

  res.redirect('/contactos');

  });
  router.get('/list', function(req, res) {
    var sql = "select * from contact"
    var params = []
    db.all(sql, params, (err, rows) => {
      if (err) {
        res.status(400).json({"error":err.message});
        return;
      }
      res.json({
        "message":"success",
        "data":rows
      })
      console.log(" db.all(sql, params, (err, rows) => {")
    });

  });


module.exports = router;
