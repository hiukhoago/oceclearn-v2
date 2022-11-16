(function ($) {

    // YOUR CODE HERE :)
    function owlProductSingle() {
        if ($(".owl-product-single").length > 0) {
            $(".owl-product-single").owlCarousel({
                items: 1,
                margin: 20,
                nav: false,
                mouseDrag: false,
                touchDrag: false,
                lazyLoad: true,
                animateOut: "fadeOut",
            });
        }

        var slidecount = 1;
        $('.owl-product-single .owl-item').not('.cloned').each(function () {
            $(this).addClass('slidenumber' + slidecount);
            slidecount = slidecount + 1;
        });

        var dotcount = 1;
        $('.owl-product-single .owl-dot').each(function () {
            $(this).addClass('dotnumber' + dotcount);
            var slidesrc = $('.slidenumber' + dotcount + ' img').attr('data-src');
            $(this).css("background-image", "url(" + slidesrc + ")");
            dotcount++;
        });

        if ($('.scrollbar-macosx').length > 0) {
            $('.scrollbar-macosx').scrollbar();
        }

        if ($('.owl-product-single .owl-dots').hasClass('disabled')) {
            $('.owl-product-single').css('margin-bottom', 50);
        }

    }

    function addToCartSingle() {
        $('.variations_form .value select').on('change', function () {
            setTimeout(function () {
                var currPrice = $('.variations_form .woocommerce-Price-amount').text();
                var priceFormat = currPrice.split('.')[0];
                $('.product-img-wrap .add-to-cart span').text(priceFormat);
            }, 300);
        });
    }

    var funcAni = function () {
        var hash = window.location.hash;
        if (!hash || $('.list-product').length < 1) { return; }
        var hashStr = hash.slice(1),
            $root = $("html,body");
        $root.stop().animate({
            scrollTop: $('[data-target=' + hashStr + ']').offset().top - $("header.header-page").outerHeight() - ($("body").hasClass("customize-support") ? 32 : 0)
        }, 800);
    };


    function toBelowSection() {
        $('.to-below-section').on('click', function () {
            var thisSection = $(this).closest('section');
            $('html,body').stop().animate({
                scrollTop: thisSection.next().offset().top - 60
            }, 800);
        });

    }

    function form_toggle_shipping_address() {
        if ($("#show-shipping-fieldset").is(":checked")) { $(".fieldset.shipping").show(); }
        else { $(".fieldset.shipping").hide(); }
        $("#show-shipping-fieldset").on("change", function () {
            if ($(this).is(":checked")) { $(".fieldset.shipping").slideDown(); }
            else { $(".fieldset.shipping").slideUp(); }
        });
    }

    function autoHeigh_product_description() {
        $('.wrap-product-information .product-description').matchHeight();
    }

    $(function () {
        owlProductSingle();
        toBelowSection();
        addToCartSingle();
        form_toggle_shipping_address();
        funcAni();
        autoHeigh_product_description();
    });

})(jQuery);