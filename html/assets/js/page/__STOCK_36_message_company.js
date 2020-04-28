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
	
	this.showModalEditConfirm = function(){
		_modal.show();
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
		var controlOffset = _$thread.find('.js-isActive .control').outerHeight();
		var threadHeight = H_list - controlOffset - paddingOffset;
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
			$db.bind('click', function(){
				$ta[0].value = '';
				$db.hide();
			})
			$ta.bind('keyup', function(){
				if($ta[0].value.length > 0) {
					$db.show();
				} else {
					$db.hide();
				}
				_manager.reflesh();
			});
			
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
				_manager.showModalEditConfirm();
			});
			$articles.find('.editButton').bind('click', function(){
				alert("編集ボタンが押されました");
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
					_manager.showModalEditConfirm();
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
	var _$cancelButton = _$modal.find('.cancelButton');
	var _$deleteButton = _$modal.find('.deleteButton');
	
	_$modal.bind('click', function(event){
		event.stopPropagation();
	})
	_$cancelButton.bind('click', function(event){
		_self.hide();
	})
	_$deleteButton.bind('click', function(event){
		alert("削除ボタンが押されました");
	})
	
	this.show = function(){
		_$modal.show();
		setTimeout(function(){
			$(window).bind('click', function(){
				_self.hide();
			});
		}, 50);
	}
	
	this.hide = function(){
		_$modal.hide();
		$(window).unbind('click');
	}
	
}

/* =========================================================
エントリーポイント
========================================================= */
$(function(){
	var dialogue = new Dialogue();
});






