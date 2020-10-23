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
    draggable: false,
    prevArrow: '    <svg class="gallery-arrow mod-prev">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#arr-left"></use>\n' +
    '    </svg>',
  nextArrow: '    <svg class="gallery-arrow mod-next">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#arr-right"></use>\n' +
    '    </svg>',
  })

    $('.tech-list-item').on('click', function() {
      $(this).next().slideToggle()
    })

    $('.tab-item').on('click', function() {
      $(this).next().slideToggle()
    })

  }