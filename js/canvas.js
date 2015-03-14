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
  var grayscale = 0;

  // Filter data
  for (var i = 0; i < length; i += channelQuantity)
  {
    grayscale = this.convertGrayscale(data[i], data[i+1], data[i+2]);
    data[i] = grayscale;
    data[i+1] = grayscale;
    data[i+2] = grayscale;
  }

  // Update context image with filtered data
  context.putImageData(image, 0, 0);

  // Perform onComplete callback, if provided
  if (onComplete != null)
  {
    onComplete();
  }
};
GrayscaleImageFilter.prototype.convertGrayscale = function (red, green, blue) {
  return (0.299 * red) + (0.587 * green) + (0.114 * blue);
};


// == Singletons ===============================================================

var imageLoader = new ImageLoader();
// var imageFilter = new ImageFilter();
var greenPixelImageFilter = new GreenPixelImageFilter();
var grayscaleImageFilter = new GrayscaleImageFilter();
