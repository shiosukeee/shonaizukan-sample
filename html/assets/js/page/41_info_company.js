$(function(){
	
	var $trigger = $('.js-accordion-trigger');
	$trigger.bind('click', function(){
		
		var _$self = $(this);
		_$self.toggleClass('js-isActive');
		
		var targetName = _$self.data('target');
		
		var _$target = $('#'+targetName);
		_$target.slideToggle();
		
	});
	
});
