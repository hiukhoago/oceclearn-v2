(function ($) {

    // WILL DELETE WHEN BUILD BACKEND
    function checkout_switchtab() {
        $(".acc-menu-siderbar.for-checkout a").on("click", function (e) {
            e.preventDefault();
            if ($(this).attr("href") === "#payment") {
                $(".section-checkout").addClass("d-none");
                $(".section-payment").removeClass("d-none");
                $(".acc-menu-siderbar.for-checkout li.active").removeClass("active");
                $(".acc-menu-siderbar.for-checkout a[href='#payment']").parent().addClass("active");
            }
            else {
                $(".section-checkout").removeClass("d-none");
                $(".section-payment").addClass("d-none");
                $(".acc-menu-siderbar.for-checkout li.active").removeClass("active");
                $(".acc-menu-siderbar.for-checkout a[href='#shipping-detail']").parent().addClass("active");
            }
        });
        $(".btn-back-section-shipping").on("click", function (e) {
            e.preventDefault();
            $(".acc-menu-siderbar.for-checkout a[href='#shipping-detail']").trigger("click");
        });
        $(".section-checkout button[type='submit']").on("click", function (e) {
            e.preventDefault();
            $(".acc-menu-siderbar.for-checkout a[href='#payment']").trigger("click");
        });
    }

    function radioInputSlide() {
        $('.custom-form .radio-style-block input').on('change', function () {
            if ($(this).is(':checked')) {
                $(this).closest('.form-row').find('input+label span').slideUp(90);
                $(this).next('label').find('span').slideDown();
            }
        });
    }

    function toggle_modal_policy() {
        $('.pop-up-window').on('click', function (e) {
            e.preventDefault();
            if ($('#policy-modal').length < 1) return;
            var $policy_modal = $('#policy-modal');
            var $term_conditions = $('.woocommerce-terms-and-conditions').html();
            $policy_modal.find('.in-modal').empty().append($term_conditions);
            $policy_modal.modal('show');

        });
    }

    $(function () {
        // checkout_switchtab();
        radioInputSlide();
        toggle_modal_policy();
        $('#rememberme').on('change', function () {
            if ($(this).is(':checked')) {
                $(this).closest('.rememberme').find('label').addClass('active');
            } else {
                $(this).closest('.rememberme').find('label').removeClass('active');
            }
        });
    });
})(jQuery);