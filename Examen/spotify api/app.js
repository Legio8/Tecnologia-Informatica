const express =  require("express");
var request = require('request'); // "Request" library
const bodyParser = require("body-parser");
var app = express();


var client_id = ''; // Your client id
var client_secret = ''; // Your secret
var redirect_uri = ''; // Your redirect uri

const archivos = require('fs');

//OPciones para la conexion que nos regresara el token
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };

  //DB Handler
var db = {
  //Indicar BD o abrir conexion
  initDB: function () {
      var fs = require("fs");
      var contents = fs.readFileSync("./info.json");
      this.infoArt = JSON.parse(contents);
  },

  //Se guarda la informacion que nos regresa la api
  guardaInfo : function(infoNueva){
    this.infoArt = infoNueva;
    archivos.writeFileSync('info.json', JSON.stringify(this.infoArt),
      function (error) {
          if (error) {
              console.log('Hubo un error al escribir en el archivo')
              console.log(error);
          }
      });
  },
  
}
var token = {
  guardaToken : function(token)
  {
    this.tokenFinal = token;
  }
}

app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile("index.html",{ root: "."});
});


//Se manda la informacion leida del archivo
app.get('/info',function(req,res){
  db.initDB();
  console.log(db.infoArt);
  res.send(db.infoArt);
});

//Ruta donde se inicia para que nos de el token la api
app.route("/inicia")
  .get( (req, res) => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        token.guardaToken(access_token);
        res.send({
          'status': '¡Token Generado!'//'access_token': access_token
        });
      }
    });
  })//Metodo post que recibe el nombre del artista a buscar y se hace la consulta a la api sobre el artista
  .post((req,res)=> {
    var artista=req.body;
    console.log(artista);
    var busqueda = {
      url: 'https://api.spotify.com/v1/search',
      qs: {
        q: artista.nombre,
        type: 'artist',
        limit: 1
      },
      headers: {
        'Authorization': 'Bearer ' + token.tokenFinal
      },
      json: true
    };
    request.get(busqueda, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var infoArtista = body;
        //console.log(infoArtista);
        db.guardaInfo(infoArtista);
        res.send({'status': 'OK!'});
      }
      else{
        console.log("Error: "+ response.statusCode + ", " + response.statusMessage);
      }
    });
  });

app.listen(3000,function(){
    console.log("Escuchando en el puerto 3000");
  })