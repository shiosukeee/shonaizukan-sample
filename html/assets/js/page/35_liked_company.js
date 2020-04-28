$(function(){
	
	// PC版とスマホ版のHTML構造の差異をJSで解消する
	var $articles = $('#S-02 .companies article');
	$articles.each(function(){
		
		var _$self = $(this);
		
		var _$elementFigure = _$self.find('.photo figure');
		var _$cloneFigure = _$elementFigure.clone();
		var _$photoSP = _$self.find('.photo__SP');
		_$photoSP.append(_$cloneFigure);
		
		var _$elementButton = _$self.find('.button a');
		var _$cloneButton = _$elementButton.clone();
		var _$buttonSP = _$self.find('.button__SP');
		_$buttonSP.append(_$cloneButton);
		
	});
	
});
