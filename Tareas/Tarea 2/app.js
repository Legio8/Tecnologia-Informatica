const express = require('express');
const app = express();
const listaAlumnos = [{Nombre:"Francisco", id:1},{Nombre:"Giovany", id:2},{Nombre:"Adriana", id:3},{Nombre:"Valeria", id:4},{Nombre:"Diana", id:5}];
// app.get('/:name', (req, res) => {
//   console.log(req.params['name']);
//   console.log(req.params.name);
//   res.send('<h3> Hello ' + req.params.name + '</h3>');
// });

app.get('/json',(req,res) => {
  res.json({'name':'Gio'});
});

app.post('/json',(req,res) => {
  res.json({'name':'Maldonado'});
});

app.post('/alumnos',(req,res) => {
  res.json(listaAlumnos);
});

app.post('/alumnos/id/:id',(req,res) => {
  var resultado;

  for(var i = 0; i < listaAlumnos.length;i++)
  {
    if(listaAlumnos[i].id == req.params.id)
    {
      resultado = listaAlumnos[i];
      break;
    }
    else
    {
      resultado = "Id no encontrado";
    }
  }

  res.json(resultado);

});

app.post('/alumnos/nombre/:nombre',(req,res) => {
  var resultado;
  
  for(var i = 0; i < listaAlumnos.length;i++)
  {
    if(listaAlumnos[i].Nombre == req.params.nombre)
    {
      resultado = listaAlumnos[i];
      break;
    }
    else
    {
      resultado = "Nombre no encontrado";
    }
  }

  res.json(resultado);
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
