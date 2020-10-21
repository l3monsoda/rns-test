window.onload = function() {

  $('.footer-block-header').on('click', function() {
    $(this).next().slideToggle()
    $(this).css("margin-bottom", "10px")
  })

  $('.project-view').slick({
    dots: true,
    autoplay: true,
    autoplaySpeed: 20000,
  })

  $('.pac-content').slick({
    prevArrow: '    <svg class="gallery-arrow mod-prev">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#arr-left"></use>\n' +
    '    </svg>',
  nextArrow: '    <svg class="gallery-arrow mod-next">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#arr-right"></use>\n' +
    '    </svg>',
  })

}