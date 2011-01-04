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
 *      'link5',
 *    ]
 *   }
 * }
 */

var Fs = require('fs');
var Mongoose = require('mongoose').Mongoose;
var PATH = 'content/';
var CACHE_SIZE = 5;
exports.createCache = function (imageFile, log) {

  log.info('connecting to Mongodb');
  db = Mongoose.connect('mongodb://localhost/bucket');

  log.info('loading Image Model');
  require('../models/image');
  ImageModel = db.model('Image');
  var imgCache = [];
  
  var ret = {

    nextImage: function nextimage(callback) {
      var nextImage = ImageModel.getRandom(function (image) {

        nextImage = image.path.split('/').pop(); // TODO make this cool
        if (imgCache.length >= CACHE_SIZE) {
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

    },

    refresh : function refresh () {
      var i = 0;
      for (;i<CACHE_SIZE;i+=1)
      {
        this.nextImage(function (){});
      }
    }

  };
  ret.refresh();
  return ret;

};
