(function ($) {

    function inputQty() {
        $(document).on('click', '.square-plus', function () {
            var value = parseInt($(this).closest('.qty-holder').find('input').val()),
                input = $(this).closest('.qty-holder').find('input');
            value = (value < 20) ? value + 1 : 20;
            input.val(value);
            $('button[name=update_cart]').prop('disabled', false);
            input.trigger('change');
        });

        $(document).on('click', '.square-minus', function () {
            var value = parseInt($(this).closest('.qty-holder').find('input').val()),
                input = $(this).closest('.qty-holder').find('input');
            value = (value > 1) ? value - 1 : 1;
            input.val(value);
            $('button[name=update_cart]').prop('disabled', false);
            input.trigger('change');
        });

        $(document).on('change', '.qty-holder input', function () {
            var value = $(this).val(),
                input = $(this);
            if (value >= 20) {
                value = 20;
            } else if (value <= 1) {
                value = 1;
            }
            input.val(value);
        });
    }

    function cart_select2() {
        $('.cart-quantity').select2({
            minimumResultsForSearch: 6,
            containerCssClass: "select2-border-container",
            dropdownCssClass: "select2-border-dropdown"
        });
    }

    $(function () {
        inputQty();
        cart_select2();
    });

})(jQuery);
