

(function ($) {
    var page = 1;
    function loadmore() {

        var funcScrollAutoTrigger = function () {
            $(".scroll-auto-trigger").each(function (i, v) {
                if ($(window).scrollTop() + $(window).height() + 50 > $(this).offset().top) {
                    if (!$(this).hasClass("isPageLoading")) { $(this).trigger("click"); }
                }
            });
        };
        $(window).on("scroll", funcScrollAutoTrigger);

        $(".loading-more-data").on("click", function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass("isPageLoading") || $this.hasClass("isDone")) { return; }
            var $target = $($(this).data("target"));
            var urljson = $(this).data("urljson");
            var totalpage = $(this).data("totalpage");
            var except = $(this).data("except");
            page++;
            if (page > totalpage) { return; }
            if (page >= totalpage) {
                $this.addClass("isDone").fadeOut();
                $this.parents(".hide-with-me").fadeOut();
            }
            $this.addClass("isPageLoading");
            $this.text("LOADING...");
            $.get(urljson + "?page=" + page + "&except=" + except).done(function (data) {
                var $newItems = $(data);
                $newItems.css({ opacity: 0 });
                $target.append($newItems);
                $newItems.animate({ opacity: 1 }, 500);
                $(".list-recipe-archive .item-post .wrap-info").matchHeight({ byRow: false });
                // setTimeout(function () {
                $this.removeClass("isPageLoading");
                $this.text($this.data("text"));
                funcScrollAutoTrigger();
                // }, 2000);
            }).fail(function () {
                $this.removeClass("isPageLoading");
                $this.text("FAIL TO GET DATA!!!");
            });
        });
    }


    function education_filter() {
        if ($('.learn-text-editor').length < 1) { return; }
        // Add key to selection
        var $select = $('.learn-text-editor select.ingredients-select');
        var arrayKey = []; $select.html("<option value=''>All</option>");
        $(".ingredient-item").each(function () {
            var firtChart = $(this).find('.title-featured').text().substring(0, 1).toUpperCase();
            $(this).data("key", firtChart);
            if (arrayKey.indexOf(firtChart) < 0) { arrayKey.push(firtChart); }
        });
        arrayKey.sort();
        arrayKey.forEach(function (el) {
            $select.append("<option value='" + el + "'>" + el + "</option>");
        });
        // On/Of event Select
        $select.off("change").on("change", function () {
            var val = $(this).val();
            if (val === "") { $(".ingredient-item").fadeIn(); return; }
            $(".ingredient-item").each(function () {
                if ($(this).data("key") == val) { $(this).fadeIn(); }
                else { $(this).hide(); }
            });
        });
    }


    $(function () {

        loadmore();
        education_filter();
        $(".row-recipes .item-post .wrap-info").matchHeight({ byRow: false });
        $(".list-recipe-archive .item-post .wrap-info").matchHeight({ byRow: false });
        $(".item-health .wrapper-text").matchHeight({ byRow: false });

    });
})(jQuery);