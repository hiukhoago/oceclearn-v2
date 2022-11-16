(function ($) {

    // YOUR CODE HERE :)
    function ui_banner_home() {
        if ($(".wrap-owl-carousel").length > 0) {
            $(".wrap-owl-carousel").owlCarousel({
                items: 1,
                margin: 20,
                nav: false,
                dots: true,
                loop: true,
                autoplay: true,
                autoplayTimeout: 6000,
                mouseDrag: false,
                animateIn: "fadeIn",
            });
            $(".wrap-owl-carousel").on("changed.owl.carousel", function (event) {
                var current = event.item.index;
                var src = $(event.target).find(".owl-item").eq(current).find(".img-drop").data('img');
                $("#banner-change-img").append("<img class='new-img' src='" + src + "' />");
                $("#banner-change-img img.new-img").css({ opacity: 0 });
                $("#banner-change-img img.new-img").attr("src", src).stop().animate({ opacity: 1 }, 300, function () {
                    $("#banner-change-img img").not('.new-img').remove();
                    $("#banner-change-img img.new-img").removeClass("new-img");
                });
            });
        }
    }
    function ui_effect_change() {
        var selector = $("footer.footer-page .img-animation");
        if (selector.length < 1) { return; }
        var eq = 0;
        var count = selector.find(".item").length;

        selector.find(".item").hide();
        selector.find(".item").eq(0).show();

        setInterval(function () {
            selector.find(".item").eq(eq).fadeOut(function () {
                $(this).removeClass('active');
                eq = (eq + 1) % count;
                selector.find(".item").eq(eq).addClass('active').fadeIn();
            });
        }, 3500);
    }
    function ui_menu_sp() {
        if ($("#btn-menu-sp").length < 1) { return; }
        $("#btn-menu-sp").on("click", function (e) {
            e.preventDefault();
            $(this).stop().toggleClass("expand");
            $(".wrap-content-mobile").stop().toggleClass("expand");
        });
    }

    function match_height_feature_product() {
        if ($('.feature-home .wrap-text-4-item .desc').length < 1 && $('.feature-home .product-feature-title').length < 1 || $(window).width() < 576) { return; }
        $('.feature-home .product-feature-title').matchHeight({ byRow: false });
        $('.feature-home .wrap-text-4-item .desc').matchHeight({ byRow: false });
    }

    function ui_scroll_home() {
        var scrollify = function () {
            if ($(window).width() > 991) {
                $.scrollify({
                    section: ".scrollpage",
                    overflowScroll: true,
                    updateHash: false,
                    setHeights: false,
                });
            }
            else {
                $.scrollify.disable();
            }
        };
        $(window).on("resize", scrollify);
        scrollify();
    }

    function init_owl_featured_home() {
        if ($('.owl-featured-product-home').length < 1) return;
        var $owl = $('.owl-featured-product-home');
        var $item = $('.product-wrapblock');
        var checkmouedrag = true;
        if ($item.length < 4) {
            checkmouedrag = false;
        }
        $owl.on('initialized.owl.carousel', function () {
            match_height_feature_product();
        }).owlCarousel({
            items: 3,
            margin: 30,
            dots: true,
            mouseDrag: checkmouedrag,
            responsive: {
                0: {
                    items: 1
                },
                576: {
                    items: 2
                },
                992: {
                    items: 3
                }

            }
        }).on('changed.owl.carousel', function () {
            match_height_feature_product();
        }).on('resized.owl.carousel', function () {
            match_height_feature_product();
        })
    }

    $(function () {
        ui_effect_change();
        ui_banner_home();
        ui_menu_sp();
        // ui_scroll_home();
        init_owl_featured_home();
    });
})(jQuery);