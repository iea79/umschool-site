/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var app = {
    pageScroll: '',
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= app.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= app.mdWidth && $(window).width() < app.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= app.smWidth && $(window).width() < app.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < app.smWidth; } // < 768
function isIOS() { return app.iOS(); } // for iPhone iPad iPod
function isTouch() { return app.touchDevice(); } // for touch device


$(document).ready(function() {
    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	// Запрет "отскока" страницы при клике по пустой ссылке с href="#"
	$('[href="#"]').click(function(event) {
		event.preventDefault();
	});

    // Inputmask.js
    $('[type=tel]').inputmask("+7(999)999 99 99",{ showMaskOnHover: false });
    formSubmit();

    if (!isXsWidth()) {
        $('.scrollbar').scrollbar();
    }

    // checkOnResize();

    togglTabs();

    $('.teachersSlider').slick({
        dots: false,
        arrows: false,
        infinite: false,
        fade: true,
        // speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
    });

    $('.teachersSlider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.teachers__listItem').removeClass('active');
        $('.teachers__listItem').eq(nextSlide).addClass('active');
        // console.log($('.teachers__listItem').eq(nextSlide).offset());
    });

    $('.teachers__listItem').on('click', function() {
        $('.teachers__listItem').not($(this)).removeClass('active');
        $(this).addClass('active');
        $('.teachersSlider').slick('goTo', $(this).index());
    });

    $('.tooltip').tooltipster({
        trigger: 'custom',
        triggerOpen: {
            mouseenter: true,
            touchstart: true,
        },
        triggerClose: {
            mouseleave: true,
            scroll: true,
            tap: true,
        }
    });

    $('.modal').on('show.bs.modal', function() {
        if ($('body').hasClass('modal-open')) {
            $('.modal.in').modal('hide');
        }
    });

    srollToId();
    filterTeacher();
    openProfList();
    showMoreReviews();
});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (app.resized == windowWidth) { return; }
    app.resized = windowWidth;

	// checkOnResize();
});

function checkOnResize() {
    // fontResize();
}

function showMoreReviews() {
    $('.reviews__more .btn').on('click', function() {
        $('.reviews__pane.active .reviews__item').show();
        $(this).hide();
    });
}

function filterTeacher() {
    let classFilter = $('.teaching__tab');
    let num = $('.teaching__tab.active').data('class');
    let profFilter = $('.teaching__dropItem');
    let profFilterCurrent = $('.teaching__current');
    let prof = $('.teaching__dropItem.active').data('prof');
    let teacher = $('.teachers__item');
    let title = $('.teaching .section__title');
    let titleText = 'Все преподаватели онлайн-школы «Умскул»';
    let numTitle = "";
    let profTitle = "";

    classFilter.on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            // changeFilterData();
        } else {
            classFilter.removeClass('active');
            $(this).addClass('active');
        }
        changeFilterData();
        changeTitleText(numTitle, profTitle);
    });

    profFilter.on('click tap', function() {
        profFilter.removeClass('active');
        $(this).addClass('active');
        profFilterCurrent.text($(this).text());
        changeFilterData();
        changeTitleText(numTitle, profTitle);
    });

    function changeFilterData() {
        num = $('.teaching__tab.active').data('class');
        prof = $('.teaching__dropItem.active').data('prof');
        numTitle = $('.teaching__tab.active').data('classTitle');
        profTitle = $('.teaching__dropItem.active').data('profTitle');

        // console.log(num);
        // console.log(prof);

        teacher.hide();

        teacher.each(function(index, el) {
            if (prof == "all") {
                if (typeof num !== 'undefined' && $(el).data('class') === num) {
                    $(el).show();
                } else {
                    $(el).show();
                }
            } else {
                if ($(el).data('prof') === prof) {
                    $(el).show();
                }
                if (typeof num !== 'undefined' && $(el).data('class') !== num) {
                    $(el).hide();
                }
            }
        });

    }

    function changeTitleText(num, prof) {
        if (!num) {num = '';}
        if (!prof) {prof = '';}

        title.text('Все преподаватели ' + prof +' онлайн-школы «Умскул» ' + num);
    }
}

function openProfList() {
    let toggle = $('.choosen__current');
    let wrap = $('.choosen__list');
    let item = $('.choosen__listItem');

    toggle.on('click tap', function() {
        $(this).closest('.choosen__list').toggleClass('open');
    });

    item.on('click tap', function() {
        $(this).closest('.choosen__list').toggleClass('open');
        $(this).closest('.choosen__list').find('.choosen__current').text($(this).text());
    });
}

function togglTabs() {
    let tab = $('[data-tab]');

    tab.on('click', function() {
        let id = $(this).data('tab'),
            wrapp = $(this).parent(),
            tabs = wrapp.find('[data-tab]');
        tabs.removeClass('active');
        $(this).addClass('active');

        $('#'+id).addClass('active').siblings().removeClass('active');
    });
}

// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
// function stikyMenu() {
//     let HeaderTop = $('header').offset().top + $('.home').innerHeight();
//     let currentTop = $(window).scrollTop();
//
//     setNavbarPosition();
//
//     $(window).scroll(function(){
//         setNavbarPosition();
//     });
//
//     function setNavbarPosition() {
//         currentTop = $(window).scrollTop();
//
//         if( currentTop > HeaderTop ) {
//             $('header').addClass('stiky');
//         } else {
//             $('header').removeClass('stiky');
//         }
//
//         $('.navbar__link').each(function(index, el) {
//             let section = $(this).attr('href');
//
//             if ($('section').is(section)) {
//                 let offset = $(section).offset().top;
//
//                 if (offset <= currentTop && offset + $(section).innerHeight() > currentTop) {
//                     $(this).addClass('active');
//                 } else {
//                     $(this).removeClass('active');
//                 }
//             }
//         });
//     }
// };

function openMobileNav() {
    $('.navbar__toggle').on('click', function() {
        var wrapp = $('.nav');

        wrapp.toggleClass('open');
    });
};
openMobileNav();

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $('[data-scroll-to]').click( function(){
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            $('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
        }
        return false;
    });
}

function fontResize() {
    var windowWidth = $(window).width();
    if (windowWidth >= 1200) {
    	var fontSize = windowWidth/19.05;
    } else if (windowWidth < 1200) {
    	var fontSize = 60;
    }
	$('body').css('fontSize', fontSize + '%');
}

// Проверка направления прокрутки вверх/вниз
function checkDirectionScroll() {
    var tempScrollTop, currentScrollTop = 0;

    $(window).scroll(function(){
        currentScrollTop = $(window).scrollTop();

        if (tempScrollTop < currentScrollTop ) {
            app.pageScroll = "down";
        } else if (tempScrollTop > currentScrollTop ) {
            app.pageScroll = "up";
        }
        tempScrollTop = currentScrollTop;

    });
}
checkDirectionScroll();

// Видео youtube для страницы
function uploadYoutubeVideo() {
    if ($(".js-youtube")) {

        $(".js-youtube").each(function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $(this).css('background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)');

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $(this).append($('<img src="img/play-video.svg" alt="Play" class="video__play">'));

        });

        $('.video__play, .video__prev').on('click', function () {
            // создаем iframe со включенной опцией autoplay
            let wrapp = $(this).closest('.js-youtube'),
                videoId = wrapp.attr('id'),
                iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";

            if ($(this).data('params')) iframe_url += '&' + $(this).data('params');

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            let iframe = $('<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
            })

            // Заменяем миниатюру HTML5 плеером с YouTube
            $(this).closest('.video__wrapper').append(iframe);

        });
    }
};
uploadYoutubeVideo();

// Деление чисел на разряды Например из строки 10000 получаем 10 000
// Использование: thousandSeparator(1000) или используем переменную.
// function thousandSeparator(str) {
//     var parts = (str + '').split('.'),
//         main = parts[0],
//         len = main.length,
//         output = '',
//         i = len - 1;

//     while(i >= 0) {
//         output = main.charAt(i) + output;
//         if ((len - i) % 3 === 0 && i > 0) {
//             output = ' ' + output;
//         }
//         --i;
//     }

//     if (parts.length > 1) {
//         output += '.' + parts[1];
//     }
//     return output;
// };


// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
// document.addEventListener('click', function(e) {
//     var map = document.querySelector('#map-wrap iframe')
//     if(e.target.id === 'map-wrap') {
//         map.style.pointerEvents = 'all'
//     } else {
//         map.style.pointerEvents = 'none'
//     }
// })

// Простая проверка форм на заполненность и отправка аяксом
function formSubmit() {
    $("[type=submit]").on('click', function (e){
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');
        // console.log(form_data);

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    // $('#success').modal('show');
                    // console.log('success');
                    console.log(response);
                    // console.log(data);
                    // document.location.href = "success.html";
                },
                error: function (response) {
                    // $('#success').modal('show');
                    // console.log('error');
                    console.log(response);
                }
            });
        }

    });

    $('[required]').on('blur', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid');
        }
    });

    $('.form__privacy input').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });
}


// Проверка на возможность ввода только русских букв, цифр, тире и пробелов
// $('#u_l_name').on('keypress keyup', function () {
//     var that = this;
//
//     setTimeout(function () {
//         if (that.value.match(/[ -]/) && that.value.length == 1) {
//             that.value = '';
//         }
//
//         if (that.value.match(/-+/g)) {
//             that.value = that.value.replace(/-+/g, '-');
//         }
//
//         if (that.value.match(/ +/g)) {
//             that.value = that.value.replace(/ +/g, ' ');
//         }
//
//         var res = /[^а-яА-Я -]/g.exec(that.value);
//
//         if (res) {
//             removeErrorMsg('#u_l_name');
//             $('#u_l_name').after('<div class="j-required-error b-check__errors">Измените язык ввода на русский</div>');
//         }
//         else {
//             removeErrorMsg('#u_l_name');
//         }
//
//         that.value = that.value.replace(res, '');
//     }, 0);
// });
