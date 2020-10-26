window.onload = function () {

  var mediaQuery = window.matchMedia('(max-width: 1110px)');

  if (mediaQuery.matches) {
    $('.footer-block-header').on('click', function () {
      $(this).next().slideToggle()
    }) 
   }

  $('.project-view').slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 20000,
  })

  $('.pac-content').slick({
    draggable: false,
    prevArrow: '    <svg class="gallery-arrow mod-prev">\n' +
      '      <use xlink:href="/assets/img/sprite.svg#arr-left"></use>\n' +
      '    </svg>',
    nextArrow: '    <svg class="gallery-arrow mod-next">\n' +
      '      <use xlink:href="/assets/img/sprite.svg#arr-right"></use>\n' +
      '    </svg>',
  })

  $('.tech-list-item').on('click', function () {
    $(this).next().slideToggle()
  })

  $('.tab-item').on('click', function () {
    $(this).next().slideToggle()
  })

  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#name',
    removalDelay: 300, //delay removal by X to allow out-animation

		// When elemened is focused, some mobile browsers in some cases zoom in
		// It looks not nice, so we disable it:
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#name';
				}
			}
		}
	});

}
