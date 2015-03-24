// == Image loader =============================================================

var ImageLoader = function() {
}

ImageLoader.prototype.load = function (canvas, imageUrl, onLoad) {
  var image = new Image();
  image.onload = function() {
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    console.log('Loaded image into ' + canvas);

    // Perform callback
    onLoad();
  };

  image.src = imageUrl;
};


// == Pixel ====================================================================

var Pixel = function(r, g, b, a) {
  Object.getPrototypeOf(Pixel.prototype).constructor.call(this);

  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

Pixel.prototype.constructor = Pixel;
Pixel.prototype.r = 0;
Pixel.prototype.g = 0;
Pixel.prototype.b = 0;
Pixel.prototype.a = 0;
Pixel.prototype.toGrayscale = function () {
  var g = (0.299 * this.r) + (0.587 * this.g) + (0.114 * this.b);
  return new Pixel(g, g, g, this.a);
};
Pixel.prototype.invert = function () {
  return new Pixel(
    255 - this.r,
    255 - this.g,
    255 - this.b,
    this.a
  );
};


// == Image filters ============================================================

var ImageFilter = function() {
};

/**
 * Red    0
 * Green  1
 * Blue   2
 * Alpha  3
 */
ImageFilter.prototype.channelQuantity = 4; // This data probably got to be retrieved from image
ImageFilter.prototype.apply = function (canvas, onComplete) {
  // TODO:Implement filter here...
};

ImageFilter.prototype.constructor = ImageFilter;
ImageFilter.prototype.getPixelIndex = function (row, column, width) {
  return (row * width * this.channelQuantity) + column * this.channelQuantity;
};


// == Green filter ==

var GreenPixelImageFilter = function() {
  Object.getPrototypeOf(GreenPixelImageFilter.prototype).constructor.call(this);
};

GreenPixelImageFilter.prototype = Object.create(ImageFilter.prototype);
GreenPixelImageFilter.prototype.constructor = GreenPixelImageFilter;
GreenPixelImageFilter.prototype.apply = function (canvas, onComplete) {
  Object.getPrototypeOf(GreenPixelImageFilter.prototype).apply.call(this, canvas);

  // Get image data
  var context = canvas.getContext('2d');
  var image = context.getImageData(0, 0, canvas.width, canvas.height);

  var data = image.data;
  var length = data.length;
  var channelQuantity = this.channelQuantity;

  // Filter data
  for (var i = 0; i < length; i += channelQuantity)
  {
    data[i]     = 0; // red
    data[i + 2] = 0; // blue
  }

  // Update context image with filtered data
  context.putImageData(image, 0, 0);

  // Perform onComplete callback, if provided
  if (onComplete != null)
  {
    onComplete();
  }
}


// == Grayscale filter ==

var GrayscaleImageFilter = function() {
  Object.getPrototypeOf(GrayscaleImageFilter.prototype).constructor.call(this);
};

GrayscaleImageFilter.prototype = Object.create(ImageFilter.prototype);
GrayscaleImageFilter.prototype.constructor = GrayscaleImageFilter;
GrayscaleImageFilter.prototype.apply = function (canvas, onComplete) {
  Object.getPrototypeOf(GreenPixelImageFilter.prototype).apply.call(this, canvas);

  // Get image data
  var context = canvas.getContext('2d');
  var image = context.getImageData(0, 0, canvas.width, canvas.height);
  var data = image.data;
  var length = data.length;
  var channelQuantity = this.channelQuantity;
  var grayscalePixel;

  // Filter data
  for (var i = 0; i < length; i += channelQuantity)
  {
    grayscalePixel = new Pixel(data[i], data[i+1], data[i+2], 255).toGrayscale();
    data[i] = grayscalePixel.r;
    data[i+1] = grayscalePixel.g;
    data[i+2] = grayscalePixel.b;
  }

  // Update context image with filtered data
  context.putImageData(image, 0, 0);

  // Perform onComplete callback, if provided
  if (onComplete != null)
  {
    onComplete();
  }
};


// == Invert ==

var InvertImageFilter = function() {
  Object.getPrototypeOf(InvertImageFilter.prototype).constructor.call(this);
};

InvertImageFilter.prototype = Object.create(ImageFilter.prototype);
InvertImageFilter.prototype.constructor = InvertImageFilter;
InvertImageFilter.prototype.apply = function (canvas, onComplete) {
  Object.getPrototypeOf(InvertImageFilter.prototype).apply.call(this, canvas);

  // Get image data
  var context = canvas.getContext('2d');
  var image = context.getImageData(0, 0, canvas.width, canvas.height);
  var data = image.data;
  var length = data.length;
  var channelQuantity = this.channelQuantity;
  var invertedPixel;

  // Filter data
  for (var i = 0; i < length; i += channelQuantity)
  {
    invertedPixel = new Pixel(data[i], data[i+1], data[i+2], 255).invert();
    data[i]   = invertedPixel.r;
    data[i+1] = invertedPixel.g;
    data[i+2] = invertedPixel.b;
  }

  // Update image data with filtered data
  context.putImageData(image, 0, 0);

  // Perform onCompleteCallback, if defined
  if (onComplete != null)
  {
    onComplete();
  }
};


// == Singletons ===============================================================

var imageLoader = new ImageLoader();
// var imageFilter = new ImageFilter();
var greenPixelImageFilter = new GreenPixelImageFilter();
var grayscaleImageFilter = new GrayscaleImageFilter();
var invertImageFilter = new InvertImageFilter();
