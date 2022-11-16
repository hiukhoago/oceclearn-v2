(function ($) {
    function videoPopup() {

        //VIMEO INIT
        var vimeo = $('#vimeo-player');
        var player = new Vimeo.Player(vimeo);

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

        //EVENT ON BUTTON INTRO CLICK
        $(".btn-play-popup").on("click", function () {
            var frame = $('.popup-video').find('.video-holder'),
                linkVid = frame.data("link");
            $.backdrop_show({
                callbackshow: function () {
                    player.play();
                    $('.popup-video').addClass('expand');
                },
                callbackhide: function () {
                    $('.popup-video').removeClass('expand');
                    player.pause();
                },
                class: "popup-video-backdrop"
            });

            resizeFullVimeo();
            $(window).on("resize", resizeFullVimeo);

        });


        //EVENT ON VIMEO END 
        player.on('ended', function () {
            $.backdrop_hide({
                callbackhide: function () {
                    $('.popup-video').removeClass('expand');
                }
            });
        });

        $(".popup-video .close-btn.health").on("click", function () {
            $.backdrop_hide({
                callbackhide: function () {
                    $('.popup-video').removeClass('expand');
                }
            });
        });

        //MUTE EVENT
        $("#mute-video").on("click", function (e) {
            e.preventDefault();
            var $i = $("#mute-video i");
            var isMute = $i.hasClass("fa-volume-off");
            if (isMute) {
                player.setVolume(1);
                $i.removeClass("fa-volume-off").addClass("fa-volume-up");
            } else {
                player.setVolume(0);
                $i.removeClass("fa-volume-up").addClass("fa-volume-off");
            }
        });

        //SESSION STORAGE FOR POPUP CONTROL
        if (!sessionStorage.getItem("isFirstHealthHub")) {
            $.backdrop_show({
                callbackshow: function () {
                    player.play();
                    $('.popup-video').addClass('expand');
                },
                callbackhide: function () {
                    $('.popup-video').removeClass('expand');
                    player.pause();
                },
                class: "popup-video-backdrop"
            });
        }
        $(window).on("load", function (e) {
            if ($('.popup-video').length > 0) { sessionStorage.setItem("isFirstHealthHub", true); }
        });
        if ($('.popup-video').length > 0) { sessionStorage.setItem("isFirstHealthHub", true); }
    }
    function ui_tooltip_custom() {
        var $tooltip = $('[data-toggle-tooltip="tooltip"]');
        if ($tooltip.length > 0) {
            $tooltip.each(function (i, v) {
                var __this = $(this),
                    text_inner = __this.attr("data-title");
                __this.hover(function () {
                    __this.parent().append("<div class='tooltip-in'>" + text_inner + "</div>");
                }
                    // , function () {
                    //     __this.find(".tooltip-in").remove();
                    // }
                );
            });

        }
    }
    $(function () {
        if ($('#vimeo-player').length > 0) {
            videoPopup();
        }
        $('[data-toggle="tooltip"]').tooltip();
        // ui_tooltip_custom();
    });
})(jQuery); 