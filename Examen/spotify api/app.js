const express =  require("express");
var request = require('request'); // "Request" library
const bodyParser = require("body-parser");
var cors = require('cors')
var app = express();

var querystring = require('querystring');

var client_id = ''; // Tu client id
var client_secret = ''; // Tu client_secret
var redirect_uri = ''; // Tu redirect uri


const archivos = require('fs');



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

  guardaInfo : function(infoNueva){
    this.infoArt = infoNueva;
    archivos.writeFileSync('info.json', JSON.stringify(this.infoArt),
      function (error) {
          if (error) {
              console.log('Hubo un error al escribir en el archivo')
              console.log(error);
          }
      });
  }
  
}

app.use(cors());
app.use(express.static('assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',function(req,res){
  res.sendFile("index.html",{ root: "."});
});

// app.get('/inicia', function(req, res) {
//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       var access_token = body.access_token;
//       res.send({
//         'access_token': access_token
//       });
//     }
//   });
// });

app.get('/info',function(req,res){
  db.initDB();
  console.log(db.infoArt);
  res.send(db.infoArt);
});

app.route("/inicia")
  .get( (req, res) => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  })
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
        'Authorization': 'Bearer ' + artista.token
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