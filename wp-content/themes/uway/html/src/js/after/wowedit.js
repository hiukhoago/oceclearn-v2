(function ($) {
    function revealOnScrollInstanceWow() {

        var $window = $(window),
            scrolled = $window.scrollTop(),
            win_height_padded = $window.height() * 1.05,
            className = ".wow";

        // Showed...
        $(className + ":not(.animated)").each(function () {
            var $this = $(this),
                offsetTop = $this.offset().top,
                offsetData = parseInt($this.data('offset'), 10);
            offsetData = isNaN(offsetData) ? 0 : offsetData;

            // if (scrolled + win_height_padded > offsetTop) {
            //     if ($this.data('timeout') || $this.data('offset')) { $this.css({visibility: "hidden"}); }
            // }

            if (scrolled + win_height_padded > offsetTop + offsetData) {
                // if ($this.data('offset')) {
                //     $this.css({visibility: "visible"});
                // }
                if ($this.data('timeout')) {
                    window.setTimeout(function () {
                        $this.css({visibility: "visible"});
                        $this.addClass('animated ' + $this.data('animation'));
                    }, parseInt($this.data('timeout'), 10));
                } else {
                    $this.css({visibility: "visible"});
                    $this.addClass('animated ' + $this.data('animation'));
                }
            }
        });

        // Hidden...
        $(className + ".animated").each(function (index) {
            var $this = $(this),
                offsetTop = $this.offset().top;
            if (scrolled + win_height_padded < offsetTop) {
                $this.removeClass('animated ' + $this.data('animation'));
                if ($this.data('timeout') || $this.data('offset')) {
                    $this.css({visibility: "hidden"});
                }
            }
        });
    }

    function run_wowjs() {
        // isTouch = Modernizr.touch;
        // if (isTouch) { $('.wow').addClass('animated'); }
        $('.wow').css({visibility: "hidden"});
        $(window).on('scroll', revealOnScrollInstanceWow);
        revealOnScrollInstanceWow();
    }
    run_wowjs();

})(jQuery);