var isInIframe = !(self == top);
var imagesLoaded = false;
var mapCursor;
var allItems;
var imgSize = {width: 0, height: 0}, cImgSize = {width: 0, height: 0};
const partsCnt = 20;
const max_dist = 30;


var fromLocalToReal = function (x_local, y_local) {
	// const waterfallInversed = CursorRecordImageIndex[0] > CursorRecordImageIndex[CursorRecordImageIndex.length - 1];
	// var index = isSbpFile ? x_local / cImgSize.width * numRows : (waterfallInversed ? cImgSize.height - y_local : y_local) / cImgSize.height * numRows;
	var index = isSbpFile ? x_local / cImgSize.width * numRows : y_local / cImgSize.height * numRows;

	var fromIndex = CursorRecordImageIndex[Math.floor(index)];
	//var toIndex = index == fromIndex ? fromIndex + 1 : Math.ceil(index);
	var toIndex = CursorRecordImageIndex[fromIndex + 2];
	var crX, crY, distX, distY;
	crX = CursorRecordX[fromIndex];
	crY = CursorRecordY[fromIndex];
	distX = CursorRecordX[toIndex] - crX;
	distY = CursorRecordY[toIndex] - crY;
	if (index != fromIndex) {
		var c = (toIndex - fromIndex) / (toIndex - index);
		crX += distX / c;
		crY += distY / c;
	}

	if (!isSbpFile) {
		var alpha = Math.atan2(distY, distX) + Math.PI * 0.5;
		
		var v = -alpha * 180 / Math.PI;
		v += (v < 0) ? 360 : 0;
		var inversedX = Math.abs(CursorRecordHeading[fromIndex] - v) > 90;
		var mW = CursorRecordRange[fromIndex] * (x_local / cImgSize.width * 2 - 1.0);
		if (inversedX) {
			// mW = -mW;
			alpha += Math.PI;
		}
		crX += Math.cos(alpha) * mW;
		crY += Math.sin(alpha) * mW;
	}
	// console.log(fromIndex, toIndex, crX, crY);
	return {x: crX, y: crY};
}


var getRealOutline = function () {
	var step = 100;
	var aX = [];
	var aY = [];
	if (isSbpFile) { // horizontal
		var i = 0;
		var crX, crY;
		for (; i < numRows; i+=step) {
			aX.push(CursorRecordX[i]);
			aY.push(CursorRecordY[i]);
		}
		if (i != numRows-1) {
			aX.push(CursorRecordX[numRows-1]);
			aY.push(CursorRecordY[numRows-1]);
		}
	} else { // vertical
		var getRightPoint = function (i, lastI, inv) {
			var crX, crY, dX, dY;
			var index1 = CursorRecordImageIndex[i];
			var index2 = CursorRecordImageIndex[lastI];
			crX = CursorRecordX[index1];
			crY = CursorRecordY[index1];
			if (inv) {
				dX = crX - CursorRecordX[index2];
				dY = crY - CursorRecordY[index2];
			} else {
				dX = CursorRecordX[index2] - crX;
				dY = CursorRecordY[index2] - crY;
			}
			var alpha = Math.atan2(dY, dX) + Math.PI * 0.5;
			var mW = CursorRecordRange[index1];
			crX += Math.cos(alpha) * mW;
			crY += Math.sin(alpha) * mW;
			return {x: crX, y: crY};
		}
		var i = 0;
		var lastI = step;
		var inv = true;
		var pt;
		for (; i < numRows; i+=step) {
			pt = getRightPoint(i, lastI, inv);
			lastI = i;
			if (i == 0)
				inv = false;
			aX.push(pt.x);
			aY.push(pt.y);
		}
		if (i > numRows-1) {
			i = numRows-1;
			pt = getRightPoint(i, lastI, inv);
			aX.push(pt.x);
			aY.push(pt.y);
		}
		i = numRows-1;
		lastI = i - step;
		inv = true;
		for (; i > 0; i-=step) {
			pt = getRightPoint(i, lastI, inv);
			lastI = i;
			if (i == numRows-1)
				inv = false;
			aX.push(pt.x);
			aY.push(pt.y);
		}
		if (i < 0) {
			i = 0;
			pt = getRightPoint(i, lastI, inv);
			aX.push(pt.x);
			aY.push(pt.y);
		}
		aX.push(aX[0]);
		aY.push(aY[0]);
	}
	return {x: aX, y: aY};
}


if (isInIframe) {  // if html loaded in 
	var updateAllItems = function () {
		allItems = [];
		const step = Math.floor(numRows / partsCnt);
		const sigma = 3;
		var pos = 0;
		if (isSbpFile) {
			//var w = imgSize.width;
			for (var i = 0; i < partsCnt; i++) {
				var p1 = fromLocalToReal(pos + sigma, 0.5);
				var p2 = fromLocalToReal(pos + step, 0.5);
				// var a = p1.y - p2.y; // y1 - y2
				// var b = p2.x - p1.x; // x2 - x1
				// var c = p1.x * p2.y - p2.x * p1.y; // x1*y2 - x2*y1
				// var dk = 1 / Math.sqrt(a * a + b * b);
				allItems.push([p1, p2]);
				//allItems.push([p1, p2, a, b, c, dk]);
				//console.log(pos, p1, p2, a, b, c, dk);
				pos += step;
			}
		} else {
			var w = imgSize.width;
			for (var i = 0; i < partsCnt; i++) {
				allItems.push([fromLocalToReal(0, pos + sigma),
							   fromLocalToReal(w, pos + sigma),
							   fromLocalToReal(w, pos + step),
							   fromLocalToReal(0, pos + step)]);
				//console.log(pos, allItems[allItems.length - 1][0], allItems[allItems.length - 1][1], allItems[allItems.length - 1][2], allItems[allItems.length - 1][3]);
				pos += step;
			}
		}
		//console.log(allItems.length);
	}

	var pointOnTriangle = function (ptx, pty, x1, x2, x3, y1, y2, y3) {
		var a = (x1 - ptx) * (y2 - y1) - (x2 - x1) * (y1 - pty);
		var b = (x2 - ptx) * (y3 - y2) - (x3 - x2) * (y2 - pty);
		var c = (x3 - ptx) * (y1 - y3) - (x1 - x3) * (y3 - pty);
		return (a > 0 && b > 0 && c > 0) || (a < 0 && b < 0 && c < 0);  // Point Inside Triagle
		// return (a = 0 && b = 0 && c = 0);  // ON TRIANGLE SIDE
	}
	// need to create optimized version
	var pointInQuadrangle = function (ptx, pty, x1, x2, x3, x4, y1, y2, y3, y4) {
		return pointOnTriangle(ptx, pty, x1, x2, x3, y1, y2, y3) || pointOnTriangle(ptx, pty, x3, x4, x1, y3, y4, y1);
	}

	var setCursorPosition = function (x, y) {
		//var pos_x = (x - topLeftX) / (bottomRightX - topLeftX);
		//var pos_y = (y - topLeftY) / (bottomRightY - topLeftY);
		var pos_x = x;
		var pos_y = y;
		//var posOnDraw = {x: on_map_x * correctedImageWidth + corrX, y: on_map_y * correctedImageHeight + corrY}
		var posOnDraw = fromRealToLocal(pos_x, pos_y);
		if (posOnDraw) {
			if (mapCursor.is(":hidden")){
				mapCursor.show();
			}
			// var oldX = parseInt(mapCursor.css('left'));
			// var oldY = parseInt(mapCursor.css('top'));
			mapCursor.css('left', posOnDraw.x - 10 + mapCursor.parent().offset().left);
			mapCursor.css('top', posOnDraw.y - 10 + mapCursor.parent().offset().top);
			var currentX = parseInt(mapCursor.css('left'));
			var currentY = parseInt(mapCursor.css('top'));
			//mapCursor[0].scrollIntoView( oldY > currentY );

			// var limitX = Math.max( document.body.scrollWidth, document.body.offsetWidth, 
                   // document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth );
			// var limitY = Math.max( document.body.scrollHeight, document.body.offsetHeight, 
                   // document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight );
			// console.log(document.body.offsetLeft, document.body.clientLeft, document.documentElement.offsetLeft, document.documentElement.clientLeft);
			// console.log(limitX, limitY, window.innerWidth, window.innerHeight);
			// console.log(oldX, currentX, mapCursor.parent().offset().left, mapCursor.parent().offset().top)

			var supportPageOffset = window.pageXOffset !== undefined;
			var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
			var scX = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;  // window.scrollX
			var scY = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;  // window.scrollY
			
			// console.log(currentX - scX)
			var hscrollHeight = vscrollWidth = document.body.parentNode.offsetWidth - document.body.offsetWidth + 1;
			// console.log(scX, scY, limitX - scX - window.innerWidth + vscrollWidth, limitY - scY - window.innerHeight + hscrollHeight);
			
			mvX = currentX - scX;
			mvY = currentY - scY;
			maxX = window.innerWidth - (vscrollWidth + mapCursor.width());
			maxY = window.innerHeight - (hscrollHeight + mapCursor.height());
			if (mvX < 0 || mvX > maxX || mvY < 0 || mvY > maxY) {
				window.scrollBy(mvX < 0 ? mvX : mvX > maxX ? mvX - maxX : 0,
								mvY < 0 ? mvY : mvY > maxY ? mvY - maxY : 0);
			}
		} else {
			if (!mapCursor.is(":hidden")){
				mapCursor.hide();
			}
		}
	}
	var showCursor = function () {
		mapCursor.show();
	}
	var hideCursor = function () {
		mapCursor.hide();
	}

	if (isSbpFile) {
		var fromRealToLocal = function (x_real, y_real) {
			if (allItems === undefined) {
				if (!imagesLoaded) return;
				else updateAllItems();
			}
			var cItem, Ax, Ay, Bx, By, ABx, ACx, dotLen, Dx, Dy, d;
			for (var i = 0, arrIl = allItems.length; i < arrIl; i++) {
				cItem = allItems[i];
				Ax = cItem[0].x;
				Ay = cItem[0].y;
				Bx = cItem[1].x;
				By = cItem[1].y;
				ABx = Bx - Ax, ABy = By - Ay;
				ACx = x_real - Ax, ACy = y_real - Ay;
				dotLen = Math.abs((ABx * ACx + ABy * ACy) / (ABx * ABx + ABy * ABy));
				Dx = Ax + ABx * dotLen;
				Dy = Ay + ABy * dotLen;
				d = Math.sqrt(Math.pow(Dx - x_real, 2) + Math.pow(Dy - y_real, 2));
				if (d <= max_dist &&
						Dx >= Math.min(Ax, Bx) && Dx <= Math.max(Ax, Bx) &&
						Dy >= Math.min(Ay, By) && Dy <= Math.max(Ay, By)) {
					var rX = ((dotLen + i) * cImgSize.width / partsCnt);
					var rY = cImgSize.height * 0.5;
					return {x: rX, y: rY};
				}
			}
		}
	} else {
		var fromRealToLocal = function (x_real, y_real) {
			if (allItems === undefined) {
				if (!imagesLoaded) return;
				else updateAllItems();
			}
			var inItem, indexOfItem;
			// 1) find one item from items
			for (var i = 0, arrIl = allItems.length; i < arrIl; i++) {
				var cItem = allItems[i];
				//Math.hypot()
				min_x = Math.min(cItem[0].x, cItem[1].x, cItem[2].x, cItem[3].x);
				max_x = Math.max(cItem[0].x, cItem[1].x, cItem[2].x, cItem[3].x);
				min_y = Math.min(cItem[0].y, cItem[1].y, cItem[2].y, cItem[3].y);
				max_y = Math.max(cItem[0].y, cItem[1].y, cItem[2].y, cItem[3].y);
				if (x_real >= min_x && x_real <= max_x && y_real >= min_y && y_real <= max_y) {
					if (pointInQuadrangle(x_real, y_real, cItem[0].x, cItem[1].x, cItem[2].x, cItem[3].x, cItem[0].y, cItem[1].y, cItem[2].y, cItem[3].y)) {
						inItem = cItem;
						indexOfItem = i;
						break;
					}
				}
			}
			if (inItem === undefined)
				return;

			// 2) calculation of point in area
			// 2.0) setup
			var x1w = inItem[0].x, y1w = inItem[0].y;
			var x2w = inItem[1].x, y2w = inItem[1].y;
			var x3w = inItem[2].x, y3w = inItem[2].y;
			var x4w = inItem[3].x, y4w = inItem[3].y;
			var x0w = (x3w + x4w) * 0.5, y0w = (y3w + y4w) * 0.5;
			var xCw = x_real, yCw = y_real;
			var alpha = Math.atan2(y2w - y3w, x2w - x3w);
			//var alpha = (Math.atan2(y2w - y3w, x2w - x3w) + Math.atan2(y1w - y4w, x1w - x4w)) * 0.5;
			// sides must be paralleled
			// 2.1) translations
			var dx1w = x1w - x0w, dy1w = y1w - y0w;
			var dx2w = x2w - x0w, dy2w = y2w - y0w;
			var dx3w = x3w - x0w, dy3w = y3w - y0w;
			var dx4w = x4w - x0w, dy4w = y4w - y0w;
			var dxCw = xCw - x0w, dyCw = yCw - y0w;
			//console.log(indexOfItem, alpha / Math.PI * 180, dxCw, dyCw);
			// 2.2) rotations
			var angle = Math.PI * 0.5 - alpha;
			//var angle = -alpha;
			var /*ax1w = Math.cos(angle) * dx1w - Math.sin(angle) * dy1w, */
				ay1w = Math.sin(angle) * dx1w + Math.cos(angle) * dy1w;
			var ax2w = Math.cos(angle) * dx2w - Math.sin(angle) * dy2w, 
				ay2w = Math.sin(angle) * dx2w + Math.cos(angle) * dy2w;
			var /*ax3w = Math.cos(angle) * dx3w - Math.sin(angle) * dy3w, */
				ay3w = Math.sin(angle) * dx3w + Math.cos(angle) * dy3w;
			var /*ax4w = Math.cos(angle) * dx4w - Math.sin(angle) * dy4w, */
				ay4w = Math.sin(angle) * dx4w + Math.cos(angle) * dy4w;
			var axCw = Math.cos(angle) * dxCw - Math.sin(angle) * dyCw, 
				ayCw = Math.sin(angle) * dxCw + Math.cos(angle) * dyCw;
			// 2.3) scales by X
			// var x0lp = 0, y0lp = 0;
			// var x1lp = -1, y1lp = 1;
			// var x2lp = 1, y2lp = 1;
			// var x3lp = 1, y3lp = 0;
			// var x4lp = -1, y4lp = 0;
			var xClp = axCw / ax2w;
			// 2.4) slide by Y
			var yh1w = ay1w - ay4w;
			var yh2w = ay2w - ay3w;
			var mxClp = (xClp + 1) * 0.5;
			var yhCw = mxClp * (yh2w - yh1w) + yh1w;
			var ymCw = mxClp * (ay3w - ay4w) + ay4w;
			var yrCw = ayCw + ymCw; // ?
			var yClp = yrCw / yhCw;
			var rX = mxClp * cImgSize.width;
			var rY = (1 - yClp + indexOfItem) * (cImgSize.height / partsCnt);
			//console.log(indexOfItem, alpha / Math.PI * 180, xClp, yClp);
			return {x: rX, y: rY};
		}
	}
}


$(window).ready(function () {
	if (isInIframe) {  // if html loaded in iframe
		$('#header').remove();  // remove header
		$('#footer').remove();  // remove footer

		var map_cursor = document.createElement("div");
		map_cursor.setAttribute("id", "map_cursor");
		document.getElementById("content").appendChild(map_cursor);
		//document.getElementById("waterfall_image").appendChild(map_cursor);
		mapCursor = $(map_cursor);

		window.onmessage = function(e) {  // setup for receiving messages from main page
			var vals = e.data.split(',');
			if (vals[0] == 'showCursor') {
				showCursor();
			} if (vals[0] == 'setCursorPosition') {
				//console.log(vals.slice(1, vals.length));
				setCursorPosition(parseFloat(vals[1]), parseFloat(vals[2]));
			} if (vals[0] == 'hideCursor') {
				hideCursor();
			}
		};

		$(window).mousewheel(function(event, delta) {
			console.log(event);
			var body = document.body;
			var html = document.documentElement;
			if (event.shiftKey) {
				body.scrollLeft -= (delta * 40);
				html.scrollLeft -= (delta * 40);
			} else {
				body.scrollTop -= (delta * 40);
				html.scrollTop -= (delta * 40);
			}
			event.preventDefault();
		});
	}
});


$(window).load(function () {
	var sizeToContent = true;
	var waterfallImage = $('#waterfall_image');
	var content = $('div#content');
	var infobar = $('div#infobar');
	var heightExceptContent = parseFloat($('body').css('margin-top')) + parseFloat($('body').css('margin-bottom')) + parseFloat($('body').css('padding-top')) + parseFloat($('body').css('padding-bottom')) + $('div#header').outerHeight() + $('div#line_name').outerHeight() + $('div#footer').outerHeight();

	//
	var ro = getRealOutline();
	window.parent.postMessage('updateOutline,' + 'x,' + ro.x.join() + ',y,' + ro.y.join(), '*');
	//

	//	var imgSize = new getImgSize(waterfallImage.attr('src'));

	//	function getImgSize(src) {
	//		var img = new Image();
	//		img.src = src;
	//		this.width = img.width;
	//		this.height = img.height;
	//	}

	function updateImgSize(item, node) {
		item.width = node.width();
		item.height = node.height();
	}
	updateImgSize(imgSize, waterfallImage);
	updateImgSize(cImgSize, waterfallImage);
	updateAllItems();
	imagesLoaded = true;

	function formatLLCoordinate(value, lat) {
		if (minutesFormat) {
			var intPart = Math.floor(Math.abs(value));
			var fracPart = (Math.abs(value) - intPart) * 60;
			return intPart.toString() + "\u00B0 " + fracPart.toFixed(5).toString() + "' " + (lat ? value > 0 ? north : south : value > 0 ? east : west);
		}
		else {
			return value.toFixed(10);
		}
	}

	waterfallImage.click(function () {
		var $this = $(this);

		//console.log(parseFloat(content.css('margin-left')), parseFloat(content.css('margin-right')), parseFloat($('body').css('margin')) * 2);
		// var paddings = parseFloat(content.css('margin-left')) + parseFloat(content.css('margin-right')) + parseFloat($('body').css('margin')) * 2;
		// var paddings = parseFloat($('body').css('margin')) * 2;
		var paddings = 0;
		var fullImageWidth = Math.ceil($(window).width() - paddings);
		$(this).width(sizeToContent ? fullImageWidth : 'auto').height(sizeToContent ? Math.ceil($(window).height() - heightExceptContent) : 'auto');
		updateImgSize(cImgSize, waterfallImage);

		if ($this.is('div')) {
			if (sizeToContent) {
				$this.children('img').each(function () {
					var $img = $(this);
					var newW = 0;
					var newH = 0;
					if (imgSize.width > imgSize.height) {
						var k = imgSize.width / 100;
						newW = $this.width() * ($img.width() / k / 100);
						newH = $this.height();
					} else {
						var k = imgSize.height / 100;
						newW = $this.width();
						newH = $this.height() * ($img.height() / k / 100);
					}
					$img.width(newW);
					$img.height(newH);
				});
			} else {
				$this.width(imgSize.width);
				$this.children('img').each(function () {
					var $img = $(this);
					$img.width('auto');
					$img.height('auto');
				});
			}
		}

		sizeToContent = !sizeToContent;
	});

	$('#waterfall_image, div#infobar').hover(function () {
		if (isInIframe)
			window.parent.postMessage('showCursor', '*');
		else
			infobar.show();
	}, function () {
		if (isInIframe)
			window.parent.postMessage('hideCursor', '*');
		else
			infobar.hide();
	}).mousemove(function (event) {
		if (!isInIframe)
			if (infobar.is(':hidden')) {
				infobar.show();
			}

		var pixX = event.pageX - $(this).offset().left - parseFloat($(this).css('border-left-width'));
		var pixY = event.pageY - $(this).offset().top - parseFloat($(this).css('border-top-width'));

		var coord = fromLocalToReal(pixX, pixY);

		if (isInIframe)
			window.parent.postMessage('setCursorPosition,' + coord.x + ',' + coord.y, '*');
		else
			infobar.text('Coordinate System Code: ' + coordinateSystemCode + ', XY: (' + coord.x.toFixed(2) + ', ' + coord.y.toFixed(2) + ') ' + units + ',');
			//'Lat/Lon: (' + formatLLCoordinate(lat(n), true) + ', ' + formatLLCoordinate(lon(n), false) + ')' + (isSbpFile ? ', Z: ' + (z(n) * pixY / $(this).height() + zOffset(n)).toFixed(2) + ', ' + ((z(n) * pixY / $(this).height() + zOffset(n)) / unitsToMs).toFixed(2) + ' ms' : ''));

		/*
		var n = (isSbpFile ? pixX / $(this).width() * imgSize.width : pixY / $(this).height() * imgSize.height);

		var index = isSbpFile ? pixX / $(this).width() * numRows : ($(this).height() - pixY) / $(this).height() * numRows;

		var fromIndex = Math.floor(index);
		//var toIndex = index == fromIndex ? fromIndex + 1 : Math.ceil(index);
		var toIndex = fromIndex + 2;
		var crX, crY, distX, distY;
		crX = CursorRecordX[fromIndex];
		crY = CursorRecordY[fromIndex];
		distX = CursorRecordX[toIndex] - crX;
		distY = CursorRecordY[toIndex] - crY;
		if (index != fromIndex){
			let c = (toIndex - fromIndex) / (toIndex - index);
			crX += distX / c;
			crY += distY / c;
		}

		if (!isSbpFile) {
			var diffPerc = pixX / $(this).width() * 2 - 1.0;
			var alpha = Math.atan2(distY, distX) + Math.PI * 0.5;
			var mW = CursorRecordRange[fromIndex];
			crX += Math.cos(alpha) * mW * diffPerc;
			crY += Math.sin(alpha) * mW * diffPerc;
			// console.log(rLen, rW, toIndex - fromIndex, mW, distX, distY, diffPerc);
		}
		if (isInIframe)
			window.parent.postMessage('setCursorPosition,' + crX + ',' + crY, '*');
		else
			infobar.text('Coordinate System Code: ' + coordinateSystemCode + ', XY: (' + crX.toFixed(2) + ', ' + crY.toFixed(2) + ') ' + units + ', Lat/Lon: (' + formatLLCoordinate(lat(n), true) + ', ' + formatLLCoordinate(lon(n), false) + ')' + (isSbpFile ? ', Z: ' + (z(n) * pixY / $(this).height() + zOffset(n)).toFixed(2) + ', ' + ((z(n) * pixY / $(this).height() + zOffset(n)) / unitsToMs).toFixed(2) + ' ms' : ''));
		*/

		return false;
	});

	$(window).resize(function () {
		if (!sizeToContent) {
			waterfallImage.width($(window).width() * 0.9).height($(window).height() - heightExceptContent);
			if (waterfallImage.is('div')) {
				waterfallImage.children('img').each(function () {
					var $img = $(this);
					if (imgSize.width > imgSize.height) {
						console.log("width");
						var newH = waterfallImage.height();
						var newW = waterfallImage.width() * ($img.context.naturalWidth / (imgSize.width / 100) / 100);
					} else {
						console.log("height");
						var newH = waterfallImage.height() * ($img.context.naturalHeight / (imgSize.height / 100) / 100);
						var newW = waterfallImage.width();
					}
					$img.height(Math.floor(newH));
					$img.width(Math.floor(newW));
				});
			}
		}
	});
});