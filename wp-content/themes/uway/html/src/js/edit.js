(function ($) {

    function toggleLogin() {
        $('#login-toggle').on('click', function (e) {
            e.preventDefault();
            $.backdrop_show({
                callbackshow: function () {
                    $('#login-toggle').parent().addClass('current-menu-item');
                    $('.panel-login').addClass('expand');
                    $('#btn-menu-sp').trigger('click');
                },
                callbackhide: function () {
                    $('#login-toggle').parent().removeClass('current-menu-item');
                    $('.panel-login').removeClass('expand');
                },
                class: "for-panel-menu"
            });
        });

        $('#btn-close-login').on('click', function (e) {
            e.preventDefault();
            $.backdrop_hide({
                callbackhide: function () {
                    $('.panel-login').removeClass('expand');
                    $('#login-toggle').parent().removeClass('current-menu-item');
                }
            });
        });
    }

    function toggleLoginSignup() {
        $('#sign-up-show').on('click', function (e) {
            e.preventDefault();
            $('#signup-fields').hide();
            $('#login-fields').fadeIn();
        });
        $('#login-show').on('click', function (e) {
            e.preventDefault();
            $('#login-fields').hide();
            $('#signup-fields').fadeIn();
        });
    }

    var cart_bag = function () {
        $('.btn-cart').on('click', function (e) {
            // e.preventDefault();
            var cartbag = $(this);
            cartbag.toggleClass('opened');

            var outsideClickListener = function (event) {
                if (!$(event.target).find('.btn-cart').length) {
                } else {
                    if ($('.btn-cart').hasClass('opened')) {
                        $('.btn-cart').removeClass('opened');
                        removeClickListener();
                        $('body').removeClass('modal-open');
                    }
                }
            };

            var removeClickListener = function () {
                document.removeEventListener('click', outsideClickListener);
            };
            document.addEventListener('click', outsideClickListener);
        });
    };

    var cart_bag_hover = function () {
        $('.btn-cart').mouseenter(function (e) {
            $("body").disablescroll();
            return false;
        }).mouseleave(function () {
            $("body").disablescroll("undo");
        });
        $("body").on("mouseenter", ".bag-hover .scroll-wrapper", function () {
            $(this).focus();
            $(this).select();
            if ($(this).find(".scroll-y .scroll-bar").height() > 0) { window.UserScrollDisabler_Is = false; }
        }).on("mouseleave", ".bag-hover .scroll-wrapper", function () {
            window.UserScrollDisabler_Is = true;
        });
    };

    function ven_clickable_cart() {
        $('.header-page .show-cart').on("click", function (e) {
            e.preventDefault();
            var __this = $(this);
            $.backdrop_show({
                callbackshow: function () {
                    $(".bag-hover").addClass("opened");
                },
                callbackhide: function () {
                    $(".bag-hover").removeClass("opened");
                }
            });
        });
        $(".bag-hover").on("click", ".btn-close-cart", function (e) {
            e.preventDefault();
            $.backdrop_hide({
                callbackhide: function () {
                    $(".bag-hover").removeClass("opened");
                }
            });
        });
    }
    function ui_videoClick() {
        $(".home-play-btn").on("click", function () {
            var frame = $(this).closest(".video-holder"),
                linkVid = frame.data("link");
            $(this).hide();
            frame.find("img").fadeOut();
            if (linkVid.indexOf("vimeo") > -1) {
                frame.append('<iframe src="https://player.vimeo.com/video/' + vimeo_parser(linkVid) + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            }
            else {
                frame.append('<iframe src="https://www.youtube.com/embed/' + youtube_parser(linkVid) + '?autoplay=1"  frameborder="0" allowfullscreen"></iframe>');
            }
        });
    }

    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    function vimeo_parser(url) {
        var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
        return m ? m[2] || m[1] : null;
    }

    $(function () {

        // PRELOADER
        if (sessionStorage.getItem("isFirstRun")) { $("#preloader").addClass("d-none"); }
        $(window).on("load", function (e) { $("#preloader").fadeOut(); this.sessionStorage.setItem("isFirstRun", true); });
        setTimeout(function () { $("#preloader").fadeOut(); this.sessionStorage.setItem("isFirstRun", true); }, 4000);

        toggleLogin();
        toggleLoginSignup();
        // cart_bag();
        ven_clickable_cart();
        /*CART EVENT*/
        $('.delete-header-cart').on("click", function () {
            $(this).closest('li').fadeOut(function () {
                $(this).remove();
            });
        });
        /*END CART EVENT*/

        $(".list-social-js").jsSocials({
            showLabel: true,
            shares: [
                { share: "facebook", label: "Facebook", logo: "fa fa-facebook" }
            ]
        });

        ui_videoClick();
    });
})(jQuery);


