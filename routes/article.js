'use strict'

var express = require('express');
var ArticuleController = require('../controllers/article');

var router = express.Router();

var multipart = require('connect-multiparty');
const { Router } = require('express');
var md_upload = multipart({uploadDir: './upload/articles'});
//Rutas de prueba
router.post('/datos-curso', ArticuleController.datosCurso); 
router.get('/test-de-controlador', ArticuleController.test);

//Rutas utiles
router.post('/save',ArticuleController.save); 
router.get('/articles/:last?',ArticuleController.getArticles);
router.get('/article/:id',ArticuleController.getArticle);
router.put('/article/:id',ArticuleController.update);
router.delete('/article/:id',ArticuleController.delete);
router.post('/upload-image/:id',md_upload, ArticuleController.upload);
router.get('/get-image/:image', ArticuleController.getImage);
router.get('/search/:search', ArticuleController.search); 
module.exports = router;