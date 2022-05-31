
const image_rc = /R(\d+)_C(\d+)/i;

var cacheImage = function(image, scale){
	var cached_canvas = document.createElement('canvas');
	cached_canvas.width = image.width * scale;
	cached_canvas.height = image.height * scale;
	var cached_ctx = cached_canvas.getContext("2d");
	cached_ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, cached_canvas.width, cached_canvas.height);
	return cached_canvas;
};

var cacheImageMipMap = function(image, max_scale_coeff, levels){
	var mipmap = [];
	image = cacheImage(image, max_scale_coeff);
	mipmap.push(image);
	if (levels > 1) {
		var sz = levels - 1;
		for (var i = 0; i < sz; i++){
			image = cacheImage(image, 0.5);
			mipmap.push(image);
		}
	}
	return mipmap;
};
//
function LoadMAP(load_images, mipmap_levels_cnt, end_loading_callback) {
	//console.log("begin of LoadMAP");
	var map_rows = 0;
	var map_columns = 0;
	var max_scale_coeff = undefined;
	const max_zoom = 5.0;
	const max_definition_w = 1920;
	const max_definition_h = 1080;

	//console.log("run RowColumn calculation");
	load_images.each(function() {
		var res = this.src.match(image_rc);
		if (res) {
			var row = Number(res[1]) + 1, 
				column = Number(res[2]) + 1;
			if (row > map_rows) map_rows = row;
			if (column > map_columns) map_columns = column;
		}
	});
	//console.log("RowColumn calculated");

	var c_images = [];
	c_images.length = load_images.length;
	var loaded_images = [];  // needs for fix on firefox

	//console.log("run Caching images");
	load_images.on("load", function () {
		var res = this.src.match(image_rc);

		var column = Number(res[2]);
		var row = map_rows - 1 - Number(res[1]);  // vertical inversion of rows
		var item_index = map_columns * row + column;

		if (max_scale_coeff === undefined) {
			var m_w = max_zoom * max_definition_w;
			var m_h = max_zoom * max_definition_h;
			var i_w = map_columns * this.width;
			var i_h = map_rows * this.height;
			if (i_w > m_w || i_h > m_h) {
				max_scale_coeff = Math.min(m_w / i_w, m_h / i_h);  // Math.max
			} else {
				max_scale_coeff = 1;
			}
		}

		if (loaded_images.indexOf(item_index) == -1) {  // fix for firefox
			c_images[item_index] = cacheImageMipMap(this, max_scale_coeff,  mipmap_levels_cnt);
			loaded_images.push(item_index);
			console.log("image " + loaded_images.length + " " + res[0] + " loaded");
			if (load_images.length == loaded_images.length) {
				console.log("ALL images " + load_images.length + " loaded");
				loaded_images = null;  // clean memory
				var image = c_images[0][0];
				end_loading_callback(c_images, image.width, image.height, map_rows, map_columns);
			}
		}
	}).each(function() {
		// attempt to defeat cases where load event does not fire on cached images
		if (this.complete) $(this).trigger("load");
	});
	//console.log("end of LoadMAP");
};

/*
function MapLoader(load_images, cached_images, mipmap_levels_cnt, end_loading_callback) {
	var self = this;
	this.map_rows = 0;
	this.map_columns = 0;
	this.cached_images = cached_images;
	this.mipmap_levels_cnt = mipmap_levels_cnt;

	this.loaded_images = [];
	this.all_images_count = load_images.length;

	this.cached_images.length = this.all_images_count;
	//this.ei_callback = each_item_callback;
	this.el_callback = end_loading_callback;

	this.updateMapSize(load_images);
	this.runLoader(load_images);

	load_images.each(function() {
		//self.updateRowColumn(this); 
		let res = this.src.match(image_rc);
		if (res) {
			let row = Number(res[1]) + 1, 
				column = Number(res[2]) + 1;
			if (row > self.map_rows) self.map_rows = row;
			if (column > self.map_columns) self.map_columns = column;
		}
	});
	load_images.on("load", function () {
		//self.loadImage(this);
		let res = this.src.match(image_rc);

		let column = Number(res[2]);
		let row = self.map_rows - 1 - Number(res[1]);  // vertical inversion of rows
		let item_index = self.map_columns * row + column;

		if (self.loaded_images.indexOf(item_index) == -1) {  // fix for firefox
			self.cached_images[item_index] = cacheImageMipMap(this, 1, self.mipmap_levels_cnt);
			self.loaded_images.push(item_index);
			console.log("image " + self.loaded_images.length + " " + res[0] + " loaded");
			if (self.all_images_count == self.loaded_images.length) {
				console.log("ALL images " + self.all_images_count + " loaded");
				self.el_callback();
			}
		}
	}).each(function() {
		// attempt to defeat cases where load event does not fire on cached images
		if (this.complete) $(this).trigger("load");
	});
}

MapLoader.prototype.getMapSize = function () {
	return {rows: this.map_rows, columns: this.map_columns};
}

MapLoader.prototype.updateMapSize = function (images) {
	var self = this;
	images.each(function() { self.updateRowColumn(this); });
}

MapLoader.prototype.runLoader = function (images) {
	var self = this;
	images.on("load", function () {
		self.loadImage(this);
	}).each(function() {
		// attempt to defeat cases where load event does not fire on cached images
		if (this.complete) $(this).trigger("load");
	});
}

MapLoader.prototype.destroy = function () {
	delete this.loaded_images;
	this.loaded_images = null;  // clean memory
	this.all_images_count = null;
}

MapLoader.prototype.updateRowColumn = function (image_obj) {
	let res = image_obj.src.match(image_rc);
	if (res) {
		let row = Number(res[1]) + 1, 
			column = Number(res[2]) + 1;
		if (row > this.map_rows) this.map_rows = row;
		if (column > this.map_columns) this.map_columns = column;
	}
}

MapLoader.prototype.loadImage = function (image_obj) {
	let res = image_obj.src.match(image_rc);

	let column = Number(res[2]);
	let row = this.map_rows - 1 - Number(res[1]);  // vertical inversion of rows
	let item_index = this.map_columns * row + column;

	if (this.loaded_images.indexOf(item_index) == -1) {  // fix for firefox
		this.cached_images[item_index] = cacheImageMipMap(image_obj, this.mipmap_levels_cnt);
		this.loaded_images.push(item_index);
		console.log("image " + this.loaded_images.length + " " + res[0] + " loaded");
		if (this.all_images_count == this.loaded_images.length) {
			console.log("ALL images " + this.all_images_count + " loaded");
			this.el_callback();
		}
	}
}
*/


var initMap = function(map_container, config, onDoneCallback) {

	/ * creating background_map canvas for drawing map tiles * /
	/* "<canvas id='background_map'>Your browser does not support HTML5 Canvas.</canvas>" */
	var canvas = document.createElement("canvas");
	canvas.setAttribute("id", "background_map");
	canvas.innerHTML = "Your browser does not support HTML5 Canvas.";
	map_container.appendChild(canvas);

	var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled       = false;
ctx.mozImageSmoothingEnabled    = false;
ctx.msImageSmoothingEnabled     = false;
ctx.oImageSmoothingEnabled      = false;

	/ * creating backbuffer canvas * /
	var backbuffer_canvas = document.createElement('canvas');
	var backbuffer_context = backbuffer_canvas.getContext('2d');
backbuffer_context.imageSmoothingEnabled       = false;
backbuffer_context.mozImageSmoothingEnabled    = false;
backbuffer_context.msImageSmoothingEnabled     = false;
backbuffer_context.oImageSmoothingEnabled      = false;

	console.log("ready1");
	var needRedraw = false;

	var map_rows = 0;
	var map_columns = 0;
	//var tranX = 0, tranY = 0;
	var posX = 0, posY = 0;
	var corrX, corrY;
	var scale = 1.0;
	var mapScaler = 1;

	const mipmap_levels_cnt = 4;
	var cached_images = [];
	var cached_images_cnt = 0;

	var originalTileWidth, originalTileHeight;
	var imageAspect;
	var correctedImageWidth, correctedImageHeight;

	var updateBackbuffer = function(){
		// console.log("updateBackbuffer", !needRedraw);
		if (needRedraw) return;
		var canvasWidth = canvas.width;  //scrollWidth;
		var canvasHeight = canvas.height;  //scrollHeight;
		var canvasWidthSc = canvasWidth * scale;
		var canvasHeightSc = canvasHeight * scale;
		var canvasAspect = canvasWidth / canvasHeight;

		if (imageAspect > canvasAspect){
			correctedImageWidth = canvasWidthSc;
			correctedImageHeight = canvasWidthSc / imageAspect;
		} else {
			correctedImageWidth = canvasHeightSc * imageAspect;
			correctedImageHeight = canvasHeightSc;
		}
		var tileImageWidth = Math.round(correctedImageWidth / map_columns);
		var tileImageHeight = Math.round(correctedImageHeight / map_rows);
		correctedImageWidth = map_columns * tileImageWidth;
		correctedImageHeight = map_rows * tileImageHeight;

		// var tempCanvasWidth = Math.min(correctedImageWidth, canvasWidth);
		// var tempCanvasHeight = Math.min(correctedImageHeight, canvasHeight);
		corrX = Math.floor((canvasWidth - correctedImageWidth) * 0.5 + posX);
		corrY = Math.floor((canvasHeight - correctedImageHeight) * 0.5 + posY);

		backbuffer_canvas.width = canvasWidth;
		backbuffer_canvas.height = canvasHeight;

		var coeff = tileImageWidth / originalTileWidth;
		var mipmap_index = 0;
		var c_mipmap = 1.0 / (1 << (mipmap_levels_cnt - 1));
		for (var i = mipmap_levels_cnt - 1; i >= 0; i--){
			if (coeff < c_mipmap) {
				mipmap_index = i;
				break;
			}
			c_mipmap *= 2;
		}

		if (cached_images_cnt == 1) {
			let image = cached_images[0][mipmap_index];
			backbuffer_context.drawImage(image, 0, 0, image.width, image.height, corrX, corrY, tileImageWidth, tileImageHeight);
		} else {
			var min_col = Math.floor((-corrX) / tileImageWidth);
			var max_col = Math.ceil((-corrX + canvasWidth) / tileImageWidth)
			var min_row = Math.floor((-corrY) / tileImageHeight);
			var max_row = Math.ceil((-corrY + canvasHeight) / tileImageHeight)

			for (var item_index = 0; item_index < cached_images_cnt; item_index++){
				let column = item_index % map_columns;
				if (column >= min_col && column < max_col) {
					let row = (item_index - column) / map_columns;  // vertical inversion of rows
					if (row >= min_row && row < max_row) {
						tileX = column * tileImageWidth + corrX;
						tileY = row * tileImageHeight + corrY;
						let image = cached_images[item_index][mipmap_index];
						backbuffer_context.drawImage(image, 0, 0, image.width, image.height, tileX, tileY, tileImageWidth, tileImageHeight);
					}
				}
			}
		}

		if (config.outline.length > 0 && config.showOutline) {
			// lines
			backbuffer_context.setLineDash([]);
			backbuffer_context.lineCap     = 'square';
			backbuffer_context.lineWidth   = 2;
			backbuffer_context.strokeStyle = "blue";
			backbuffer_context.beginPath();
			
			var pt = config.outline[0];
			var posOnDraw = config.getOnScreenPosition(pt.x, pt.y);
			backbuffer_context.moveTo(posOnDraw.x, posOnDraw.y);
			for (var i = 1; i < config.outline.length; i++) {
				pt = config.outline[i];
				posOnDraw = config.getOnScreenPosition(pt.x, pt.y);
				backbuffer_context.lineTo(posOnDraw.x, posOnDraw.y);
			}
			
			backbuffer_context.stroke();

			// points
			backbuffer_context.setLineDash([0, 20]);
			backbuffer_context.lineCap     = 'round';
			backbuffer_context.lineWidth   = 7;
			backbuffer_context.strokeStyle = "red";
			backbuffer_context.beginPath();

			var pt = config.outline[0];
			var posOnDraw = config.getOnScreenPosition(pt.x, pt.y);
			backbuffer_context.moveTo(posOnDraw.x, posOnDraw.y);
			for (var i = 1; i < config.outline.length; i++) {
				pt = config.outline[i];
				posOnDraw = config.getOnScreenPosition(pt.x, pt.y);
				backbuffer_context.lineTo(posOnDraw.x, posOnDraw.y);
			}
			backbuffer_context.stroke();
		}

		needRedraw = true;
		//console.log("end updateBackbuffer");
	};

	var allImagesLoaded = function (images, tile_width, tile_height, rows, columns) {
		// console.log("allImagesLoaded");
		originalTileWidth = tile_width;
		originalTileHeight = tile_height;
		imageAspect = (tile_width * columns) / (tile_height * rows);
		cached_images = images;
		cached_images_cnt = images.length;
		map_rows = rows;
		map_columns = columns;

		// remove images from memory
		$("div#map .tile img").remove();

		onDoneCallback();
		render();
	}

	var updateCanvasSize = function () {
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;

		if (imageAspect > canvas.width / canvas.height){
			mapScaler = (originalTileWidth * map_columns) / canvas.width;
		} else {
			mapScaler = (originalTileHeight * map_rows) / canvas.height;
		}
	};

	var updateMap = function(){
		updateCanvasSize();
		updateBackbuffer();
	}
	config.showOutline = false;
	config.updateMap = updateMap;  // TEMP edition of resizing logic
	//config.updateBackbuffer = updateBackbuffer;
	config.updateScale = function (zoom) {
		var new_scale = zoom * mapScaler + 1;
		posX *= new_scale / scale;
		posY *= new_scale / scale;
		scale = new_scale;
		updateBackbuffer();
	};
	config.translateMap = function (trX, trY) {
		posX += trX;
		posY += trY;
		updateBackbuffer();
	}
	config.resetMapPosition = function () {
		posX = 0;
		posY = 0;
	}
	config.getOnMapPosition = function (on_screen_x, on_screen_y) {
		return {x: (on_screen_x - corrX) / correctedImageWidth, y: (on_screen_y - corrY) / correctedImageHeight};
	}
	config.getOnScreenPosition = function (on_map_x, on_map_y) {
		return {x: on_map_x * correctedImageWidth + corrX, y: on_map_y * correctedImageHeight + corrY};
	}
	config.getMapSize = function () {
		return {width: correctedImageWidth, height: correctedImageHeight};
	}

	LoadMAP($("div#map .tile img"), mipmap_levels_cnt, allImagesLoaded);
	console.log("ready2");

	// Drawing map with offscreen pre-rendering
	function render() {
		if (needRedraw){
			canvas.width = canvas.width;  // clear context
			ctx.drawImage(backbuffer_canvas, 0, 0, backbuffer_canvas.width, backbuffer_canvas.height, 0, 0, backbuffer_canvas.width, backbuffer_canvas.height);
			needRedraw = false;
		}
		requestAnimationFrame(render);
	}
};
