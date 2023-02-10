var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/myapp', (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Conexion exitosa")
    }
});

module.exports = db;