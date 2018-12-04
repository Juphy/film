const {
  success,
  failed,
  authFailed
} = require('./base.js');

const {uploader} = require('../lib/uploader.js')
const config = require('../config')

// 上传图片
const image = async (ctx, next) => {
  ctx.req.bucketType = config.cos.imageBucket
  ctx.req.maxSize = 1
  ctx.req.mimetypes = ['image/jpeg', 'image/jp2', 'image/jpm', 'image/jpx', 'image/gif', 'image/bmp', 'image/png', 'audio/mpeg']
  const data = await uploader(ctx.req);

  ctx.body = success(data, '上传图片成功');

};

// 上传视频
const video = async (ctx, next) => {

  ctx.req.bucketType = config.cos.videoBucket
  ctx.req.maxSize = 2
  ctx.req.mimetypes = ['audio/mpeg', 'audio/mp3', 'audio/m4a','video/mp4']
  const data = await uploader(ctx.req);
  ctx.body = success(data, '上传视频成功');

};

//上传文件
const file = async (ctx, next) => {
  ctx.req.bucketType = config.cos.fileBucket
  ctx.req.maxSize = 5
  ctx.req.mimetypes = ['application/pdf']
  const data = await uploader(ctx.req);
  ctx.body = success(data, '上传文件成功');
}







module.exports = {
  pub:{
    image,
    video,
    file
  }
  
}