const express = require('express');
const bodyParser =  require ('body-parser');
const app = express();
var fs = require("fs");

//DB Handler
var db = {
  //Indicar BD oa brir conexion
  initDB : function(){
    //alternativa 1
    //this.alumnos = require("./alumnos.json");

    //alternativa 2
    var contents = fs.readFileSync("./alumnos.json");
    this.alumnos = JSON.parse(contents); 
  },

  //Busqueda Alumno metodo 1 no tan optimizado
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
  },

  //Busqueda Alumno metodo 2 optimizado
  getAlumnoBy2 : function(filter,value){
    console.log("filtro: " + filter + ", valor: " + value);
    var selected = filter + " " + value  +" no encontrado";
    for(var i=0;i< Object.keys(this.alumnos).length;i++)
    {
      var alumno = this.alumnos[i];
      console.log(alumno);
      console.log(alumno[filter]);
      if(alumno[filter] == value){
        selected = alumno;
        return selected;
      }
    }
    return selected;
  },

  añadeAlumno : function(nomb,clav)
  {
    var msg;
    var aux = {"Nombre":nomb, "clave":clav};
    var existe = false;

    for(var i=0;i< Object.keys(this.alumnos).length;i++)
    {
      var alumno = this.alumnos[i];
      if(alumno.clave == aux.clave)
      {
        existe=true;
        break;
      }
    }

    if(!existe)
    {
      this.alumnos.push(aux);
      var datos = JSON.stringify(this.alumnos, null, 2);
      fs.writeFile('alumnos.json', datos, (err) => {
        if (err) throw err;
        console.log('Se ha agregado el alumno.');
      });
      msg = "Se agrego el alumno " + aux.Nombre + " con clave: " + aux.clave + " revise la lista de alumnos para verificar (localhost:3000/alumnos 'metodo get')";
    }
    else{
      msg = "La clave " + clav + " ya existe por favor introduzca otra";
    }
    return msg;
  },

  guardaNuevo()
  {
    var datos = JSON.stringify(this.alumnos, null, 2);
    fs.writeFile('alumnos.json', datos, (err) => {
      if (err) throw err;
      console.log('Se ha modificado el archivo');
    });
  },

  elimina(alumno)
  {
    for(var i=0;i< Object.keys(this.alumnos).length;i++)
    {
      var aux = this.alumnos[i];
      if(alumno.clave == aux.clave && alumno.nombre == aux.nombre)
      {
        //delete this.alumnos[i];
        this.alumnos.splice(i,1);
        this.guardaNuevo();
        break;
      }
    }
    
  }
}


app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req,res) => {
  res.sendFile("index.html",{ root: "."});
});

app.get('/alumnos',(req,res) => {
  db.initDB();
  res.json(db.alumnos);
});


app.get('/alumnos/clave/:clave',(req,res) => {
  db.initDB();
  var clave = req.params.clave;
  var alumno = db.getAlumnoBy2('clave',clave);
  res.json(alumno);
});

app.get('/alumnos/nombre/:nombre',(req,res) => {
  db.initDB();
  var nombre = req.params.nombre;
  var alumno = db.getAlumnoBy2('Nombre',nombre);
  res.json(alumno);
});

app.post('/alumnos/agrega/:nombre/:clave',(req,res) => {
  db.initDB();
  var clave = req.params.clave;
  var nombre = req.params.nombre;
  var mensaje = db.añadeAlumno(nombre,clave);
  res.json(mensaje);
});

app.post('/agreganuevo',(req,res) => {
  db.initDB();
  var alumno = req.body;
  console.log(alumno);
  db.alumnos.push(alumno);  
  db.guardaNuevo();
  res.json({"status":"OK!"});
});

app.post('/elimina',(req,res) => {
  db.initDB();
  var alumno = req.body;
  console.log(alumno);
  db.elimina(alumno);
  res.json({"status":"OK!"});
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});