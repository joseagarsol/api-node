'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');

var Article = require('../models/article');

var controller = {
    datosCurso: (req,res) => {
        //Ruta o metodo de prueba
        app.get('/probando', function(req,res){
            return res.status(200).send({
                curso: 'Master en javascript'
            });
        });
    },
    test: (req,res) => {
        return res.status(200).send({
            message: 'Soy el metodo test de mi controlador de articulos'
        });
    },
    save: (req,res) => {
        //recoger los parámetros por post
        var params = req.body;
          
        //validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);



        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_title && validate_content){
            //Crear el objeto a guardar
            var article = new Article();

            //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //Guardar en articulos
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    articleStored
                });

            });

        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
    },
     getArticles: (req,res) => {
        
        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined){
            query.limit(5);
        }
        //Find
        query.sort('-_id').exec((err,articles) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    messsage: 'Error al devolver los articulos'
                });    
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    messsage: 'No hay articulos para mostrar'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },
    getArticle: (req,res) => {

        //recoger el id de la url
        var articleId = req.params.id;

        //comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                messsage: 'No existe el articulo'
            });    
        }

        //buscar el articulo
        Article.findById(articleId,(err, article) => {
            if(!article || err){
                return res.status(404).send({
                    status: 'error',
                    messsage: 'No existe el articulo'
                });
            }

            //devolver una respuesta
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },
    update: (req,res) => {
        
        //recoger el id del articulo por la url

        var articleId = req.params.id;
        //recoger los datos que llegan por put
        var params = req.body;

        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message: 'Nos faltan datos por enviar'
            });    
        }

        if(validate_title && validate_content){
            //find and update
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) => {
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'error al actualizar'
                    });        
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });
        }

    },
    delete: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id;
        //find and delete
        Article.findOneAndDelete({_id: articleId}, (err,articleRemoved)=> {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar'
                });        
            }
            if(!articleRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo, posiblemente no exista'
                });
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            });
        });
    },
    upload: (req,res) => {
        //configurar el modulo del connect multiparty router/article.js

        //recoger el fichero de la peticion
        var file_name = 'Imagen no subida...';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\')

        //********ADVERTENCIA EN LINUX O MAC****************
        //var file_split = file_path.split('\\')
        
        //Nombre del archivo
        var file_name = file_split[2];
        
        //extension del fichero
        var extension_split = file_name.split('.');
        var file_ext = extension_split[1];

        //comprobar la extension, solo imagenes, si no es valida borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'la extension de la imagen no es válida'
                }); 
            });

        }else{
            //si todo es valido, sacamos el id por la url
            var articleId = req.params.id;
            //buscar el articulo, asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                
                if(err ||!articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'error al guardar la imagen del articulo'
                    });    
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                }); 
            });           
        }

    },

    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        }); 
    },
    search: (req,res) => {
        //sacar el string a buscar
        var searchString = req.params.search;

        //find or 
        Article.find({ "$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'error en la peticion'
                });
            }

            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con lo que buscas'
                });
            }
            
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }

}; //end controller

module.exports = controller;