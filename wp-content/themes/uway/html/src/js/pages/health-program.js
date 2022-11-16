(function ($) {
    function ui_detect_video() {
        var resizeFullVimeo = function () {
            var $vid = $(".video-holder");
            var $ifr = $(".video-holder iframe");
            $ifr.css({
                height: "100%",
                width: "100%"
            });
            $ifr.attr("width", "");
            $ifr.attr("height", "");
            var w = $vid.width(),
                h = $vid.height();
            var ch = w * 9 / 16,
                cw = h * 16 / 9;
            if (ch > h) {
                $ifr.height(ch);

            } else {
                if (cw > w) {
                    $ifr.width(cw);
                }
            }
        };
        $(".play-btn").on("click", function () {
            var frame = $(this).closest(".video-holder"),
                linkVid = frame.data("link");
            $(this).hide().closest(".video-holder").addClass("ani");

            frame.find("img").fadeOut();

            setTimeout(function () {
                if (linkVid.indexOf("vimeo") > -1) {
                    frame.append('<iframe src="https://player.vimeo.com/video/' + vimeo_parser(linkVid) + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                }
                else {
                    frame.append('<iframe src="https://www.youtube.com/embed/' + youtube_parser(linkVid) + '?autoplay=1"  frameborder="0" allowfullscreen"></iframe>');
                }
                resizeFullVimeo();
            }, 1000);
            $(window).on("resize", resizeFullVimeo);
        });
        $(".close-btn").on("click", function () {
            var frame = $(this).closest(".video-holder");
            $(this).closest(".video-holder").removeClass("ani").find("iframe").remove();
            $(".play-btn").show();
            frame.find("img").fadeIn();
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

    function ui_get_start() {
        $(".btn-black-get").on("click", function (e) {
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;
            e.preventDefault();
            var href = $(this).attr("href");
            if ($('.box-day-scroll' + href).length < 1) { return; }
            $("html,body").animate({
                scrollTop: $('.box-day-scroll' + href).offset().top - offsetTop
            }, 800, function () {
                $(".box-day-scroll").removeClass("current-day");
                $(href).addClass("current-day");
            });
        });
    }
    function ui_recipes_modal() {
        $(".content-health a[data-toggle='modal-edit'], .box-day-scroll .introduction a[href*='/educations/']").on("click", function (e) {
            e.preventDefault();
            var url = $(this).data("url"),
                $iframe = $("<iframe>").attr({
                    src: url,
                    frameborder: 0,
                });
            $().ven_loading_show({ fixed: true, class: 'loading-recipes' });
            $("#recipes-modal .iframe_div").html($iframe);
            $iframe.on("load", function () {
                $().ven_loading_hide();
                $("#recipes-modal").modal("show");
                setTimeout(function () {
                    $(".iframe_div iframe").height($(".iframe_div iframe")[0].contentDocument.body.scrollHeight);
                }, 500);
            });
        });

        // for education popup
        $(".box-day-scroll .introduction a[href*='/educations/']").each(function (e) {
            var href = $(this).attr('href'); if (!href) { return; }
            href = href.replace("/educations/", "/wp-json/api/v1/get-short-des-programs/");
            href = href.substring(0, href.length - 1);
            $(this).data("url", href);
        });
    }
    function ui_sticky_bar() {
        var $sticky = $(".sticky-bar"),
            $target_footer = $("footer.footer-page");
        if ($sticky.length < 1) { return; }
        var fix_stick = function () {
            if ($(window).scrollTop() >= $sticky.offset().top - $("header.header-page").height()) {
                $sticky.find(".toggle-nav").addClass("fixed");
                $sticky.find(".wrap-sticky").addClass("fixed");
                $sticky.height($sticky.find(".wrap-sticky").outerHeight(true));
                if ($(window).scrollTop() >= $target_footer.offset().top - 120) {
                    $sticky.addClass("slideUp");
                } else {
                    $sticky.removeClass("slideUp");
                }
            }
            else {
                $sticky.find(".toggle-nav").removeClass("fixed");
                $sticky.find(".wrap-sticky").removeClass("fixed");
                $sticky.height("");
            }
        };
        $(window).on("scroll", fix_stick);
        fix_stick();

        // Click scroll anchor
        $('.sticky-bar nav li a').on("click", function (e) {
            e.preventDefault();
            var $href = $($(this).attr("href"));
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;

            if ($href.length > 0) {
                $('html, body').stop().animate({ scrollTop: $href.offset().top - offsetTop }, 800);
            }
        });

        var funcCheckRange = function () {
            if ($("header.header-page").length < 1 || $(".sticky-bar").length < 1) { return; }
            var $last = null;
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;
            $('.sticky-bar nav li a').each(function () {
                var $href = $($(this).attr("href"));
                if ($href.length > 0) {
                    if ($(window).scrollTop() + offsetTop + 5 >= $href.offset().top && $(window).scrollTop() + offsetTop + 5 < $href.offset().top + $href.outerHeight(true)) {
                        $last = $href;
                    }
                }
            });
            $(".sticky-bar nav li").removeClass("active");

            if ($last) {
                $(".sticky-bar nav li a[href='" + $last.selector + "']").parent().addClass("active");
            }
            else {
                if ($(window).width() < 992) {
                    $(".list-days li").first().addClass("active");
                }
            }
        };
        $(window).on("scroll.funcCheckRange", funcCheckRange);
        funcCheckRange();
        $(".list-days li").addClass("is-hide");

    }
    function ui_health_hub_modal() {
        $(".health-hub a[data-toggle='modal-edit']").on("click", function (e) {
            e.preventDefault();
            var url = $(this).data("url"),
                $iframe = $("<iframe>").attr({
                    src: url,
                    frameborder: 0,
                });
            $().ven_loading_show({ fixed: true, class: 'loading-recipes' });
            $("#health-hub-modal .iframe_div").html($iframe);
            $iframe.on("load", function () {
                $().ven_loading_hide();
                $("#health-hub-modal").modal("show");
                setTimeout(function () {
                    $(".iframe_div iframe").height($(".iframe_div iframe")[0].contentDocument.body.scrollHeight);
                }, 500);
            });
        });
    }
    var funcClick = function () {
        var $list_days = $(".sticky-bar .list-days"),
            $height_trans = $(".sticky-bar .content-center");
        $(".sticky-bar .toggle-nav").toggleClass("is-active");
        $height_trans.height($list_days.outerHeight(true)); $list_days.toggleClass("expand");
        if (!$(this).hasClass("is-active")) {
            $height_trans.height($list_days.outerHeight(true));
            $list_days.find('li:not(.active)').addClass("is-hide");
        } else {
            $list_days.find('li:not(.active)').removeClass("is-hide");
        }
        $height_trans.height($list_days.outerHeight(true));
        setTimeout(function () {
            $height_trans.height("");
        }, 500);
    };
    function ui_mobile_toggle() {
        var $toggle = $(".sticky-bar .toggle-nav");
        if ($toggle.length < 1) { return; }
        $toggle.on("click", funcClick);
    }
    function ui__click_nav() {
        if ($(window).width() < 992) {
            $(".sticky-bar .list-days a").on("click", funcClick);
        }
        $(window).on("resize", function () {
            if ($(window).width() < 992) {
                if ($(".list-days").hasClass("expand")) {
                    $(".list-days").removeClass("expand");
                    $(".list-days li").first().addClass("active");
                } else {
                    $(".list-days li").first().removeClass("active");

                }
            }
        });
    }
    $(function () {
        ui_detect_video();
        ui_get_start();
        ui_recipes_modal();
        ui_sticky_bar();
        ui_health_hub_modal();
        ui_mobile_toggle();
        ui__click_nav();

    });
})(jQuery); 