// Модальные окна

$('.popup-with-form').magnificPopup({
  type: 'inline',
  preloader: false,
  focus: '#name',
  removalDelay: 300, //delay removal by X to allow out-animation


  callbacks: {
    beforeOpen: function () {
      this.st.mainClass = this.st.el.attr('data-effect');
      if ($(window).width() < 700) {
        this.st.focus = false;
      } else {
        this.st.focus = '#name';
      }
    }
  }
});

// Мобильное меню, ивенты кнопки

const menuToggle = document.querySelector('#menu-toggle');
const mobileNavContainer = document.querySelector('#mobile-nav');
const buttonToggle = document.querySelector('.header__call-button');

menuToggle.onclick = function () {
  buttonToggle.classList.toggle('header__call-button_inactive');
  menuToggle.classList.toggle('menu-icon-active');
  mobileNavContainer.classList.toggle('navigation-mobile__list_active');
}

// Зона загрузки файлов

Dropzone.autoDiscover = false;

var myDropzone = new Dropzone("li#formUpload", {
  url: "#",
  maxFilesize: 2, // MB
  uploadMultiple: true,
  maxFiles: 5,
  acceptedFiles: '.jpg, .png, jpeg',
  dictDefaultMessage: 'Загрузите изображение',
});

// Шторка до/после

$(function () {
  $(".portfolio__slider").twentytwenty({
    no_overlay: true, //Do not show the overlay with before and after
  });
  // Mesure your images and divide by 2.
  var imgWidth = $(".portfolio__slider img").width() / 2;

  // On the container, apply a left offset of 50% (screen center) - minus half image width.
  $(".portfolio__slider").css({
    "position": "relative",
    "left": "calc(50% - " + imgWidth + "px)"
  });
});

//  Галерея выполненных работ слик-карусель

$('.js-gallery').slick({
  rows: 2,
  slidesPerRow: 4,
  prevArrow: '    <svg class="gallery-arrow mod-prev">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#angle-left"></use>\n' +
    '    </svg>',
  nextArrow: '    <svg class="gallery-arrow mod-next">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#angle-right"></use>\n' +
    '    </svg>',
  responsive: [{
      breakpoint: 1025,
      settings: {
        slidesPerRow: 3
      }
    },
    {
      breakpoint: 769,
      settings: {
        slidesPerRow: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesPerRow: 1
      }
    }
  ]
});

// Слик лайтбокс

$('.js-gallery').slickLightbox({
  src: 'src',
  itemSelector: '.js-gallery-popup img',
  background: 'rgba(0, 0, 0, .7)'
});

//  Маз слайдер

$('.maz-slider').slick({
  slidesToShow: 1,
  centerMode: true,
  dots: true,

  prevArrow: '    <svg class="maz-slider-arrow mod-prev">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#angle-left"></use>\n' +
    '    </svg>',
  nextArrow: '    <svg class="maz-slider-arrow mod-next">\n' +
    '      <use xlink:href="/assets/img/sprite.svg#angle-right"></use>\n' +
    '    </svg>'
});

// Сумматор таблицы прайс-листа

const service = document.querySelectorAll('.table-row');
const finalPrice = document.querySelector('.price-result');
const finalTime = document.querySelector('.time-result');

for (var i = 0; i < service.length; i++) {

  service[i].onclick = function () {

    this.classList.toggle('table-row-active');

    let currentCheckbox = this.querySelector('.table-row-checkbox');

    currentCheckbox.classList.toggle('table-row-checkbox_active');

    calcPrice();
    calcTime();
  }
}

function calcPrice() {

  let price = 0;

  for (var i = 0; i < service.length; i++) {
    if (service[i].classList.contains('table-row-active')) {
      price += parseInt(service[i].getAttribute('data-price'));
    }
  }

  finalPrice.innerHTML = price;
}

function calcTime() {

  let time = 0;

  for (var i = 0; i < service.length; i++) {
    if (service[i].classList.contains('table-row-active')) {
      time += parseInt(service[i].getAttribute('data-time'));
    }
  }

  finalTime.innerHTML = time;

}

// Фильтр грузовиков

var fActive = '';
const tabItems = document.querySelectorAll('.tab-item');

function filterCard(fabrication) {
  if (fActive != fabrication) {
    $('.painting-card__item').filter('.' + fabrication).fadeIn();
    $('.painting-card__item').filter(':not(.' + fabrication + ')').fadeOut();
    fActive = fabrication;
  }
}

$('#russian').on('click', function () {
  $(this).addClass('tab-item__active');
  $('.tab-item').not(this).removeClass('tab-item__active');
  filterCard('russia');
});

$('#europian').on('click', function () {
  $(this).addClass('tab-item__active');
  $('.tab-item').not(this).removeClass('tab-item__active');
  filterCard('europe');
});

$('#american').on('click', function () {
  $(this).addClass('tab-item__active');
  $('.tab-item').not(this).removeClass('tab-item__active');
  filterCard('usa');
});

$('#chineese').on('click', function () {
  $(this).addClass('tab-item__active');
  $('.tab-item').not(this).removeClass('tab-item__active');
  filterCard('china');
});

$('#all').on('click', function () {
  $(this).addClass('tab-item__active');
  $('.tab-item').not(this).removeClass('tab-item__active');
  $('.painting-card__item').fadeIn();
  fActive = 'all';
});

// Валидация формы

// Создаем ассоциативный массив с подготовленными данными для отправки

var formData = {}

var onError = function () {
  var messageContainer = this.element.nextElementSibling
  messageContainer.classList.remove('valid-message')
  messageContainer.classList.add('error-message')
  this.element.classList.remove('form-modal-window__input-item_valid')
  this.element.classList.add('form-modal-window__input-item_error')
  this.element.parentNode.classList.remove('valid-field')
  this.element.parentNode.classList.add('invalid-field')
  messageContainer.textContent = this.message
}

var onSuccess = function () {
  var messageContainer = this.element.nextElementSibling
  messageContainer.classList.remove('error-message')
  messageContainer.classList.add('valid-message')
  this.element.classList.remove('form-modal-window__input-item_error')
  this.element.classList.add('form-modal-window__input-item_valid')
  this.element.parentNode.classList.remove('invalid-field')
  this.element.parentNode.classList.add('valid-field')
  messageContainer.textContent = 'Данные введены корректно'
  formData[this.element.getAttribute('name')] = this.value
}

var phoneInputCta = new Validator.init(document.getElementById('phone-cta'), { 
  rules: {
    required: true,
    match: 'phone',
    min: 6,
    max: 12,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% цифр',
    max: 'Не больше %rule% цифр',
    match: 'Введите корректный номер телефона'
  },
  onError: onError,
  onSuccess: onSuccess
})

var nameInputCta = new Validator.init(document.getElementById('name-cta'), {
  rules: {
    required: true,
    match: 'letters',
    min: 2,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% букв'
  },
  onError: onError,
  onSuccess: onSuccess
})

var messageInputCta = new Validator.init(document.getElementById('textarea-cta'), {
  rules: {
    required: false
  },
  onError: function () {},
  onSuccess: function () {
    formData[this.element.getAttribute('name')] = this.value
  }
})

var phoneInputEpf = new Validator.init(document.getElementById('phone-epf'), { 
  rules: {
    required: true,
    match: 'phone',
    min: 6,
    max: 12,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% цифр',
    max: 'Не больше %rule% цифр',
    match: 'Введите корректный номер телефона'
  },
  onError: onError,
  onSuccess: onSuccess
})

var nameInputEpf = new Validator.init(document.getElementById('name-epf'), {
  rules: {
    required: true,
    match: 'letters',
    min: 2,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% букв'
  },
  onError: onError,
  onSuccess: onSuccess
})

var phoneInputFaq = new Validator.init(document.getElementById('phone-faq'), { 
  rules: {
    required: true,
    match: 'phone',
    min: 6,
    max: 12,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% цифр',
    max: 'Не больше %rule% цифр',
    match: 'Введите корректный номер телефона'
  },
  onError: onError,
  onSuccess: onSuccess
})

var nameInputFaq = new Validator.init(document.getElementById('name-faq'), {
  rules: {
    required: true,
    match: 'letters',
    min: 2,
  },
  messages: {
    required: 'Это поле обязательно для заполнения!',
    min: 'Введите минимум %rule% букв'
  },
  onError: onError,
  onSuccess: onSuccess
})

var messageInputFaq = new Validator.init(document.getElementById('textarea-faq'), {
  rules: {
    required: false
  },
  onError: function () {},
  onSuccess: function () {
    formData[this.element.getAttribute('name')] = this.value
  }
})

$('#phone-cta').on('change', function (e) {
  phoneInputCta.validate()
})

$('#name-cta').on('change', function (e) {
  nameInputCta.validate()
})

$('#message-cta').on('change', function (e) {
  messageInputCta.validate()
})

$('#phone-epf').on('change', function (e) {
  phoneInputEpf.validate()
})

$('#name-epf').on('change', function (e) {
  nameInputEpf.validate()
})

$('#phone-faq').on('change', function (e) {
  phoneInputFaq.validate()
})

$('#name-faq').on('change', function (e) {
  nameInputFaq.validate()
})

$('#message-faq').on('change', function (e) {
  messageInputFaq.validate()
})

$('.form-modal-window').on('submit', function (e) {
  e.preventDefault()
  $.ajax({
    url: "assets/php/send.php",
    type: "POST",
    data: formData,
    cache: false,

    beforeSend: function () {
        $('.form-modal-window__form-content').slideUp(500)
        $('.lds-ring').appendTo($('.form-modal-window')).show()  
        },

    success: function (response) {
        console.log(this)
        setTimeout(function() {
            var jsonData = JSON.parse(response)
            if (jsonData.res == '1') {
                $('.lds-ring').hide()
                $('.form-modal-window__header').text('Спасибо!')
                $('.form-content__subtext').text('Ваша заявка успешно отправлена')
                $('.checkmark').appendTo($('.form-modal-window')).show()    
            }
    
            else {
                console.log('Все плохо!')
            }
        }, 3000)

        setTimeout(function() {
            $('.checkmark').slideUp()
        }, 8000)
    },

    error: function() {
    }
  })
})

