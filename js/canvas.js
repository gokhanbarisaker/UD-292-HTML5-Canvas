var ImageLoader = function() {
  this.load = function (canvas, imageUrl, onLoad) {
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

  console.log('Created image loader');
}

var imageLoader = new ImageLoader();
