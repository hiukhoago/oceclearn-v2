(function ($) {


    function initAnimDuration() {
        $('.fadeToLeft').each(function () {
            var duration = $(this).data('duration');
            $(this).css('transition', 'all ' + duration + ' .7s ease');
        });
    }

    var homeScrollEffect = function () {
        if ($('.home-effect').length < 1 || $(window).width() < 992) return;
        $('.scroll-effect').each(function () {
            if ($(window).scrollTop() + $(window).height() / 2 >= $(this).offset().top - $('.header-page').height()) {
                $(this).addClass('active');
            }
        })

    }

    $(function () {
        // initAnimDuration();
        // homeScrollEffect();
        // $(window).on('scroll', homeScrollEffect);
    });
})(jQuery);