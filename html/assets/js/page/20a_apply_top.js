$(function(){
	
	$('.js-accordion').each(function(){
		var _$set = $(this);
		var _$opener = _$set.find('.js-accordion_opener');
		var _$drawer = _$set.find('.js-accordion_drawer');
		_$opener.bind('click', function(){
			_$drawer.slideToggle();
			_$opener.toggleClass('js-isActive');
		});
	});
	
});