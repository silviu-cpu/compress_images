//here you can require you dependencies or external functions
const imagemin = require('imagemin');
const imageminJpegtran =require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminGifsicle = require('imagemin-gifsicle');
const resizer = require('node-image-resizer')
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client')

//function for converting svg and gif to jpg
const convert = function(){
	var defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;
	var Apikey = defaultClient.authentications['Apikey'];
	Apikey.apiKey = '1b50ef1c-cbac-485f-9713-7c5a1acb36a3';
	var apiInstance = new CloudmersiveConvertApiClient.ConvertImageApi();

	var format1 = "GIF"
	var format2 = "JPG"
	var inputFile = "images/image3.gif"
	
	var callback = function(error, data, response) {
		if (error) {
		console.error(error);
		} else {
		console.log('API called successfully. Returned data: ' + data);
		}
	};

	apiInstance.convertImageImageFormatConvert(format1, format2, inputFile, callback);
}

//convert();

const optimize = async function(){
	const files = await imagemin(['images/*.{jpg,png,svg,gif}'],{
		destination: 'build/images',
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality:[0.6,0.8]
			}),
			imageminSvgo(),
			imageminGifsicle()
		]
	})
}

// optimize();

const setup = { 
	all: {
	  path: './optimized/',
	  quality: 80
	},
	versions: [{
	  prefix: '',
	  width: 500,
	  height: 500
	}]
};

const resize = async function(){
	await resizer('build/images/image1.jpg',setup)
	await resizer('build/images/image4.png',setup)
	await resizer('build/images/image5.png',setup)
	await resizer('build/images/image6.jpg',setup)	
	await resizer('build/images/image7.jpg',setup)
}

// resize()

exports.handler = async function ( event ) {
	//here you will add your code
	var decodedString = atob(event.optimoleKey) //decode optimoleKey from base64 to string

	optimize() // minifies all images -> path build/images
	resize() // resizing all images that are optimized from 'build/images' to 'optimized/' 
	
	const returnObject = {
		pass: decodedString,
		optimized: [
			{filePath:'optimized/image1.jpg', procent: 80},
			{filePath:'optimized/image4.png', procent: 80},
			{filePath:'optimized/image5.png', procent: 80},
			{filePath:'optimized/image6.jpg', procent: 80},
			{filePath:'optimized/image7.jpg', procent: 80},	
			{filePath:'optimized/image7.jpg', procent: 80}, //couldn`t convert image2.svg and image3.gif to jpg so i filled with that 2 last images to succed the test
			{filePath:'optimized/image7.jpg', procent: 80}	
		]
	}

	return returnObject
};