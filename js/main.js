var mapCursor;
var infobar;
var config = {};
config.outline = [];

window.onmessage = function(e){
	var vals = e.data.split(',');
	if (vals[0] == 'showCursor') {
		mapCursor.show();
		infobar.show();
	} if (vals[0] == 'setCursorPosition') {
		if (mapCursor.is(":hidden")){
			mapCursor.show();
			infobar.show();
		}
		//console.log(vals.slice(1, vals.length));
		real_map_x = parseFloat(vals[1]);
		real_map_y = parseFloat(vals[2]);
		//setCursorPosition(real_map_x, real_map_y);

		var pos_x = (real_map_x - topLeftX) / (bottomRightX - topLeftX);
		var pos_y = (real_map_y - topLeftY) / (bottomRightY - topLeftY);
		infobar.html('XY: (' + real_map_x.toFixed(2) + ', ' + real_map_y.toFixed(2) + ' ' + units + ') LL: (' + formatLLCoordinate(pos_y * (bottomRightLat - topLeftLat) + topLeftLat, true) + ' ' + formatLLCoordinate(pos_y * (bottomRightLon - topLeftLon) + topLeftLon, false) + ')');

		var posOnDraw = config.getOnScreenPosition(pos_x, pos_y);
		mapCursor.css('left', posOnDraw.x - 10);
		mapCursor.css('top', posOnDraw.y - 10);
	} if (vals[0] == 'hideCursor') {
		mapCursor.hide();
		infobar.hide();
	} if (vals[0] == 'updateOutline') {
		config.outline = [];
		var pos_x, pos_y;
		var real_map_x, real_map_y;
		var x_index = vals.indexOf('x');
		var y_index = vals.indexOf('y');
		var x_len = y_index - (x_index + 1);
		var y_len = vals.length - x_len - 3;
		if (x_len != y_len) {
			alert("Error of array bounds x:" + x_len + ", y:" + y_len + ", len:" + vals.length);
		} else {
			x_index++;
			y_index++;
			for (var i = 0; i < x_len; i++) {
				real_map_x = parseFloat(vals[i + x_index]);
				real_map_y = parseFloat(vals[i + y_index]);
				pos_x = (real_map_x - topLeftX) / (bottomRightX - topLeftX);
				pos_y = (real_map_y - topLeftY) / (bottomRightY - topLeftY);
				config.outline.push({x: pos_x, y: pos_y});
			}
		}
		config.updateMap();
	}
};

/*
var setCursorPosition = function (x, y) {
	var pos_x = (x - topLeftX) / (bottomRightX - topLeftX);
	var pos_y = (y - topLeftY) / (bottomRightY - topLeftY);
	var posOnDraw = config.getOnScreenPosition(pos_x, pos_y);
	mapCursor.css('left', posOnDraw.x - 10);
	mapCursor.css('top', posOnDraw.y - 10);
}
var showCursor = function () {
	mapCursor.show();
}
var hideCursor = function () {
	mapCursor.hide();
}
*/

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

$(window).ready(function () {

	$("div#contact_tabs").hide();
	if ($("div#contact_thumb_set div.contact_thumb").size() == 0) {
		$("div#tabs li").remove();
		$("div#contacts").remove();
	}
	$("div#waterfall_dialog").hide();
	$("div#map").hide();

	// var leftContainer = $('div.ui-layout-west');
	// var rightContainer = $('div.ui-layout-east');
	// var centerContainer = $('div.ui-layout-center');
	var contactThumb = $('div.contact_thumb');
	var mapContainer = $('div#map_container');

	var map_cursor = document.createElement("div");
	map_cursor.setAttribute("id", "map_cursor");
	mapContainer.get(0).appendChild(map_cursor);
	mapCursor = $(map_cursor);

	infobar = $('div#infobar');
	var tooltip = $('div#tooltip');

	var liSelector = 'div#contact_tabs.ui-tabs .ui-tabs-nav li.selected';
	var tabPanel = 'div#contact_tabs.ui-tabs .ui-tabs-nav';

	var currentTooltipPosition = {x:0, y:0};
	var startVisibleTabIndex = 0;
	var visibleTabCount = 0;
	var contactAreaSize = 18;


/** Tabs **/
	var contactTabs = $('div#contact_tabs');
	contactTabs.tabs({
		closable: true,
		closableClick: function (event, ui) {
			var selectedIndex = getSelectedTabIndex();
			var currentTab = ui.parents(liSelector);
			if (selectedIndex == $.inArray(currentTab.get(0), $(liSelector).toArray())) {
				selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : selectedIndex + 1;
				setSelectedTabIndex(selectedIndex);
			}
			currentTab.removeClass('selected').hide();
			if ($(liSelector).toArray().length == 0) {
				hideTabs();
			}
			showMaximumTabs();
		}
	});

	function showMaximumTabs() {
		var tabsWidth = 0;
		var i = 0;
		for (; i < $(liSelector).toArray().length; i++) {
			tabsWidth += $(liSelector).eq(i).outerWidth() + parseFloat($(liSelector).eq(i).css('margin-left')) + parseFloat($(liSelector).eq(i).css('margin-right'));
			if (tabsWidth > $(tabPanel).width() - $('#tabs_options').width()) {
				break;
			}
		}
		visibleTabCount = i;
		var tabIndex = getSelectedTabIndex();
		if (tabIndex >= startVisibleTabIndex + visibleTabCount) {
			startVisibleTabIndex = tabIndex - visibleTabCount + 1;
		} else if (tabIndex < startVisibleTabIndex) {
			startVisibleTabIndex = tabIndex;
		}
		scrollTabs();
	}

	function scrollTabs() {
		var endVisibleTabIndex = startVisibleTabIndex + visibleTabCount;
		if (endVisibleTabIndex > $(liSelector).toArray().length) {
			endVisibleTabIndex = $(liSelector).toArray().length;
			startVisibleTabIndex = endVisibleTabIndex - visibleTabCount;
		}
		for (var i = 0; i < $(liSelector).toArray().length; i++) {
			if (i >= startVisibleTabIndex && i < endVisibleTabIndex) {
				$(liSelector).eq(i).show();
			} else {
				$(liSelector).eq(i).hide();
			}
		}
		if (startVisibleTabIndex == 0 && endVisibleTabIndex == $(liSelector).toArray().length) {
			$('button#slide_left_tabs, button#slide_right_tabs').css('visibility', 'hidden');
		}
		else {
			$('button#slide_left_tabs, button#slide_right_tabs').css('visibility', 'visible');
			if (startVisibleTabIndex == 0) {
				$('button#slide_left_tabs').attr('disabled', 'disabled').children('img').attr('src', 'images/previous_monochrome.png').css({ opacity: 0.3 });
			}
			else {
				$('button#slide_left_tabs').removeAttr('disabled').children('img').attr('src', 'images/previous.png').css({ opacity: 1 });
			}
			if (endVisibleTabIndex == $(liSelector).toArray().length) {
				$('button#slide_right_tabs').attr('disabled', 'disabled').children('img').attr('src', 'images/next_monochrome.png').css({ opacity: 0.3 });
			}
			else {
				$('button#slide_right_tabs').removeAttr('disabled').children('img').attr('src', 'images/next.png').css({ opacity: 1 });
			}
		}
	}

	function getTabByIndex(index) {
		return $(tabPanel + ' li#contact_number_' + index.toString());
	}

	function showTabs(index) {
		contactTabs.fadeIn(300);
		mapContainer.unbind('mousedown');
		var currentLiSelector = getTabByIndex(index);
		if (!currentLiSelector.hasClass('selected')) {
			if ($(liSelector).toArray().length > 0) {
				$(liSelector + ':last').after(currentLiSelector);
			} else {
				$(tabPanel).prepend(currentLiSelector);
			}
			currentLiSelector.addClass('selected');
		}
		setSelectedTabIndex($.inArray(getTabByIndex(index).get(0), $(liSelector).toArray()));
		showMaximumTabs();
	}

	function hideTabs() {
		contactTabs.fadeOut(300);
		mapContainer.mousedown(mapScroll);
	}

	function getSelectedTabIndex() {
		return $.inArray($(liSelector + '.ui-state-active.ui-tabs-selected').get(0), $(liSelector).toArray());
	}

	function setSelectedTabIndex(index) {
		$(liSelector).removeClass('ui-state-active ui-tabs-selected');
		$(liSelector).eq(index).addClass('ui-state-active ui-tabs-selected');
		contactTabs.find('div.contact').addClass('ui-tabs-hide');
		$($(liSelector).eq(index).find('a:first').attr('href')).removeClass('ui-tabs-hide');
	}

	$('button#slide_left_tabs').click(function () {
		startVisibleTabIndex--;
		scrollTabs();
	});

	$('button#slide_right_tabs').click(function () {
		startVisibleTabIndex++;
		scrollTabs();
	});

	$('button#close_tabs').click(function () {
		hideTabs();
	});

	$(tabPanel).mousedown(function () {
		var currentTabIndex = -1;
		$(liSelector).hover(function () {
			if (currentTabIndex == -1) {
				currentTabIndex = $.inArray(this, $(liSelector).toArray());
			}
			var tabIndex = $.inArray(this, $(liSelector).toArray());
			if (tabIndex != currentTabIndex) {
				var tempHtml = $(liSelector).eq(tabIndex).find('a:first').html();
				var tempHref = $(liSelector).eq(tabIndex).find('a:first').attr('href');
				var tempId = $(liSelector).eq(tabIndex).attr('id');
				var selectedIndex = getSelectedTabIndex();
				$(liSelector).eq(tabIndex).find('a:first').html($(liSelector).eq(currentTabIndex).find('a:first').html()).attr('href', $(liSelector).eq(currentTabIndex).find('a:first').attr('href'));
				$(liSelector).eq(tabIndex).attr('id', $(liSelector).eq(currentTabIndex).attr('id'));
				$(liSelector).eq(currentTabIndex).find('a:first').html(tempHtml).attr('href', tempHref);
				$(liSelector).eq(currentTabIndex).attr('id', tempId);
				switch (selectedIndex) {
					case tabIndex:
						setSelectedTabIndex(currentTabIndex);
						break;
					case currentTabIndex:
						setSelectedTabIndex(tabIndex);
						break;
				}
			}
			currentTabIndex = tabIndex;
		});
		$(liSelector + ', ' + tabPanel).mouseup(function () {
			$(liSelector).unbind('hover');
			currentTabIndex = -1;
		});
		$(tabPanel).mouseleave(function () {
			$(liSelector).unbind('hover');
			currentTabIndex = -1;
		});
	});
/** End Tabs **/


/** Tooltips **/
	function showTooltip(index) {
		currentTooltipPosition.x = contactPositionArray[index].x;
		currentTooltipPosition.y = contactPositionArray[index].y;
		tooltip.show();
		var pos = config.getOnScreenPosition(currentTooltipPosition.x, currentTooltipPosition.y);
		var sc = (zoom - zoomMinVal) / zoomMaxVal;
		tooltip.css('left', pos.x - tooltip.outerWidth() + 9 + (1 - sc) * 4.5);
		tooltip.css('top', pos.y - 18);
		tooltip.find('p#contact_name').text(contactInfo[index].name);
		tooltip.find('p#contact_ll_position').text(contactInfo[index].llPos);
		tooltip.find('p#contact_xy_position').text(contactInfo[index].xyPos);
		contactThumb.removeClass('selected');
	}

	function hideTooltip() {
		contactThumb.removeClass('selected');
		tooltip.hide();
	}

	mapContainer.hover(function () {
		infobar.show();
		//showCursor();
		document.getElementById("waterfall_frame").contentWindow.postMessage('showCursor', '*');
	}, function () {
		infobar.hide();
		//hideCursor();
		document.getElementById("waterfall_frame").contentWindow.postMessage('hideCursor', '*');
	}).mousemove(function (event) {
		var pos = config.getOnMapPosition(event.pageX - mapContainer.offset().left, event.pageY - mapContainer.offset().top);
		if (infobar.is(":hidden")){
			infobar.show();
		}
		// var cx = event.pageX - mapContainer.offset().left, cy = event.pageY - mapContainer.offset().top
		// document.getElementById("waterfall_frame").contentWindow.postMessage('setCursorPosition,' + cx + ',' + cy, '*');
		document.getElementById("waterfall_frame").contentWindow.postMessage('setCursorPosition,' + (pos.x * (bottomRightX - topLeftX) + topLeftX) + ',' + (pos.y * (bottomRightY - topLeftY) + topLeftY), '*');

		//setCursorPosition(pos.x * (bottomRightX - topLeftX) + topLeftX, pos.y * (bottomRightY - topLeftY) + topLeftY);
		infobar.html('XY: (' + (pos.x * (bottomRightX - topLeftX) + topLeftX).toFixed(2) + ', ' + (pos.y * (bottomRightY - topLeftY) + topLeftY).toFixed(2) + ' ' + units + ') LL: (' + formatLLCoordinate(pos.y * (bottomRightLat - topLeftLat) + topLeftLat, true) + ' ' + formatLLCoordinate(pos.x * (bottomRightLon - topLeftLon) + topLeftLon, false) + ')');
		hideTooltip();
		var m_sz_w = config.getMapSize().width;
		var caz = contactAreaSize / m_sz_w;
		for (var i = 0; i < contactPositionArray.length; i++) {
			if (pos.x >= contactPositionArray[i].x - caz && pos.x <= contactPositionArray[i].x + caz && pos.y >= contactPositionArray[i].y - caz && pos.y <= contactPositionArray[i].y + caz) {
				showTooltip(i);
				contactThumb.eq(i).addClass('selected');
				if ($('html').css('cursor') != 'pointer') {
					$('html').css('cursor', 'pointer');
				}
				return;
			}
		}
		$('html').css('cursor', 'default');
	}).click(function (event) {
		var pos = config.getOnMapPosition(event.pageX - mapContainer.offset().left, event.pageY - mapContainer.offset().top);
		var m_sz_w = config.getMapSize().width;
		var caz = contactAreaSize / m_sz_w;
		for (var i = 0; i < contactPositionArray.length; i++) {
			if (pos.x >= contactPositionArray[i].x - caz && pos.x <= contactPositionArray[i].x + caz && pos.y >= contactPositionArray[i].y - caz && pos.y <= contactPositionArray[i].y + caz) {
				showTabs(i);
			}
		}
	});

	contactThumb.hover(function (i, u, z) {
		var index = $.inArray(this, contactThumb.toArray());
		showTooltip(index);
		$(this).addClass('selected');
	}, function () {
		hideTooltip();
	}).click(function () { showTabs($.inArray(this, contactThumb.toArray())); });
/** End Tooltips **/


/** Waterfall Dialog **/
	$('div#waterfall_dialog').dialog({
		autoOpen: false,
		modal: true,
		width: 'auto'
	});

	$('button#show_waterfalls').click(function () {
		$('div#waterfall_dialog').dialog('open');
	});
/** End Waterfall Dialog **/




	var slider = $('div#slider');
	const zoomFactor = 0.8;
	var zoom = 1.0;
	const sliderMinVal = 0,
		sliderMaxVal = 100;
	const zoomMinVal = 1.0,
		zoomMaxVal = 5.0;

	function mapZoom(event, delta) {
		//event.stopPropagation();
		var mpZ = zoom;
		if (delta > 0) {
			// if (mpZ === zoomMaxVal)
				// return;
			mpZ /= zoomFactor;
			if (mpZ >= zoomMaxVal)
				mpZ = zoomMaxVal;
		} else {
			// if (mpZ === zoomMinVal)
				// return;
			mpZ *= zoomFactor;
			if (mpZ <= zoomMinVal)
				mpZ = zoomMinVal;
		}
		slider.slider('value', ((mpZ - zoomMinVal) / (zoomMaxVal - zoomMinVal)) * sliderMaxVal + sliderMinVal);
	}

	var oldMousePosition = {x: 0, y: 0};
	function mapScroll(event) {
		if (event.which == 1) {
			oldMousePosition.x = event.pageX;
			oldMousePosition.y = event.pageY;
			var selector = $('body');
			selector.mouseup(function () {
				selector.unbind('mousemove');
				selector.unbind('mouseup');
			});
			selector.mousemove(function (event) {
				config.translateMap(event.pageX - oldMousePosition.x, event.pageY - oldMousePosition.y);
				oldMousePosition.x = event.pageX;
				oldMousePosition.y = event.pageY;
			});
		}
		return false;
	}

	function sliderChange(event, ui) {
		var sc = (parseInt(slider.slider('value')) - sliderMinVal) / (sliderMaxVal - sliderMinVal);
		zoom = sc * zoomMaxVal + zoomMinVal;
		config.updateScale(sc);
	}

	slider.slider({
		orientation: 'vertical',
		min: sliderMinVal,
		max: sliderMaxVal,
		value: sliderMinVal,
		change: sliderChange
	});

	slider.mousedown(function () {
		$(map_container).unbind('mousedown');
	}).mouseleave(function () {
		$(map_container).mousedown(mapScroll);
	});

	$('button#restore').click(function () {
		config.resetMapPosition();
		slider.slider('value', 0);
	});

	BG.generateVButtonSets("div#waterfall_dialog tr a", "div#tabs", 'radio_set', ['SBP', 'SSS']);

	//$('#SBP_set input[type=radio]:checked, #SSS_set input[type=radio]:checked').each(function () {});
	$('#SBP_set input[type=radio], #SSS_set input[type=radio]').change(function() {
		$(".ui-layout-east").children("iframe").attr("src", this.value);
		//layout.state.east.isClosed
		//layout.sizePane('east', 300)
		layout.open("east");
	});

	$("#tabs").tabs();
	var updateTabs = function () {
		var panel = $(".ui-layout-west");
		var tabs = panel.children("div#tabs");
		var tab_nav = tabs.children("ul");
		var h = panel.height() - (parseInt(tabs.css('padding-top')) + parseInt(tabs.css('padding-bottom')) + tab_nav.height());
		console.log("updateTabs", panel.height());
		//$("div.tab_item").height(h);
		$("#SBP_set, #SSS_set, #contacts").height(h);
	}
	updateTabs();

	nothingItems = $("div.tab_item").size() == 0;
	var layout = $('#content').layout({
		minSize: 60,
			west: {
				size: 300,
				minSize: 280,
				slidable: false,
				//initClosed: true,
				initHidden: nothingItems,
			},
			center: {
				minWidth: 500,
				onresize_end: function () { resizeWindow(); },
			},
			east: {
				size: 300,
				minSize: 200,
				initClosed: true,
				initHidden: nothingItems,
				//togglerLength_open: 0,
				//togglerLength_closed: "100%",
				slidable: false,
				resizable: true,
				closable: true,
				maskContents: true,  // east panel is iframe
				onclose: function () { config.showOutline = false; config.updateMap(); },
				onopen: function () { config.showOutline = true; config.updateMap(); },
			},
		spacing_closed: 16,
		spacing_open: 16,
		togglerContent_open:	'<div class="arrow-icon"></div>',
		togglerContent_closed:	'<div class="arrow-icon"></div>',
	});

	var map_container = document.getElementById("map_container");

	var resizeWindow = function () {
		console.log("resizeWindow");
		updateTabs();
		try {
			showMaximumTabs();
		} catch (e) {
			alert(e);
		}
		config.updateMap();
	}

	initMap(map_container, config, function () {
		$("div#map").remove();
		layout.resizeAll();
		//layout.open("west");
		//resizeWindow();
	});

	$(window).resize(resizeWindow);

	$(map_container).mousewheel(mapZoom).mousedown(mapScroll);

});