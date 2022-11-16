/*
 * sPreLoader - jQuery plugin
 * Create a Loading Screen to preloader content for you website
 *
 * Name:         sPreLoader.js
 * Author:       Uy Pham
 * Date:         07.27.2017      
 * Version:      1.0
 * Editor:       uypham
 *   
 */

(function ($) {
    var items = new Array(),
        errors = new Array(),
        onComplete = function () {},
        current = 0;

    var jpreOptions = {
        preMainSection: '#sPreLoader',
        prePerText: '.preloader-percentage-text',
        preBar: '.preloader-bar',
        colorBarOuter: "transparent",
        colorBar: '#e8119b',
        heightBar: '3px',
        colorBg: '#fff',
        colorText: '#000',
        showPercent: true,
        debugMode: false,
        zindex: 1000,
        allPage: false,
        delay: 800
    };

    var getImages = function (element) {
        $(element).find('*:not(script)').each(function () {
            var url = "";

            if ($(this).css('background-image').indexOf('none') == -1) {
                url = $(this).css('background-image');
                if (url.indexOf('url') != -1) {
                    var temp = url.match(/url\((.*?)\)/);
                    url = temp[1].replace(/\"/g, '');
                }
            } else if ($(this).get(0).nodeName.toLowerCase() == 'img' && typeof ($(this).attr('src')) != 'undefined') {
                url = $(this).attr('src');
            }

            if (url.length > 0) {
                if (url.indexOf('linear-gradient') > -1) {
                    return;
                }
                items.push(url);
            }
        });
    };

    var preloading = function () {
        for (var i = 0; i < items.length; i++) {
            loadImg(items[i]);
        }
    };

    var loadImg = function (url) {
        var imgLoad = new Image();
        $(imgLoad)
            .load(function () {
                completeLoading();
            })
            .error(function () {
                errors.push($(this).attr('src'));
                completeLoading();
            })
            .attr('src', url);
    };

    var completeLoading = function () {
        current++;

        var per = Math.round((current / items.length) * 100);
        $(jBar).stop().animate({
            width: per + '%'
        }, 500, 'linear');

        if (jpreOptions.showPercent) {
            $(jPer).width(per + "%");
        }

        if (current >= items.length) {
            current = items.length;
            if (jpreOptions.debugMode) {
                var error = debug();
            }
            loadComplete();
        }
    };

    var loadComplete = function () {
        $(jBar).stop().animate({
            width: '100%'
        }, 500, 'linear', function () {
            $(jOverlay).fadeOut(jpreOptions.delay, function () {
                onComplete();
            });
        });
    };

    var debug = function () {
        if (errors.length > 0) {
            var str = 'ERROR - IMAGE FILES MISSING!!!\n\r';
            str += errors.length + ' image files cound not be found. \n\r';
            str += 'Please check your image paths and filenames:\n\r';
            for (var i = 0; i < errors.length; i++) {
                str += '- ' + errors[i] + '\n\r';
            }
            return true;
        } else {
            return false;
        }
    };

    var createContainer = function (tar) {

        jOverlay = $(jpreOptions.preMainSection);
        var text_html = "<div class='main-preloader-inner'>";
        if (jpreOptions.showPercent) {
            text_html += "<div class='wrap'>" +
                "<div class='loading'>" +
                "<div class='bounceball'></div><div class='text'><i class='logo'></i></div>" +
                "</div></div>";
        }
        text_html += "<div class='preloader-bar-outer'>" +
            "<div class='" + jpreOptions.preBar.replace('.', '') + "'></div>" +
            "</div>" +
            "</div>";
        jOverlay.prepend(text_html);
        jBar = jOverlay.find(jpreOptions.preBar);
        jPer = jOverlay.find(jpreOptions.prePerText);

        /* CSS */
        jOverlay.css({
            "z-index": jpreOptions.zindex,
            position: 'fixed'
        });
        jBar.parent().css({
            background: jpreOptions.colorBarOuter,
            position: 'fixed',
            height: jpreOptions.heightBar,
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            opacity: jpreOptions.showPercent ? 0 : 1
        });
        jBar.css({
            background: jpreOptions.colorBar,
            height: "100%",
            width: 0
        });
        if (jpreOptions.showPercent) {
            jOverlay.css({
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                background: jpreOptions.colorBg,
                "text-align": "center",
            });
            jPer.parents(".preloader-percentage").css({
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                color: jpreOptions.colorText
            });
        } else {
            jOverlay.addClass("bg-none");
        }
    };

    var checkContainer = function (tar) {
        if (tar.length < 1) {
            console.log("DOM(" + tar.selector + ") not exists!!!");
            return false;
        }
        jOverlay = $(jpreOptions.preMainSection);
        if (jpreOptions.allPage && jOverlay.length < 1) {
            $('body').prepend('<div id="' + jpreOptions.preMainSection.replace('#', '') + '"></div>');
            jOverlay = $(jpreOptions.preMainSection);
        }
        if (jOverlay.length < 1) {
            console.log("DOM(" + jpreOptions.preMainSection + ") not exist!!!");
            return false;
        }
        return true;
    };

    $.fn.sPreLoader = function (options, callback) {
        if (options) {
            $.extend(jpreOptions, options);

            // Special for hunterlab
            var isFirstLoading = sessionStorage.getItem("isFirstLoading");
            if (!isFirstLoading) {
                sessionStorage.setItem("isFirstLoading", false);
                jpreOptions.showPercent = true;
            }
        }
        if (typeof callback == 'function') {
            onComplete = callback;
        }

        if (checkContainer(this)) {
            createContainer(this);
            getImages(this);
            preloading();
        } else {
            onComplete();
        }
        return this;
    };

})(jQuery);