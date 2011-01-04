/*
 *
 * NextImage:
 * {
 *  type : 'cache'
 *  payload : {
 *    action : 'nextImage',
 *    data : 'link'  
 *   }
 * }
 *
 *
 * CACHE:
 * {
 *  type : 'cache'
 *  payload : {
 *    action : 'init',
 *    data : [
 *      'link1',
 *      'link2',
 *      'link3',
 *      'link4',
 *    ]
 *   }
 * }
 */

var Fs = require('fs');
var Mongoose = require('mongoose').Mongoose;
var PATH = 'content/';
exports.createCache = function (imageFile, log) {

  log.info('connecting to Mongodb');
  db = Mongoose.connect('mongodb://localhost/bucket');

  log.info('loading Image Model');
  require('../models/image');
  ImageModel = db.model('Image');
  var imgCache = [];

  return {

    nextImage: function nextimage(callback) {
      var nextImage = ImageModel.getRandom(function (image) {

        nextImage = image.path.split('/').pop() // TODO make this cool
        if (imgCache.length > 4) {
          imgCache.shift();
        }
        imgCache.push(nextImage);
        callback ( { type: 'cache', payload : { action :'nextImage', data: PATH + nextImage}} ) ;
      });
    },

    cache: function cache() {
      var cachedItems = imgCache.map(function (image) {
          return PATH + image;
        });
      return { type: 'cache', payload : { action :'init', data: cachedItems }};

    }

  };

};
