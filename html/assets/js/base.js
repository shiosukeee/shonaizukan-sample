/* =========================================================
カルーセル
========================================================= */
var Carousel = function($root){
	
	var _$root = $root;
	var _slickSP = null;
	var _slickPC = null;
	
	this.init = function(){
		
		var $sliderPC = _$root.find('.u-media-PC .js-slick');
		_slickPC = $sliderPC.slick({
			slidesToScroll: 1,
			centerMode: true,
			variableWidth: true
		});
		
		var $sliderSP = _$root.find('.u-media-SP .js-slick');
		_slickPC = $sliderSP.slick();
		
		var $prev = _$root.find('.customPrev');
		$prev.bind('click', function(){
			$sliderSP.slick('slickPrev');
		})
		
		var $next = _$root.find('.customNext');
		$next.bind('click', function(){
			$sliderSP.slick('slickNext');
		})
		
	}
}

/* =========================================================
Dialogue
========================================================= */
var Dialogue = function(){
	
	var _slider = null;
	
	setupBaloon();
	
	var list = new DialogueList();
	
	var thread = new DialogueThread();
	thread.init();
	
	var modal = new DialogueModal();
	
	var control = new DialogueControl();
	
	var manager = new DialogueManager();
	manager.init(list, thread, control, modal);
	
	$(window).bind('resize', manager.resizeDialogue).trigger('resize');
	
	
	
	//-----
	
	/**
	 * バルーンの実装
	 */
	function setupBaloon() {
		var $currentUnitSearchBaloon = null;
		$('.unit-baloonSelector').each(function(){
			var _$root = $(this);
			var _$selectArea = $(this).find('.selectArea');
			_$selectArea.each(function(){

				var _$self = $(this);
				var _$selector = _$self.find('.pseudoSelector');
				var _$baloon = _$self.find('.baloon');
				var _$button = _$self.find('.button input[type="button"]');
				
				_$baloon.bind('click', function(event){
					event.stopPropagation();
				});
				
				_$selector.bind('click', function(event){
					event.stopPropagation();
					if($currentUnitSearchBaloon !== _$baloon && $currentUnitSearchBaloon) {
						$currentUnitSearchBaloon.hide();
					}
					_$baloon.toggle();
					$currentUnitSearchBaloon = _$baloon;
				});
				_$button.bind('click', function(event){
					event.stopPropagation();
					_$baloon.hide();
				});
			});
		});
	}
	
}

/* =========================================================
DialogueManager
========================================================= */
var DialogueManager = function(){
	
	var _self = this;
	var _list = null;
	var _thread = null;
	var _control = null;
	var _modal = null;
	
	this.init = function(){
		console.log("OK");
	}
	
	this.init = function(list, thread, control, modal){
		
		_list = list;
		_list.setManager(_self);
		
		_thread = thread;
		_thread.setManager(_self);
		
		_control = control;
		_control.setManager(_self);
		
		_modal = modal;
		_modal.setManager(_self);
		
	}
	
	this.switchThread = function(targetName){
		_thread.showThread(targetName);
		_self.resizeDialogue();
	}
	
	this.fileRegisted = function(){
		_self.resizeDialogue();
	}
	
	this.fileDeleted = function(){
		_self.resizeDialogue();
	}
	
	this.reflesh = function(){
		_self.resizeDialogue();
	}
	
	this.showModalSelect = function(){
		_modal.showModeSelect();
	}
	
	this.showModalDelete = function(){
		_modal.showModeDelete();
	}
	
	this.onClickedEditArticle = function(){
		alert("「編集ボタン」が押されました\nDialogueManager.onClickedEditArticle();");
	}
	
	this.onClickedDeleteArticle = function(){
		alert("「削除ボタン」が押されました\nDialogueManager.onClickedDeleteArticle();");
	}
	
	/**
	 * 画面の高さをコントロールする
	 */
	this.resizeDialogue = function(){
		
		var _$dialogue = $('#dialogue');

		var offset = 0;

		var heightWINDOW = $(window).height();

		var heightHeader = $('#header').outerHeight();
		offset += heightHeader;

		var heightSHeader = $('#S-header').outerHeight();
		offset += heightSHeader;

		var paddingTOP = _$dialogue.css('padding-top').replace('px', '');
		offset += Number(paddingTOP);
		var paddingBTM = _$dialogue.css('padding-bottom').replace('px', '');
		offset += Number(paddingBTM);

		var dialogueHeight = heightWINDOW - offset;

		var _$list = $('#dialogue #list');
		var H_listHeader = _$list.find('header').outerHeight();
		var H_list = dialogueHeight - H_listHeader;
		$('#dialogue #list .company').outerHeight(H_list);

		// ダイアログ領域のPaddingを除いた高さ
		var paddingOffset = 0;
		var _$body = $('#dialogue #thread .body');
		paddingOffset += Number(_$body.css('padding-top').replace('px', ''));
		paddingOffset += Number(_$body.css('padding-bottom').replace('px', ''));
		
		var _$thread = $('#dialogue #thread');
		var T_listHeader = _$thread.find('header').outerHeight();
		var T_list = dialogueHeight - T_listHeader;
		var controlOffset = _$thread.find('.js-isActive .control').outerHeight();
		var threadHeight = T_list - controlOffset - paddingOffset;
		$('#dialogue #thread .body .scroll').outerHeight(threadHeight);
		
	}
	
}

/* =========================================================
DialogueList（画面左側のペイン）
========================================================= */
var DialogueList = function(){
	
	this.NAME = 'DialogueList';
	
	var _manager = null;
	this.setManager = function(m){
		_manager = m;
	}
	
	var _$list = $('#dialogue #list');
	var _$articles = _$list.find('article');
	_$articles.each(function(){
		var _$self = $(this);
		_$self.bind('click', function(){
			
			_$articles.removeClass('js-active');
			_$self.addClass('js-active');
			
			var targetName = _$self.data('target');
			_manager.switchThread(targetName);
		});
	});
	
}

/* =========================================================
DialogueControl（送信などのコントロールエリア）
========================================================= */
var DialogueControl = function(){
	
	this.NAME = 'DialogueControl';
	
	var _manager = null;
	this.setManager = function(m){
		_manager = m;
	}
	
	var _$controls = $('#dialogue .thread .control');
	_$controls.each(function(){
		
		var _$self = $(this);
		
		var _$uploadFiles = _$self.find('.uploadFiles ul');
		var _$uploadFileResume = _$self.find('.uploadFiles .resume');
		var _$uploadFileApply = _$self.find('.uploadFiles .apply');
		
		var _$FU_resume = _$self.find('.js-fileUploader.resume');
		var _$FU_apply = _$self.find('.js-fileUploader.apply');
		
		// アップロードに関するボタン
		_$FU_resume.bind('change', function(){
			var file = $(this).prop('files')[0];
			_$uploadFileResume.find('.name').html(file.name);
			_$uploadFileResume.show();
			_manager.fileRegisted();
		});
		
		_$FU_apply.bind('change', function(){
			var file = $(this).prop('files')[0];
			_$uploadFileApply.find('.name').html(file.name);
			_$uploadFileApply.show();
			_manager.fileRegisted();
		});
		
		// アップロード待機中ファイルの削除ボタン
		var _$deleteButtons = _$uploadFiles.find('.deleteButton');
		_$deleteButtons.each(function(){
			var _$self = $(this);
			_$self.bind('click', function(){
				var _$li = _$self.closest('li').hide();
				var targetName = _$self.data('target');
				switch(targetName){
					case 'resume':
						_$FU_resume[0].value = '';
						break;
					case 'apply':
						_$FU_apply[0].value = '';
						break;
				}
				_manager.fileDeleted();
			});
		});
		
		// テキストエリア
		var _$textarea = _$self.find('.textarea');
		_$textarea.each(function(){
			var _$self = $(this);
			var $db = _$self.find('.deleteButton');
			var $ta = _$self.find('textarea');
			
			// 「×」ボタンが押されたときの処理
			$db.bind('click', function(){
				$ta[0].value = '';
				$db.hide();
				$ta.outerHeight(70+'px');
				_manager.reflesh();
			})
			
			// テキストエリア内でキー入力されたときの処理
			$ta.bind('keyup', function(){
				if($ta[0].value.length > 0) {
					$db.show();
				} else {
					$db.hide();
				}
				_manager.reflesh();
			});
			
			// テキストエリアに文字入力に準ずる操作が行われた時の処理
			$ta.bind('change keyup keydown paste cut', function(){
				if ($ta.outerHeight() > this.scrollHeight){
					$ta.height(1);
					if(Number($ta.height() < 70)){
						$ta.outerHeight(70+'px');
					}
				}
				while ($ta.outerHeight() < this.scrollHeight){
					$ta.height($ta.height() + 2);
				}
				_manager.reflesh();
			});
			
		});
		
		
	});
	
}

/* =========================================================
DialogueThread（画面右側のペイン）
========================================================= */
var DialogueThread = function(){
	
	this.NAME = 'DialogueThread';
	
	var _manager = null;
	this.setManager = function(m){
		_manager = m;
	}
	
	//---
	
	var _$thread = $('#thread');
	var _$threads = _$thread.find('.thread');
	
	//---
	
	/**
	 * 初期化する
	 */
	this.init = function(){
		
		// 一番最初に配置されているスレッドをアクティブ化
		_$threads.eq(0).addClass('js-isActive');
		
		setupSlideContents();
		setupHeightControl();
		setupArticles();
		
	}
	
	/**
	 * 指定されたスレッドを表示させる
	 */
	this.showThread = function(targetName){

		_$threads.hide();
		_$threads.removeClass('js-isActive');
		
		var _$targetThread = $(_$thread.find('#'+targetName));
		_$targetThread.addClass('js-isActive');
		_$targetThread.show();
		
	}
	
	//---
	
	/**
	 * スマホ版のスライドコンテンツを実現させる処理
	 */
	function setupArticles(){
		_$threads.each(function(){
			
			var $thread = $(this);
			var $articles = $thread.find('.message article');
			$articles.bind('mouseenter', function(){
				// PCのみ処理
				if(check_isSMP()) return;
				var $a = $(this);
				$a.addClass('js-isEntered');
			});
			$articles.bind('mouseleave', function(){
				// PCのみ処理
				if(check_isSMP()) return;
				var $a = $(this);
				$a.removeClass('js-isEntered');
			});
			
			// PC版における編集・削除ボタン押下に対する処理
			$articles.find('.deleteButton').bind('click', function(){
				_manager.showModalDelete();
			});
			$articles.find('.editButton').bind('click', function(){
				_manager.onClickedEditArticle();
			});

			// スマホで長押しした際の削除確認モーダル
			var timer = null;
			$articles.bind('touchend', function() {
				clearInterval(timer);
			});
			$('#thread .scroll').bind('scroll', function() {
				clearInterval(timer);
			});
			$articles.bind('touchstart', function() {
				timer = setTimeout(function(){
					_manager.showModalSelect();
				}, 500);
			});
			
		});
	}
	
	/**
	 * スマホ版のスライドコンテンツを実現させる処理
	 */
	function setupSlideContents(){
		$('#thread').simpleSidebar({
			opener: '.js-threadOpener',
			wrapper: '#js-slideContents',
			sidebar: {
				align: 'right',
				closingLinks: '#js-sbCloseButton',
				gap: 0
			},
			sbWrapper: {
				display: true,
				overflowY: 'visible'
			},
			mask: {
				display: false
			}
		});
	}

	/**
	 * 高さを調整するための処理
	 */
	function setupHeightControl(){
		$(window).bind('resize', function(){
			setTimeout(function(){
				var w = $(window).width();
				$('#thread').width(w);
				$('#thread').css({
					right: -w + 'px'
				});
				$('#js-slideContents').css({
					left: 0,
					right: 0
				});
			}, 500);
		}).trigger('resize');
	}
	
	/**
	 * スマホかPCを判定する
	 */
	function check_isSMP() {
		return navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i);
	}	
		
}

/* =========================================================
DialogueModal（「編集」「削除」の確認モーダル）
========================================================= */
var DialogueModal = function(){
	
	this.NAME = 'DialogueModal';
	
	var _manager = null;
	this.setManager = function(m){
		_manager = m;
	}
	
	//---
	
	var _self = this;
	var _$modal = $('#modalEditConfirm');
	var _$editButton = _$modal.find('.editButton');
	var _$toDeleteButton = _$modal.find('.toDeleteButton');
	var _$cancelButton = _$modal.find('.cancelButton');
	var _$deleteButton = _$modal.find('.deleteButton');
	
	_$modal.bind('click', function(event){
		event.stopPropagation();
	})
	_$editButton.bind('click', function(event){
		_manager.onClickedEditArticle();
	})
	_$toDeleteButton.bind('click', function(event){
		_self.showModeDelete();
	})
	_$cancelButton.bind('click', function(event){
		_self.hide();
	})
	_$deleteButton.bind('click', function(event){
		_manager.onClickedDeleteArticle();
	})
	
	this.showModeSelect = function(){
		_$modal.removeClass('js-modeDelete');
		_$modal.addClass('js-modeSelect');
		_$modal.show();
		setTimeout(function(){
			$(window).bind('click', function(){
				_self.hide();
			});
		}, 50);
	}
	
	this.showModeDelete = function(){
		_$modal.removeClass('js-modeSelect');
		_$modal.addClass('js-modeDelete');
		_$modal.show();
	}
	
	this.hide = function(){
		_$modal.hide();
		$(window).unbind('click');
	}
	
}

/* =========================================================
疑似ローダー
========================================================= */
var Loader = function(){
	
	var _flagShowLoader = null;
	var IS_ACTIVE = true;
	
	// 初めての訪問か判定
	var hasVisited = $.cookie('hasVisited');
	if(hasVisited) {
		hasVisited = true;
	} else {
		hasVisited = false;
	}
	
	// COOKIEを更新
	$.cookie('hasVisited', 1, { expires: 7 });
	
	// 同じドメインからの遷移か判定
	var referrer = document.referrer;
	var current = window.location.host;
	var isSameDomain = (referrer.lastIndexOf(current) > 0);
	if(isSameDomain || hasVisited) {
		_flagShowLoader = false;
	} else {
		_flagShowLoader = true;
	}
	
	var _$root = $('#loader');
	var _$loader = $('#js-loader');
	var _$body = $('body');
	
	var prop = {width: '100%'};
	var opt = {
		duration: 1500,
		easing: 'swing',
		complete: function(){
			_$body.removeClass('js-isLoading');
			_$root.fadeOut();
		}
	};
	
	this.start = function(){
		
		// ローダーを表示
		if(IS_ACTIVE && _flagShowLoader) {
			_$loader.animate(prop, opt);
		}
		
		// 即座にコンテンツを表示
		else {
			_$body.show();
			_$body.removeClass('js-isLoading');
			_$root.hide();
		}
	}
	
}

/* =========================================================
いいね
========================================================= */
var ModalLink = function(){
	
	var _self = this;
	var _$modalLike = $('#modalLike');
	var _$closers = _$modalLike.find('.js-closer');
	
	function addBodyClick() {
		$('#sb-wrapper').bind('click', _self.hide);
	}
	function removeBodyClick() {
		$('#sb-wrapper').unbind('click', _self.hide);
	}
	
	this.show = function() {
		_$modalLike.show();
		addBodyClick();
	}
	this.hide = function() {
		_$modalLike.hide();
		removeBodyClick();
	}
	
	this.init = function(){
		$('.js-callModalLike').each(function(){
			var _$button = $(this);
			_$button.bind('click', function(event){
				event.stopPropagation();
				if(_$button.hasClass('liked')) {
					_$button.removeClass('liked');
				} else {
					_self.show();
				}
			});
		});
		_$closers.each(function(){
			var _$button = $(this);
			_$button.bind('click', function(){
				_self.hide();
			});
		});
			
	}
	
}

/* =========================================================
「ページの先頭へ」ボタン
========================================================= */
var Pagetop = function(){
	
	var _$button = $('#pagetop');
	
	this.deploy = function(){
		$(window).bind('scroll', function(){
			var st = $(window).scrollTop();
			if(st > 200) {
				_$button.stop().fadeIn();
			} else {
				_$button.stop().fadeOut();
			}
		});
	}
	
}

/* =========================================================
コンテンツのステータスを管理する
========================================================= */
var ContentsStatusManager = function() {
	
	var $searchBox = $('#js-searchBox');
	var $workBox = $('#js-workBox');
	var $aside = $('#sidebar');
	
	this.hideSearchBox = function() {
		var $searchButton = $('header .searchButton');
		$searchButton.removeClass('js-isActive');
		$searchBox.hide();
	}
	this.hideWorkBox = function() {
		$workBox.hide();
	}
	this.hideAside = function() {
		var $menuButton = $('#menuButton');
		$menuButton.removeClass('js-isActive');
		$('body').removeClass('js-isSidebarShown');
		$aside.hide();
	}
	
}

/* =========================================================
トップページ「カバー画像」:Vegas
========================================================= */
var VegasCover = function(){
	
	var _$root = null;
	var _vegas = null;
	var _mediaStatus = null;
	
	var _vegasAry__PC = [
		{ src: "/assets/images/top/top-cover_ph01.jpg" },
		{ src: "/assets/images/top/top-cover_ph02.jpg" },
		{ src: "/assets/images/top/top-cover_ph03.jpg" },
		{ src: "/assets/images/top/top-cover_ph04.jpg" },
		{ src: "/assets/images/top/top-cover_ph05.jpg" },
		{ src: "/assets/images/top/top-cover_ph06.jpg" }
	];
	var _vegasAry__SP = [
		{ src: "/assets/images/top/top-cover_ph01__SP.jpg" },
		{ src: "/assets/images/top/top-cover_ph02__SP.jpg" },
		{ src: "/assets/images/top/top-cover_ph03__SP.jpg" },
		{ src: "/assets/images/top/top-cover_ph04__SP.jpg" },
		{ src: "/assets/images/top/top-cover_ph05__SP.jpg" },
		{ src: "/assets/images/top/top-cover_ph06__SP.jpg" }
	];
	
	function create(){
		
		var isSMP = getIsSP();
		
		// PCとSP間が切り替わったら処理する
		if(_mediaStatus == isSMP && _mediaStatus != null) return;
		_mediaStatus = isSMP;
		
		if(isSMP) {
//			var h = $(window).height() - 45;
//			_$root.height(h);
//			$("#page-top #S-cover .table").height(h);
		} else {
			_$root.height(500);
			$("#page-top #S-cover .table").height(500);
		}
		var vegasAry = isSMP? _vegasAry__SP : _vegasAry__PC;
		var initSlide = Math.random() * (vegasAry.length);
		initSlide = Math.floor(initSlide);
		
		_$root = $("#page-top #S-cover .js-vegas");
		
		try {
			_$root.vegas('destroy');
		} catch(e) {
			
		}
		
		_$root.vegas({
			slides: vegasAry,
			slide: initSlide,
			valign: "top"
		});
		
	}
	
	this.init = function(){
		_$root = $("#page-top #S-cover .js-vegas");
		$(window).bind('resize', create).trigger('resize');
		
	}
	
}

/* =========================================================
汎用関数
========================================================= */
function getIsSP() {
	return $(window).width() < 769;
}

/* =========================================================
共通部分の処理
========================================================= */
function pageCommon() {
	
	var _contentsStatusManager = new ContentsStatusManager();
	
	// 「検索」の挙動
	var $searchBox = $('#js-searchBox');
	$('header .searchButton').bind('click', function(){
		
		_contentsStatusManager.hideWorkBox();
		var $searchButton = $(this);
		$searchButton.toggleClass('js-isActive');
		$searchBox.toggle();
		
		$('body').removeClass('js-isSidebarShown');

	});
	
	// 「職種で探す」の挙動
	var $workBox = $('#js-workBox');
	$('.js-callWorkButton').bind('click', function(){
		_contentsStatusManager.hideAside();
		_contentsStatusManager.hideSearchBox();
		
		var $workButton = $(this);
		$workButton.toggleClass('js-isActive');
		$workBox.show();
		
		if ($workBox.css('display') == 'block') {
			$('body').addClass('js-isSidebarShown');
		} else {
			$('body').removeClass('js-isSidebarShown');
		}
		
	});
	$('header .workBox .js-closeButton').bind('click', function(){
		$workBox.hide();
		$('body').removeClass('js-isSidebarShown');
	});
	
	// スマホ版サイドバーの挙動
	var $sidebar = $('#sidebar');
	$('#menuButton').bind('click', function(){
		_contentsStatusManager.hideSearchBox();
		_contentsStatusManager.hideWorkBox();
		var $menuButton = $(this);
		$menuButton.toggleClass('js-isActive');
		$sidebar.toggle();
		
		if ($sidebar.css('display') == 'block') {
			$('body').addClass('js-isSidebarShown');
		} else {
			$('body').removeClass('js-isSidebarShown');
		}
		
	});
	
	// ヘッダのバルーン
	$('header .baloonSet .category').bind('mouseenter', function(){
		var $category = $(this);
		var $target = $category.find('.baloon');
		var w = $category.find('.button').width() / 2;
		$target.find('.arrow').css({left: w});
		$target.stop().css({
			display: 'block',
			opacity: 0,
			'margin-top': '5px'
		});
		$target.animate({
			opacity: 1,
			'margin-top': '0px'
		},{duration: 200, queue: false});
	});
	$('header .baloonSet .category').bind('mouseleave', function(){
		var $target = $(this).find('.baloon');
		$target.animate({
			opacity: 0,
			'margin-top': '5px'
		}, function(){
			$target.stop().css({
				display: 'none'
			});
		});
	});
	
	// 条件を指定して検索
	var $currentUnitSearchBaloon = null;
	$('.unit-search').each(function(){
		var _$root = $(this);
		var _$selectArea = $(this).find('.selectArea');
		_$selectArea.each(function(){
			
			var _$self = $(this);
			var _$selector = _$self.find('.pseudoSelector');
			var _$baloon = _$self.find('.baloon');
			var _$button = _$self.find('.button input[type="button"]');
			
			_$selector.bind('click', function(){
				if($currentUnitSearchBaloon !== _$baloon && $currentUnitSearchBaloon) {
					$currentUnitSearchBaloon.hide();
				}
				_$baloon.toggle();
				$currentUnitSearchBaloon = _$baloon;
			});
			_$button.bind('click', function(){
				_$baloon.hide();
			});
		});
	});
	
	// いいね
	var modalLink = new ModalLink();
	modalLink.init();
	
}

/* =========================================================
エントリーポイント
========================================================= */
$(function(){
	
	// 「ページの先頭へ」パーツ
	var pagetop = new Pagetop();
	pagetop.deploy();
	
	// 疑似ローダーの表示
	var loader = new Loader();
	loader.start();
	
	// 共通部分の処理
	pageCommon();
	
	/* ページごとの独自処理
	---------------------------------------------*/
	
	// ①TOP
	if($('#page-top').size() > 0){
		$.getScript('/assets/js/page/01_top.js');
	}
	
	// ②WORK TOP
	if($('#page-work-top').size() > 0){
		$.getScript('/assets/js/page/02_work_top.js');
	}
	
	// ④WORK 求人リスト一覧
	if($('#page-work-recruitlist').size() > 0){
		$.getScript('/assets/js/page/04_work_recruitlist.js');
	}
	
	// ⑥LIFE TOP
	if($('#page-life-top').size() > 0){
		$.getScript('/assets/js/page/06_life_top.js');
	}
	
	// ⑦LIFE 《カテゴリー》 TOP
	if($('.page-life-category-top').size() > 0){
		$.getScript('/assets/js/page/07_life_category_top.js');
	}
	
	// ⑨LIFE　《カテゴリー》　記事
	if($('.page-life-category-article').size() > 0){
		$.getScript('/assets/js/page/09_life_category_article.js');
	}
	
	// ⑪NEWS
	if($('#page-news').size() > 0){
		$.getScript('/assets/js/page/11_news.js');
	}
	
	// ⑲会員登録：2/3
	if($('#page-regist02').size() > 0){
		$.getScript('/assets/js/page/19c_regist02.js');
	}
	
	// ⑳企業への応募
	if($('#page-apply-top').size() > 0){
		$.getScript('/assets/js/page/20a_apply_top.js');
	}
	
	// ㉛Info
	if($('#page-info-applicant').size() > 0){
		$.getScript('/assets/js/page/31_info_applicant.js');
	}
	
	// ㉞WEB履歴書　職務経歴①
	if($('#page-resume-career01').size() > 0){
		$.getScript('/assets/js/page/34c_resume_career01.js');
	}
	
	// ㉞WEB履歴書　職務経歴②
	if($('#page-resume-career02').size() > 0){
		$.getScript('/assets/js/page/34d_resume_career02.js');
	}
	
	// ㉟「いいね」した企業
	if($('#page-liked-company').size() > 0){
		$.getScript('/assets/js/page/35_liked_company.js');
	}
	
	// ㊱応募企業 メッセージ①
	if($('#page-message-company').size() > 0){
		$.getScript('/assets/js/page/36_message_company.js');
	}
	
	// ㊶Info
	if($('#page-info-company').size() > 0){
		$.getScript('/assets/js/page/41_info_company.js');
	}
	
	// ㊺応募者 メッセージ
	if($('#page-message-applicant').size() > 0){
		$.getScript('/assets/js/page/45_message_applicant.js');
	}
	
	// ㊻スカウト メッセージ（A）
	if($('#page-message-scout').size() > 0){
		$.getScript('/assets/js/page/46_message_scout.js');
	}
	
	
	/* スムーススクロール
	---------------------------------------------*/
	$('a[href^="#"]').click(function(){ 
		var ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var speed = 500; //移動完了までの時間(sec)を指定
		var href= $(this).attr("href"); 
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		if(ww > 840) position -= $('header').outerHeight();
		$("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	});

});