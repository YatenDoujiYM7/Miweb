var nodemailer = require("nodemailer");
require('dotenv').config();

// create reusable transporter object using the default SMTP transport
let conect = nodemailer.createTransport({
    host: "imap.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: `${process.env.userEmail}`, // generated ethereal user
        pass: `${process.env.passEmail}`, // generated ethereal password
    },
    
});


module.exports = conect;