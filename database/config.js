var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:', (err)=>{
    if(err){
        console.log(err);
    }else{
        db.run(`CREATE TABLE user (
            name text, 
            surname text, 
            email text, 
            password text
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log(err)
            }else{
                // Table just created, creating some rows
                console.log("Base de datos creada")
            }
        });
        
        db.run(`CREATE TABLE contact (
            name text, 
            comment text, 
            email text, 
            ip text,
            date text
            )`,
        (err) => {
            if (err) {
                // Table already created
                console.log(err)
            }else{
                // Table just created, creating some rows
                console.log("Base de datos creada")

            }
        });  
    }
});


module.exports = db;