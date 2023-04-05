import Lazy from 'vanilla-lazyload';
import * as M from 'materialize-css';
import IMask from 'imask';

let lazy = new Lazy(undefined, document.querySelectorAll('.lazy'));
let modal = M.Modal.init(document.querySelectorAll('.modal'));
let elements = document.querySelectorAll('[type=tel]');
elements.forEach(el => {

	let mask = IMask(<HTMLInputElement>el, {
		mask: '+7 (000) 000-0000',
		lazy: false,
		placeholderChar: '_'
	});
})

$(window).on('scroll', (e:JQuery.ScrollEvent) => {
	setupTimeline();
});

if ($('#round-l-send').length) {
	$('body').on('click', '#round-l-send', sendMessage);
}

if ($('#bottom-form').length) {
	$('body').on('click', '#bottom-form', sendMessage);
}

$('form').find('input').each(function(){
	$(this).on('click', function () {
		$(this).removeClass('error');
	})
});

$('body').on('change', '[type=checkbox]', (e:JQuery.ChangeEvent) => {
	let el = <HTMLInputElement>e.currentTarget;
	let checked = el.checked;
	let sendBttn = $(el).parents('section').find('.send-bttn').get(0);
	
	if(checked){
		sendBttn?.classList.remove('disabled');
	}else{
		sendBttn?.classList.add('disabled');
	}
})

function sendMessage(e) {
	e.preventDefault();
	var error = false;
	var form = $(this).parents('form');
	form.find('input').each(function(){
		if($(this).prop('required') && $(this).val() == ''){
			$(this).addClass('error');
			error = true;
		}
	});

	if(!error){
		var formData = $(form).serialize();
		$.ajax({
			url: '/ajax.php',
			type: "POST",
			dataType: 'JSON',
			data: formData,
			success: function success(res) {
				if (res.success) {
					M.toast({
						html: "Заявка успешно отправлена!"
					});
					form[0].reset();
				} else {
					M.toast({
						html: "Не заполнены все обязательные поля"
					});
				}
			},
			error: function error(err) {
				M.toast({
					html: "Произошла ошибка. Попробуйет еще раз"
				});
				console.error(err);
			}
		});
	}else{
		M.toast({
			html: "Не заполнены все обязательные поля"
		});
	}
}

$('body').on('click', '.scroll-link', (e:JQuery.ClickEvent) => {
	e.preventDefault();

	let el = e.currentTarget;
	let hash = $(el).attr('href')?.substring(1);
	let top = $('#'+hash).offset()?.top;
	
	$('html, body').animate({
		scrollTop: top
	}, 400);
})

function setupTimeline()
{
	let windowHeight = window.innerHeight;
	let bottomLimit = windowHeight - windowHeight / 2;

	let scrollIndicator = <HTMLDivElement>document.querySelector('.timeline-indicator');
	let indicatorTop = scrollIndicator.getClientRects()[0].top;

	let scrollIndicatorContainer = scrollIndicator.parentElement;
	let parentHeight = scrollIndicatorContainer?.clientHeight || 0;

	if((bottomLimit - indicatorTop) < (parentHeight - 140)){
		scrollIndicator.style.height = (bottomLimit - indicatorTop) + "px"
	}else{
		scrollIndicator.style.height = 'calc(100% - 140px)';
	}
	
	$('.timeline-entry').each((index:number, el:HTMLElement) => {
		let elTop = el.getClientRects()[0].top;

		if(elTop < bottomLimit){
			$(el).addClass('shown');
		}else{
			$(el).removeClass('shown');
		}

		if($('.shown').length){
			let count = $('.shown').length;
			$('.shown').removeClass('last');
			(<HTMLDivElement>$('.shown').get(count - 1)).classList.add('last');
		}
	});
}
