$(function(){
	
	// VegasCoverはbase.jsにて定義
	var vegasCover = new VegasCover();
	vegasCover.init();
	
	// バナーエリア
	$("#page-top #S-01 .js-slick").slick();
	
	// WORK一覧
	// 「Carousel」クラスはbase.jsにて定義
	var carouselCompany = new Carousel($("#page-top #S-02"));
	carouselCompany.init();
	
	// LIFE一覧
	// 「Carousel」クラスはbase.jsにて定義
	var carouselEntertainment = new Carousel($("#page-top #S-03"));
	carouselEntertainment.init();
	
});
