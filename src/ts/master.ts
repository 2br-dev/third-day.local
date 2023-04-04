import Lazy from 'vanilla-lazyload';
import * as M from 'materialize-css';

let lazy = new Lazy(undefined, document.querySelectorAll('.lazy'));
let modal = M.Modal.init(document.querySelectorAll('.modal'));

$(window).on('scroll', (e:JQuery.ScrollEvent) => {
	setupTimeline();
});

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