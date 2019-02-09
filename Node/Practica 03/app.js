const express = require('express');
const app = express();
const listaAlumnos = [{Nombre:"Francisco", id:1},{Nombre:"Giovany", id:2},{Nombre:"Adriana", id:3},{Nombre:"Valeria", id:4},{Nombre:"Diana", id:5}];

//DB Handler
var db = {
  //Indicar BD oa brir conexion
  initDB : function(){
    //alternativa 1
    //this.alumnos = require("./alumnos.json");

    //alternativa 2
    var fs = require("fs");
    var contents = fs.readFileSync("./alumnos.json");
    this.alumnos = JSON.parse(contents); 
  },

  //Busqueda Alumno
  getAlumnoBy : function(filter,value){
    console.log("filtro: " + filter + "valor: " + value);
    var selected = null;
    this.alumnos.forEach(alumno => {
      console.log(alumno);
      console.log(alumno[filter]);
      if(alumno[filter] == value){
        selected = alumno;
        return selected;
      }      
    });
    return selected;
  }
}

app.get('/alumnos',(req,res) => {
  db.initDB();
  res.json(db.alumnos);
});


app.get('/alumnos/:clave',(req,res) => {
  db.initDB();
  var clave = req.params.clave;
  var alumno = db.getAlumnoBy('clave',clave);
  res.json(alumno);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

//poder agregar un alumno otra llamada con post que va a mandar un objeto json y lo va a agregar a la base de datos