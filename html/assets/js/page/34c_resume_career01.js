$(function(){
	
	// クローンの雛形となるノードをメモリに確保
	var _$career = $('#career');
	var _$careerTable = _$career.find('.js-careerTable');
	var _$prototypeCareerTable = _$careerTable.clone();
	
	// 雛形をさらにクローンし、ノードに配置
	var _$buttonAdd = $('#js-buttonAddCareerTable');
	_$buttonAdd.bind('click', function(){
		var _$clone = _$prototypeCareerTable.clone();
		_$clone.show();
		_$career.append(_$clone);
	});
	
});