
(function( $ ){
$.fn.vbuttonset = function() {
	$(this).buttonset();
	$(this).addClass('ui-vbuttonset')
	$('input[type=radio]:checked', this).removeAttr('checked');
	// Refresh the jQuery UI buttonset.
	$(this).buttonset('refresh');
	// $('label.ui-button', this).addClass('ui-corner-left').addClass('ui-corner-right');
	$('label.ui-button:first', this).removeClass('ui-corner-left').addClass('ui-corner-top');
	$('label.ui-button:last', this).removeClass('ui-corner-right').addClass('ui-corner-bottom');
};
})( jQuery );
