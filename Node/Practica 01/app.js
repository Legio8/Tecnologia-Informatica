var express = require('express');
const math = require('mathjs');

var app = express();

function operacion(n){
    math.sqrt(n)
}

console.log(operacion(85));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

