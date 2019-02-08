const express = require('express');
const app = express();

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

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

//Hacer un expres que tenga 2 llamdas post, el server y poner "/alumnos" y regrese un json con una lista de alumnos
// y la segunda "/alumnos/id" o "/alumnos/name" y regrese solo ese alumno