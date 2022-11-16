(function ($) {

    function blog_sticky() {
        var $sticky = $(".wrap-sidebar-blog-single");
        if ($sticky.length < 1) { return; }
        if ($(window).width() >= 992) { $sticky.stick_in_parent({ offset_top: $("header.header-page").height() + ($("body").hasClass("admin-bar") ? 32 : 0) }); }
        $(window).on("resize", function () {
            if ($(window).width() < 992) { $sticky.trigger("sticky_kit:detach"); }
        });
    }
    $(function () {
        blog_sticky();
    });
})(jQuery); 