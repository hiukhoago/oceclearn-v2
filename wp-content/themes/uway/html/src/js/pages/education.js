(function ($) {

    $(function () {

        if ($('.education .tab-navi-learn').length > 0) {
            if (window.location.hash) {
                var hash = window.location.hash.substring(1);
                $(window).scrollTop($('.education .tab-navi-learn').offset().top - ($('.header-page').height() + 0));
                $('.tab-navi-learn a[data-hash=' + hash + ']').trigger('click');
            }
        }

    });
})(jQuery); 