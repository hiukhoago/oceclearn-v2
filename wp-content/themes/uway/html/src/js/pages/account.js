(function ($) {

    // function ui_review_account() {
    //     // var $wrap_list = $(".content-account .wrap-list");

    //     // $(".toggle-review").on("click", function (e) {
    //     //     e.preventDefault();
    //     //     if ($wrap_list.attr("data-show-review") != "1" || typeof $wrap_list.data("show") == "undefined") {
    //     //         $wrap_list.attr("data-show-review", 1);
    //     //     } else {
    //     //         $wrap_list.attr("data-show-review", 0);
    //     //     }
    //     // }); 
    //     $(".toggle-review").on("click", function (e) {
    //         e.preventDefault();
    //         $("#wrap-list-order").toggleClass("show-detail");
    //         $("html,body").animate({
    //             scrollTop: $("#wrap-list-order").offset().top - 80
    //         }, 800);
    //     });

    // }
    function form_select2() {
        var initSelect2 = function () {
            $(".custom-form select").each(function () {
                $(this).select2({
                    minimumResultsForSearch: $(this).find("option").length < 6 ? -1 : 0,
                    containerCssClass: "select2-border-container",
                    dropdownCssClass: "select2-border-dropdown"
                });
            });
        };
        if ($(".custom-form select").length > 0) {
            initSelect2();
            $(".custom-form").bind("DOMSubtreeModified", function () {
                if ($(".custom-form .select2").length > 0) { return; }
                setTimeout(initSelect2, 500);
            });
        }
    }
    function ui_validate() {
        var check_required_input = function (e, msg) {
            if ($(e.target).val().length < 1) {
                $(e.target).addClass("has-error");
                if ($(e.target).parent().find(".error").length < 1) {
                    $("<span class='error'>This field is a required.</span>").insertAfter($(e.target));
                }
            } else {
                $(e.target).removeClass("has-error");
                $(e.target).parent().find(".error").remove();
            }
        };

        if ($("#show-shipping-fieldset").is(":checked")) {
            var $input_validate = $(".woocommerce-account .billing .validate-required input,.woocommerce-account .shipping .validate-required input");
        }
        else {
            var $input_validate = $(".woocommerce-account .edit-account .validate-required input,.woocommerce-account .billing .validate-required input");
        }
        $input_validate.on("keyup", check_required_input);
        var check_all = function () {
            var is_ok = true,
                $first;
            $input_validate.each(function (i, v) {
                check_required_input({
                    target: $(v)[0]
                });
                if ($(v).hasClass("has-error")) {
                    is_ok = false;
                    if (!$first) {
                        $first = $(v);
                    }
                }
            });
            if ($first) {
                $first.focus();
            }
            return is_ok;
        };
        $(".woocommerce-account .custom-form form").on('submit', function (e) {
            if (!check_all()) {
                e.preventDefault();
            }
        });
    }
    $(function () {
        // ui_review_account();
        form_select2();
        ui_validate();
    });
})(jQuery);