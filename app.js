'use strict'

//Cargar módulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//ejecutar express (http)
var app = express();

//cargar ficheros de rutas
var article_routes = require('./routes/article');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//añadir prefijos a rutas / cargar rutas
app.use('/api', article_routes);

//Ruta o metodo de prueba
/*
app.get('/probando', function(req,res){
    return res.status(200).send({
        curso: 'Master en javascript'
    });
});
*/
//exportar modulo (fichero actual)
module.exports = app;