(function ($) {
    function handleScrollDownEffect() {
        if (!$('.scroll-effect.active').is(':last-child')) {
            $('.scroll-effect.active').removeClass('active').next().addClass('active');
        }
    }
    function handleScrollUpEffect() {
        if (!$('.scroll-effect.active').is(':first-child')) {
            $('.scroll-effect.active').removeClass('active').prev().addClass('active');
        }
    }

    function initAnimDuration() {
        $('.fadeToLeft').each(function () {
            var duration = $(this).data('duration');
            $(this).css('transition', 'all ' + duration + ' .7s ease');
        });
    }

    function homeScrollEffect() {
        if ($('.home-effect').length < 1 || $(window).width() < 992) return;
        $(window).on('mousewheel', _.throttle(function (e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                handleScrollDownEffect();
            }
            else {
                handleScrollUpEffect();
            }
        }, 1200, { trailing: false }));
    }

    $(function () {
        // homeScrollEffect();
        // initAnimDuration();
    });
})(jQuery);