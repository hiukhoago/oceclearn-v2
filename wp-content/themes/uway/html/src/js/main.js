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
(function ($) {

    function format_hour_to_minute(hour) {
        var hour_part = parseFloat(hour.split(':')[0]) * 60;
        var minute_part = parseFloat(hour.split(':')[1]);
        var minute = hour_part + minute_part;
        return minute;
    }

    //CALENDAR EVENT HANDLER
    $.ui_calendar_appointment = function (disable_dates, disable_times, method_unbookable) {
        var $calendar = $("#calendar");
        var inactive_dates = disable_dates;
        // var method = method_unbookable;
        function remove_duplicates(arr) {
            var obj = {};
            var ret_arr = [];
            for (var i = 0; i < arr.length; i++) {
                obj[arr[i]] = true;
            }
            for (var key in obj) {
                ret_arr.push(key);
            }
            return ret_arr;
        }

        // if (inactive_dates && Object.keys(inactive_dates).length !== 0) {
        //     Array.prototype.push.apply(inactive_dates, method);
        //     inactive_dates = remove_duplicates(inactive_dates);
        // }

        if ($calendar.length < 1) { return; }
        $calendar.datepicker({
            startDate: '0d',
            format: 'yyyy/mm/dd',
            endDate: '+50y',
            weekStart: 1,
            maxViewMode: 2,
            templates: {
                leftArrow: '<i class="fa fa-chevron-left"></i>',
                rightArrow: '<i class="fa fa-chevron-right"></i>'
            },
            beforeShowDay: function (date) {
                var d = date;
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1;
                var curr_year = d.getFullYear();
                var formattedDate = curr_year + "/" + (curr_month < 10 ? "0" : '')
                    + curr_month + "/" + (curr_date < 10 ? "0" : '') + curr_date;
                if ($.inArray(formattedDate, inactive_dates) != -1) {
                    return {
                        classes: 'disable-date',
                        enabled: false,
                        tooltip: 'This date/time is not available for booking',
                    };
                }
                return;
            }
        }).on('changeDate', function (e) {
            var date = e.format();
            var format_date = date.split("/");
            var method_minute_duration = parseFloat($('.book-step-next').attr('data-minute'));
            //RESET TITLE TOOLTIP ON CHANGE DATE
            $('.item-time-picker').attr({
                'title': '',
            });
            //RESET SELECTION PICKER
            $.reset_selection_picker();
            //CHECK DATA SELECTED DESKTOP
            $.check_data_desktop();
            //CHECK FULL DATA SELECTED
            $.check_full_data_selected();

            //DISABLE TIME SELECTION BY DATE
            if (disable_times && disable_times.hasOwnProperty(date)) {
                var array_time = disable_times[date];
                var time_picker = $('.item-time-picker');
                $.each(array_time, function (i, v) {
                    var time_start = v['time_start'],
                        time_end = v['time_end'];
                    var minute_start = format_hour_to_minute(time_start),
                        minute_end = format_hour_to_minute(time_end);
                    time_picker.each(function () {
                        var $this = $(this),
                            input_picker = $this.find('input'),
                            label_picker = $this.find('label');
                        var time_picker_choice = $(this).find('label').text();
                        time_picker_minute_format = format_hour_to_minute(time_picker_choice);
                        if ((time_picker_minute_format >= minute_start)
                            && (time_picker_minute_format < minute_end)) {
                            input_picker.prop('disabled', true);
                            label_picker.addClass('disabled').closest('.item-time-picker').attr('title', 'This date/time is not available for booking');
                        }
                        if ((time_picker_minute_format + method_minute_duration > minute_start)
                            && (time_picker_minute_format + method_minute_duration <= minute_end)) {
                            input_picker.prop('disabled', true);
                            label_picker.addClass('disabled').closest('.item-time-picker').attr('title', 'This date/time is not available for booking');
                        }
                        if ((time_picker_minute_format + method_minute_duration > minute_start) && (time_picker_minute_format + method_minute_duration < minute_end + method_minute_duration)) {
                            input_picker.prop('disabled', true);
                            label_picker.addClass('disabled').closest('.item-time-picker').attr('title', 'This date/time is not available for booking');
                        }
                    });
                });
            }

            //PARSE DATE SELECTION TO BUTTON
            $('.btn-final-step').attr('booking_date', date);
            var year = format_date[0],
                month = format_date[1],
                day = format_date[2];
            var day_text = "";
            var month_data = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            var month_string = month_data[parseInt(month) - 1];

            switch (day) {
                case "01":
                case "21":
                    day_text = "st";
                    break;
                case "02":
                case "22":
                    day_text = "nd";
                    break;
                case "03":
                case "23":
                    day_text = "rd";
                    break;
                default:
                    day_text = "th";
            }
            $(".date-chosen").text(day + "-" + month + "-" + year);
        });
    }
    $(function () {

    });
})(jQuery); 
(function ($) {
    //DEFAULT OFFSET FOR SMOOTHSCROLL
    var offset_top_default = $('header.header-page').outerHeight()
        + (($("body").hasClass("admin-bar")
            && $(window).width() >= 768) ? 32 : 0);

    //SMOOTH SCROLL ON BOOKING CHANGE STEP EVENT
    function scroll_booking_section() {
        if ($('.to-booking-section').length < 1) return;
        var $btn = $('.to-booking-section');
        $btn.on('click', function (e) {
            var $booking = $('.booking-appointment');
            e.preventDefault();
            if ($booking.length > 0) {
                $('html,body').stop().animate({
                    scrollTop: $booking.offset().top - offset_top_default
                }, 800)
            }
        });
    }

    //INIT PRACTITIONER THUMB SLIDER
    function init_practitioner_slider() {
        if ($('.practitioners-slider').length < 1) return;
        var $owl = $('.practitioners-slider');
        $owl.owlCarousel({
            items: 3,
            dots: false,
            responsive: {
                0: {
                    margin: 50,
                    items: 1,
                    stagePadding: 55,
                    dots: true,
                },
                576: {
                    margin: 50,
                    items: 2,
                    stagePadding: 50,
                    dots: true,
                },
                992: {
                    dots: false,
                    margin: 70,
                    items: 3,
                    stagePadding: 0
                }
            }
        }).on('changed.owl.carousel', function (event) {
            if ($(window).width() < 576) {
                var index = event.item.index;
                $('.owl-item').eq(index).find('.practitioner-item').trigger('click');
            }
        })

        //HANDLE PRACTITIONER THUMB EVENT 
        $('.practitioner-item').on('click', function (e) {
            e.preventDefault();
            var $owl_item = $(this).closest('.owl-item'),
                $position = $owl_item.index(),
                $owl_profile = $('.owl-profile').length > 0 ? $('.owl-profile') : null;

            //HANDLE SLIDER ACTIVE
            $('.practitioner-item').removeClass('active');
            $(this).addClass('active');

            //HANDLE SELECTION PRACTITIONER ACTIVE
            $('.selection-practitioner').removeClass('active');
            $('.selection-practitioner').eq($position).addClass('active');


            if ($owl_profile) {
                $owl_profile.trigger('to.owl.carousel', [$position, 300]);
            }
        });
    }

    //INIT SLIDER PRACTITIONER PROFILES
    function init_owl_profile() {
        if ($('.owl-profile').length < 1) return;
        var $owl = $('.owl-profile');

        $owl.owlCarousel({
            items: 1,
            margin: 30,
            dots: false,
            touchDrag: false,
            mouseDrag: false,
            animateIn: 'fadeIn',
        }).on('changed.owl.carousel', function (e) {
        });
    }

    //RECALCULATE APPOINTMENT BOOKING SECTION
    $.calculate_height_step = function (step) {
        setTimeout(function () {
            $('.wrapper-effect').height(step.height());
            box_info_sticky();
        }, 450);
    }

    //RENDER CONSULTATION BOX
    function render_consultation_box(data_variation) {
        $('.consult-wrapper-append').empty();
        $.each(data_variation, function (i, v) {
            var html = "<div class='consult-wrapper'>";
            html += "<input id='consult-" + i + "' type='radio' name='consultation' value=" + v.id
                + " data-cost=" + v.cost + ">";
            html += "<label for='consult-" + i + "'>";
            html += "<span class='title-consult'><span class='text-title-consult'>" + v.title + "</span><span class='time-consult'>"
                + "<span class='minutes'>" + v.time.split(" ")[0] + "</span> minutes</span></span>";
            html += "<span class='price-consult'><span class='currency'>$</span>" + v.cost + "</span>";
            html += "</label>";
            html += "</div>";
            $('.consult-wrapper-append').append(html);
        });
    }

    function render_method_box(data_method) {
        $.each(data_method, function (i, v) {
            if (Object.keys(data_method[i]['unbookable']).length !== 0) {
                var data_unbookable = JSON.stringify(data_method[i]['unbookable']);
                $('input[value="' + i + '"]').attr({
                    'data-unbookable': data_unbookable,
                });
            }
        });
    }

    //CALCULATE HOUR DURATION
    function calculate_hour_format(minutes_select, hour_start) {
        if (!minutes_select || !hour_start) return;
        var numb_to_minute = parseFloat(hour_start.toString().split(":")[0]) * 60;
        var numb_minute = parseFloat(hour_start.toString().split(":")[1]);
        var minute_total = numb_to_minute + numb_minute;
        var minute_start_end_total = parseFloat(minutes_select) + minute_total;
        var hour_display_float = minute_start_end_total / 60;
        var hour_display_string = hour_display_float.toString().split(".")[0];
        var minute_display_float = (hour_display_float - Math.floor(hour_display_float)) * 60;
        var minute_display_string = minute_display_float.toString();
        $('.time-end').text(hour_display_string + ":" + minute_display_string + (minute_display_float == 0 ? '0' : ''));
    }

    //RESET SELECTION PICKER
    $.reset_selection_picker = function () {
        $('.item-time-picker input').prop('disabled', false);
        $('.item-time-picker input').prop('checked', false);
        $('.item-time-picker label').removeClass('disabled');
        $('.date-chosen,.time-start,.time-end').text('');
    }

    //RESET BOX INFO
    function reset_box_info() {
        $('.date-chosen').text('');
        $('.item-time-picker').find('input').prop('checked', false);
        $('.time-start,.time-end').text('');
    }

    //SLIDE DOWN CURRENT FOCUS ON MOBILE
    function slide_current_focus() {
        var $step_1 = $('.row-step-1');
        $('.mobile-toggle-wrapper').hide();
        $('.current-focus .mobile-toggle-wrapper').css('display', 'flex').hide().fadeIn(function () {
            $.calculate_height_step($step_1);
        });
    }

    //CHECK DATA SELECTED
    function check_data_selected() {
        $('.stepper>.row').each(function () {
            var $this = $(this);
            var $text_checker = $this.find('.selected-checker');
            if ($text_checker.text().trim().length && !$this.hasClass('current-focus')) {
                $this.addClass('selected');
            }
        })
    }

    //CHECK DATA SELECTED DESKTOP
    $.check_data_desktop = function () {
        $('.stepper>.row').each(function () {
            var $this = $(this);
            var $text_checker = $this.find('.selected-checker');
            var $step = $this.data('step');

            if ($text_checker.text().trim().length && !$this.hasClass('current-focus')) {
                $('.edit-back[data-step="' + $step + '"]').show();
            } else {
                $('.edit-back[data-step="' + $step + '"]').hide();
            }
        })
    }

    //CHECK DATA SELECTED DESKTOP
    $.check_full_data_selected = function () {
        var cnt = 0;
        var cnt_step3 = 0;
        $('.stepper>.row').each(function () {
            var $this = $(this);
            var $step = $this.data('step');
            var $text_checker = $this.find('.selected-checker');
            var $btn_final = $('.btn-final-step')
            if ($text_checker.text().trim().length && $step != 3) {
                cnt++;
            } else if ($step == 3) {
                $text_checker.each(function () {
                    if ($(this).text().trim().length) {
                        cnt_step3++;
                    }
                })
            }
            if (cnt == 3 && cnt_step3 == 3) {
                $btn_final.addClass('clickable');
            } else {
                $btn_final.removeClass('clickable');
            }
        })
    }


    //HANDLE BUTTON TO PREVIOUS STEP EVENT
    $('.edit-back').on('click', function (e) {
        e.preventDefault();
        var current_index = $(this).data('step');
        var step_row_target = $('.stepper>.row[data-step=' + current_index + ']');
        var $booking_section = $('.booking-appointment');
        var $side_bottom = $('.side-bottom');
        if (current_index == 3) {
            //TRIGGER CLICK RETURN BACK TO CALENDAR PICKING
            $('.time-picker-back').trigger('click');
        }
        var $offset_target = 0;
        if (current_index == 4) {
            //SCROLL WINDOW TO END OF BOOKING SECTION
            $offset_target = (($booking_section.offset().top + $booking_section.outerHeight())
                - $(window).height()) + $side_bottom.height()
        } else {
            $offset_target = step_row_target.offset().top - offset_top_default;
        }
        $('html,body').stop().animate({
            scrollTop: $offset_target
        }, 450, function () {
            $('.stepper>.row').removeClass('current-focus');
            step_row_target.addClass('current-focus');
            $.check_data_desktop();
        });
    })

    //FOCUS ON ROW TO EDIT ON MOBILE 
    function edit_back_mobile() {
        $('.edit-back-mobile').on('click', function () {
            var $this = $(this);
            var $step_1 = $('.row-step-1');
            var $row_focus = $this.closest('.row');
            var $current_step = $row_focus.data('step');
            if ($current_step == 3) {
                //TRIGGER CLICK RETURN BACK TO CALENDAR PICKING
                $('.time-picker-back').trigger('click');
            }
            $('.stepper>.row').removeClass('current-focus');
            $row_focus.removeClass('selected').addClass('current-focus');
            check_data_selected();
            $('.mobile-toggle-wrapper').hide();
            $row_focus.find('.mobile-toggle-wrapper').css('display', 'flex').hide().fadeIn(function () {
                $.calculate_height_step($step_1);
            });
        });
    }

    //ACTIVE NEXT STEP
    $.scroll_to_next_step = function () {
        var $next_step = $('.current-focus').next('.row');
        var $next_step_index = $('.current-focus').next('.row').index();
        var $text_checker = $next_step.find('.selected-checker');
        var $row = $('.stepper>.row');
        var $row_numbs = $row.length;
        var $booking_section = $('.booking-appointment');
        var $side_bottom = $('.side-bottom');
        //CHECK IF IS MOBILE SCREEN AND IS NOT LAST ROW
        if ($(window).width() < 768 && $next_step.length > 0) {
            if ($text_checker.text().trim().length < 1) {
                $row.removeClass('current-focus');
                $next_step.addClass('current-focus');
                slide_current_focus();
                $next_step.removeClass('selected');
            } else {
                $row.removeClass('current-focus');
                $('.mobile-toggle-wrapper').hide();
            }
            check_data_selected();
            $.check_full_data_selected();
        }
        if ($next_step.length < 1 || $(window).width() < 768) return;
        var $offset_target = 0;
        if ($next_step_index == ($row_numbs - 1)) {
            //SCROLL WINDOW TO END OF BOOKING SECTION
            $offset_target = (($booking_section.offset().top + $booking_section.outerHeight())
                - $(window).height()) + $side_bottom.height()
        } else {
            $offset_target = $next_step.offset().top - offset_top_default;
        }
        $('html,body').stop().animate({
            scrollTop: $offset_target
        }, function () {
            $row.removeClass('current-focus');
            $next_step.addClass('current-focus');
            setTimeout(function () {
                $.check_data_desktop();
                $.check_full_data_selected();
            }, 250);
        });
    }

    //BOOKING JS CALL
    function handle_book_initiation() {
        //BOOK APPOINTMENT CLICK
        $('.book-appointment-btn').on('click', function (e) {
            e.preventDefault();
            /**
             * $data_variation: appointment variation object
             * $data_method: appointment method object
             * $data_disable: appointment disable dates object
             * $name: selected practitioner name
             * $box_info: box info overview data selecting
             */
            var $data_variation = $(this).data("appointment-variation");
            var $data_method = $(this).data('appointment-method');
            var $data_disable = $(this).data("appointment-disable");
            var $name = $('.selection-practitioner.active').find('h5').text();
            var $book_step_next = $('.book-step-next');
            var $face_info = $data_method['ftf_unbookable_date'] ? ($data_method['ftf_unbookable_date'].infor || '') : '';
            //RESET METHOD WRAPPER STATE
            $('.method-wrapper input').prop('checked', false);
            $('.method-wrapper input').attr('data-unbookable', '');

            //EMPTY METHOD INFO BOX
            $('.method-face-info').empty();
            if ($data_variation && $data_variation !== '') {
                //RENDER CONSULTATION BOX
                render_consultation_box($data_variation);
            }
            if ($data_method && Object.keys($data_method).length !== 0) {
                //RENDER METHOD BOX
                render_method_box($data_method);
                //PASS DATA RETRIEVED TO BLOCK
                $('.method-face-info').html('<p>' + $face_info + '</p>');
            }

            if ($data_disable && Object.keys($data_disable).length !== 0) {
                $book_step_next.attr('data-disable-dates', JSON.stringify($data_disable.unbookable));
                if ($data_disable.schedule) {
                    $book_step_next.attr('data-schedule', JSON.stringify($data_disable.schedule));
                } else {
                    $book_step_next.attr('data-schedule', "");
                }
            } else {
                $book_step_next.attr('data-disable-dates', "");
                $book_step_next.attr('data-schedule', "");
            }

            var $data_employee = $(this).data('employee-id');
            if ($data_employee) {
                $book_step_next.removeClass('bookable').attr('data-id', $data_employee);
                $('.book-step-final').attr('data-product-id', $data_employee);
            }

            var $step_1 = $('.row-step-1');
            $('html,body').stop().animate({
                scrollTop: $('.booking-appointment').offset().top - offset_top_default
            }, 450, function () {
                $('.row-intro').removeClass('active');
                $step_1.addClass('active');
                $.calculate_height_step($step_1);
                //UPDATE BOX INFO PRACTITIONER NAME
                $('.practitioner-name').text($name);
                setTimeout(function () {
                    $('.holder-box-info').fadeIn();
                    $('.box-info-pick').trigger("sticky_kit:recalc");
                }, 450);
                //TRIGGER CLICK RETURN BACK TO CALENDAR PICKING
                $('.time-picker-back').trigger('click');

                //RESET CURRENT FOCUS ROW
                $('.stepper>.row').removeClass('current-focus');
                $('.stepper>.row').first().next().addClass('current-focus');
                //MOBILE HANDLE EFFECT
                if ($(window).width() < 768) {
                    slide_current_focus();
                    check_data_selected();
                } else {
                    $.check_data_desktop();
                }
            });

            //RERENDER CALENDAR
            $("#calendar").datepicker('destroy');
            $.ui_calendar_appointment($data_disable.unbookable, $data_disable.schedule);


        });

        $(window).on('resize', function () {
            var $wrapper = $('.wrapper-effect');
            if ($('.row-step-1').hasClass('active')) {
                $wrapper.height($('.row-step-1').height());
            } else if ($('.row-intro').hasClass('active')) {
                $wrapper.height($('.row-intro').height());
            }
        })
    }

    //HANDLE PRACTITIONER SELECTION EVENT ON STEP 2
    function handle_selection_practitioner() {
        $(document).on('click', '.selection-practitioner', function (e) {
            e.preventDefault();
            var $position = $(this).index(),
                $owl_profile = $('.owl-profile').length > 0 ? $('.owl-profile') : null;
            var $name = $(this).find('h5').text();

            // set step default
            $('.row[data-step="1"]').addClass('current-focus');

            if (!$(this).hasClass('active')) {
                //REMOVE BOX INFO METHOD AND CONSULTATION TEXT
                $('.consultation-title , .method-name').text('');
                //RESET BOX INFO
                reset_box_info();

                //RESET METHOD WRAPPER STATE
                $('.method-wrapper input').prop('checked', false);
                $('.method-wrapper input').attr('data-unbookable', '');
                //UPDATE BOX INFO PRACTITIONER NAME
                $('.practitioner-name').text($name);
                //HANDLE SLIDER PRACTITIONER ACTIVE
                $('.practitioner-item').removeClass('active');
                $('.practitioners-slider .owl-item').eq($position).find('.practitioner-item').addClass('active');

                //HANDLE ACTIVE SELECTION PRACTITIONER
                $('.selection-practitioner').removeClass('active');
                $(this).addClass('active');

                if ($owl_profile) {
                    $owl_profile.trigger('to.owl.carousel', [$position, 300]);

                    //PARSE DATA ATTRIBUTE TO BOOK APPOINTMENT BUTTON
                    var $data_employee = $owl_profile.find('.owl-item').eq($position)
                        .find('.book-appointment-btn').data('employee-id');

                    //RENDER CONSULTATION BOX
                    var $data_variation = $owl_profile.find('.owl-item').eq($position)
                        .find('.book-appointment-btn').data('appointment-variation');
                    render_consultation_box($data_variation);

                    var $data_method = $owl_profile.find('.owl-item').eq($position)
                        .find('.book-appointment-btn').data('appointment-method');
                    var $face_info = $data_method['ftf_unbookable_date'] ? ($data_method['ftf_unbookable_date'].infor || '') : '';
                    //RENDER METHOD BOX
                    if ($data_method && Object.keys($data_method).length !== 0) {
                        render_method_box($data_method);
                        //PASS DATA RETRIEVED TO BLOCK
                        $('.method-face-info').html('<p>' + $face_info + '</p>');
                    }

                    var $data_disable = $owl_profile.find('.owl-item').eq($position)
                        .find('.book-appointment-btn').data('appointment-disable');
                    if ($data_disable && Object.keys($data_disable).length !== 0) {
                        $('.book-step-next').attr('data-disable-dates', JSON.stringify($data_disable.unbookable));
                        if ($data_disable.schedule) {
                            $('.book-step-next').attr('data-schedule', JSON.stringify($data_disable.schedule));
                        } else {
                            $('.book-step-next').attr('data-schedule', "");
                        }
                    } else {
                        $('.book-step-next').attr('data-disable-dates', "");
                        $('.book-step-next').attr('data-schedule', "");
                    }
                    $('.book-step-next').removeClass('bookable').attr('data-id', $data_employee);
                    $('.book-step-final').attr({
                        'data-product-id': $data_employee,
                        'data-service-id': '',
                        'booking_date': ''
                    });

                    //CHECK DATA SELECTED
                    $('.stepper>.row').removeClass('selected')

                    //TRIGGER CLICK RETURN BACK TO CALENDAR PICKING
                    $('.time-picker-back').trigger('click');
                }

                //RERENDER CALENDAR
                $("#calendar").datepicker('destroy');
                $.ui_calendar_appointment($data_disable.unbookable, $data_disable.schedule);
            }

            //ACTIVE NEXT STEP FOCUS
            $.scroll_to_next_step();

            //MOBILE HANDLE EFFECT
            if ($(window).width() < 768) {
                check_data_selected();
            }
        });

        //HANDLE CONSULTATION BOX ON CHANGE 
        $(document).on('change', '.consult-wrapper input:radio', function () {
            //HANDLE BOX INFO UPDATE
            var $value_price = $('.consult-wrapper').find('input[type="radio"]:checked').attr('data-cost'),
                $value_consult = $('.consult-wrapper').find('input[type="radio"]:checked')
                    .parent().find('.text-title-consult').text(),
                $value_id = $('.consult-wrapper').find('input[type="radio"]:checked').val();
            var $minutes = $('.consult-wrapper').find('input[type="radio"]:checked').next()
                .find('.minutes').text(),
                $time_start = $('.item-time-picker input[type="radio"]:checked').next('label').text();
            if ($time_start) {
                calculate_hour_format($minutes, $time_start);
            }

            $('.book-step-next').attr('data-minute', $minutes);

            $('.consultation-title').text($value_consult);
            $('.book-step-final span').text($value_price);

            //COUNT NUMBER CHECKED INPUT
            $('.book-step-next').attr('data-service-id', $value_id);
            $('.book-step-final').attr('data-service-id', $value_id);

            //TRIGGER CALENDAR ON CHANGE
            $('#calendar td.day.active').trigger('click');

            setTimeout(function () {
                //ACTIVE NEXT STEP FOCUS
                $.scroll_to_next_step();
            }, 500);

        });

        //HANDLE METHOD WRAPPER ON CHANGE
        $(document).on('change', '.method-wrapper input:radio', function () {
            var $value_method = $('.method-wrapper').find('input[type="radio"]:checked').val();
            $('.method-face-info').hide();
            if ($value_method == "face to face") {
                $('.method-face-info').show();
            }
            $.calculate_height_step($('.row-step-1'));
            $('.method-name').text($value_method);
            //ACTIVE NEXT STEP FOCUS
            $.scroll_to_next_step();
            $.check_full_data_selected();
        });

        $('.book-step-prev').on('click', function (e) {
            e.preventDefault();
            $('html,body').stop().animate({
                scrollTop: $('.booking-appointment').offset().top - offset_top_default
            }, 450, function () {
                $('.return-step').trigger('click');
            });
        });

        //HANDLE CLOSE BUTTON EVENT
        $('.return-step').on('click', function (e) {
            e.preventDefault();
            var stepper_row = $('.stepper>.row');
            var $row_intro = $('.row-intro');
            var $row_step_1 = $('.row-step-1');
            var $book_step_final = $('.book-step-final');
            $('.holder-box-info').fadeOut(function () {
                $row_intro.addClass('active');
                $row_step_1.removeClass('active');
                $('.consultation-title , .method-name').text('');
                $book_step_final.attr('booking_date', '');
                reset_box_info();
                stepper_row.removeClass('current-focus selected');
                stepper_row.eq(0).addClass('current-focus');
                $.calculate_height_step($row_intro);
            });
        });
    }

    //INIT TIME SELECTION SLIDER
    function init_owl_time_picker() {
        if ($('.owl-time-picker').length < 1) return;
        var $owl = $('.owl-time-picker');
        $owl.owlCarousel({
            margin: 12,
            dots: false,
            nav: true,
            autoWidth: true,
            navText: ['', ''],
            responsive: {
                0: {
                    items: 3,
                },
                768: {
                    items: 4,
                },
                1200: {
                    items: 6,
                }
            }
        })
    }

    //HANDLE TIME PICKER CLICK BACK
    function show_calendar_back() {
        $('.time-picker-back').on('click', function () {
            //FADE IN TIME PICKER
            $('.wrap-slide-time-picker').fadeOut(function () {
                $('#calendar').fadeIn();
                $.calculate_height_step($('.row-step-1'));
            });
        })
    }

    //FORMAT SELECTION TIME
    function format_item_picker() {
        $('.item-time-picker').each(function () {
            var $value = $(this).find('label').text();
            $numb_hour = $value.toString().split(".")[0],
                $numb_minute = $value.toString().split(".")[1]
            $(this).find('label').text($numb_hour + ":" + $numb_minute);
        });
    }

    //GENERATE TIME SELECTION
    function generate_time_picker() {
        $(document).on('change', '.item-time-picker', function () {
            var $time_start = $(this).find('label').text(),
                $minutes = $('.consult-wrapper').find('input[type="radio"]:checked').next()
                    .find('.minutes').text();
            calculate_hour_format($minutes, $time_start);
            $('.time-start').text($time_start + " - ");
            $.calculate_height_step($('.row-step-1'));
            setTimeout(function () {
                //ACTIVE NEXT STEP FOCUS
                $.scroll_to_next_step();
            }, 300);
        });
    }

    //GENERATE OBJECT DATA JSON && SAVE IN SESSION STORAGE
    function submit_form_appointment() {
        $('.book-step-final').on('click', function (e) {
            var $method_name = $('.method-name').first().text();
            var $booking_date = $(this).attr('booking_date');
            var $time_start = $('.time-start').first().text().split(" ")[0];
            var $time_end = $('.time-end').first().text();
            var data_to_pass = {
                "appointment_method": $method_name,
                "appointment_booking_date": $booking_date,
                "appointment_time_chosen": {
                    "appointment_time_start": $time_start,
                    "appointment_time_end": $time_end
                },
            };
            //SAVE JSON TO SESSION STORAGE
            sessionStorage.setItem("appointment_data", JSON.stringify(data_to_pass));
        });
    }

    //CHECK SESSION STORAGE EXIST && APPEND INPUT FIELD IN CHECKOUT FORM | CREATE TABLE REVIEW APPOINTMENT BOOKED
    function check_exist_session() {
        if ($('.checkout-page').length < 1) return;
        var appointment_data = sessionStorage.getItem('appointment_data');
        if (appointment_data) {
            var data_json = JSON.parse(appointment_data);
            var html = "";
            var text_render = ""
            $('.details-appointment').append('<div class="box-info-pick"></div>');
            $.each(data_json, function (i, v) {
                if (i == 'appointment_time_chosen') {
                    //RENDER ITEM IN BOX
                    html = "<div class='item-inner'>";
                    html += "<div class='title'>Time: <span class='time-start'></span><span class='time-end'></span></div>";
                    html += "</div>";
                    $('.woocommerce-checkout .box-info-pick').append(html);

                    $.each(data_json[i], function (index, value) {
                        $('<input>').attr({
                            type: 'hidden',
                            name: index,
                            value: value.length < 5 ? '0' + value : value
                        }).appendTo('form.woocommerce-checkout');

                        if (index == 'appointment_time_start') {
                            $('.time-start').text(value);
                        } else if (index == 'appointment_time_end') {
                            $('.time-end').text(" - " + value);
                        }
                    });

                } else {
                    $('<input>').attr({
                        type: 'hidden',
                        name: i,
                        value: v
                    }).appendTo('form.woocommerce-checkout');

                    if (i == 'appointment_method') {
                        text_render = "Method: ";
                    } else if (i == 'appointment_booking_date') {
                        text_render = "Date: ";
                        v = v.split('/').reverse().join('/');
                    }
                    //RENDER ITEM IN BOX
                    html = "<div class='item-inner'>";
                    html += "<div class='title'>" + text_render + v + "</div>";
                    html += "</div>";
                    $('.woocommerce-checkout .box-info-pick').append(html);
                }
            });
        }
    }

    function box_info_sticky() {
        var $sticky = $(".booking-appointment .box-info-pick");
        if ($sticky.length < 1) { return; }
        if ($(window).width() >= 768) {
            $sticky.stick_in_parent({
                offset_top: $("header.header-page").height()
                    + ($("body").hasClass("admin-bar") ? 32 : 0)
            });
        }
        $(window).on("resize", function () {
            if ($(window).width() < 768) { $sticky.trigger("sticky_kit:detach"); }
        });
    }

    /**
     * Create Slider for Pricing Block
     */
    function init_slider_pricing() {
        if ($('.slider-pricing').length < 1) return;
        var $owl = $('.slider-pricing');
        $owl.owlCarousel({
            margin: 5,
            responsive: {
                0: {
                    items: 1,
                    stagePadding: 35,
                    startPosition: 1,
                    center: true,
                },
                400: {
                    items: 1,
                    stagePadding: 50,
                    startPosition: 1,
                    center: true,
                },
                480: {
                    items: 1,
                    stagePadding: 100,
                    startPosition: 1,
                    center: true,
                },
                576: {
                    items: 1,
                    stagePadding: 125,
                    startPosition: 1,
                    center: true,
                },
                768: {
                    items: 1,
                    stagePadding: 185,
                    startPosition: 1,
                    center: true,

                },
                992: {
                    dots: false,
                    items: 3,
                    stagePadding: 0,
                }
            }
        })
    }

    $(function () {
        scroll_booking_section();
        init_practitioner_slider();
        init_owl_profile();
        init_owl_time_picker();
        handle_book_initiation();
        handle_selection_practitioner();
        format_item_picker();
        generate_time_picker();
        submit_form_appointment();
        check_exist_session();
        box_info_sticky();
        show_calendar_back();
        edit_back_mobile();
        init_slider_pricing();
        $('.appointment-pricing .block-pricing').matchHeight();
    });
})(jQuery); 
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
(function ($) {

    $(function () {

        if ($('.education .tab-navi-learn').length > 0) {
            if (window.location.hash) {
                var hash = window.location.hash.substring(1);
                $(window).scrollTop($('.education .tab-navi-learn').offset().top - ($('.header-page').height() + 0));
                $('.tab-navi-learn a[data-hash=' + hash + ']').trigger('click');
            }
        }

    });
})(jQuery); 
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
(function ($) {
    function ui_detect_video() {
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
        $(".play-btn").on("click", function () {
            var frame = $(this).closest(".video-holder"),
                linkVid = frame.data("link");
            $(this).hide().closest(".video-holder").addClass("ani");

            frame.find("img").fadeOut();

            setTimeout(function () {
                if (linkVid.indexOf("vimeo") > -1) {
                    frame.append('<iframe src="https://player.vimeo.com/video/' + vimeo_parser(linkVid) + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                }
                else {
                    frame.append('<iframe src="https://www.youtube.com/embed/' + youtube_parser(linkVid) + '?autoplay=1"  frameborder="0" allowfullscreen"></iframe>');
                }
                resizeFullVimeo();
            }, 1000);
            $(window).on("resize", resizeFullVimeo);
        });
        $(".close-btn").on("click", function () {
            var frame = $(this).closest(".video-holder");
            $(this).closest(".video-holder").removeClass("ani").find("iframe").remove();
            $(".play-btn").show();
            frame.find("img").fadeIn();
        });
    }
    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    function vimeo_parser(url) {
        var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
        return m ? m[2] || m[1] : null;
    }

    function ui_get_start() {
        $(".btn-black-get").on("click", function (e) {
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;
            e.preventDefault();
            var href = $(this).attr("href");
            if ($('.box-day-scroll' + href).length < 1) { return; }
            $("html,body").animate({
                scrollTop: $('.box-day-scroll' + href).offset().top - offsetTop
            }, 800, function () {
                $(".box-day-scroll").removeClass("current-day");
                $(href).addClass("current-day");
            });
        });
    }
    function ui_recipes_modal() {
        $(".content-health a[data-toggle='modal-edit'], .box-day-scroll .introduction a[href*='/educations/']").on("click", function (e) {
            e.preventDefault();
            var url = $(this).data("url"),
                $iframe = $("<iframe>").attr({
                    src: url,
                    frameborder: 0,
                });
            $().ven_loading_show({ fixed: true, class: 'loading-recipes' });
            $("#recipes-modal .iframe_div").html($iframe);
            $iframe.on("load", function () {
                $().ven_loading_hide();
                $("#recipes-modal").modal("show");
                setTimeout(function () {
                    $(".iframe_div iframe").height($(".iframe_div iframe")[0].contentDocument.body.scrollHeight);
                }, 500);
            });
        });

        // for education popup
        $(".box-day-scroll .introduction a[href*='/educations/']").each(function (e) {
            var href = $(this).attr('href'); if (!href) { return; }
            href = href.replace("/educations/", "/wp-json/api/v1/get-short-des-programs/");
            href = href.substring(0, href.length - 1);
            $(this).data("url", href);
        });
    }
    function ui_sticky_bar() {
        var $sticky = $(".sticky-bar"),
            $target_footer = $("footer.footer-page");
        if ($sticky.length < 1) { return; }
        var fix_stick = function () {
            if ($(window).scrollTop() >= $sticky.offset().top - $("header.header-page").height()) {
                $sticky.find(".toggle-nav").addClass("fixed");
                $sticky.find(".wrap-sticky").addClass("fixed");
                $sticky.height($sticky.find(".wrap-sticky").outerHeight(true));
                if ($(window).scrollTop() >= $target_footer.offset().top - 120) {
                    $sticky.addClass("slideUp");
                } else {
                    $sticky.removeClass("slideUp");
                }
            }
            else {
                $sticky.find(".toggle-nav").removeClass("fixed");
                $sticky.find(".wrap-sticky").removeClass("fixed");
                $sticky.height("");
            }
        };
        $(window).on("scroll", fix_stick);
        fix_stick();

        // Click scroll anchor
        $('.sticky-bar nav li a').on("click", function (e) {
            e.preventDefault();
            var $href = $($(this).attr("href"));
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;

            if ($href.length > 0) {
                $('html, body').stop().animate({ scrollTop: $href.offset().top - offsetTop }, 800);
            }
        });

        var funcCheckRange = function () {
            if ($("header.header-page").length < 1 || $(".sticky-bar").length < 1) { return; }
            var $last = null;
            var offsetTop = $("header.header-page").height() + $(".sticky-bar").height() + 5;
            $('.sticky-bar nav li a').each(function () {
                var $href = $($(this).attr("href"));
                if ($href.length > 0) {
                    if ($(window).scrollTop() + offsetTop + 5 >= $href.offset().top && $(window).scrollTop() + offsetTop + 5 < $href.offset().top + $href.outerHeight(true)) {
                        $last = $href;
                    }
                }
            });
            $(".sticky-bar nav li").removeClass("active");

            if ($last) {
                $(".sticky-bar nav li a[href='" + $last.selector + "']").parent().addClass("active");
            }
            else {
                if ($(window).width() < 992) {
                    $(".list-days li").first().addClass("active");
                }
            }
        };
        $(window).on("scroll.funcCheckRange", funcCheckRange);
        funcCheckRange();
        $(".list-days li").addClass("is-hide");

    }
    function ui_health_hub_modal() {
        $(".health-hub a[data-toggle='modal-edit']").on("click", function (e) {
            e.preventDefault();
            var url = $(this).data("url"),
                $iframe = $("<iframe>").attr({
                    src: url,
                    frameborder: 0,
                });
            $().ven_loading_show({ fixed: true, class: 'loading-recipes' });
            $("#health-hub-modal .iframe_div").html($iframe);
            $iframe.on("load", function () {
                $().ven_loading_hide();
                $("#health-hub-modal").modal("show");
                setTimeout(function () {
                    $(".iframe_div iframe").height($(".iframe_div iframe")[0].contentDocument.body.scrollHeight);
                }, 500);
            });
        });
    }
    var funcClick = function () {
        var $list_days = $(".sticky-bar .list-days"),
            $height_trans = $(".sticky-bar .content-center");
        $(".sticky-bar .toggle-nav").toggleClass("is-active");
        $height_trans.height($list_days.outerHeight(true)); $list_days.toggleClass("expand");
        if (!$(this).hasClass("is-active")) {
            $height_trans.height($list_days.outerHeight(true));
            $list_days.find('li:not(.active)').addClass("is-hide");
        } else {
            $list_days.find('li:not(.active)').removeClass("is-hide");
        }
        $height_trans.height($list_days.outerHeight(true));
        setTimeout(function () {
            $height_trans.height("");
        }, 500);
    };
    function ui_mobile_toggle() {
        var $toggle = $(".sticky-bar .toggle-nav");
        if ($toggle.length < 1) { return; }
        $toggle.on("click", funcClick);
    }
    function ui__click_nav() {
        if ($(window).width() < 992) {
            $(".sticky-bar .list-days a").on("click", funcClick);
        }
        $(window).on("resize", function () {
            if ($(window).width() < 992) {
                if ($(".list-days").hasClass("expand")) {
                    $(".list-days").removeClass("expand");
                    $(".list-days li").first().addClass("active");
                } else {
                    $(".list-days li").first().removeClass("active");

                }
            }
        });
    }
    $(function () {
        ui_detect_video();
        ui_get_start();
        ui_recipes_modal();
        ui_sticky_bar();
        ui_health_hub_modal();
        ui_mobile_toggle();
        ui__click_nav();

    });
})(jQuery); 
(function ($) {
    function handleScrollDownEffect() {
        if (!$('.scroll-effect.active').is(':last-child')) {
            $('.scroll-effect.active').removeClass('active').next().addClass('active');
        }
    }
    function handleScrollUpEffect() {
        if (!$('.scroll-effect.active').is(':first-child')) {
            $('.scroll-effect.active').removeClass('active').prev().addClass('active');
        }
    }

    function initAnimDuration() {
        $('.fadeToLeft').each(function () {
            var duration = $(this).data('duration');
            $(this).css('transition', 'all ' + duration + ' .7s ease');
        });
    }

    function homeScrollEffect() {
        if ($('.home-effect').length < 1 || $(window).width() < 992) return;
        $(window).on('mousewheel', _.throttle(function (e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                handleScrollDownEffect();
            }
            else {
                handleScrollUpEffect();
            }
        }, 1200, { trailing: false }));
    }

    $(function () {
        // homeScrollEffect();
        // initAnimDuration();
    });
})(jQuery);
(function ($) {


    function initAnimDuration() {
        $('.fadeToLeft').each(function () {
            var duration = $(this).data('duration');
            $(this).css('transition', 'all ' + duration + ' .7s ease');
        });
    }

    var homeScrollEffect = function () {
        if ($('.home-effect').length < 1 || $(window).width() < 992) return;
        $('.scroll-effect').each(function () {
            if ($(window).scrollTop() + $(window).height() / 2 >= $(this).offset().top - $('.header-page').height()) {
                $(this).addClass('active');
            }
        })

    }

    $(function () {
        // initAnimDuration();
        // homeScrollEffect();
        // $(window).on('scroll', homeScrollEffect);
    });
})(jQuery);
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

(function ($) {
    $(function () {
        $('.gallery-thumb-list').lightGallery({
            thumbnail: true
        });
    });
})(jQuery);


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
//-----------------------SLIDER BANNER----------------
let dataHomeBanners = [{
        image: "../../src/img/ecolearn-banner-1.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>10%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>200k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-2.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>12%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>400k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-3.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>15%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>900k</span>"
    },
    {
        image: "../../src/img/ecolearn-banner-4.png",
        title: "Giảm <span style='color:#008984; font-size: 96px;font-weight:700'>20%</span> khi mua hóa đơn <span style='color:#008984; font-size: 96px;font-weight:700'>4500k</span>"
    }
]

let index = -1;

function next() {
    index++;
    if (dataHomeBanners.length > 0) {
        if (index >= dataHomeBanners.length) index = 0;

        var img = document.getElementById('img-banner-index');
        if (img) {
            img.src = dataHomeBanners[index].image;
            document.getElementById("desc").innerHTML = dataHomeBanners[index].title;
        }
    }

}

function previous() {
    index--;
    if (index <= 0) index = dataBanners.length - 1;

    var img = document.getElementById("img");
    img.src = dataBanners[index].image;
    document.getElementById("desc").innerHTML = dataBanners[index].title;
}

const bannerHome = document.getElementsByClassName('body-content-banner');
const homePage = setInterval(next, 3000);
if (!bannerHome) {
    clearIntervel(homePage);
}

// indexBanner =  setInterval("next()", 3000);
// clearIntervel(indexBanner);

const dataBannerProducts = [{
        image: "../../src/img/product-banner-1.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-2.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-3.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    },
    {
        image: "../../src/img/product-banner-4.png",
        title: "<span style='color:#112848; font-size: 28px;font-weight:700;line-height: 120%;'>SẢN PHẨM VI SINH </span></br> <span style='color:#112848; font-size: 18px;font-weight:400; line-height: 27px; padding:5% 0;'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.</span>"
    }
]
let i = -1;

function nextProductBanner() {
    i++;
    if (i >= dataBannerProducts.length) i = 0;

    var img = document.getElementById('product-banner');
    console.log(dataBannerProducts[i].image)
    if (img) {
        console.log(i)
        img.src = dataBannerProducts[i].image;
        document.getElementById('desc-product').innerHTML = dataBannerProducts[i].title;
    }
}
const bannerProduct = document.getElementsByClassName('body-content-product-banner');
let product = setInterval(nextProductBanner, 3000);
if (!bannerProduct) {
    clearIntervel(product);
}

//-----------------------INCREASE - DECREASE- AMOUNT ----------------
let amountElement = document.getElementById('amount');
let valueAmount = amountElement.value;
let handleDecrease = () => {
    if (valueAmount > 1)
        valueAmount--;
    amountElement.value = valueAmount;
};
let handleIncrease = () => {
    valueAmount++;
    amountElement.value = valueAmount;
};
//Bắt sự kiện input 
amountElement.addEventListener('input', () => {
    convertValueAmount = parseInt(valueAmount);
    console.log(convertValueAmount);
    convertValueAmount = (isNaN(convertValueAmount) || convertValueAmount == 0) ? 1 : convertValueAmount;
    document.getElementById('amount').value = convertValueAmount;
});
//-----------------------CLICK SMALL IMAGE SHOW LARGE IMAGE ----------------
function handleChangeImage(id) {
    let imagePath = document.getElementById(id).getAttribute('src');
    document.getElementById("main-img").setAttribute('src', imagePath);
}
//------------------------CART--------------------

//ADD TO CART
(function ($) {

    function toggleLogin() {
        $('#login-toggle').on('click', function (e) {
            e.preventDefault();
            $.backdrop_show({
                callbackshow: function () {
                    $('#login-toggle').parent().addClass('current-menu-item');
                    $('.panel-login').addClass('expand');
                    $('#btn-menu-sp').trigger('click');
                },
                callbackhide: function () {
                    $('#login-toggle').parent().removeClass('current-menu-item');
                    $('.panel-login').removeClass('expand');
                },
                class: "for-panel-menu"
            });
        });

        $('#btn-close-login').on('click', function (e) {
            e.preventDefault();
            $.backdrop_hide({
                callbackhide: function () {
                    $('.panel-login').removeClass('expand');
                    $('#login-toggle').parent().removeClass('current-menu-item');
                }
            });
        });
    }

    function toggleLoginSignup() {
        $('#sign-up-show').on('click', function (e) {
            e.preventDefault();
            $('#signup-fields').hide();
            $('#login-fields').fadeIn();
        });
        $('#login-show').on('click', function (e) {
            e.preventDefault();
            $('#login-fields').hide();
            $('#signup-fields').fadeIn();
        });
    }

    var cart_bag = function () {
        $('.btn-cart').on('click', function (e) {
            // e.preventDefault();
            var cartbag = $(this);
            cartbag.toggleClass('opened');

            var outsideClickListener = function (event) {
                if (!$(event.target).find('.btn-cart').length) {
                } else {
                    if ($('.btn-cart').hasClass('opened')) {
                        $('.btn-cart').removeClass('opened');
                        removeClickListener();
                        $('body').removeClass('modal-open');
                    }
                }
            };

            var removeClickListener = function () {
                document.removeEventListener('click', outsideClickListener);
            };
            document.addEventListener('click', outsideClickListener);
        });
    };

    var cart_bag_hover = function () {
        $('.btn-cart').mouseenter(function (e) {
            $("body").disablescroll();
            return false;
        }).mouseleave(function () {
            $("body").disablescroll("undo");
        });
        $("body").on("mouseenter", ".bag-hover .scroll-wrapper", function () {
            $(this).focus();
            $(this).select();
            if ($(this).find(".scroll-y .scroll-bar").height() > 0) { window.UserScrollDisabler_Is = false; }
        }).on("mouseleave", ".bag-hover .scroll-wrapper", function () {
            window.UserScrollDisabler_Is = true;
        });
    };

    function ven_clickable_cart() {
        $('.header-page .show-cart').on("click", function (e) {
            e.preventDefault();
            var __this = $(this);
            $.backdrop_show({
                callbackshow: function () {
                    $(".bag-hover").addClass("opened");
                },
                callbackhide: function () {
                    $(".bag-hover").removeClass("opened");
                }
            });
        });
        $(".bag-hover").on("click", ".btn-close-cart", function (e) {
            e.preventDefault();
            $.backdrop_hide({
                callbackhide: function () {
                    $(".bag-hover").removeClass("opened");
                }
            });
        });
    }
    function ui_videoClick() {
        $(".home-play-btn").on("click", function () {
            var frame = $(this).closest(".video-holder"),
                linkVid = frame.data("link");
            $(this).hide();
            frame.find("img").fadeOut();
            if (linkVid.indexOf("vimeo") > -1) {
                frame.append('<iframe src="https://player.vimeo.com/video/' + vimeo_parser(linkVid) + '?autoplay=1&title=0&byline=0&portrait=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
            }
            else {
                frame.append('<iframe src="https://www.youtube.com/embed/' + youtube_parser(linkVid) + '?autoplay=1"  frameborder="0" allowfullscreen"></iframe>');
            }
        });
    }

    function youtube_parser(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }
    function vimeo_parser(url) {
        var m = url.match(/^.+vimeo.com\/(.*\/)?([^#\?]*)/);
        return m ? m[2] || m[1] : null;
    }

    $(function () {

        // PRELOADER
        if (sessionStorage.getItem("isFirstRun")) { $("#preloader").addClass("d-none"); }
        $(window).on("load", function (e) { $("#preloader").fadeOut(); this.sessionStorage.setItem("isFirstRun", true); });
        setTimeout(function () { $("#preloader").fadeOut(); this.sessionStorage.setItem("isFirstRun", true); }, 4000);

        toggleLogin();
        toggleLoginSignup();
        // cart_bag();
        ven_clickable_cart();
        /*CART EVENT*/
        $('.delete-header-cart').on("click", function () {
            $(this).closest('li').fadeOut(function () {
                $(this).remove();
            });
        });
        /*END CART EVENT*/

        $(".list-social-js").jsSocials({
            showLabel: true,
            shares: [
                { share: "facebook", label: "Facebook", logo: "fa fa-facebook" }
            ]
        });

        ui_videoClick();
    });
})(jQuery);



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY291bnQuanMiLCJhcHBvaW50bWVudC1jYWxlbmRhci5qcyIsImFwcG9pbnRtZW50LmpzIiwiYmxvZy5qcyIsImNhcnQuanMiLCJjaGVja291dC5qcyIsImVkdWNhdGlvbi5qcyIsImhlYWx0aC1odWIuanMiLCJoZWFsdGgtcHJvZ3JhbS5qcyIsImhvbWUtZWZmZWN0LjEuanMiLCJob21lLWVmZmVjdC5qcyIsImhvbWUuanMiLCJwcm9kdWN0LXNpbmdsZS5qcyIsInJlY2lwZXMtc2luZ2xlLmpzIiwicmVjaXBlcy5qcyIsInNsaWRlcl92Mi5qcyIsImVkaXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgIC8vIGZ1bmN0aW9uIHVpX3Jldmlld19hY2NvdW50KCkge1xyXG4gICAgLy8gICAgIC8vIHZhciAkd3JhcF9saXN0ID0gJChcIi5jb250ZW50LWFjY291bnQgLndyYXAtbGlzdFwiKTtcclxuXHJcbiAgICAvLyAgICAgLy8gJChcIi50b2dnbGUtcmV2aWV3XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgIC8vICAgICAvLyAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8gICAgIC8vICAgICBpZiAoJHdyYXBfbGlzdC5hdHRyKFwiZGF0YS1zaG93LXJldmlld1wiKSAhPSBcIjFcIiB8fCB0eXBlb2YgJHdyYXBfbGlzdC5kYXRhKFwic2hvd1wiKSA9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAvLyAgICAgLy8gICAgICAgICAkd3JhcF9saXN0LmF0dHIoXCJkYXRhLXNob3ctcmV2aWV3XCIsIDEpO1xyXG4gICAgLy8gICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgIC8vICAgICAgICAgJHdyYXBfbGlzdC5hdHRyKFwiZGF0YS1zaG93LXJldmlld1wiLCAwKTtcclxuICAgIC8vICAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vIH0pOyBcclxuICAgIC8vICAgICAkKFwiLnRvZ2dsZS1yZXZpZXdcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgLy8gICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAvLyAgICAgICAgICQoXCIjd3JhcC1saXN0LW9yZGVyXCIpLnRvZ2dsZUNsYXNzKFwic2hvdy1kZXRhaWxcIik7XHJcbiAgICAvLyAgICAgICAgICQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAvLyAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoXCIjd3JhcC1saXN0LW9yZGVyXCIpLm9mZnNldCgpLnRvcCAtIDgwXHJcbiAgICAvLyAgICAgICAgIH0sIDgwMCk7XHJcbiAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgLy8gfVxyXG4gICAgZnVuY3Rpb24gZm9ybV9zZWxlY3QyKCkge1xyXG4gICAgICAgIHZhciBpbml0U2VsZWN0MiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChcIi5jdXN0b20tZm9ybSBzZWxlY3RcIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnNlbGVjdDIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiAkKHRoaXMpLmZpbmQoXCJvcHRpb25cIikubGVuZ3RoIDwgNiA/IC0xIDogMCxcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXJDc3NDbGFzczogXCJzZWxlY3QyLWJvcmRlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICBkcm9wZG93bkNzc0NsYXNzOiBcInNlbGVjdDItYm9yZGVyLWRyb3Bkb3duXCJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmICgkKFwiLmN1c3RvbS1mb3JtIHNlbGVjdFwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGluaXRTZWxlY3QyKCk7XHJcbiAgICAgICAgICAgICQoXCIuY3VzdG9tLWZvcm1cIikuYmluZChcIkRPTVN1YnRyZWVNb2RpZmllZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChcIi5jdXN0b20tZm9ybSAuc2VsZWN0MlwiKS5sZW5ndGggPiAwKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChpbml0U2VsZWN0MiwgNTAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdWlfdmFsaWRhdGUoKSB7XHJcbiAgICAgICAgdmFyIGNoZWNrX3JlcXVpcmVkX2lucHV0ID0gZnVuY3Rpb24gKGUsIG1zZykge1xyXG4gICAgICAgICAgICBpZiAoJChlLnRhcmdldCkudmFsKCkubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgJChlLnRhcmdldCkuYWRkQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChlLnRhcmdldCkucGFyZW50KCkuZmluZChcIi5lcnJvclwiKS5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIjxzcGFuIGNsYXNzPSdlcnJvcic+VGhpcyBmaWVsZCBpcyBhIHJlcXVpcmVkLjwvc3Bhbj5cIikuaW5zZXJ0QWZ0ZXIoJChlLnRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlQ2xhc3MoXCJoYXMtZXJyb3JcIik7XHJcbiAgICAgICAgICAgICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5maW5kKFwiLmVycm9yXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjc2hvdy1zaGlwcGluZy1maWVsZHNldFwiKS5pcyhcIjpjaGVja2VkXCIpKSB7XHJcbiAgICAgICAgICAgIHZhciAkaW5wdXRfdmFsaWRhdGUgPSAkKFwiLndvb2NvbW1lcmNlLWFjY291bnQgLmJpbGxpbmcgLnZhbGlkYXRlLXJlcXVpcmVkIGlucHV0LC53b29jb21tZXJjZS1hY2NvdW50IC5zaGlwcGluZyAudmFsaWRhdGUtcmVxdWlyZWQgaW5wdXRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgJGlucHV0X3ZhbGlkYXRlID0gJChcIi53b29jb21tZXJjZS1hY2NvdW50IC5lZGl0LWFjY291bnQgLnZhbGlkYXRlLXJlcXVpcmVkIGlucHV0LC53b29jb21tZXJjZS1hY2NvdW50IC5iaWxsaW5nIC52YWxpZGF0ZS1yZXF1aXJlZCBpbnB1dFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJGlucHV0X3ZhbGlkYXRlLm9uKFwia2V5dXBcIiwgY2hlY2tfcmVxdWlyZWRfaW5wdXQpO1xyXG4gICAgICAgIHZhciBjaGVja19hbGwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBpc19vayA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICAkZmlyc3Q7XHJcbiAgICAgICAgICAgICRpbnB1dF92YWxpZGF0ZS5lYWNoKGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBjaGVja19yZXF1aXJlZF9pbnB1dCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiAkKHYpWzBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmICgkKHYpLmhhc0NsYXNzKFwiaGFzLWVycm9yXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNfb2sgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISRmaXJzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZmlyc3QgPSAkKHYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICgkZmlyc3QpIHtcclxuICAgICAgICAgICAgICAgICRmaXJzdC5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpc19vaztcclxuICAgICAgICB9O1xyXG4gICAgICAgICQoXCIud29vY29tbWVyY2UtYWNjb3VudCAuY3VzdG9tLWZvcm0gZm9ybVwiKS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKCFjaGVja19hbGwoKSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyB1aV9yZXZpZXdfYWNjb3VudCgpO1xyXG4gICAgICAgIGZvcm1fc2VsZWN0MigpO1xyXG4gICAgICAgIHVpX3ZhbGlkYXRlKCk7XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTsiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBmb3JtYXRfaG91cl90b19taW51dGUoaG91cikge1xyXG4gICAgICAgIHZhciBob3VyX3BhcnQgPSBwYXJzZUZsb2F0KGhvdXIuc3BsaXQoJzonKVswXSkgKiA2MDtcclxuICAgICAgICB2YXIgbWludXRlX3BhcnQgPSBwYXJzZUZsb2F0KGhvdXIuc3BsaXQoJzonKVsxXSk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZSA9IGhvdXJfcGFydCArIG1pbnV0ZV9wYXJ0O1xyXG4gICAgICAgIHJldHVybiBtaW51dGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy9DQUxFTkRBUiBFVkVOVCBIQU5ETEVSXHJcbiAgICAkLnVpX2NhbGVuZGFyX2FwcG9pbnRtZW50ID0gZnVuY3Rpb24gKGRpc2FibGVfZGF0ZXMsIGRpc2FibGVfdGltZXMsIG1ldGhvZF91bmJvb2thYmxlKSB7XHJcbiAgICAgICAgdmFyICRjYWxlbmRhciA9ICQoXCIjY2FsZW5kYXJcIik7XHJcbiAgICAgICAgdmFyIGluYWN0aXZlX2RhdGVzID0gZGlzYWJsZV9kYXRlcztcclxuICAgICAgICAvLyB2YXIgbWV0aG9kID0gbWV0aG9kX3VuYm9va2FibGU7XHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlX2R1cGxpY2F0ZXMoYXJyKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICAgICAgdmFyIHJldF9hcnIgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG9ialthcnJbaV1dID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICByZXRfYXJyLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0X2FycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIChpbmFjdGl2ZV9kYXRlcyAmJiBPYmplY3Qua2V5cyhpbmFjdGl2ZV9kYXRlcykubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgLy8gICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGluYWN0aXZlX2RhdGVzLCBtZXRob2QpO1xyXG4gICAgICAgIC8vICAgICBpbmFjdGl2ZV9kYXRlcyA9IHJlbW92ZV9kdXBsaWNhdGVzKGluYWN0aXZlX2RhdGVzKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmICgkY2FsZW5kYXIubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cclxuICAgICAgICAkY2FsZW5kYXIuZGF0ZXBpY2tlcih7XHJcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogJzBkJyxcclxuICAgICAgICAgICAgZm9ybWF0OiAneXl5eS9tbS9kZCcsXHJcbiAgICAgICAgICAgIGVuZERhdGU6ICcrNTB5JyxcclxuICAgICAgICAgICAgd2Vla1N0YXJ0OiAxLFxyXG4gICAgICAgICAgICBtYXhWaWV3TW9kZTogMixcclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBsZWZ0QXJyb3c6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tbGVmdFwiPjwvaT4nLFxyXG4gICAgICAgICAgICAgICAgcmlnaHRBcnJvdzogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1yaWdodFwiPjwvaT4nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGJlZm9yZVNob3dEYXk6IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGRhdGU7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3Vycl9kYXRlID0gZC5nZXREYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3Vycl9tb250aCA9IGQuZ2V0TW9udGgoKSArIDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3Vycl95ZWFyID0gZC5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGZvcm1hdHRlZERhdGUgPSBjdXJyX3llYXIgKyBcIi9cIiArIChjdXJyX21vbnRoIDwgMTAgPyBcIjBcIiA6ICcnKVxyXG4gICAgICAgICAgICAgICAgICAgICsgY3Vycl9tb250aCArIFwiL1wiICsgKGN1cnJfZGF0ZSA8IDEwID8gXCIwXCIgOiAnJykgKyBjdXJyX2RhdGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGZvcm1hdHRlZERhdGUsIGluYWN0aXZlX2RhdGVzKSAhPSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXM6ICdkaXNhYmxlLWRhdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDogJ1RoaXMgZGF0ZS90aW1lIGlzIG5vdCBhdmFpbGFibGUgZm9yIGJvb2tpbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5vbignY2hhbmdlRGF0ZScsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRlID0gZS5mb3JtYXQoKTtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdF9kYXRlID0gZGF0ZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgICAgIHZhciBtZXRob2RfbWludXRlX2R1cmF0aW9uID0gcGFyc2VGbG9hdCgkKCcuYm9vay1zdGVwLW5leHQnKS5hdHRyKCdkYXRhLW1pbnV0ZScpKTtcclxuICAgICAgICAgICAgLy9SRVNFVCBUSVRMRSBUT09MVElQIE9OIENIQU5HRSBEQVRFXHJcbiAgICAgICAgICAgICQoJy5pdGVtLXRpbWUtcGlja2VyJykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAndGl0bGUnOiAnJyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vUkVTRVQgU0VMRUNUSU9OIFBJQ0tFUlxyXG4gICAgICAgICAgICAkLnJlc2V0X3NlbGVjdGlvbl9waWNrZXIoKTtcclxuICAgICAgICAgICAgLy9DSEVDSyBEQVRBIFNFTEVDVEVEIERFU0tUT1BcclxuICAgICAgICAgICAgJC5jaGVja19kYXRhX2Rlc2t0b3AoKTtcclxuICAgICAgICAgICAgLy9DSEVDSyBGVUxMIERBVEEgU0VMRUNURURcclxuICAgICAgICAgICAgJC5jaGVja19mdWxsX2RhdGFfc2VsZWN0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vRElTQUJMRSBUSU1FIFNFTEVDVElPTiBCWSBEQVRFXHJcbiAgICAgICAgICAgIGlmIChkaXNhYmxlX3RpbWVzICYmIGRpc2FibGVfdGltZXMuaGFzT3duUHJvcGVydHkoZGF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnJheV90aW1lID0gZGlzYWJsZV90aW1lc1tkYXRlXTtcclxuICAgICAgICAgICAgICAgIHZhciB0aW1lX3BpY2tlciA9ICQoJy5pdGVtLXRpbWUtcGlja2VyJyk7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2goYXJyYXlfdGltZSwgZnVuY3Rpb24gKGksIHYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGltZV9zdGFydCA9IHZbJ3RpbWVfc3RhcnQnXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZV9lbmQgPSB2Wyd0aW1lX2VuZCddO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW51dGVfc3RhcnQgPSBmb3JtYXRfaG91cl90b19taW51dGUodGltZV9zdGFydCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZV9lbmQgPSBmb3JtYXRfaG91cl90b19taW51dGUodGltZV9lbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVfcGlja2VyLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRfcGlja2VyID0gJHRoaXMuZmluZCgnaW5wdXQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsX3BpY2tlciA9ICR0aGlzLmZpbmQoJ2xhYmVsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aW1lX3BpY2tlcl9jaG9pY2UgPSAkKHRoaXMpLmZpbmQoJ2xhYmVsJykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lX3BpY2tlcl9taW51dGVfZm9ybWF0ID0gZm9ybWF0X2hvdXJfdG9fbWludXRlKHRpbWVfcGlja2VyX2Nob2ljZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgodGltZV9waWNrZXJfbWludXRlX2Zvcm1hdCA+PSBtaW51dGVfc3RhcnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAodGltZV9waWNrZXJfbWludXRlX2Zvcm1hdCA8IG1pbnV0ZV9lbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dF9waWNrZXIucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsX3BpY2tlci5hZGRDbGFzcygnZGlzYWJsZWQnKS5jbG9zZXN0KCcuaXRlbS10aW1lLXBpY2tlcicpLmF0dHIoJ3RpdGxlJywgJ1RoaXMgZGF0ZS90aW1lIGlzIG5vdCBhdmFpbGFibGUgZm9yIGJvb2tpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRpbWVfcGlja2VyX21pbnV0ZV9mb3JtYXQgKyBtZXRob2RfbWludXRlX2R1cmF0aW9uID4gbWludXRlX3N0YXJ0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgKHRpbWVfcGlja2VyX21pbnV0ZV9mb3JtYXQgKyBtZXRob2RfbWludXRlX2R1cmF0aW9uIDw9IG1pbnV0ZV9lbmQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dF9waWNrZXIucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsX3BpY2tlci5hZGRDbGFzcygnZGlzYWJsZWQnKS5jbG9zZXN0KCcuaXRlbS10aW1lLXBpY2tlcicpLmF0dHIoJ3RpdGxlJywgJ1RoaXMgZGF0ZS90aW1lIGlzIG5vdCBhdmFpbGFibGUgZm9yIGJvb2tpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHRpbWVfcGlja2VyX21pbnV0ZV9mb3JtYXQgKyBtZXRob2RfbWludXRlX2R1cmF0aW9uID4gbWludXRlX3N0YXJ0KSAmJiAodGltZV9waWNrZXJfbWludXRlX2Zvcm1hdCArIG1ldGhvZF9taW51dGVfZHVyYXRpb24gPCBtaW51dGVfZW5kICsgbWV0aG9kX21pbnV0ZV9kdXJhdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0X3BpY2tlci5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxfcGlja2VyLmFkZENsYXNzKCdkaXNhYmxlZCcpLmNsb3Nlc3QoJy5pdGVtLXRpbWUtcGlja2VyJykuYXR0cigndGl0bGUnLCAnVGhpcyBkYXRlL3RpbWUgaXMgbm90IGF2YWlsYWJsZSBmb3IgYm9va2luZycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9QQVJTRSBEQVRFIFNFTEVDVElPTiBUTyBCVVRUT05cclxuICAgICAgICAgICAgJCgnLmJ0bi1maW5hbC1zdGVwJykuYXR0cignYm9va2luZ19kYXRlJywgZGF0ZSk7XHJcbiAgICAgICAgICAgIHZhciB5ZWFyID0gZm9ybWF0X2RhdGVbMF0sXHJcbiAgICAgICAgICAgICAgICBtb250aCA9IGZvcm1hdF9kYXRlWzFdLFxyXG4gICAgICAgICAgICAgICAgZGF5ID0gZm9ybWF0X2RhdGVbMl07XHJcbiAgICAgICAgICAgIHZhciBkYXlfdGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBtb250aF9kYXRhID0gW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIixcclxuICAgICAgICAgICAgICAgIFwiSnVseVwiLCBcIkF1Z3VzdFwiLCBcIlNlcHRlbWJlclwiLCBcIk9jdG9iZXJcIiwgXCJOb3ZlbWJlclwiLCBcIkRlY2VtYmVyXCJdO1xyXG4gICAgICAgICAgICB2YXIgbW9udGhfc3RyaW5nID0gbW9udGhfZGF0YVtwYXJzZUludChtb250aCkgLSAxXTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoZGF5KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMDFcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIyMVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRheV90ZXh0ID0gXCJzdFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjAyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiMjJcIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXlfdGV4dCA9IFwibmRcIjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCIwM1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIjIzXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF5X3RleHQgPSBcInJkXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGRheV90ZXh0ID0gXCJ0aFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQoXCIuZGF0ZS1jaG9zZW5cIikudGV4dChkYXkgKyBcIi1cIiArIG1vbnRoICsgXCItXCIgKyB5ZWFyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyAiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIC8vREVGQVVMVCBPRkZTRVQgRk9SIFNNT09USFNDUk9MTFxyXG4gICAgdmFyIG9mZnNldF90b3BfZGVmYXVsdCA9ICQoJ2hlYWRlci5oZWFkZXItcGFnZScpLm91dGVySGVpZ2h0KClcclxuICAgICAgICArICgoJChcImJvZHlcIikuaGFzQ2xhc3MoXCJhZG1pbi1iYXJcIilcclxuICAgICAgICAgICAgJiYgJCh3aW5kb3cpLndpZHRoKCkgPj0gNzY4KSA/IDMyIDogMCk7XHJcblxyXG4gICAgLy9TTU9PVEggU0NST0xMIE9OIEJPT0tJTkcgQ0hBTkdFIFNURVAgRVZFTlRcclxuICAgIGZ1bmN0aW9uIHNjcm9sbF9ib29raW5nX3NlY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKCQoJy50by1ib29raW5nLXNlY3Rpb24nKS5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICAgICAgdmFyICRidG4gPSAkKCcudG8tYm9va2luZy1zZWN0aW9uJyk7XHJcbiAgICAgICAgJGJ0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgJGJvb2tpbmcgPSAkKCcuYm9va2luZy1hcHBvaW50bWVudCcpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmICgkYm9va2luZy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAkKCdodG1sLGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiAkYm9va2luZy5vZmZzZXQoKS50b3AgLSBvZmZzZXRfdG9wX2RlZmF1bHRcclxuICAgICAgICAgICAgICAgIH0sIDgwMClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vSU5JVCBQUkFDVElUSU9ORVIgVEhVTUIgU0xJREVSXHJcbiAgICBmdW5jdGlvbiBpbml0X3ByYWN0aXRpb25lcl9zbGlkZXIoKSB7XHJcbiAgICAgICAgaWYgKCQoJy5wcmFjdGl0aW9uZXJzLXNsaWRlcicpLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICB2YXIgJG93bCA9ICQoJy5wcmFjdGl0aW9uZXJzLXNsaWRlcicpO1xyXG4gICAgICAgICRvd2wub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBpdGVtczogMyxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDUwLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFkZGluZzogNTUsXHJcbiAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA1NzY6IHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDUwLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFkZGluZzogNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDcwLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFkZGluZzogMFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDU3Nikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZXZlbnQuaXRlbS5pbmRleDtcclxuICAgICAgICAgICAgICAgICQoJy5vd2wtaXRlbScpLmVxKGluZGV4KS5maW5kKCcucHJhY3RpdGlvbmVyLWl0ZW0nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy9IQU5ETEUgUFJBQ1RJVElPTkVSIFRIVU1CIEVWRU5UIFxyXG4gICAgICAgICQoJy5wcmFjdGl0aW9uZXItaXRlbScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICRvd2xfaXRlbSA9ICQodGhpcykuY2xvc2VzdCgnLm93bC1pdGVtJyksXHJcbiAgICAgICAgICAgICAgICAkcG9zaXRpb24gPSAkb3dsX2l0ZW0uaW5kZXgoKSxcclxuICAgICAgICAgICAgICAgICRvd2xfcHJvZmlsZSA9ICQoJy5vd2wtcHJvZmlsZScpLmxlbmd0aCA+IDAgPyAkKCcub3dsLXByb2ZpbGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvL0hBTkRMRSBTTElERVIgQUNUSVZFXHJcbiAgICAgICAgICAgICQoJy5wcmFjdGl0aW9uZXItaXRlbScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAvL0hBTkRMRSBTRUxFQ1RJT04gUFJBQ1RJVElPTkVSIEFDVElWRVxyXG4gICAgICAgICAgICAkKCcuc2VsZWN0aW9uLXByYWN0aXRpb25lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgJCgnLnNlbGVjdGlvbi1wcmFjdGl0aW9uZXInKS5lcSgkcG9zaXRpb24pLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblxyXG4gICAgICAgICAgICBpZiAoJG93bF9wcm9maWxlKSB7XHJcbiAgICAgICAgICAgICAgICAkb3dsX3Byb2ZpbGUudHJpZ2dlcigndG8ub3dsLmNhcm91c2VsJywgWyRwb3NpdGlvbiwgMzAwXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0lOSVQgU0xJREVSIFBSQUNUSVRJT05FUiBQUk9GSUxFU1xyXG4gICAgZnVuY3Rpb24gaW5pdF9vd2xfcHJvZmlsZSgpIHtcclxuICAgICAgICBpZiAoJCgnLm93bC1wcm9maWxlJykubGVuZ3RoIDwgMSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciAkb3dsID0gJCgnLm93bC1wcm9maWxlJyk7XHJcblxyXG4gICAgICAgICRvd2wub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBpdGVtczogMSxcclxuICAgICAgICAgICAgbWFyZ2luOiAzMCxcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIHRvdWNoRHJhZzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1vdXNlRHJhZzogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGVJbjogJ2ZhZGVJbicsXHJcbiAgICAgICAgfSkub24oJ2NoYW5nZWQub3dsLmNhcm91c2VsJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL1JFQ0FMQ1VMQVRFIEFQUE9JTlRNRU5UIEJPT0tJTkcgU0VDVElPTlxyXG4gICAgJC5jYWxjdWxhdGVfaGVpZ2h0X3N0ZXAgPSBmdW5jdGlvbiAoc3RlcCkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKCcud3JhcHBlci1lZmZlY3QnKS5oZWlnaHQoc3RlcC5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIGJveF9pbmZvX3N0aWNreSgpO1xyXG4gICAgICAgIH0sIDQ1MCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9SRU5ERVIgQ09OU1VMVEFUSU9OIEJPWFxyXG4gICAgZnVuY3Rpb24gcmVuZGVyX2NvbnN1bHRhdGlvbl9ib3goZGF0YV92YXJpYXRpb24pIHtcclxuICAgICAgICAkKCcuY29uc3VsdC13cmFwcGVyLWFwcGVuZCcpLmVtcHR5KCk7XHJcbiAgICAgICAgJC5lYWNoKGRhdGFfdmFyaWF0aW9uLCBmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiPGRpdiBjbGFzcz0nY29uc3VsdC13cmFwcGVyJz5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjxpbnB1dCBpZD0nY29uc3VsdC1cIiArIGkgKyBcIicgdHlwZT0ncmFkaW8nIG5hbWU9J2NvbnN1bHRhdGlvbicgdmFsdWU9XCIgKyB2LmlkXHJcbiAgICAgICAgICAgICAgICArIFwiIGRhdGEtY29zdD1cIiArIHYuY29zdCArIFwiPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPGxhYmVsIGZvcj0nY29uc3VsdC1cIiArIGkgKyBcIic+XCI7XHJcbiAgICAgICAgICAgIGh0bWwgKz0gXCI8c3BhbiBjbGFzcz0ndGl0bGUtY29uc3VsdCc+PHNwYW4gY2xhc3M9J3RleHQtdGl0bGUtY29uc3VsdCc+XCIgKyB2LnRpdGxlICsgXCI8L3NwYW4+PHNwYW4gY2xhc3M9J3RpbWUtY29uc3VsdCc+XCJcclxuICAgICAgICAgICAgICAgICsgXCI8c3BhbiBjbGFzcz0nbWludXRlcyc+XCIgKyB2LnRpbWUuc3BsaXQoXCIgXCIpWzBdICsgXCI8L3NwYW4+IG1pbnV0ZXM8L3NwYW4+PC9zcGFuPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPHNwYW4gY2xhc3M9J3ByaWNlLWNvbnN1bHQnPjxzcGFuIGNsYXNzPSdjdXJyZW5jeSc+JDwvc3Bhbj5cIiArIHYuY29zdCArIFwiPC9zcGFuPlwiO1xyXG4gICAgICAgICAgICBodG1sICs9IFwiPC9sYWJlbD5cIjtcclxuICAgICAgICAgICAgaHRtbCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICAkKCcuY29uc3VsdC13cmFwcGVyLWFwcGVuZCcpLmFwcGVuZChodG1sKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW5kZXJfbWV0aG9kX2JveChkYXRhX21ldGhvZCkge1xyXG4gICAgICAgICQuZWFjaChkYXRhX21ldGhvZCwgZnVuY3Rpb24gKGksIHYpIHtcclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGFfbWV0aG9kW2ldWyd1bmJvb2thYmxlJ10pLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGFfdW5ib29rYWJsZSA9IEpTT04uc3RyaW5naWZ5KGRhdGFfbWV0aG9kW2ldWyd1bmJvb2thYmxlJ10pO1xyXG4gICAgICAgICAgICAgICAgJCgnaW5wdXRbdmFsdWU9XCInICsgaSArICdcIl0nKS5hdHRyKHtcclxuICAgICAgICAgICAgICAgICAgICAnZGF0YS11bmJvb2thYmxlJzogZGF0YV91bmJvb2thYmxlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NBTENVTEFURSBIT1VSIERVUkFUSU9OXHJcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVfaG91cl9mb3JtYXQobWludXRlc19zZWxlY3QsIGhvdXJfc3RhcnQpIHtcclxuICAgICAgICBpZiAoIW1pbnV0ZXNfc2VsZWN0IHx8ICFob3VyX3N0YXJ0KSByZXR1cm47XHJcbiAgICAgICAgdmFyIG51bWJfdG9fbWludXRlID0gcGFyc2VGbG9hdChob3VyX3N0YXJ0LnRvU3RyaW5nKCkuc3BsaXQoXCI6XCIpWzBdKSAqIDYwO1xyXG4gICAgICAgIHZhciBudW1iX21pbnV0ZSA9IHBhcnNlRmxvYXQoaG91cl9zdGFydC50b1N0cmluZygpLnNwbGl0KFwiOlwiKVsxXSk7XHJcbiAgICAgICAgdmFyIG1pbnV0ZV90b3RhbCA9IG51bWJfdG9fbWludXRlICsgbnVtYl9taW51dGU7XHJcbiAgICAgICAgdmFyIG1pbnV0ZV9zdGFydF9lbmRfdG90YWwgPSBwYXJzZUZsb2F0KG1pbnV0ZXNfc2VsZWN0KSArIG1pbnV0ZV90b3RhbDtcclxuICAgICAgICB2YXIgaG91cl9kaXNwbGF5X2Zsb2F0ID0gbWludXRlX3N0YXJ0X2VuZF90b3RhbCAvIDYwO1xyXG4gICAgICAgIHZhciBob3VyX2Rpc3BsYXlfc3RyaW5nID0gaG91cl9kaXNwbGF5X2Zsb2F0LnRvU3RyaW5nKCkuc3BsaXQoXCIuXCIpWzBdO1xyXG4gICAgICAgIHZhciBtaW51dGVfZGlzcGxheV9mbG9hdCA9IChob3VyX2Rpc3BsYXlfZmxvYXQgLSBNYXRoLmZsb29yKGhvdXJfZGlzcGxheV9mbG9hdCkpICogNjA7XHJcbiAgICAgICAgdmFyIG1pbnV0ZV9kaXNwbGF5X3N0cmluZyA9IG1pbnV0ZV9kaXNwbGF5X2Zsb2F0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgJCgnLnRpbWUtZW5kJykudGV4dChob3VyX2Rpc3BsYXlfc3RyaW5nICsgXCI6XCIgKyBtaW51dGVfZGlzcGxheV9zdHJpbmcgKyAobWludXRlX2Rpc3BsYXlfZmxvYXQgPT0gMCA/ICcwJyA6ICcnKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9SRVNFVCBTRUxFQ1RJT04gUElDS0VSXHJcbiAgICAkLnJlc2V0X3NlbGVjdGlvbl9waWNrZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJCgnLml0ZW0tdGltZS1waWNrZXIgaW5wdXQnKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAkKCcuaXRlbS10aW1lLXBpY2tlciBpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgJCgnLml0ZW0tdGltZS1waWNrZXIgbGFiZWwnKS5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAkKCcuZGF0ZS1jaG9zZW4sLnRpbWUtc3RhcnQsLnRpbWUtZW5kJykudGV4dCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9SRVNFVCBCT1ggSU5GT1xyXG4gICAgZnVuY3Rpb24gcmVzZXRfYm94X2luZm8oKSB7XHJcbiAgICAgICAgJCgnLmRhdGUtY2hvc2VuJykudGV4dCgnJyk7XHJcbiAgICAgICAgJCgnLml0ZW0tdGltZS1waWNrZXInKS5maW5kKCdpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgJCgnLnRpbWUtc3RhcnQsLnRpbWUtZW5kJykudGV4dCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9TTElERSBET1dOIENVUlJFTlQgRk9DVVMgT04gTU9CSUxFXHJcbiAgICBmdW5jdGlvbiBzbGlkZV9jdXJyZW50X2ZvY3VzKCkge1xyXG4gICAgICAgIHZhciAkc3RlcF8xID0gJCgnLnJvdy1zdGVwLTEnKTtcclxuICAgICAgICAkKCcubW9iaWxlLXRvZ2dsZS13cmFwcGVyJykuaGlkZSgpO1xyXG4gICAgICAgICQoJy5jdXJyZW50LWZvY3VzIC5tb2JpbGUtdG9nZ2xlLXdyYXBwZXInKS5jc3MoJ2Rpc3BsYXknLCAnZmxleCcpLmhpZGUoKS5mYWRlSW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkLmNhbGN1bGF0ZV9oZWlnaHRfc3RlcCgkc3RlcF8xKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0NIRUNLIERBVEEgU0VMRUNURURcclxuICAgIGZ1bmN0aW9uIGNoZWNrX2RhdGFfc2VsZWN0ZWQoKSB7XHJcbiAgICAgICAgJCgnLnN0ZXBwZXI+LnJvdycpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgJHRleHRfY2hlY2tlciA9ICR0aGlzLmZpbmQoJy5zZWxlY3RlZC1jaGVja2VyJyk7XHJcbiAgICAgICAgICAgIGlmICgkdGV4dF9jaGVja2VyLnRleHQoKS50cmltKCkubGVuZ3RoICYmICEkdGhpcy5oYXNDbGFzcygnY3VycmVudC1mb2N1cycpKSB7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy9DSEVDSyBEQVRBIFNFTEVDVEVEIERFU0tUT1BcclxuICAgICQuY2hlY2tfZGF0YV9kZXNrdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5zdGVwcGVyPi5yb3cnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgdmFyICR0ZXh0X2NoZWNrZXIgPSAkdGhpcy5maW5kKCcuc2VsZWN0ZWQtY2hlY2tlcicpO1xyXG4gICAgICAgICAgICB2YXIgJHN0ZXAgPSAkdGhpcy5kYXRhKCdzdGVwJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHRleHRfY2hlY2tlci50ZXh0KCkudHJpbSgpLmxlbmd0aCAmJiAhJHRoaXMuaGFzQ2xhc3MoJ2N1cnJlbnQtZm9jdXMnKSkge1xyXG4gICAgICAgICAgICAgICAgJCgnLmVkaXQtYmFja1tkYXRhLXN0ZXA9XCInICsgJHN0ZXAgKyAnXCJdJykuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJCgnLmVkaXQtYmFja1tkYXRhLXN0ZXA9XCInICsgJHN0ZXAgKyAnXCJdJykuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvL0NIRUNLIERBVEEgU0VMRUNURUQgREVTS1RPUFxyXG4gICAgJC5jaGVja19mdWxsX2RhdGFfc2VsZWN0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNudCA9IDA7XHJcbiAgICAgICAgdmFyIGNudF9zdGVwMyA9IDA7XHJcbiAgICAgICAgJCgnLnN0ZXBwZXI+LnJvdycpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgJHN0ZXAgPSAkdGhpcy5kYXRhKCdzdGVwJyk7XHJcbiAgICAgICAgICAgIHZhciAkdGV4dF9jaGVja2VyID0gJHRoaXMuZmluZCgnLnNlbGVjdGVkLWNoZWNrZXInKTtcclxuICAgICAgICAgICAgdmFyICRidG5fZmluYWwgPSAkKCcuYnRuLWZpbmFsLXN0ZXAnKVxyXG4gICAgICAgICAgICBpZiAoJHRleHRfY2hlY2tlci50ZXh0KCkudHJpbSgpLmxlbmd0aCAmJiAkc3RlcCAhPSAzKSB7XHJcbiAgICAgICAgICAgICAgICBjbnQrKztcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkc3RlcCA9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAkdGV4dF9jaGVja2VyLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLnRleHQoKS50cmltKCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNudF9zdGVwMysrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNudCA9PSAzICYmIGNudF9zdGVwMyA9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuX2ZpbmFsLmFkZENsYXNzKCdjbGlja2FibGUnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRidG5fZmluYWwucmVtb3ZlQ2xhc3MoJ2NsaWNrYWJsZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9IQU5ETEUgQlVUVE9OIFRPIFBSRVZJT1VTIFNURVAgRVZFTlRcclxuICAgICQoJy5lZGl0LWJhY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgY3VycmVudF9pbmRleCA9ICQodGhpcykuZGF0YSgnc3RlcCcpO1xyXG4gICAgICAgIHZhciBzdGVwX3Jvd190YXJnZXQgPSAkKCcuc3RlcHBlcj4ucm93W2RhdGEtc3RlcD0nICsgY3VycmVudF9pbmRleCArICddJyk7XHJcbiAgICAgICAgdmFyICRib29raW5nX3NlY3Rpb24gPSAkKCcuYm9va2luZy1hcHBvaW50bWVudCcpO1xyXG4gICAgICAgIHZhciAkc2lkZV9ib3R0b20gPSAkKCcuc2lkZS1ib3R0b20nKTtcclxuICAgICAgICBpZiAoY3VycmVudF9pbmRleCA9PSAzKSB7XHJcbiAgICAgICAgICAgIC8vVFJJR0dFUiBDTElDSyBSRVRVUk4gQkFDSyBUTyBDQUxFTkRBUiBQSUNLSU5HXHJcbiAgICAgICAgICAgICQoJy50aW1lLXBpY2tlci1iYWNrJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyICRvZmZzZXRfdGFyZ2V0ID0gMDtcclxuICAgICAgICBpZiAoY3VycmVudF9pbmRleCA9PSA0KSB7XHJcbiAgICAgICAgICAgIC8vU0NST0xMIFdJTkRPVyBUTyBFTkQgT0YgQk9PS0lORyBTRUNUSU9OXHJcbiAgICAgICAgICAgICRvZmZzZXRfdGFyZ2V0ID0gKCgkYm9va2luZ19zZWN0aW9uLm9mZnNldCgpLnRvcCArICRib29raW5nX3NlY3Rpb24ub3V0ZXJIZWlnaHQoKSlcclxuICAgICAgICAgICAgICAgIC0gJCh3aW5kb3cpLmhlaWdodCgpKSArICRzaWRlX2JvdHRvbS5oZWlnaHQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRvZmZzZXRfdGFyZ2V0ID0gc3RlcF9yb3dfdGFyZ2V0Lm9mZnNldCgpLnRvcCAtIG9mZnNldF90b3BfZGVmYXVsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCgnaHRtbCxib2R5Jykuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBzY3JvbGxUb3A6ICRvZmZzZXRfdGFyZ2V0XHJcbiAgICAgICAgfSwgNDUwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoJy5zdGVwcGVyPi5yb3cnKS5yZW1vdmVDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICBzdGVwX3Jvd190YXJnZXQuYWRkQ2xhc3MoJ2N1cnJlbnQtZm9jdXMnKTtcclxuICAgICAgICAgICAgJC5jaGVja19kYXRhX2Rlc2t0b3AoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcblxyXG4gICAgLy9GT0NVUyBPTiBST1cgVE8gRURJVCBPTiBNT0JJTEUgXHJcbiAgICBmdW5jdGlvbiBlZGl0X2JhY2tfbW9iaWxlKCkge1xyXG4gICAgICAgICQoJy5lZGl0LWJhY2stbW9iaWxlJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICB2YXIgJHN0ZXBfMSA9ICQoJy5yb3ctc3RlcC0xJyk7XHJcbiAgICAgICAgICAgIHZhciAkcm93X2ZvY3VzID0gJHRoaXMuY2xvc2VzdCgnLnJvdycpO1xyXG4gICAgICAgICAgICB2YXIgJGN1cnJlbnRfc3RlcCA9ICRyb3dfZm9jdXMuZGF0YSgnc3RlcCcpO1xyXG4gICAgICAgICAgICBpZiAoJGN1cnJlbnRfc3RlcCA9PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAvL1RSSUdHRVIgQ0xJQ0sgUkVUVVJOIEJBQ0sgVE8gQ0FMRU5EQVIgUElDS0lOR1xyXG4gICAgICAgICAgICAgICAgJCgnLnRpbWUtcGlja2VyLWJhY2snKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICQoJy5zdGVwcGVyPi5yb3cnKS5yZW1vdmVDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICAkcm93X2ZvY3VzLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpLmFkZENsYXNzKCdjdXJyZW50LWZvY3VzJyk7XHJcbiAgICAgICAgICAgIGNoZWNrX2RhdGFfc2VsZWN0ZWQoKTtcclxuICAgICAgICAgICAgJCgnLm1vYmlsZS10b2dnbGUtd3JhcHBlcicpLmhpZGUoKTtcclxuICAgICAgICAgICAgJHJvd19mb2N1cy5maW5kKCcubW9iaWxlLXRvZ2dsZS13cmFwcGVyJykuY3NzKCdkaXNwbGF5JywgJ2ZsZXgnKS5oaWRlKCkuZmFkZUluKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQuY2FsY3VsYXRlX2hlaWdodF9zdGVwKCRzdGVwXzEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0FDVElWRSBORVhUIFNURVBcclxuICAgICQuc2Nyb2xsX3RvX25leHRfc3RlcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJG5leHRfc3RlcCA9ICQoJy5jdXJyZW50LWZvY3VzJykubmV4dCgnLnJvdycpO1xyXG4gICAgICAgIHZhciAkbmV4dF9zdGVwX2luZGV4ID0gJCgnLmN1cnJlbnQtZm9jdXMnKS5uZXh0KCcucm93JykuaW5kZXgoKTtcclxuICAgICAgICB2YXIgJHRleHRfY2hlY2tlciA9ICRuZXh0X3N0ZXAuZmluZCgnLnNlbGVjdGVkLWNoZWNrZXInKTtcclxuICAgICAgICB2YXIgJHJvdyA9ICQoJy5zdGVwcGVyPi5yb3cnKTtcclxuICAgICAgICB2YXIgJHJvd19udW1icyA9ICRyb3cubGVuZ3RoO1xyXG4gICAgICAgIHZhciAkYm9va2luZ19zZWN0aW9uID0gJCgnLmJvb2tpbmctYXBwb2ludG1lbnQnKTtcclxuICAgICAgICB2YXIgJHNpZGVfYm90dG9tID0gJCgnLnNpZGUtYm90dG9tJyk7XHJcbiAgICAgICAgLy9DSEVDSyBJRiBJUyBNT0JJTEUgU0NSRUVOIEFORCBJUyBOT1QgTEFTVCBST1dcclxuICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCA3NjggJiYgJG5leHRfc3RlcC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICgkdGV4dF9jaGVja2VyLnRleHQoKS50cmltKCkubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgJHJvdy5yZW1vdmVDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICAgICAgJG5leHRfc3RlcC5hZGRDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICAgICAgc2xpZGVfY3VycmVudF9mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgJG5leHRfc3RlcC5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRyb3cucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZm9jdXMnKTtcclxuICAgICAgICAgICAgICAgICQoJy5tb2JpbGUtdG9nZ2xlLXdyYXBwZXInKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2hlY2tfZGF0YV9zZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICAkLmNoZWNrX2Z1bGxfZGF0YV9zZWxlY3RlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJG5leHRfc3RlcC5sZW5ndGggPCAxIHx8ICQod2luZG93KS53aWR0aCgpIDwgNzY4KSByZXR1cm47XHJcbiAgICAgICAgdmFyICRvZmZzZXRfdGFyZ2V0ID0gMDtcclxuICAgICAgICBpZiAoJG5leHRfc3RlcF9pbmRleCA9PSAoJHJvd19udW1icyAtIDEpKSB7XHJcbiAgICAgICAgICAgIC8vU0NST0xMIFdJTkRPVyBUTyBFTkQgT0YgQk9PS0lORyBTRUNUSU9OXHJcbiAgICAgICAgICAgICRvZmZzZXRfdGFyZ2V0ID0gKCgkYm9va2luZ19zZWN0aW9uLm9mZnNldCgpLnRvcCArICRib29raW5nX3NlY3Rpb24ub3V0ZXJIZWlnaHQoKSlcclxuICAgICAgICAgICAgICAgIC0gJCh3aW5kb3cpLmhlaWdodCgpKSArICRzaWRlX2JvdHRvbS5oZWlnaHQoKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRvZmZzZXRfdGFyZ2V0ID0gJG5leHRfc3RlcC5vZmZzZXQoKS50b3AgLSBvZmZzZXRfdG9wX2RlZmF1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQoJ2h0bWwsYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkb2Zmc2V0X3RhcmdldFxyXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJHJvdy5yZW1vdmVDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICAkbmV4dF9zdGVwLmFkZENsYXNzKCdjdXJyZW50LWZvY3VzJyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJC5jaGVja19kYXRhX2Rlc2t0b3AoKTtcclxuICAgICAgICAgICAgICAgICQuY2hlY2tfZnVsbF9kYXRhX3NlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9CT09LSU5HIEpTIENBTExcclxuICAgIGZ1bmN0aW9uIGhhbmRsZV9ib29rX2luaXRpYXRpb24oKSB7XHJcbiAgICAgICAgLy9CT09LIEFQUE9JTlRNRU5UIENMSUNLXHJcbiAgICAgICAgJCgnLmJvb2stYXBwb2ludG1lbnQtYnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogJGRhdGFfdmFyaWF0aW9uOiBhcHBvaW50bWVudCB2YXJpYXRpb24gb2JqZWN0XHJcbiAgICAgICAgICAgICAqICRkYXRhX21ldGhvZDogYXBwb2ludG1lbnQgbWV0aG9kIG9iamVjdFxyXG4gICAgICAgICAgICAgKiAkZGF0YV9kaXNhYmxlOiBhcHBvaW50bWVudCBkaXNhYmxlIGRhdGVzIG9iamVjdFxyXG4gICAgICAgICAgICAgKiAkbmFtZTogc2VsZWN0ZWQgcHJhY3RpdGlvbmVyIG5hbWVcclxuICAgICAgICAgICAgICogJGJveF9pbmZvOiBib3ggaW5mbyBvdmVydmlldyBkYXRhIHNlbGVjdGluZ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdmFyICRkYXRhX3ZhcmlhdGlvbiA9ICQodGhpcykuZGF0YShcImFwcG9pbnRtZW50LXZhcmlhdGlvblwiKTtcclxuICAgICAgICAgICAgdmFyICRkYXRhX21ldGhvZCA9ICQodGhpcykuZGF0YSgnYXBwb2ludG1lbnQtbWV0aG9kJyk7XHJcbiAgICAgICAgICAgIHZhciAkZGF0YV9kaXNhYmxlID0gJCh0aGlzKS5kYXRhKFwiYXBwb2ludG1lbnQtZGlzYWJsZVwiKTtcclxuICAgICAgICAgICAgdmFyICRuYW1lID0gJCgnLnNlbGVjdGlvbi1wcmFjdGl0aW9uZXIuYWN0aXZlJykuZmluZCgnaDUnKS50ZXh0KCk7XHJcbiAgICAgICAgICAgIHZhciAkYm9va19zdGVwX25leHQgPSAkKCcuYm9vay1zdGVwLW5leHQnKTtcclxuICAgICAgICAgICAgdmFyICRmYWNlX2luZm8gPSAkZGF0YV9tZXRob2RbJ2Z0Zl91bmJvb2thYmxlX2RhdGUnXSA/ICgkZGF0YV9tZXRob2RbJ2Z0Zl91bmJvb2thYmxlX2RhdGUnXS5pbmZvciB8fCAnJykgOiAnJztcclxuICAgICAgICAgICAgLy9SRVNFVCBNRVRIT0QgV1JBUFBFUiBTVEFURVxyXG4gICAgICAgICAgICAkKCcubWV0aG9kLXdyYXBwZXIgaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkKCcubWV0aG9kLXdyYXBwZXIgaW5wdXQnKS5hdHRyKCdkYXRhLXVuYm9va2FibGUnLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAvL0VNUFRZIE1FVEhPRCBJTkZPIEJPWFxyXG4gICAgICAgICAgICAkKCcubWV0aG9kLWZhY2UtaW5mbycpLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIGlmICgkZGF0YV92YXJpYXRpb24gJiYgJGRhdGFfdmFyaWF0aW9uICE9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgLy9SRU5ERVIgQ09OU1VMVEFUSU9OIEJPWFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyX2NvbnN1bHRhdGlvbl9ib3goJGRhdGFfdmFyaWF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJGRhdGFfbWV0aG9kICYmIE9iamVjdC5rZXlzKCRkYXRhX21ldGhvZCkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvL1JFTkRFUiBNRVRIT0QgQk9YXHJcbiAgICAgICAgICAgICAgICByZW5kZXJfbWV0aG9kX2JveCgkZGF0YV9tZXRob2QpO1xyXG4gICAgICAgICAgICAgICAgLy9QQVNTIERBVEEgUkVUUklFVkVEIFRPIEJMT0NLXHJcbiAgICAgICAgICAgICAgICAkKCcubWV0aG9kLWZhY2UtaW5mbycpLmh0bWwoJzxwPicgKyAkZmFjZV9pbmZvICsgJzwvcD4nKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCRkYXRhX2Rpc2FibGUgJiYgT2JqZWN0LmtleXMoJGRhdGFfZGlzYWJsZSkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAkYm9va19zdGVwX25leHQuYXR0cignZGF0YS1kaXNhYmxlLWRhdGVzJywgSlNPTi5zdHJpbmdpZnkoJGRhdGFfZGlzYWJsZS51bmJvb2thYmxlKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGRhdGFfZGlzYWJsZS5zY2hlZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRib29rX3N0ZXBfbmV4dC5hdHRyKCdkYXRhLXNjaGVkdWxlJywgSlNPTi5zdHJpbmdpZnkoJGRhdGFfZGlzYWJsZS5zY2hlZHVsZSkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm9va19zdGVwX25leHQuYXR0cignZGF0YS1zY2hlZHVsZScsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGJvb2tfc3RlcF9uZXh0LmF0dHIoJ2RhdGEtZGlzYWJsZS1kYXRlcycsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgJGJvb2tfc3RlcF9uZXh0LmF0dHIoJ2RhdGEtc2NoZWR1bGUnLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRkYXRhX2VtcGxveWVlID0gJCh0aGlzKS5kYXRhKCdlbXBsb3llZS1pZCcpO1xyXG4gICAgICAgICAgICBpZiAoJGRhdGFfZW1wbG95ZWUpIHtcclxuICAgICAgICAgICAgICAgICRib29rX3N0ZXBfbmV4dC5yZW1vdmVDbGFzcygnYm9va2FibGUnKS5hdHRyKCdkYXRhLWlkJywgJGRhdGFfZW1wbG95ZWUpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1maW5hbCcpLmF0dHIoJ2RhdGEtcHJvZHVjdC1pZCcsICRkYXRhX2VtcGxveWVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRzdGVwXzEgPSAkKCcucm93LXN0ZXAtMScpO1xyXG4gICAgICAgICAgICAkKCdodG1sLGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJy5ib29raW5nLWFwcG9pbnRtZW50Jykub2Zmc2V0KCkudG9wIC0gb2Zmc2V0X3RvcF9kZWZhdWx0XHJcbiAgICAgICAgICAgIH0sIDQ1MCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCgnLnJvdy1pbnRybycpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICRzdGVwXzEuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJC5jYWxjdWxhdGVfaGVpZ2h0X3N0ZXAoJHN0ZXBfMSk7XHJcbiAgICAgICAgICAgICAgICAvL1VQREFURSBCT1ggSU5GTyBQUkFDVElUSU9ORVIgTkFNRVxyXG4gICAgICAgICAgICAgICAgJCgnLnByYWN0aXRpb25lci1uYW1lJykudGV4dCgkbmFtZSk7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuaG9sZGVyLWJveC1pbmZvJykuZmFkZUluKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJveC1pbmZvLXBpY2snKS50cmlnZ2VyKFwic3RpY2t5X2tpdDpyZWNhbGNcIik7XHJcbiAgICAgICAgICAgICAgICB9LCA0NTApO1xyXG4gICAgICAgICAgICAgICAgLy9UUklHR0VSIENMSUNLIFJFVFVSTiBCQUNLIFRPIENBTEVOREFSIFBJQ0tJTkdcclxuICAgICAgICAgICAgICAgICQoJy50aW1lLXBpY2tlci1iYWNrJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1JFU0VUIENVUlJFTlQgRk9DVVMgUk9XXHJcbiAgICAgICAgICAgICAgICAkKCcuc3RlcHBlcj4ucm93JykucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtZm9jdXMnKTtcclxuICAgICAgICAgICAgICAgICQoJy5zdGVwcGVyPi5yb3cnKS5maXJzdCgpLm5leHQoKS5hZGRDbGFzcygnY3VycmVudC1mb2N1cycpO1xyXG4gICAgICAgICAgICAgICAgLy9NT0JJTEUgSEFORExFIEVGRkVDVFxyXG4gICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgNzY4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVfY3VycmVudF9mb2N1cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrX2RhdGFfc2VsZWN0ZWQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5jaGVja19kYXRhX2Rlc2t0b3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvL1JFUkVOREVSIENBTEVOREFSXHJcbiAgICAgICAgICAgICQoXCIjY2FsZW5kYXJcIikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xyXG4gICAgICAgICAgICAkLnVpX2NhbGVuZGFyX2FwcG9pbnRtZW50KCRkYXRhX2Rpc2FibGUudW5ib29rYWJsZSwgJGRhdGFfZGlzYWJsZS5zY2hlZHVsZSk7XHJcblxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkd3JhcHBlciA9ICQoJy53cmFwcGVyLWVmZmVjdCcpO1xyXG4gICAgICAgICAgICBpZiAoJCgnLnJvdy1zdGVwLTEnKS5oYXNDbGFzcygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgICAgICR3cmFwcGVyLmhlaWdodCgkKCcucm93LXN0ZXAtMScpLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKCcucm93LWludHJvJykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAkd3JhcHBlci5oZWlnaHQoJCgnLnJvdy1pbnRybycpLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy9IQU5ETEUgUFJBQ1RJVElPTkVSIFNFTEVDVElPTiBFVkVOVCBPTiBTVEVQIDJcclxuICAgIGZ1bmN0aW9uIGhhbmRsZV9zZWxlY3Rpb25fcHJhY3RpdGlvbmVyKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc2VsZWN0aW9uLXByYWN0aXRpb25lcicsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICRwb3NpdGlvbiA9ICQodGhpcykuaW5kZXgoKSxcclxuICAgICAgICAgICAgICAgICRvd2xfcHJvZmlsZSA9ICQoJy5vd2wtcHJvZmlsZScpLmxlbmd0aCA+IDAgPyAkKCcub3dsLXByb2ZpbGUnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHZhciAkbmFtZSA9ICQodGhpcykuZmluZCgnaDUnKS50ZXh0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgc3RlcCBkZWZhdWx0XHJcbiAgICAgICAgICAgICQoJy5yb3dbZGF0YS1zdGVwPVwiMVwiXScpLmFkZENsYXNzKCdjdXJyZW50LWZvY3VzJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcbiAgICAgICAgICAgICAgICAvL1JFTU9WRSBCT1ggSU5GTyBNRVRIT0QgQU5EIENPTlNVTFRBVElPTiBURVhUXHJcbiAgICAgICAgICAgICAgICAkKCcuY29uc3VsdGF0aW9uLXRpdGxlICwgLm1ldGhvZC1uYW1lJykudGV4dCgnJyk7XHJcbiAgICAgICAgICAgICAgICAvL1JFU0VUIEJPWCBJTkZPXHJcbiAgICAgICAgICAgICAgICByZXNldF9ib3hfaW5mbygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vUkVTRVQgTUVUSE9EIFdSQVBQRVIgU1RBVEVcclxuICAgICAgICAgICAgICAgICQoJy5tZXRob2Qtd3JhcHBlciBpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAkKCcubWV0aG9kLXdyYXBwZXIgaW5wdXQnKS5hdHRyKCdkYXRhLXVuYm9va2FibGUnLCAnJyk7XHJcbiAgICAgICAgICAgICAgICAvL1VQREFURSBCT1ggSU5GTyBQUkFDVElUSU9ORVIgTkFNRVxyXG4gICAgICAgICAgICAgICAgJCgnLnByYWN0aXRpb25lci1uYW1lJykudGV4dCgkbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvL0hBTkRMRSBTTElERVIgUFJBQ1RJVElPTkVSIEFDVElWRVxyXG4gICAgICAgICAgICAgICAgJCgnLnByYWN0aXRpb25lci1pdGVtJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnByYWN0aXRpb25lcnMtc2xpZGVyIC5vd2wtaXRlbScpLmVxKCRwb3NpdGlvbikuZmluZCgnLnByYWN0aXRpb25lci1pdGVtJykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vSEFORExFIEFDVElWRSBTRUxFQ1RJT04gUFJBQ1RJVElPTkVSXHJcbiAgICAgICAgICAgICAgICAkKCcuc2VsZWN0aW9uLXByYWN0aXRpb25lcicpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkb3dsX3Byb2ZpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkb3dsX3Byb2ZpbGUudHJpZ2dlcigndG8ub3dsLmNhcm91c2VsJywgWyRwb3NpdGlvbiwgMzAwXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vUEFSU0UgREFUQSBBVFRSSUJVVEUgVE8gQk9PSyBBUFBPSU5UTUVOVCBCVVRUT05cclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGRhdGFfZW1wbG95ZWUgPSAkb3dsX3Byb2ZpbGUuZmluZCgnLm93bC1pdGVtJykuZXEoJHBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmJvb2stYXBwb2ludG1lbnQtYnRuJykuZGF0YSgnZW1wbG95ZWUtaWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9SRU5ERVIgQ09OU1VMVEFUSU9OIEJPWFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZGF0YV92YXJpYXRpb24gPSAkb3dsX3Byb2ZpbGUuZmluZCgnLm93bC1pdGVtJykuZXEoJHBvc2l0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmJvb2stYXBwb2ludG1lbnQtYnRuJykuZGF0YSgnYXBwb2ludG1lbnQtdmFyaWF0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyX2NvbnN1bHRhdGlvbl9ib3goJGRhdGFfdmFyaWF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRkYXRhX21ldGhvZCA9ICRvd2xfcHJvZmlsZS5maW5kKCcub3dsLWl0ZW0nKS5lcSgkcG9zaXRpb24pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuYm9vay1hcHBvaW50bWVudC1idG4nKS5kYXRhKCdhcHBvaW50bWVudC1tZXRob2QnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJGZhY2VfaW5mbyA9ICRkYXRhX21ldGhvZFsnZnRmX3VuYm9va2FibGVfZGF0ZSddID8gKCRkYXRhX21ldGhvZFsnZnRmX3VuYm9va2FibGVfZGF0ZSddLmluZm9yIHx8ICcnKSA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUkVOREVSIE1FVEhPRCBCT1hcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGRhdGFfbWV0aG9kICYmIE9iamVjdC5rZXlzKCRkYXRhX21ldGhvZCkubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbmRlcl9tZXRob2RfYm94KCRkYXRhX21ldGhvZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vUEFTUyBEQVRBIFJFVFJJRVZFRCBUTyBCTE9DS1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubWV0aG9kLWZhY2UtaW5mbycpLmh0bWwoJzxwPicgKyAkZmFjZV9pbmZvICsgJzwvcD4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkZGF0YV9kaXNhYmxlID0gJG93bF9wcm9maWxlLmZpbmQoJy5vd2wtaXRlbScpLmVxKCRwb3NpdGlvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5ib29rLWFwcG9pbnRtZW50LWJ0bicpLmRhdGEoJ2FwcG9pbnRtZW50LWRpc2FibGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGRhdGFfZGlzYWJsZSAmJiBPYmplY3Qua2V5cygkZGF0YV9kaXNhYmxlKS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykuYXR0cignZGF0YS1kaXNhYmxlLWRhdGVzJywgSlNPTi5zdHJpbmdpZnkoJGRhdGFfZGlzYWJsZS51bmJvb2thYmxlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkZGF0YV9kaXNhYmxlLnNjaGVkdWxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYm9vay1zdGVwLW5leHQnKS5hdHRyKCdkYXRhLXNjaGVkdWxlJywgSlNPTi5zdHJpbmdpZnkoJGRhdGFfZGlzYWJsZS5zY2hlZHVsZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykuYXR0cignZGF0YS1zY2hlZHVsZScsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykuYXR0cignZGF0YS1kaXNhYmxlLWRhdGVzJywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5ib29rLXN0ZXAtbmV4dCcpLmF0dHIoJ2RhdGEtc2NoZWR1bGUnLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykucmVtb3ZlQ2xhc3MoJ2Jvb2thYmxlJykuYXR0cignZGF0YS1pZCcsICRkYXRhX2VtcGxveWVlKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcuYm9vay1zdGVwLWZpbmFsJykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdkYXRhLXByb2R1Y3QtaWQnOiAkZGF0YV9lbXBsb3llZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ2RhdGEtc2VydmljZS1pZCc6ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYm9va2luZ19kYXRlJzogJydcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9DSEVDSyBEQVRBIFNFTEVDVEVEXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN0ZXBwZXI+LnJvdycpLnJlbW92ZUNsYXNzKCdzZWxlY3RlZCcpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vVFJJR0dFUiBDTElDSyBSRVRVUk4gQkFDSyBUTyBDQUxFTkRBUiBQSUNLSU5HXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnRpbWUtcGlja2VyLWJhY2snKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vUkVSRU5ERVIgQ0FMRU5EQVJcclxuICAgICAgICAgICAgICAgICQoXCIjY2FsZW5kYXJcIikuZGF0ZXBpY2tlcignZGVzdHJveScpO1xyXG4gICAgICAgICAgICAgICAgJC51aV9jYWxlbmRhcl9hcHBvaW50bWVudCgkZGF0YV9kaXNhYmxlLnVuYm9va2FibGUsICRkYXRhX2Rpc2FibGUuc2NoZWR1bGUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL0FDVElWRSBORVhUIFNURVAgRk9DVVNcclxuICAgICAgICAgICAgJC5zY3JvbGxfdG9fbmV4dF9zdGVwKCk7XHJcblxyXG4gICAgICAgICAgICAvL01PQklMRSBIQU5ETEUgRUZGRUNUXHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDc2OCkge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tfZGF0YV9zZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vSEFORExFIENPTlNVTFRBVElPTiBCT1ggT04gQ0hBTkdFIFxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLmNvbnN1bHQtd3JhcHBlciBpbnB1dDpyYWRpbycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy9IQU5ETEUgQk9YIElORk8gVVBEQVRFXHJcbiAgICAgICAgICAgIHZhciAkdmFsdWVfcHJpY2UgPSAkKCcuY29uc3VsdC13cmFwcGVyJykuZmluZCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS5hdHRyKCdkYXRhLWNvc3QnKSxcclxuICAgICAgICAgICAgICAgICR2YWx1ZV9jb25zdWx0ID0gJCgnLmNvbnN1bHQtd3JhcHBlcicpLmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXTpjaGVja2VkJylcclxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KCkuZmluZCgnLnRleHQtdGl0bGUtY29uc3VsdCcpLnRleHQoKSxcclxuICAgICAgICAgICAgICAgICR2YWx1ZV9pZCA9ICQoJy5jb25zdWx0LXdyYXBwZXInKS5maW5kKCdpbnB1dFt0eXBlPVwicmFkaW9cIl06Y2hlY2tlZCcpLnZhbCgpO1xyXG4gICAgICAgICAgICB2YXIgJG1pbnV0ZXMgPSAkKCcuY29uc3VsdC13cmFwcGVyJykuZmluZCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS5uZXh0KClcclxuICAgICAgICAgICAgICAgIC5maW5kKCcubWludXRlcycpLnRleHQoKSxcclxuICAgICAgICAgICAgICAgICR0aW1lX3N0YXJ0ID0gJCgnLml0ZW0tdGltZS1waWNrZXIgaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS5uZXh0KCdsYWJlbCcpLnRleHQoKTtcclxuICAgICAgICAgICAgaWYgKCR0aW1lX3N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBjYWxjdWxhdGVfaG91cl9mb3JtYXQoJG1pbnV0ZXMsICR0aW1lX3N0YXJ0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykuYXR0cignZGF0YS1taW51dGUnLCAkbWludXRlcyk7XHJcblxyXG4gICAgICAgICAgICAkKCcuY29uc3VsdGF0aW9uLXRpdGxlJykudGV4dCgkdmFsdWVfY29uc3VsdCk7XHJcbiAgICAgICAgICAgICQoJy5ib29rLXN0ZXAtZmluYWwgc3BhbicpLnRleHQoJHZhbHVlX3ByaWNlKTtcclxuXHJcbiAgICAgICAgICAgIC8vQ09VTlQgTlVNQkVSIENIRUNLRUQgSU5QVVRcclxuICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1uZXh0JykuYXR0cignZGF0YS1zZXJ2aWNlLWlkJywgJHZhbHVlX2lkKTtcclxuICAgICAgICAgICAgJCgnLmJvb2stc3RlcC1maW5hbCcpLmF0dHIoJ2RhdGEtc2VydmljZS1pZCcsICR2YWx1ZV9pZCk7XHJcblxyXG4gICAgICAgICAgICAvL1RSSUdHRVIgQ0FMRU5EQVIgT04gQ0hBTkdFXHJcbiAgICAgICAgICAgICQoJyNjYWxlbmRhciB0ZC5kYXkuYWN0aXZlJykudHJpZ2dlcignY2xpY2snKTtcclxuXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy9BQ1RJVkUgTkVYVCBTVEVQIEZPQ1VTXHJcbiAgICAgICAgICAgICAgICAkLnNjcm9sbF90b19uZXh0X3N0ZXAoKTtcclxuICAgICAgICAgICAgfSwgNTAwKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vSEFORExFIE1FVEhPRCBXUkFQUEVSIE9OIENIQU5HRVxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLm1ldGhvZC13cmFwcGVyIGlucHV0OnJhZGlvJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHZhbHVlX21ldGhvZCA9ICQoJy5tZXRob2Qtd3JhcHBlcicpLmZpbmQoJ2lucHV0W3R5cGU9XCJyYWRpb1wiXTpjaGVja2VkJykudmFsKCk7XHJcbiAgICAgICAgICAgICQoJy5tZXRob2QtZmFjZS1pbmZvJykuaGlkZSgpO1xyXG4gICAgICAgICAgICBpZiAoJHZhbHVlX21ldGhvZCA9PSBcImZhY2UgdG8gZmFjZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcubWV0aG9kLWZhY2UtaW5mbycpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkLmNhbGN1bGF0ZV9oZWlnaHRfc3RlcCgkKCcucm93LXN0ZXAtMScpKTtcclxuICAgICAgICAgICAgJCgnLm1ldGhvZC1uYW1lJykudGV4dCgkdmFsdWVfbWV0aG9kKTtcclxuICAgICAgICAgICAgLy9BQ1RJVkUgTkVYVCBTVEVQIEZPQ1VTXHJcbiAgICAgICAgICAgICQuc2Nyb2xsX3RvX25leHRfc3RlcCgpO1xyXG4gICAgICAgICAgICAkLmNoZWNrX2Z1bGxfZGF0YV9zZWxlY3RlZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKCcuYm9vay1zdGVwLXByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogJCgnLmJvb2tpbmctYXBwb2ludG1lbnQnKS5vZmZzZXQoKS50b3AgLSBvZmZzZXRfdG9wX2RlZmF1bHRcclxuICAgICAgICAgICAgfSwgNDUwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKCcucmV0dXJuLXN0ZXAnKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy9IQU5ETEUgQ0xPU0UgQlVUVE9OIEVWRU5UXHJcbiAgICAgICAgJCgnLnJldHVybi1zdGVwJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgc3RlcHBlcl9yb3cgPSAkKCcuc3RlcHBlcj4ucm93Jyk7XHJcbiAgICAgICAgICAgIHZhciAkcm93X2ludHJvID0gJCgnLnJvdy1pbnRybycpO1xyXG4gICAgICAgICAgICB2YXIgJHJvd19zdGVwXzEgPSAkKCcucm93LXN0ZXAtMScpO1xyXG4gICAgICAgICAgICB2YXIgJGJvb2tfc3RlcF9maW5hbCA9ICQoJy5ib29rLXN0ZXAtZmluYWwnKTtcclxuICAgICAgICAgICAgJCgnLmhvbGRlci1ib3gtaW5mbycpLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHJvd19pbnRyby5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkcm93X3N0ZXBfMS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAkKCcuY29uc3VsdGF0aW9uLXRpdGxlICwgLm1ldGhvZC1uYW1lJykudGV4dCgnJyk7XHJcbiAgICAgICAgICAgICAgICAkYm9va19zdGVwX2ZpbmFsLmF0dHIoJ2Jvb2tpbmdfZGF0ZScsICcnKTtcclxuICAgICAgICAgICAgICAgIHJlc2V0X2JveF9pbmZvKCk7XHJcbiAgICAgICAgICAgICAgICBzdGVwcGVyX3Jvdy5yZW1vdmVDbGFzcygnY3VycmVudC1mb2N1cyBzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgc3RlcHBlcl9yb3cuZXEoMCkuYWRkQ2xhc3MoJ2N1cnJlbnQtZm9jdXMnKTtcclxuICAgICAgICAgICAgICAgICQuY2FsY3VsYXRlX2hlaWdodF9zdGVwKCRyb3dfaW50cm8pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0lOSVQgVElNRSBTRUxFQ1RJT04gU0xJREVSXHJcbiAgICBmdW5jdGlvbiBpbml0X293bF90aW1lX3BpY2tlcigpIHtcclxuICAgICAgICBpZiAoJCgnLm93bC10aW1lLXBpY2tlcicpLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICB2YXIgJG93bCA9ICQoJy5vd2wtdGltZS1waWNrZXInKTtcclxuICAgICAgICAkb3dsLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgbWFyZ2luOiAxMixcclxuICAgICAgICAgICAgZG90czogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdjogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b1dpZHRoOiB0cnVlLFxyXG4gICAgICAgICAgICBuYXZUZXh0OiBbJycsICcnXSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDc2ODoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiA0LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDEyMDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogNixcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy9IQU5ETEUgVElNRSBQSUNLRVIgQ0xJQ0sgQkFDS1xyXG4gICAgZnVuY3Rpb24gc2hvd19jYWxlbmRhcl9iYWNrKCkge1xyXG4gICAgICAgICQoJy50aW1lLXBpY2tlci1iYWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvL0ZBREUgSU4gVElNRSBQSUNLRVJcclxuICAgICAgICAgICAgJCgnLndyYXAtc2xpZGUtdGltZS1waWNrZXInKS5mYWRlT3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoJyNjYWxlbmRhcicpLmZhZGVJbigpO1xyXG4gICAgICAgICAgICAgICAgJC5jYWxjdWxhdGVfaGVpZ2h0X3N0ZXAoJCgnLnJvdy1zdGVwLTEnKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLy9GT1JNQVQgU0VMRUNUSU9OIFRJTUVcclxuICAgIGZ1bmN0aW9uIGZvcm1hdF9pdGVtX3BpY2tlcigpIHtcclxuICAgICAgICAkKCcuaXRlbS10aW1lLXBpY2tlcicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgJHZhbHVlID0gJCh0aGlzKS5maW5kKCdsYWJlbCcpLnRleHQoKTtcclxuICAgICAgICAgICAgJG51bWJfaG91ciA9ICR2YWx1ZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVswXSxcclxuICAgICAgICAgICAgICAgICRudW1iX21pbnV0ZSA9ICR2YWx1ZS50b1N0cmluZygpLnNwbGl0KFwiLlwiKVsxXVxyXG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ2xhYmVsJykudGV4dCgkbnVtYl9ob3VyICsgXCI6XCIgKyAkbnVtYl9taW51dGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vR0VORVJBVEUgVElNRSBTRUxFQ1RJT05cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlX3RpbWVfcGlja2VyKCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLml0ZW0tdGltZS1waWNrZXInLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdGltZV9zdGFydCA9ICQodGhpcykuZmluZCgnbGFiZWwnKS50ZXh0KCksXHJcbiAgICAgICAgICAgICAgICAkbWludXRlcyA9ICQoJy5jb25zdWx0LXdyYXBwZXInKS5maW5kKCdpbnB1dFt0eXBlPVwicmFkaW9cIl06Y2hlY2tlZCcpLm5leHQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCcubWludXRlcycpLnRleHQoKTtcclxuICAgICAgICAgICAgY2FsY3VsYXRlX2hvdXJfZm9ybWF0KCRtaW51dGVzLCAkdGltZV9zdGFydCk7XHJcbiAgICAgICAgICAgICQoJy50aW1lLXN0YXJ0JykudGV4dCgkdGltZV9zdGFydCArIFwiIC0gXCIpO1xyXG4gICAgICAgICAgICAkLmNhbGN1bGF0ZV9oZWlnaHRfc3RlcCgkKCcucm93LXN0ZXAtMScpKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvL0FDVElWRSBORVhUIFNURVAgRk9DVVNcclxuICAgICAgICAgICAgICAgICQuc2Nyb2xsX3RvX25leHRfc3RlcCgpO1xyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vR0VORVJBVEUgT0JKRUNUIERBVEEgSlNPTiAmJiBTQVZFIElOIFNFU1NJT04gU1RPUkFHRVxyXG4gICAgZnVuY3Rpb24gc3VibWl0X2Zvcm1fYXBwb2ludG1lbnQoKSB7XHJcbiAgICAgICAgJCgnLmJvb2stc3RlcC1maW5hbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIHZhciAkbWV0aG9kX25hbWUgPSAkKCcubWV0aG9kLW5hbWUnKS5maXJzdCgpLnRleHQoKTtcclxuICAgICAgICAgICAgdmFyICRib29raW5nX2RhdGUgPSAkKHRoaXMpLmF0dHIoJ2Jvb2tpbmdfZGF0ZScpO1xyXG4gICAgICAgICAgICB2YXIgJHRpbWVfc3RhcnQgPSAkKCcudGltZS1zdGFydCcpLmZpcnN0KCkudGV4dCgpLnNwbGl0KFwiIFwiKVswXTtcclxuICAgICAgICAgICAgdmFyICR0aW1lX2VuZCA9ICQoJy50aW1lLWVuZCcpLmZpcnN0KCkudGV4dCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YV90b19wYXNzID0ge1xyXG4gICAgICAgICAgICAgICAgXCJhcHBvaW50bWVudF9tZXRob2RcIjogJG1ldGhvZF9uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJhcHBvaW50bWVudF9ib29raW5nX2RhdGVcIjogJGJvb2tpbmdfZGF0ZSxcclxuICAgICAgICAgICAgICAgIFwiYXBwb2ludG1lbnRfdGltZV9jaG9zZW5cIjoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwiYXBwb2ludG1lbnRfdGltZV9zdGFydFwiOiAkdGltZV9zdGFydCxcclxuICAgICAgICAgICAgICAgICAgICBcImFwcG9pbnRtZW50X3RpbWVfZW5kXCI6ICR0aW1lX2VuZFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy9TQVZFIEpTT04gVE8gU0VTU0lPTiBTVE9SQUdFXHJcbiAgICAgICAgICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oXCJhcHBvaW50bWVudF9kYXRhXCIsIEpTT04uc3RyaW5naWZ5KGRhdGFfdG9fcGFzcykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vQ0hFQ0sgU0VTU0lPTiBTVE9SQUdFIEVYSVNUICYmIEFQUEVORCBJTlBVVCBGSUVMRCBJTiBDSEVDS09VVCBGT1JNIHwgQ1JFQVRFIFRBQkxFIFJFVklFVyBBUFBPSU5UTUVOVCBCT09LRURcclxuICAgIGZ1bmN0aW9uIGNoZWNrX2V4aXN0X3Nlc3Npb24oKSB7XHJcbiAgICAgICAgaWYgKCQoJy5jaGVja291dC1wYWdlJykubGVuZ3RoIDwgMSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBhcHBvaW50bWVudF9kYXRhID0gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnYXBwb2ludG1lbnRfZGF0YScpO1xyXG4gICAgICAgIGlmIChhcHBvaW50bWVudF9kYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhX2pzb24gPSBKU09OLnBhcnNlKGFwcG9pbnRtZW50X2RhdGEpO1xyXG4gICAgICAgICAgICB2YXIgaHRtbCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0X3JlbmRlciA9IFwiXCJcclxuICAgICAgICAgICAgJCgnLmRldGFpbHMtYXBwb2ludG1lbnQnKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJib3gtaW5mby1waWNrXCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhX2pzb24sIGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAnYXBwb2ludG1lbnRfdGltZV9jaG9zZW4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9SRU5ERVIgSVRFTSBJTiBCT1hcclxuICAgICAgICAgICAgICAgICAgICBodG1sID0gXCI8ZGl2IGNsYXNzPSdpdGVtLWlubmVyJz5cIjtcclxuICAgICAgICAgICAgICAgICAgICBodG1sICs9IFwiPGRpdiBjbGFzcz0ndGl0bGUnPlRpbWU6IDxzcGFuIGNsYXNzPSd0aW1lLXN0YXJ0Jz48L3NwYW4+PHNwYW4gY2xhc3M9J3RpbWUtZW5kJz48L3NwYW4+PC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy53b29jb21tZXJjZS1jaGVja291dCAuYm94LWluZm8tcGljaycpLmFwcGVuZChodG1sKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGFfanNvbltpXSwgZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCc8aW5wdXQ+JykuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLmxlbmd0aCA8IDUgPyAnMCcgKyB2YWx1ZSA6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKCdmb3JtLndvb2NvbW1lcmNlLWNoZWNrb3V0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gJ2FwcG9pbnRtZW50X3RpbWVfc3RhcnQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcudGltZS1zdGFydCcpLnRleHQodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09ICdhcHBvaW50bWVudF90aW1lX2VuZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy50aW1lLWVuZCcpLnRleHQoXCIgLSBcIiArIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnPGlucHV0PicpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnaGlkZGVuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogaSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZcclxuICAgICAgICAgICAgICAgICAgICB9KS5hcHBlbmRUbygnZm9ybS53b29jb21tZXJjZS1jaGVja291dCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAnYXBwb2ludG1lbnRfbWV0aG9kJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0X3JlbmRlciA9IFwiTWV0aG9kOiBcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gJ2FwcG9pbnRtZW50X2Jvb2tpbmdfZGF0ZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dF9yZW5kZXIgPSBcIkRhdGU6IFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ID0gdi5zcGxpdCgnLycpLnJldmVyc2UoKS5qb2luKCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vUkVOREVSIElURU0gSU4gQk9YXHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCA9IFwiPGRpdiBjbGFzcz0naXRlbS1pbm5lcic+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjxkaXYgY2xhc3M9J3RpdGxlJz5cIiArIHRleHRfcmVuZGVyICsgdiArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbCArPSBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy53b29jb21tZXJjZS1jaGVja291dCAuYm94LWluZm8tcGljaycpLmFwcGVuZChodG1sKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJveF9pbmZvX3N0aWNreSgpIHtcclxuICAgICAgICB2YXIgJHN0aWNreSA9ICQoXCIuYm9va2luZy1hcHBvaW50bWVudCAuYm94LWluZm8tcGlja1wiKTtcclxuICAgICAgICBpZiAoJHN0aWNreS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSA3NjgpIHtcclxuICAgICAgICAgICAgJHN0aWNreS5zdGlja19pbl9wYXJlbnQoe1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0X3RvcDogJChcImhlYWRlci5oZWFkZXItcGFnZVwiKS5oZWlnaHQoKVxyXG4gICAgICAgICAgICAgICAgICAgICsgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwiYWRtaW4tYmFyXCIpID8gMzIgOiAwKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgNzY4KSB7ICRzdGlja3kudHJpZ2dlcihcInN0aWNreV9raXQ6ZGV0YWNoXCIpOyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgU2xpZGVyIGZvciBQcmljaW5nIEJsb2NrXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluaXRfc2xpZGVyX3ByaWNpbmcoKSB7XHJcbiAgICAgICAgaWYgKCQoJy5zbGlkZXItcHJpY2luZycpLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICB2YXIgJG93bCA9ICQoJy5zbGlkZXItcHJpY2luZycpO1xyXG4gICAgICAgICRvd2wub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBtYXJnaW46IDUsXHJcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHtcclxuICAgICAgICAgICAgICAgIDA6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogMSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFnZVBhZGRpbmc6IDM1LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zaXRpb246IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDQwMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFkZGluZzogNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNDgwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiAxMjUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNzY4OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhZ2VQYWRkaW5nOiAxODUsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjogMSxcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIDk5Mjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAzLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlUGFkZGluZzogMCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2Nyb2xsX2Jvb2tpbmdfc2VjdGlvbigpO1xyXG4gICAgICAgIGluaXRfcHJhY3RpdGlvbmVyX3NsaWRlcigpO1xyXG4gICAgICAgIGluaXRfb3dsX3Byb2ZpbGUoKTtcclxuICAgICAgICBpbml0X293bF90aW1lX3BpY2tlcigpO1xyXG4gICAgICAgIGhhbmRsZV9ib29rX2luaXRpYXRpb24oKTtcclxuICAgICAgICBoYW5kbGVfc2VsZWN0aW9uX3ByYWN0aXRpb25lcigpO1xyXG4gICAgICAgIGZvcm1hdF9pdGVtX3BpY2tlcigpO1xyXG4gICAgICAgIGdlbmVyYXRlX3RpbWVfcGlja2VyKCk7XHJcbiAgICAgICAgc3VibWl0X2Zvcm1fYXBwb2ludG1lbnQoKTtcclxuICAgICAgICBjaGVja19leGlzdF9zZXNzaW9uKCk7XHJcbiAgICAgICAgYm94X2luZm9fc3RpY2t5KCk7XHJcbiAgICAgICAgc2hvd19jYWxlbmRhcl9iYWNrKCk7XHJcbiAgICAgICAgZWRpdF9iYWNrX21vYmlsZSgpO1xyXG4gICAgICAgIGluaXRfc2xpZGVyX3ByaWNpbmcoKTtcclxuICAgICAgICAkKCcuYXBwb2ludG1lbnQtcHJpY2luZyAuYmxvY2stcHJpY2luZycpLm1hdGNoSGVpZ2h0KCk7XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTsgIiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gYmxvZ19zdGlja3koKSB7XHJcbiAgICAgICAgdmFyICRzdGlja3kgPSAkKFwiLndyYXAtc2lkZWJhci1ibG9nLXNpbmdsZVwiKTtcclxuICAgICAgICBpZiAoJHN0aWNreS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSA5OTIpIHsgJHN0aWNreS5zdGlja19pbl9wYXJlbnQoeyBvZmZzZXRfdG9wOiAkKFwiaGVhZGVyLmhlYWRlci1wYWdlXCIpLmhlaWdodCgpICsgKCQoXCJib2R5XCIpLmhhc0NsYXNzKFwiYWRtaW4tYmFyXCIpID8gMzIgOiAwKSB9KTsgfVxyXG4gICAgICAgICQod2luZG93KS5vbihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDk5MikgeyAkc3RpY2t5LnRyaWdnZXIoXCJzdGlja3lfa2l0OmRldGFjaFwiKTsgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYmxvZ19zdGlja3koKTtcclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyAiLCIoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICBmdW5jdGlvbiBpbnB1dFF0eSgpIHtcclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnNxdWFyZS1wbHVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUludCgkKHRoaXMpLmNsb3Nlc3QoJy5xdHktaG9sZGVyJykuZmluZCgnaW5wdXQnKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9ICQodGhpcykuY2xvc2VzdCgnLnF0eS1ob2xkZXInKS5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSA8IDIwKSA/IHZhbHVlICsgMSA6IDIwO1xyXG4gICAgICAgICAgICBpbnB1dC52YWwodmFsdWUpO1xyXG4gICAgICAgICAgICAkKCdidXR0b25bbmFtZT11cGRhdGVfY2FydF0nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgaW5wdXQudHJpZ2dlcignY2hhbmdlJyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuc3F1YXJlLW1pbnVzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBwYXJzZUludCgkKHRoaXMpLmNsb3Nlc3QoJy5xdHktaG9sZGVyJykuZmluZCgnaW5wdXQnKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICBpbnB1dCA9ICQodGhpcykuY2xvc2VzdCgnLnF0eS1ob2xkZXInKS5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgICAgICB2YWx1ZSA9ICh2YWx1ZSA+IDEpID8gdmFsdWUgLSAxIDogMTtcclxuICAgICAgICAgICAgaW5wdXQudmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgJCgnYnV0dG9uW25hbWU9dXBkYXRlX2NhcnRdJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIGlucHV0LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5xdHktaG9sZGVyIGlucHV0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLnZhbCgpLFxyXG4gICAgICAgICAgICAgICAgaW5wdXQgPSAkKHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPj0gMjApIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gMjA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPD0gMSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlucHV0LnZhbCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gY2FydF9zZWxlY3QyKCkge1xyXG4gICAgICAgICQoJy5jYXJ0LXF1YW50aXR5Jykuc2VsZWN0Mih7XHJcbiAgICAgICAgICAgIG1pbmltdW1SZXN1bHRzRm9yU2VhcmNoOiA2LFxyXG4gICAgICAgICAgICBjb250YWluZXJDc3NDbGFzczogXCJzZWxlY3QyLWJvcmRlci1jb250YWluZXJcIixcclxuICAgICAgICAgICAgZHJvcGRvd25Dc3NDbGFzczogXCJzZWxlY3QyLWJvcmRlci1kcm9wZG93blwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaW5wdXRRdHkoKTtcclxuICAgICAgICBjYXJ0X3NlbGVjdDIoKTtcclxuICAgIH0pO1xyXG5cclxufSkoalF1ZXJ5KTtcclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgLy8gV0lMTCBERUxFVEUgV0hFTiBCVUlMRCBCQUNLRU5EXHJcbiAgICBmdW5jdGlvbiBjaGVja291dF9zd2l0Y2h0YWIoKSB7XHJcbiAgICAgICAgJChcIi5hY2MtbWVudS1zaWRlcmJhci5mb3ItY2hlY2tvdXQgYVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcImhyZWZcIikgPT09IFwiI3BheW1lbnRcIikge1xyXG4gICAgICAgICAgICAgICAgJChcIi5zZWN0aW9uLWNoZWNrb3V0XCIpLmFkZENsYXNzKFwiZC1ub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgJChcIi5zZWN0aW9uLXBheW1lbnRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmFjYy1tZW51LXNpZGVyYmFyLmZvci1jaGVja291dCBsaS5hY3RpdmVcIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmFjYy1tZW51LXNpZGVyYmFyLmZvci1jaGVja291dCBhW2hyZWY9JyNwYXltZW50J11cIikucGFyZW50KCkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnNlY3Rpb24tY2hlY2tvdXRcIikucmVtb3ZlQ2xhc3MoXCJkLW5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiLnNlY3Rpb24tcGF5bWVudFwiKS5hZGRDbGFzcyhcImQtbm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIuYWNjLW1lbnUtc2lkZXJiYXIuZm9yLWNoZWNrb3V0IGxpLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIuYWNjLW1lbnUtc2lkZXJiYXIuZm9yLWNoZWNrb3V0IGFbaHJlZj0nI3NoaXBwaW5nLWRldGFpbCddXCIpLnBhcmVudCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIi5idG4tYmFjay1zZWN0aW9uLXNoaXBwaW5nXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKFwiLmFjYy1tZW51LXNpZGVyYmFyLmZvci1jaGVja291dCBhW2hyZWY9JyNzaGlwcGluZy1kZXRhaWwnXVwiKS50cmlnZ2VyKFwiY2xpY2tcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIi5zZWN0aW9uLWNoZWNrb3V0IGJ1dHRvblt0eXBlPSdzdWJtaXQnXVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJChcIi5hY2MtbWVudS1zaWRlcmJhci5mb3ItY2hlY2tvdXQgYVtocmVmPScjcGF5bWVudCddXCIpLnRyaWdnZXIoXCJjbGlja1wiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByYWRpb0lucHV0U2xpZGUoKSB7XHJcbiAgICAgICAgJCgnLmN1c3RvbS1mb3JtIC5yYWRpby1zdHlsZS1ibG9jayBpbnB1dCcpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtLXJvdycpLmZpbmQoJ2lucHV0K2xhYmVsIHNwYW4nKS5zbGlkZVVwKDkwKTtcclxuICAgICAgICAgICAgICAgICQodGhpcykubmV4dCgnbGFiZWwnKS5maW5kKCdzcGFuJykuc2xpZGVEb3duKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVfbW9kYWxfcG9saWN5KCkge1xyXG4gICAgICAgICQoJy5wb3AtdXAtd2luZG93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoJCgnI3BvbGljeS1tb2RhbCcpLmxlbmd0aCA8IDEpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyICRwb2xpY3lfbW9kYWwgPSAkKCcjcG9saWN5LW1vZGFsJyk7XHJcbiAgICAgICAgICAgIHZhciAkdGVybV9jb25kaXRpb25zID0gJCgnLndvb2NvbW1lcmNlLXRlcm1zLWFuZC1jb25kaXRpb25zJykuaHRtbCgpO1xyXG4gICAgICAgICAgICAkcG9saWN5X21vZGFsLmZpbmQoJy5pbi1tb2RhbCcpLmVtcHR5KCkuYXBwZW5kKCR0ZXJtX2NvbmRpdGlvbnMpO1xyXG4gICAgICAgICAgICAkcG9saWN5X21vZGFsLm1vZGFsKCdzaG93Jyk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIGNoZWNrb3V0X3N3aXRjaHRhYigpO1xyXG4gICAgICAgIHJhZGlvSW5wdXRTbGlkZSgpO1xyXG4gICAgICAgIHRvZ2dsZV9tb2RhbF9wb2xpY3koKTtcclxuICAgICAgICAkKCcjcmVtZW1iZXJtZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5yZW1lbWJlcm1lJykuZmluZCgnbGFiZWwnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5yZW1lbWJlcm1lJykuZmluZCgnbGFiZWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBpZiAoJCgnLmVkdWNhdGlvbiAudGFiLW5hdmktbGVhcm4nKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCQoJy5lZHVjYXRpb24gLnRhYi1uYXZpLWxlYXJuJykub2Zmc2V0KCkudG9wIC0gKCQoJy5oZWFkZXItcGFnZScpLmhlaWdodCgpICsgMCkpO1xyXG4gICAgICAgICAgICAgICAgJCgnLnRhYi1uYXZpLWxlYXJuIGFbZGF0YS1oYXNoPScgKyBoYXNoICsgJ10nKS50cmlnZ2VyKCdjbGljaycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyAiLCIoZnVuY3Rpb24gKCQpIHtcclxuICAgIGZ1bmN0aW9uIHZpZGVvUG9wdXAoKSB7XHJcblxyXG4gICAgICAgIC8vVklNRU8gSU5JVFxyXG4gICAgICAgIHZhciB2aW1lbyA9ICQoJyN2aW1lby1wbGF5ZXInKTtcclxuICAgICAgICB2YXIgcGxheWVyID0gbmV3IFZpbWVvLlBsYXllcih2aW1lbyk7XHJcblxyXG4gICAgICAgIHZhciByZXNpemVGdWxsVmltZW8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciAkdmlkID0gJChcIi52aWRlby1ob2xkZXJcIik7XHJcbiAgICAgICAgICAgIHZhciAkaWZyID0gJChcIi52aWRlby1ob2xkZXIgaWZyYW1lXCIpO1xyXG4gICAgICAgICAgICAkaWZyLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkaWZyLmF0dHIoXCJ3aWR0aFwiLCBcIlwiKTtcclxuICAgICAgICAgICAgJGlmci5hdHRyKFwiaGVpZ2h0XCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgdyA9ICR2aWQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIGggPSAkdmlkLmhlaWdodCgpO1xyXG4gICAgICAgICAgICB2YXIgY2ggPSB3ICogOSAvIDE2LFxyXG4gICAgICAgICAgICAgICAgY3cgPSBoICogMTYgLyA5O1xyXG4gICAgICAgICAgICBpZiAoY2ggPiBoKSB7XHJcbiAgICAgICAgICAgICAgICAkaWZyLmhlaWdodChjaCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGN3ID4gdykge1xyXG4gICAgICAgICAgICAgICAgICAgICRpZnIud2lkdGgoY3cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy9FVkVOVCBPTiBCVVRUT04gSU5UUk8gQ0xJQ0tcclxuICAgICAgICAkKFwiLmJ0bi1wbGF5LXBvcHVwXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgZnJhbWUgPSAkKCcucG9wdXAtdmlkZW8nKS5maW5kKCcudmlkZW8taG9sZGVyJyksXHJcbiAgICAgICAgICAgICAgICBsaW5rVmlkID0gZnJhbWUuZGF0YShcImxpbmtcIik7XHJcbiAgICAgICAgICAgICQuYmFja2Ryb3Bfc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja3Nob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wb3B1cC12aWRlbycpLmFkZENsYXNzKCdleHBhbmQnKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja2hpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucG9wdXAtdmlkZW8nKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2xhc3M6IFwicG9wdXAtdmlkZW8tYmFja2Ryb3BcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJlc2l6ZUZ1bGxWaW1lbygpO1xyXG4gICAgICAgICAgICAkKHdpbmRvdykub24oXCJyZXNpemVcIiwgcmVzaXplRnVsbFZpbWVvKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvL0VWRU5UIE9OIFZJTUVPIEVORCBcclxuICAgICAgICBwbGF5ZXIub24oJ2VuZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkLmJhY2tkcm9wX2hpZGUoe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2toaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBvcHVwLXZpZGVvJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIi5wb3B1cC12aWRlbyAuY2xvc2UtYnRuLmhlYWx0aFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJC5iYWNrZHJvcF9oaWRlKHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNraGlkZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5wb3B1cC12aWRlbycpLnJlbW92ZUNsYXNzKCdleHBhbmQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vTVVURSBFVkVOVFxyXG4gICAgICAgICQoXCIjbXV0ZS12aWRlb1wiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICRpID0gJChcIiNtdXRlLXZpZGVvIGlcIik7XHJcbiAgICAgICAgICAgIHZhciBpc011dGUgPSAkaS5oYXNDbGFzcyhcImZhLXZvbHVtZS1vZmZcIik7XHJcbiAgICAgICAgICAgIGlmIChpc011dGUpIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5zZXRWb2x1bWUoMSk7XHJcbiAgICAgICAgICAgICAgICAkaS5yZW1vdmVDbGFzcyhcImZhLXZvbHVtZS1vZmZcIikuYWRkQ2xhc3MoXCJmYS12b2x1bWUtdXBcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIuc2V0Vm9sdW1lKDApO1xyXG4gICAgICAgICAgICAgICAgJGkucmVtb3ZlQ2xhc3MoXCJmYS12b2x1bWUtdXBcIikuYWRkQ2xhc3MoXCJmYS12b2x1bWUtb2ZmXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vU0VTU0lPTiBTVE9SQUdFIEZPUiBQT1BVUCBDT05UUk9MXHJcbiAgICAgICAgaWYgKCFzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFwiaXNGaXJzdEhlYWx0aEh1YlwiKSkge1xyXG4gICAgICAgICAgICAkLmJhY2tkcm9wX3Nob3coe1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzaG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBsYXkoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucG9wdXAtdmlkZW8nKS5hZGRDbGFzcygnZXhwYW5kJyk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2toaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBvcHVwLXZpZGVvJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcInBvcHVwLXZpZGVvLWJhY2tkcm9wXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICQod2luZG93KS5vbihcImxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgaWYgKCQoJy5wb3B1cC12aWRlbycpLmxlbmd0aCA+IDApIHsgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImlzRmlyc3RIZWFsdGhIdWJcIiwgdHJ1ZSk7IH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoJCgnLnBvcHVwLXZpZGVvJykubGVuZ3RoID4gMCkgeyBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwiaXNGaXJzdEhlYWx0aEh1YlwiLCB0cnVlKTsgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdWlfdG9vbHRpcF9jdXN0b20oKSB7XHJcbiAgICAgICAgdmFyICR0b29sdGlwID0gJCgnW2RhdGEtdG9nZ2xlLXRvb2x0aXA9XCJ0b29sdGlwXCJdJyk7XHJcbiAgICAgICAgaWYgKCR0b29sdGlwLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJHRvb2x0aXAuZWFjaChmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9fdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dF9pbm5lciA9IF9fdGhpcy5hdHRyKFwiZGF0YS10aXRsZVwiKTtcclxuICAgICAgICAgICAgICAgIF9fdGhpcy5ob3ZlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX190aGlzLnBhcmVudCgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J3Rvb2x0aXAtaW4nPlwiICsgdGV4dF9pbm5lciArIFwiPC9kaXY+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBfX3RoaXMuZmluZChcIi50b29sdGlwLWluXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnI3ZpbWVvLXBsYXllcicpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmlkZW9Qb3B1cCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xyXG4gICAgICAgIC8vIHVpX3Rvb2x0aXBfY3VzdG9tKCk7XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTsgIiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBmdW5jdGlvbiB1aV9kZXRlY3RfdmlkZW8oKSB7XHJcbiAgICAgICAgdmFyIHJlc2l6ZUZ1bGxWaW1lbyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyICR2aWQgPSAkKFwiLnZpZGVvLWhvbGRlclwiKTtcclxuICAgICAgICAgICAgdmFyICRpZnIgPSAkKFwiLnZpZGVvLWhvbGRlciBpZnJhbWVcIik7XHJcbiAgICAgICAgICAgICRpZnIuY3NzKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRpZnIuYXR0cihcIndpZHRoXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAkaWZyLmF0dHIoXCJoZWlnaHRcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIHZhciB3ID0gJHZpZC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaCA9ICR2aWQuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgIHZhciBjaCA9IHcgKiA5IC8gMTYsXHJcbiAgICAgICAgICAgICAgICBjdyA9IGggKiAxNiAvIDk7XHJcbiAgICAgICAgICAgIGlmIChjaCA+IGgpIHtcclxuICAgICAgICAgICAgICAgICRpZnIuaGVpZ2h0KGNoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3cgPiB3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlmci53aWR0aChjdyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgICQoXCIucGxheS1idG5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9ICQodGhpcykuY2xvc2VzdChcIi52aWRlby1ob2xkZXJcIiksXHJcbiAgICAgICAgICAgICAgICBsaW5rVmlkID0gZnJhbWUuZGF0YShcImxpbmtcIik7XHJcbiAgICAgICAgICAgICQodGhpcykuaGlkZSgpLmNsb3Nlc3QoXCIudmlkZW8taG9sZGVyXCIpLmFkZENsYXNzKFwiYW5pXCIpO1xyXG5cclxuICAgICAgICAgICAgZnJhbWUuZmluZChcImltZ1wiKS5mYWRlT3V0KCk7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaW5rVmlkLmluZGV4T2YoXCJ2aW1lb1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kKCc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nICsgdmltZW9fcGFyc2VyKGxpbmtWaWQpICsgJz9hdXRvcGxheT0xJnRpdGxlPTAmYnlsaW5lPTAmcG9ydHJhaXQ9MFwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kKCc8aWZyYW1lIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB5b3V0dWJlX3BhcnNlcihsaW5rVmlkKSArICc/YXV0b3BsYXk9MVwiICBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW5cIj48L2lmcmFtZT4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc2l6ZUZ1bGxWaW1lbygpO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIHJlc2l6ZUZ1bGxWaW1lbyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIi5jbG9zZS1idG5cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBmcmFtZSA9ICQodGhpcykuY2xvc2VzdChcIi52aWRlby1ob2xkZXJcIik7XHJcbiAgICAgICAgICAgICQodGhpcykuY2xvc2VzdChcIi52aWRlby1ob2xkZXJcIikucmVtb3ZlQ2xhc3MoXCJhbmlcIikuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgJChcIi5wbGF5LWJ0blwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIGZyYW1lLmZpbmQoXCJpbWdcIikuZmFkZUluKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB5b3V0dWJlX3BhcnNlcih1cmwpIHtcclxuICAgICAgICB2YXIgcmVnRXhwID0gL14uKigoeW91dHUuYmVcXC8pfCh2XFwvKXwoXFwvdVxcL1xcd1xcLyl8KGVtYmVkXFwvKXwod2F0Y2hcXD8pKVxcPz92Pz0/KFteI1xcJlxcP10qKS4qLztcclxuICAgICAgICB2YXIgbWF0Y2ggPSB1cmwubWF0Y2gocmVnRXhwKTtcclxuICAgICAgICByZXR1cm4gKG1hdGNoICYmIG1hdGNoWzddLmxlbmd0aCA9PSAxMSkgPyBtYXRjaFs3XSA6IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZpbWVvX3BhcnNlcih1cmwpIHtcclxuICAgICAgICB2YXIgbSA9IHVybC5tYXRjaCgvXi4rdmltZW8uY29tXFwvKC4qXFwvKT8oW14jXFw/XSopLyk7XHJcbiAgICAgICAgcmV0dXJuIG0gPyBtWzJdIHx8IG1bMV0gOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHVpX2dldF9zdGFydCgpIHtcclxuICAgICAgICAkKFwiLmJ0bi1ibGFjay1nZXRcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gJChcImhlYWRlci5oZWFkZXItcGFnZVwiKS5oZWlnaHQoKSArICQoXCIuc3RpY2t5LWJhclwiKS5oZWlnaHQoKSArIDU7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG4gICAgICAgICAgICBpZiAoJCgnLmJveC1kYXktc2Nyb2xsJyArIGhyZWYpLmxlbmd0aCA8IDEpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICQoXCJodG1sLGJvZHlcIikuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6ICQoJy5ib3gtZGF5LXNjcm9sbCcgKyBocmVmKS5vZmZzZXQoKS50b3AgLSBvZmZzZXRUb3BcclxuICAgICAgICAgICAgfSwgODAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmJveC1kYXktc2Nyb2xsXCIpLnJlbW92ZUNsYXNzKFwiY3VycmVudC1kYXlcIik7XHJcbiAgICAgICAgICAgICAgICAkKGhyZWYpLmFkZENsYXNzKFwiY3VycmVudC1kYXlcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdWlfcmVjaXBlc19tb2RhbCgpIHtcclxuICAgICAgICAkKFwiLmNvbnRlbnQtaGVhbHRoIGFbZGF0YS10b2dnbGU9J21vZGFsLWVkaXQnXSwgLmJveC1kYXktc2Nyb2xsIC5pbnRyb2R1Y3Rpb24gYVtocmVmKj0nL2VkdWNhdGlvbnMvJ11cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmRhdGEoXCJ1cmxcIiksXHJcbiAgICAgICAgICAgICAgICAkaWZyYW1lID0gJChcIjxpZnJhbWU+XCIpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyOiAwLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoKS52ZW5fbG9hZGluZ19zaG93KHsgZml4ZWQ6IHRydWUsIGNsYXNzOiAnbG9hZGluZy1yZWNpcGVzJyB9KTtcclxuICAgICAgICAgICAgJChcIiNyZWNpcGVzLW1vZGFsIC5pZnJhbWVfZGl2XCIpLmh0bWwoJGlmcmFtZSk7XHJcbiAgICAgICAgICAgICRpZnJhbWUub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoKS52ZW5fbG9hZGluZ19oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3JlY2lwZXMtbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5pZnJhbWVfZGl2IGlmcmFtZVwiKS5oZWlnaHQoJChcIi5pZnJhbWVfZGl2IGlmcmFtZVwiKVswXS5jb250ZW50RG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGZvciBlZHVjYXRpb24gcG9wdXBcclxuICAgICAgICAkKFwiLmJveC1kYXktc2Nyb2xsIC5pbnRyb2R1Y3Rpb24gYVtocmVmKj0nL2VkdWNhdGlvbnMvJ11cIikuZWFjaChmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpOyBpZiAoIWhyZWYpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnJlcGxhY2UoXCIvZWR1Y2F0aW9ucy9cIiwgXCIvd3AtanNvbi9hcGkvdjEvZ2V0LXNob3J0LWRlcy1wcm9ncmFtcy9cIik7XHJcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnN1YnN0cmluZygwLCBocmVmLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmRhdGEoXCJ1cmxcIiwgaHJlZik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1aV9zdGlja3lfYmFyKCkge1xyXG4gICAgICAgIHZhciAkc3RpY2t5ID0gJChcIi5zdGlja3ktYmFyXCIpLFxyXG4gICAgICAgICAgICAkdGFyZ2V0X2Zvb3RlciA9ICQoXCJmb290ZXIuZm9vdGVyLXBhZ2VcIik7XHJcbiAgICAgICAgaWYgKCRzdGlja3kubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cclxuICAgICAgICB2YXIgZml4X3N0aWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID49ICRzdGlja3kub2Zmc2V0KCkudG9wIC0gJChcImhlYWRlci5oZWFkZXItcGFnZVwiKS5oZWlnaHQoKSkge1xyXG4gICAgICAgICAgICAgICAgJHN0aWNreS5maW5kKFwiLnRvZ2dsZS1uYXZcIikuYWRkQ2xhc3MoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGlja3kuZmluZChcIi53cmFwLXN0aWNreVwiKS5hZGRDbGFzcyhcImZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0aWNreS5oZWlnaHQoJHN0aWNreS5maW5kKFwiLndyYXAtc3RpY2t5XCIpLm91dGVySGVpZ2h0KHRydWUpKTtcclxuICAgICAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gJHRhcmdldF9mb290ZXIub2Zmc2V0KCkudG9wIC0gMTIwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0aWNreS5hZGRDbGFzcyhcInNsaWRlVXBcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGlja3kucmVtb3ZlQ2xhc3MoXCJzbGlkZVVwXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHN0aWNreS5maW5kKFwiLnRvZ2dsZS1uYXZcIikucmVtb3ZlQ2xhc3MoXCJmaXhlZFwiKTtcclxuICAgICAgICAgICAgICAgICRzdGlja3kuZmluZChcIi53cmFwLXN0aWNreVwiKS5yZW1vdmVDbGFzcyhcImZpeGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgJHN0aWNreS5oZWlnaHQoXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgICQod2luZG93KS5vbihcInNjcm9sbFwiLCBmaXhfc3RpY2spO1xyXG4gICAgICAgIGZpeF9zdGljaygpO1xyXG5cclxuICAgICAgICAvLyBDbGljayBzY3JvbGwgYW5jaG9yXHJcbiAgICAgICAgJCgnLnN0aWNreS1iYXIgbmF2IGxpIGEnKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICRocmVmID0gJCgkKHRoaXMpLmF0dHIoXCJocmVmXCIpKTtcclxuICAgICAgICAgICAgdmFyIG9mZnNldFRvcCA9ICQoXCJoZWFkZXIuaGVhZGVyLXBhZ2VcIikuaGVpZ2h0KCkgKyAkKFwiLnN0aWNreS1iYXJcIikuaGVpZ2h0KCkgKyA1O1xyXG5cclxuICAgICAgICAgICAgaWYgKCRocmVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJGhyZWYub2Zmc2V0KCkudG9wIC0gb2Zmc2V0VG9wIH0sIDgwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGZ1bmNDaGVja1JhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJChcImhlYWRlci5oZWFkZXItcGFnZVwiKS5sZW5ndGggPCAxIHx8ICQoXCIuc3RpY2t5LWJhclwiKS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICB2YXIgJGxhc3QgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgb2Zmc2V0VG9wID0gJChcImhlYWRlci5oZWFkZXItcGFnZVwiKS5oZWlnaHQoKSArICQoXCIuc3RpY2t5LWJhclwiKS5oZWlnaHQoKSArIDU7XHJcbiAgICAgICAgICAgICQoJy5zdGlja3ktYmFyIG5hdiBsaSBhJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJGhyZWYgPSAkKCQodGhpcykuYXR0cihcImhyZWZcIikpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRocmVmLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgb2Zmc2V0VG9wICsgNSA+PSAkaHJlZi5vZmZzZXQoKS50b3AgJiYgJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgb2Zmc2V0VG9wICsgNSA8ICRocmVmLm9mZnNldCgpLnRvcCArICRocmVmLm91dGVySGVpZ2h0KHRydWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsYXN0ID0gJGhyZWY7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJChcIi5zdGlja3ktYmFyIG5hdiBsaVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmICgkbGFzdCkge1xyXG4gICAgICAgICAgICAgICAgJChcIi5zdGlja3ktYmFyIG5hdiBsaSBhW2hyZWY9J1wiICsgJGxhc3Quc2VsZWN0b3IgKyBcIiddXCIpLnBhcmVudCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgOTkyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5saXN0LWRheXMgbGlcIikuZmlyc3QoKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwic2Nyb2xsLmZ1bmNDaGVja1JhbmdlXCIsIGZ1bmNDaGVja1JhbmdlKTtcclxuICAgICAgICBmdW5jQ2hlY2tSYW5nZSgpO1xyXG4gICAgICAgICQoXCIubGlzdC1kYXlzIGxpXCIpLmFkZENsYXNzKFwiaXMtaGlkZVwiKTtcclxuXHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1aV9oZWFsdGhfaHViX21vZGFsKCkge1xyXG4gICAgICAgICQoXCIuaGVhbHRoLWh1YiBhW2RhdGEtdG9nZ2xlPSdtb2RhbC1lZGl0J11cIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciB1cmwgPSAkKHRoaXMpLmRhdGEoXCJ1cmxcIiksXHJcbiAgICAgICAgICAgICAgICAkaWZyYW1lID0gJChcIjxpZnJhbWU+XCIpLmF0dHIoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYzogdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lYm9yZGVyOiAwLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICQoKS52ZW5fbG9hZGluZ19zaG93KHsgZml4ZWQ6IHRydWUsIGNsYXNzOiAnbG9hZGluZy1yZWNpcGVzJyB9KTtcclxuICAgICAgICAgICAgJChcIiNoZWFsdGgtaHViLW1vZGFsIC5pZnJhbWVfZGl2XCIpLmh0bWwoJGlmcmFtZSk7XHJcbiAgICAgICAgICAgICRpZnJhbWUub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQoKS52ZW5fbG9hZGluZ19oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAkKFwiI2hlYWx0aC1odWItbW9kYWxcIikubW9kYWwoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIi5pZnJhbWVfZGl2IGlmcmFtZVwiKS5oZWlnaHQoJChcIi5pZnJhbWVfZGl2IGlmcmFtZVwiKVswXS5jb250ZW50RG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICB2YXIgZnVuY0NsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkbGlzdF9kYXlzID0gJChcIi5zdGlja3ktYmFyIC5saXN0LWRheXNcIiksXHJcbiAgICAgICAgICAgICRoZWlnaHRfdHJhbnMgPSAkKFwiLnN0aWNreS1iYXIgLmNvbnRlbnQtY2VudGVyXCIpO1xyXG4gICAgICAgICQoXCIuc3RpY2t5LWJhciAudG9nZ2xlLW5hdlwiKS50b2dnbGVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcclxuICAgICAgICAkaGVpZ2h0X3RyYW5zLmhlaWdodCgkbGlzdF9kYXlzLm91dGVySGVpZ2h0KHRydWUpKTsgJGxpc3RfZGF5cy50b2dnbGVDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoXCJpcy1hY3RpdmVcIikpIHtcclxuICAgICAgICAgICAgJGhlaWdodF90cmFucy5oZWlnaHQoJGxpc3RfZGF5cy5vdXRlckhlaWdodCh0cnVlKSk7XHJcbiAgICAgICAgICAgICRsaXN0X2RheXMuZmluZCgnbGk6bm90KC5hY3RpdmUpJykuYWRkQ2xhc3MoXCJpcy1oaWRlXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRsaXN0X2RheXMuZmluZCgnbGk6bm90KC5hY3RpdmUpJykucmVtb3ZlQ2xhc3MoXCJpcy1oaWRlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkaGVpZ2h0X3RyYW5zLmhlaWdodCgkbGlzdF9kYXlzLm91dGVySGVpZ2h0KHRydWUpKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGhlaWdodF90cmFucy5oZWlnaHQoXCJcIik7XHJcbiAgICAgICAgfSwgNTAwKTtcclxuICAgIH07XHJcbiAgICBmdW5jdGlvbiB1aV9tb2JpbGVfdG9nZ2xlKCkge1xyXG4gICAgICAgIHZhciAkdG9nZ2xlID0gJChcIi5zdGlja3ktYmFyIC50b2dnbGUtbmF2XCIpO1xyXG4gICAgICAgIGlmICgkdG9nZ2xlLmxlbmd0aCA8IDEpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgJHRvZ2dsZS5vbihcImNsaWNrXCIsIGZ1bmNDbGljayk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1aV9fY2xpY2tfbmF2KCkge1xyXG4gICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA8IDk5Mikge1xyXG4gICAgICAgICAgICAkKFwiLnN0aWNreS1iYXIgLmxpc3QtZGF5cyBhXCIpLm9uKFwiY2xpY2tcIiwgZnVuY0NsaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQod2luZG93KS53aWR0aCgpIDwgOTkyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJChcIi5saXN0LWRheXNcIikuaGFzQ2xhc3MoXCJleHBhbmRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmxpc3QtZGF5c1wiKS5yZW1vdmVDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmxpc3QtZGF5cyBsaVwiKS5maXJzdCgpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmxpc3QtZGF5cyBsaVwiKS5maXJzdCgpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdWlfZGV0ZWN0X3ZpZGVvKCk7XHJcbiAgICAgICAgdWlfZ2V0X3N0YXJ0KCk7XHJcbiAgICAgICAgdWlfcmVjaXBlc19tb2RhbCgpO1xyXG4gICAgICAgIHVpX3N0aWNreV9iYXIoKTtcclxuICAgICAgICB1aV9oZWFsdGhfaHViX21vZGFsKCk7XHJcbiAgICAgICAgdWlfbW9iaWxlX3RvZ2dsZSgpO1xyXG4gICAgICAgIHVpX19jbGlja19uYXYoKTtcclxuXHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTsgIiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBmdW5jdGlvbiBoYW5kbGVTY3JvbGxEb3duRWZmZWN0KCkge1xyXG4gICAgICAgIGlmICghJCgnLnNjcm9sbC1lZmZlY3QuYWN0aXZlJykuaXMoJzpsYXN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgJCgnLnNjcm9sbC1lZmZlY3QuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLm5leHQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlU2Nyb2xsVXBFZmZlY3QoKSB7XHJcbiAgICAgICAgaWYgKCEkKCcuc2Nyb2xsLWVmZmVjdC5hY3RpdmUnKS5pcygnOmZpcnN0LWNoaWxkJykpIHtcclxuICAgICAgICAgICAgJCgnLnNjcm9sbC1lZmZlY3QuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpLnByZXYoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRBbmltRHVyYXRpb24oKSB7XHJcbiAgICAgICAgJCgnLmZhZGVUb0xlZnQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gJCh0aGlzKS5kYXRhKCdkdXJhdGlvbicpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLmNzcygndHJhbnNpdGlvbicsICdhbGwgJyArIGR1cmF0aW9uICsgJyAuN3MgZWFzZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGhvbWVTY3JvbGxFZmZlY3QoKSB7XHJcbiAgICAgICAgaWYgKCQoJy5ob21lLWVmZmVjdCcpLmxlbmd0aCA8IDEgfHwgJCh3aW5kb3cpLndpZHRoKCkgPCA5OTIpIHJldHVybjtcclxuICAgICAgICAkKHdpbmRvdykub24oJ21vdXNld2hlZWwnLCBfLnRocm90dGxlKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLm9yaWdpbmFsRXZlbnQuZGV0YWlsID4gMCB8fCBlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA8IDApIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVNjcm9sbERvd25FZmZlY3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZVNjcm9sbFVwRWZmZWN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCAxMjAwLCB7IHRyYWlsaW5nOiBmYWxzZSB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gaG9tZVNjcm9sbEVmZmVjdCgpO1xyXG4gICAgICAgIC8vIGluaXRBbmltRHVyYXRpb24oKTtcclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyIsIihmdW5jdGlvbiAoJCkge1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBpbml0QW5pbUR1cmF0aW9uKCkge1xyXG4gICAgICAgICQoJy5mYWRlVG9MZWZ0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9ICQodGhpcykuZGF0YSgnZHVyYXRpb24nKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ3RyYW5zaXRpb24nLCAnYWxsICcgKyBkdXJhdGlvbiArICcgLjdzIGVhc2UnKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaG9tZVNjcm9sbEVmZmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJCgnLmhvbWUtZWZmZWN0JykubGVuZ3RoIDwgMSB8fCAkKHdpbmRvdykud2lkdGgoKSA8IDk5MikgcmV0dXJuO1xyXG4gICAgICAgICQoJy5zY3JvbGwtZWZmZWN0JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICgkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgLyAyID49ICQodGhpcykub2Zmc2V0KCkudG9wIC0gJCgnLmhlYWRlci1wYWdlJykuaGVpZ2h0KCkpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gaW5pdEFuaW1EdXJhdGlvbigpO1xyXG4gICAgICAgIC8vIGhvbWVTY3JvbGxFZmZlY3QoKTtcclxuICAgICAgICAvLyAkKHdpbmRvdykub24oJ3Njcm9sbCcsIGhvbWVTY3JvbGxFZmZlY3QpO1xyXG4gICAgfSk7XHJcbn0pKGpRdWVyeSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgLy8gWU9VUiBDT0RFIEhFUkUgOilcclxuICAgIGZ1bmN0aW9uIHVpX2Jhbm5lcl9ob21lKCkge1xyXG4gICAgICAgIGlmICgkKFwiLndyYXAtb3dsLWNhcm91c2VsXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJChcIi53cmFwLW93bC1jYXJvdXNlbFwiKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICBpdGVtczogMSxcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogMjAsXHJcbiAgICAgICAgICAgICAgICBuYXY6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5VGltZW91dDogNjAwMCxcclxuICAgICAgICAgICAgICAgIG1vdXNlRHJhZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlSW46IFwiZmFkZUluXCIsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiLndyYXAtb3dsLWNhcm91c2VsXCIpLm9uKFwiY2hhbmdlZC5vd2wuY2Fyb3VzZWxcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IGV2ZW50Lml0ZW0uaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3JjID0gJChldmVudC50YXJnZXQpLmZpbmQoXCIub3dsLWl0ZW1cIikuZXEoY3VycmVudCkuZmluZChcIi5pbWctZHJvcFwiKS5kYXRhKCdpbWcnKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYmFubmVyLWNoYW5nZS1pbWdcIikuYXBwZW5kKFwiPGltZyBjbGFzcz0nbmV3LWltZycgc3JjPSdcIiArIHNyYyArIFwiJyAvPlwiKTtcclxuICAgICAgICAgICAgICAgICQoXCIjYmFubmVyLWNoYW5nZS1pbWcgaW1nLm5ldy1pbWdcIikuY3NzKHsgb3BhY2l0eTogMCB9KTtcclxuICAgICAgICAgICAgICAgICQoXCIjYmFubmVyLWNoYW5nZS1pbWcgaW1nLm5ldy1pbWdcIikuYXR0cihcInNyY1wiLCBzcmMpLnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCAzMDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiI2Jhbm5lci1jaGFuZ2UtaW1nIGltZ1wiKS5ub3QoJy5uZXctaW1nJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcIiNiYW5uZXItY2hhbmdlLWltZyBpbWcubmV3LWltZ1wiKS5yZW1vdmVDbGFzcyhcIm5ldy1pbWdcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdWlfZWZmZWN0X2NoYW5nZSgpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSAkKFwiZm9vdGVyLmZvb3Rlci1wYWdlIC5pbWctYW5pbWF0aW9uXCIpO1xyXG4gICAgICAgIGlmIChzZWxlY3Rvci5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHZhciBlcSA9IDA7XHJcbiAgICAgICAgdmFyIGNvdW50ID0gc2VsZWN0b3IuZmluZChcIi5pdGVtXCIpLmxlbmd0aDtcclxuXHJcbiAgICAgICAgc2VsZWN0b3IuZmluZChcIi5pdGVtXCIpLmhpZGUoKTtcclxuICAgICAgICBzZWxlY3Rvci5maW5kKFwiLml0ZW1cIikuZXEoMCkuc2hvdygpO1xyXG5cclxuICAgICAgICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yLmZpbmQoXCIuaXRlbVwiKS5lcShlcSkuZmFkZU91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGVxID0gKGVxICsgMSkgJSBjb3VudDtcclxuICAgICAgICAgICAgICAgIHNlbGVjdG9yLmZpbmQoXCIuaXRlbVwiKS5lcShlcSkuYWRkQ2xhc3MoJ2FjdGl2ZScpLmZhZGVJbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCAzNTAwKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHVpX21lbnVfc3AoKSB7XHJcbiAgICAgICAgaWYgKCQoXCIjYnRuLW1lbnUtc3BcIikubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cclxuICAgICAgICAkKFwiI2J0bi1tZW51LXNwXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnN0b3AoKS50b2dnbGVDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICAgICAgJChcIi53cmFwLWNvbnRlbnQtbW9iaWxlXCIpLnN0b3AoKS50b2dnbGVDbGFzcyhcImV4cGFuZFwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBtYXRjaF9oZWlnaHRfZmVhdHVyZV9wcm9kdWN0KCkge1xyXG4gICAgICAgIGlmICgkKCcuZmVhdHVyZS1ob21lIC53cmFwLXRleHQtNC1pdGVtIC5kZXNjJykubGVuZ3RoIDwgMSAmJiAkKCcuZmVhdHVyZS1ob21lIC5wcm9kdWN0LWZlYXR1cmUtdGl0bGUnKS5sZW5ndGggPCAxIHx8ICQod2luZG93KS53aWR0aCgpIDwgNTc2KSB7IHJldHVybjsgfVxyXG4gICAgICAgICQoJy5mZWF0dXJlLWhvbWUgLnByb2R1Y3QtZmVhdHVyZS10aXRsZScpLm1hdGNoSGVpZ2h0KHsgYnlSb3c6IGZhbHNlIH0pO1xyXG4gICAgICAgICQoJy5mZWF0dXJlLWhvbWUgLndyYXAtdGV4dC00LWl0ZW0gLmRlc2MnKS5tYXRjaEhlaWdodCh7IGJ5Um93OiBmYWxzZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1aV9zY3JvbGxfaG9tZSgpIHtcclxuICAgICAgICB2YXIgc2Nyb2xsaWZ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5OTEpIHtcclxuICAgICAgICAgICAgICAgICQuc2Nyb2xsaWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uOiBcIi5zY3JvbGxwYWdlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3dTY3JvbGw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSGFzaDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0SGVpZ2h0czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQuc2Nyb2xsaWZ5LmRpc2FibGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwicmVzaXplXCIsIHNjcm9sbGlmeSk7XHJcbiAgICAgICAgc2Nyb2xsaWZ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaW5pdF9vd2xfZmVhdHVyZWRfaG9tZSgpIHtcclxuICAgICAgICBpZiAoJCgnLm93bC1mZWF0dXJlZC1wcm9kdWN0LWhvbWUnKS5sZW5ndGggPCAxKSByZXR1cm47XHJcbiAgICAgICAgdmFyICRvd2wgPSAkKCcub3dsLWZlYXR1cmVkLXByb2R1Y3QtaG9tZScpO1xyXG4gICAgICAgIHZhciAkaXRlbSA9ICQoJy5wcm9kdWN0LXdyYXBibG9jaycpO1xyXG4gICAgICAgIHZhciBjaGVja21vdWVkcmFnID0gdHJ1ZTtcclxuICAgICAgICBpZiAoJGl0ZW0ubGVuZ3RoIDwgNCkge1xyXG4gICAgICAgICAgICBjaGVja21vdWVkcmFnID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRvd2wub24oJ2luaXRpYWxpemVkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWF0Y2hfaGVpZ2h0X2ZlYXR1cmVfcHJvZHVjdCgpO1xyXG4gICAgICAgIH0pLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgaXRlbXM6IDMsXHJcbiAgICAgICAgICAgIG1hcmdpbjogMzAsXHJcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXHJcbiAgICAgICAgICAgIG1vdXNlRHJhZzogY2hlY2ttb3VlZHJhZyxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZToge1xyXG4gICAgICAgICAgICAgICAgMDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiAxXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgNTc2OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IDJcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICA5OTI6IHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczogM1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLm9uKCdjaGFuZ2VkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWF0Y2hfaGVpZ2h0X2ZlYXR1cmVfcHJvZHVjdCgpO1xyXG4gICAgICAgIH0pLm9uKCdyZXNpemVkLm93bC5jYXJvdXNlbCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWF0Y2hfaGVpZ2h0X2ZlYXR1cmVfcHJvZHVjdCgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdWlfZWZmZWN0X2NoYW5nZSgpO1xyXG4gICAgICAgIHVpX2Jhbm5lcl9ob21lKCk7XHJcbiAgICAgICAgdWlfbWVudV9zcCgpO1xyXG4gICAgICAgIC8vIHVpX3Njcm9sbF9ob21lKCk7XHJcbiAgICAgICAgaW5pdF9vd2xfZmVhdHVyZWRfaG9tZSgpO1xyXG4gICAgfSk7XHJcbn0pKGpRdWVyeSk7IiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgLy8gWU9VUiBDT0RFIEhFUkUgOilcclxuICAgIGZ1bmN0aW9uIG93bFByb2R1Y3RTaW5nbGUoKSB7XHJcbiAgICAgICAgaWYgKCQoXCIub3dsLXByb2R1Y3Qtc2luZ2xlXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJChcIi5vd2wtcHJvZHVjdC1zaW5nbGVcIikub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICAgICAgaXRlbXM6IDEsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDIwLFxyXG4gICAgICAgICAgICAgICAgbmF2OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1vdXNlRHJhZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0b3VjaERyYWc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGF6eUxvYWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRlT3V0OiBcImZhZGVPdXRcIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc2xpZGVjb3VudCA9IDE7XHJcbiAgICAgICAgJCgnLm93bC1wcm9kdWN0LXNpbmdsZSAub3dsLWl0ZW0nKS5ub3QoJy5jbG9uZWQnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc2xpZGVudW1iZXInICsgc2xpZGVjb3VudCk7XHJcbiAgICAgICAgICAgIHNsaWRlY291bnQgPSBzbGlkZWNvdW50ICsgMTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIGRvdGNvdW50ID0gMTtcclxuICAgICAgICAkKCcub3dsLXByb2R1Y3Qtc2luZ2xlIC5vd2wtZG90JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2RvdG51bWJlcicgKyBkb3Rjb3VudCk7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZXNyYyA9ICQoJy5zbGlkZW51bWJlcicgKyBkb3Rjb3VudCArICcgaW1nJykuYXR0cignZGF0YS1zcmMnKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwidXJsKFwiICsgc2xpZGVzcmMgKyBcIilcIik7XHJcbiAgICAgICAgICAgIGRvdGNvdW50Kys7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICgkKCcuc2Nyb2xsYmFyLW1hY29zeCcpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgJCgnLnNjcm9sbGJhci1tYWNvc3gnKS5zY3JvbGxiYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICgkKCcub3dsLXByb2R1Y3Qtc2luZ2xlIC5vd2wtZG90cycpLmhhc0NsYXNzKCdkaXNhYmxlZCcpKSB7XHJcbiAgICAgICAgICAgICQoJy5vd2wtcHJvZHVjdC1zaW5nbGUnKS5jc3MoJ21hcmdpbi1ib3R0b20nLCA1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBhZGRUb0NhcnRTaW5nbGUoKSB7XHJcbiAgICAgICAgJCgnLnZhcmlhdGlvbnNfZm9ybSAudmFsdWUgc2VsZWN0Jykub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY3VyclByaWNlID0gJCgnLnZhcmlhdGlvbnNfZm9ybSAud29vY29tbWVyY2UtUHJpY2UtYW1vdW50JykudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByaWNlRm9ybWF0ID0gY3VyclByaWNlLnNwbGl0KCcuJylbMF07XHJcbiAgICAgICAgICAgICAgICAkKCcucHJvZHVjdC1pbWctd3JhcCAuYWRkLXRvLWNhcnQgc3BhbicpLnRleHQocHJpY2VGb3JtYXQpO1xyXG4gICAgICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBmdW5jQW5pID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XHJcbiAgICAgICAgaWYgKCFoYXNoIHx8ICQoJy5saXN0LXByb2R1Y3QnKS5sZW5ndGggPCAxKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHZhciBoYXNoU3RyID0gaGFzaC5zbGljZSgxKSxcclxuICAgICAgICAgICAgJHJvb3QgPSAkKFwiaHRtbCxib2R5XCIpO1xyXG4gICAgICAgICRyb290LnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgc2Nyb2xsVG9wOiAkKCdbZGF0YS10YXJnZXQ9JyArIGhhc2hTdHIgKyAnXScpLm9mZnNldCgpLnRvcCAtICQoXCJoZWFkZXIuaGVhZGVyLXBhZ2VcIikub3V0ZXJIZWlnaHQoKSAtICgkKFwiYm9keVwiKS5oYXNDbGFzcyhcImN1c3RvbWl6ZS1zdXBwb3J0XCIpID8gMzIgOiAwKVxyXG4gICAgICAgIH0sIDgwMCk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiB0b0JlbG93U2VjdGlvbigpIHtcclxuICAgICAgICAkKCcudG8tYmVsb3ctc2VjdGlvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHRoaXNTZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KCdzZWN0aW9uJyk7XHJcbiAgICAgICAgICAgICQoJ2h0bWwsYm9keScpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogdGhpc1NlY3Rpb24ubmV4dCgpLm9mZnNldCgpLnRvcCAtIDYwXHJcbiAgICAgICAgICAgIH0sIDgwMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGZvcm1fdG9nZ2xlX3NoaXBwaW5nX2FkZHJlc3MoKSB7XHJcbiAgICAgICAgaWYgKCQoXCIjc2hvdy1zaGlwcGluZy1maWVsZHNldFwiKS5pcyhcIjpjaGVja2VkXCIpKSB7ICQoXCIuZmllbGRzZXQuc2hpcHBpbmdcIikuc2hvdygpOyB9XHJcbiAgICAgICAgZWxzZSB7ICQoXCIuZmllbGRzZXQuc2hpcHBpbmdcIikuaGlkZSgpOyB9XHJcbiAgICAgICAgJChcIiNzaG93LXNoaXBwaW5nLWZpZWxkc2V0XCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoXCI6Y2hlY2tlZFwiKSkgeyAkKFwiLmZpZWxkc2V0LnNoaXBwaW5nXCIpLnNsaWRlRG93bigpOyB9XHJcbiAgICAgICAgICAgIGVsc2UgeyAkKFwiLmZpZWxkc2V0LnNoaXBwaW5nXCIpLnNsaWRlVXAoKTsgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGF1dG9IZWlnaF9wcm9kdWN0X2Rlc2NyaXB0aW9uKCkge1xyXG4gICAgICAgICQoJy53cmFwLXByb2R1Y3QtaW5mb3JtYXRpb24gLnByb2R1Y3QtZGVzY3JpcHRpb24nKS5tYXRjaEhlaWdodCgpO1xyXG4gICAgfVxyXG5cclxuICAgICQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG93bFByb2R1Y3RTaW5nbGUoKTtcclxuICAgICAgICB0b0JlbG93U2VjdGlvbigpO1xyXG4gICAgICAgIGFkZFRvQ2FydFNpbmdsZSgpO1xyXG4gICAgICAgIGZvcm1fdG9nZ2xlX3NoaXBwaW5nX2FkZHJlc3MoKTtcclxuICAgICAgICBmdW5jQW5pKCk7XHJcbiAgICAgICAgYXV0b0hlaWdoX3Byb2R1Y3RfZGVzY3JpcHRpb24oKTtcclxuICAgIH0pO1xyXG5cclxufSkoalF1ZXJ5KTsiLCJcclxuKGZ1bmN0aW9uICgkKSB7XHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuZ2FsbGVyeS10aHVtYi1saXN0JykubGlnaHRHYWxsZXJ5KHtcclxuICAgICAgICAgICAgdGh1bWJuYWlsOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTsiLCJcclxuXHJcbihmdW5jdGlvbiAoJCkge1xyXG4gICAgdmFyIHBhZ2UgPSAxO1xyXG4gICAgZnVuY3Rpb24gbG9hZG1vcmUoKSB7XHJcblxyXG4gICAgICAgIHZhciBmdW5jU2Nyb2xsQXV0b1RyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoXCIuc2Nyb2xsLWF1dG8tdHJpZ2dlclwiKS5lYWNoKGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpICsgJCh3aW5kb3cpLmhlaWdodCgpICsgNTAgPiAkKHRoaXMpLm9mZnNldCgpLnRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcyhcImlzUGFnZUxvYWRpbmdcIikpIHsgJCh0aGlzKS50cmlnZ2VyKFwiY2xpY2tcIik7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGxcIiwgZnVuY1Njcm9sbEF1dG9UcmlnZ2VyKTtcclxuXHJcbiAgICAgICAgJChcIi5sb2FkaW5nLW1vcmUtZGF0YVwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgaWYgKCR0aGlzLmhhc0NsYXNzKFwiaXNQYWdlTG9hZGluZ1wiKSB8fCAkdGhpcy5oYXNDbGFzcyhcImlzRG9uZVwiKSkgeyByZXR1cm47IH1cclxuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKCQodGhpcykuZGF0YShcInRhcmdldFwiKSk7XHJcbiAgICAgICAgICAgIHZhciB1cmxqc29uID0gJCh0aGlzKS5kYXRhKFwidXJsanNvblwiKTtcclxuICAgICAgICAgICAgdmFyIHRvdGFscGFnZSA9ICQodGhpcykuZGF0YShcInRvdGFscGFnZVwiKTtcclxuICAgICAgICAgICAgdmFyIGV4Y2VwdCA9ICQodGhpcykuZGF0YShcImV4Y2VwdFwiKTtcclxuICAgICAgICAgICAgcGFnZSsrO1xyXG4gICAgICAgICAgICBpZiAocGFnZSA+IHRvdGFscGFnZSkgeyByZXR1cm47IH1cclxuICAgICAgICAgICAgaWYgKHBhZ2UgPj0gdG90YWxwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcyhcImlzRG9uZVwiKS5mYWRlT3V0KCk7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy5wYXJlbnRzKFwiLmhpZGUtd2l0aC1tZVwiKS5mYWRlT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoXCJpc1BhZ2VMb2FkaW5nXCIpO1xyXG4gICAgICAgICAgICAkdGhpcy50ZXh0KFwiTE9BRElORy4uLlwiKTtcclxuICAgICAgICAgICAgJC5nZXQodXJsanNvbiArIFwiP3BhZ2U9XCIgKyBwYWdlICsgXCImZXhjZXB0PVwiICsgZXhjZXB0KS5kb25lKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJG5ld0l0ZW1zID0gJChkYXRhKTtcclxuICAgICAgICAgICAgICAgICRuZXdJdGVtcy5jc3MoeyBvcGFjaXR5OiAwIH0pO1xyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5hcHBlbmQoJG5ld0l0ZW1zKTtcclxuICAgICAgICAgICAgICAgICRuZXdJdGVtcy5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCA1MDApO1xyXG4gICAgICAgICAgICAgICAgJChcIi5saXN0LXJlY2lwZS1hcmNoaXZlIC5pdGVtLXBvc3QgLndyYXAtaW5mb1wiKS5tYXRjaEhlaWdodCh7IGJ5Um93OiBmYWxzZSB9KTtcclxuICAgICAgICAgICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHRoaXMucmVtb3ZlQ2xhc3MoXCJpc1BhZ2VMb2FkaW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgJHRoaXMudGV4dCgkdGhpcy5kYXRhKFwidGV4dFwiKSk7XHJcbiAgICAgICAgICAgICAgICBmdW5jU2Nyb2xsQXV0b1RyaWdnZXIoKTtcclxuICAgICAgICAgICAgICAgIC8vIH0sIDIwMDApO1xyXG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKFwiaXNQYWdlTG9hZGluZ1wiKTtcclxuICAgICAgICAgICAgICAgICR0aGlzLnRleHQoXCJGQUlMIFRPIEdFVCBEQVRBISEhXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gZWR1Y2F0aW9uX2ZpbHRlcigpIHtcclxuICAgICAgICBpZiAoJCgnLmxlYXJuLXRleHQtZWRpdG9yJykubGVuZ3RoIDwgMSkgeyByZXR1cm47IH1cclxuICAgICAgICAvLyBBZGQga2V5IHRvIHNlbGVjdGlvblxyXG4gICAgICAgIHZhciAkc2VsZWN0ID0gJCgnLmxlYXJuLXRleHQtZWRpdG9yIHNlbGVjdC5pbmdyZWRpZW50cy1zZWxlY3QnKTtcclxuICAgICAgICB2YXIgYXJyYXlLZXkgPSBbXTsgJHNlbGVjdC5odG1sKFwiPG9wdGlvbiB2YWx1ZT0nJz5BbGw8L29wdGlvbj5cIik7XHJcbiAgICAgICAgJChcIi5pbmdyZWRpZW50LWl0ZW1cIikuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBmaXJ0Q2hhcnQgPSAkKHRoaXMpLmZpbmQoJy50aXRsZS1mZWF0dXJlZCcpLnRleHQoKS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKFwia2V5XCIsIGZpcnRDaGFydCk7XHJcbiAgICAgICAgICAgIGlmIChhcnJheUtleS5pbmRleE9mKGZpcnRDaGFydCkgPCAwKSB7IGFycmF5S2V5LnB1c2goZmlydENoYXJ0KTsgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGFycmF5S2V5LnNvcnQoKTtcclxuICAgICAgICBhcnJheUtleS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG4gICAgICAgICAgICAkc2VsZWN0LmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgZWwgKyBcIic+XCIgKyBlbCArIFwiPC9vcHRpb24+XCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIE9uL09mIGV2ZW50IFNlbGVjdFxyXG4gICAgICAgICRzZWxlY3Qub2ZmKFwiY2hhbmdlXCIpLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT09IFwiXCIpIHsgJChcIi5pbmdyZWRpZW50LWl0ZW1cIikuZmFkZUluKCk7IHJldHVybjsgfVxyXG4gICAgICAgICAgICAkKFwiLmluZ3JlZGllbnQtaXRlbVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmRhdGEoXCJrZXlcIikgPT0gdmFsKSB7ICQodGhpcykuZmFkZUluKCk7IH1cclxuICAgICAgICAgICAgICAgIGVsc2UgeyAkKHRoaXMpLmhpZGUoKTsgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgJChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIGxvYWRtb3JlKCk7XHJcbiAgICAgICAgZWR1Y2F0aW9uX2ZpbHRlcigpO1xyXG4gICAgICAgICQoXCIucm93LXJlY2lwZXMgLml0ZW0tcG9zdCAud3JhcC1pbmZvXCIpLm1hdGNoSGVpZ2h0KHsgYnlSb3c6IGZhbHNlIH0pO1xyXG4gICAgICAgICQoXCIubGlzdC1yZWNpcGUtYXJjaGl2ZSAuaXRlbS1wb3N0IC53cmFwLWluZm9cIikubWF0Y2hIZWlnaHQoeyBieVJvdzogZmFsc2UgfSk7XHJcbiAgICAgICAgJChcIi5pdGVtLWhlYWx0aCAud3JhcHBlci10ZXh0XCIpLm1hdGNoSGVpZ2h0KHsgYnlSb3c6IGZhbHNlIH0pO1xyXG5cclxuICAgIH0pO1xyXG59KShqUXVlcnkpOyIsIi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1TTElERVIgQkFOTkVSLS0tLS0tLS0tLS0tLS0tLVxyXG5sZXQgZGF0YUhvbWVCYW5uZXJzID0gW3tcclxuICAgICAgICBpbWFnZTogXCIuLi8uLi9zcmMvaW1nL2Vjb2xlYXJuLWJhbm5lci0xLnBuZ1wiLFxyXG4gICAgICAgIHRpdGxlOiBcIkdp4bqjbSA8c3BhbiBzdHlsZT0nY29sb3I6IzAwODk4NDsgZm9udC1zaXplOiA5NnB4O2ZvbnQtd2VpZ2h0OjcwMCc+MTAlPC9zcGFuPiBraGkgbXVhIGjDs2EgxJHGoW4gPHNwYW4gc3R5bGU9J2NvbG9yOiMwMDg5ODQ7IGZvbnQtc2l6ZTogOTZweDtmb250LXdlaWdodDo3MDAnPjIwMGs8L3NwYW4+XCJcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaW1hZ2U6IFwiLi4vLi4vc3JjL2ltZy9lY29sZWFybi1iYW5uZXItMi5wbmdcIixcclxuICAgICAgICB0aXRsZTogXCJHaeG6o20gPHNwYW4gc3R5bGU9J2NvbG9yOiMwMDg5ODQ7IGZvbnQtc2l6ZTogOTZweDtmb250LXdlaWdodDo3MDAnPjEyJTwvc3Bhbj4ga2hpIG11YSBow7NhIMSRxqFuIDxzcGFuIHN0eWxlPSdjb2xvcjojMDA4OTg0OyBmb250LXNpemU6IDk2cHg7Zm9udC13ZWlnaHQ6NzAwJz40MDBrPC9zcGFuPlwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGltYWdlOiBcIi4uLy4uL3NyYy9pbWcvZWNvbGVhcm4tYmFubmVyLTMucG5nXCIsXHJcbiAgICAgICAgdGl0bGU6IFwiR2nhuqNtIDxzcGFuIHN0eWxlPSdjb2xvcjojMDA4OTg0OyBmb250LXNpemU6IDk2cHg7Zm9udC13ZWlnaHQ6NzAwJz4xNSU8L3NwYW4+IGtoaSBtdWEgaMOzYSDEkcahbiA8c3BhbiBzdHlsZT0nY29sb3I6IzAwODk4NDsgZm9udC1zaXplOiA5NnB4O2ZvbnQtd2VpZ2h0OjcwMCc+OTAwazwvc3Bhbj5cIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpbWFnZTogXCIuLi8uLi9zcmMvaW1nL2Vjb2xlYXJuLWJhbm5lci00LnBuZ1wiLFxyXG4gICAgICAgIHRpdGxlOiBcIkdp4bqjbSA8c3BhbiBzdHlsZT0nY29sb3I6IzAwODk4NDsgZm9udC1zaXplOiA5NnB4O2ZvbnQtd2VpZ2h0OjcwMCc+MjAlPC9zcGFuPiBraGkgbXVhIGjDs2EgxJHGoW4gPHNwYW4gc3R5bGU9J2NvbG9yOiMwMDg5ODQ7IGZvbnQtc2l6ZTogOTZweDtmb250LXdlaWdodDo3MDAnPjQ1MDBrPC9zcGFuPlwiXHJcbiAgICB9XHJcbl1cclxuXHJcbmxldCBpbmRleCA9IC0xO1xyXG5cclxuZnVuY3Rpb24gbmV4dCgpIHtcclxuICAgIGluZGV4Kys7XHJcbiAgICBpZiAoZGF0YUhvbWVCYW5uZXJzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAoaW5kZXggPj0gZGF0YUhvbWVCYW5uZXJzLmxlbmd0aCkgaW5kZXggPSAwO1xyXG5cclxuICAgICAgICB2YXIgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZy1iYW5uZXItaW5kZXgnKTtcclxuICAgICAgICBpZiAoaW1nKSB7XHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBkYXRhSG9tZUJhbm5lcnNbaW5kZXhdLmltYWdlO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc2NcIikuaW5uZXJIVE1MID0gZGF0YUhvbWVCYW5uZXJzW2luZGV4XS50aXRsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBwcmV2aW91cygpIHtcclxuICAgIGluZGV4LS07XHJcbiAgICBpZiAoaW5kZXggPD0gMCkgaW5kZXggPSBkYXRhQmFubmVycy5sZW5ndGggLSAxO1xyXG5cclxuICAgIHZhciBpbWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImltZ1wiKTtcclxuICAgIGltZy5zcmMgPSBkYXRhQmFubmVyc1tpbmRleF0uaW1hZ2U7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlc2NcIikuaW5uZXJIVE1MID0gZGF0YUJhbm5lcnNbaW5kZXhdLnRpdGxlO1xyXG59XHJcblxyXG5jb25zdCBiYW5uZXJIb21lID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYm9keS1jb250ZW50LWJhbm5lcicpO1xyXG5jb25zdCBob21lUGFnZSA9IHNldEludGVydmFsKG5leHQsIDMwMDApO1xyXG5pZiAoIWJhbm5lckhvbWUpIHtcclxuICAgIGNsZWFySW50ZXJ2ZWwoaG9tZVBhZ2UpO1xyXG59XHJcblxyXG4vLyBpbmRleEJhbm5lciA9ICBzZXRJbnRlcnZhbChcIm5leHQoKVwiLCAzMDAwKTtcclxuLy8gY2xlYXJJbnRlcnZlbChpbmRleEJhbm5lcik7XHJcblxyXG5jb25zdCBkYXRhQmFubmVyUHJvZHVjdHMgPSBbe1xyXG4gICAgICAgIGltYWdlOiBcIi4uLy4uL3NyYy9pbWcvcHJvZHVjdC1iYW5uZXItMS5wbmdcIixcclxuICAgICAgICB0aXRsZTogXCI8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAyOHB4O2ZvbnQtd2VpZ2h0OjcwMDtsaW5lLWhlaWdodDogMTIwJTsnPlPhuqJOIFBI4bqoTSBWSSBTSU5IIDwvc3Bhbj48L2JyPiA8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAxOHB4O2ZvbnQtd2VpZ2h0OjQwMDsgbGluZS1oZWlnaHQ6IDI3cHg7IHBhZGRpbmc6NSUgMDsnPlRoZXJlIGFyZSBtYW55IHZhcmlhdGlvbnMgb2YgcGFzc2FnZXMgb2YgTG9yZW0gSXBzdW0gYXZhaWxhYmxlLCBidXQgdGhlIG1ham9yaXR5IGhhdmUgc3VmZmVyZWQgYWx0ZXJhdGlvbiBpbiBzb21lIGZvcm0uPC9zcGFuPlwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGltYWdlOiBcIi4uLy4uL3NyYy9pbWcvcHJvZHVjdC1iYW5uZXItMi5wbmdcIixcclxuICAgICAgICB0aXRsZTogXCI8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAyOHB4O2ZvbnQtd2VpZ2h0OjcwMDtsaW5lLWhlaWdodDogMTIwJTsnPlPhuqJOIFBI4bqoTSBWSSBTSU5IIDwvc3Bhbj48L2JyPiA8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAxOHB4O2ZvbnQtd2VpZ2h0OjQwMDsgbGluZS1oZWlnaHQ6IDI3cHg7IHBhZGRpbmc6NSUgMDsnPlRoZXJlIGFyZSBtYW55IHZhcmlhdGlvbnMgb2YgcGFzc2FnZXMgb2YgTG9yZW0gSXBzdW0gYXZhaWxhYmxlLCBidXQgdGhlIG1ham9yaXR5IGhhdmUgc3VmZmVyZWQgYWx0ZXJhdGlvbiBpbiBzb21lIGZvcm0uPC9zcGFuPlwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGltYWdlOiBcIi4uLy4uL3NyYy9pbWcvcHJvZHVjdC1iYW5uZXItMy5wbmdcIixcclxuICAgICAgICB0aXRsZTogXCI8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAyOHB4O2ZvbnQtd2VpZ2h0OjcwMDtsaW5lLWhlaWdodDogMTIwJTsnPlPhuqJOIFBI4bqoTSBWSSBTSU5IIDwvc3Bhbj48L2JyPiA8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAxOHB4O2ZvbnQtd2VpZ2h0OjQwMDsgbGluZS1oZWlnaHQ6IDI3cHg7IHBhZGRpbmc6NSUgMDsnPlRoZXJlIGFyZSBtYW55IHZhcmlhdGlvbnMgb2YgcGFzc2FnZXMgb2YgTG9yZW0gSXBzdW0gYXZhaWxhYmxlLCBidXQgdGhlIG1ham9yaXR5IGhhdmUgc3VmZmVyZWQgYWx0ZXJhdGlvbiBpbiBzb21lIGZvcm0uPC9zcGFuPlwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGltYWdlOiBcIi4uLy4uL3NyYy9pbWcvcHJvZHVjdC1iYW5uZXItNC5wbmdcIixcclxuICAgICAgICB0aXRsZTogXCI8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAyOHB4O2ZvbnQtd2VpZ2h0OjcwMDtsaW5lLWhlaWdodDogMTIwJTsnPlPhuqJOIFBI4bqoTSBWSSBTSU5IIDwvc3Bhbj48L2JyPiA8c3BhbiBzdHlsZT0nY29sb3I6IzExMjg0ODsgZm9udC1zaXplOiAxOHB4O2ZvbnQtd2VpZ2h0OjQwMDsgbGluZS1oZWlnaHQ6IDI3cHg7IHBhZGRpbmc6NSUgMDsnPlRoZXJlIGFyZSBtYW55IHZhcmlhdGlvbnMgb2YgcGFzc2FnZXMgb2YgTG9yZW0gSXBzdW0gYXZhaWxhYmxlLCBidXQgdGhlIG1ham9yaXR5IGhhdmUgc3VmZmVyZWQgYWx0ZXJhdGlvbiBpbiBzb21lIGZvcm0uPC9zcGFuPlwiXHJcbiAgICB9XHJcbl1cclxubGV0IGkgPSAtMTtcclxuXHJcbmZ1bmN0aW9uIG5leHRQcm9kdWN0QmFubmVyKCkge1xyXG4gICAgaSsrO1xyXG4gICAgaWYgKGkgPj0gZGF0YUJhbm5lclByb2R1Y3RzLmxlbmd0aCkgaSA9IDA7XHJcblxyXG4gICAgdmFyIGltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9kdWN0LWJhbm5lcicpO1xyXG4gICAgY29uc29sZS5sb2coZGF0YUJhbm5lclByb2R1Y3RzW2ldLmltYWdlKVxyXG4gICAgaWYgKGltZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGkpXHJcbiAgICAgICAgaW1nLnNyYyA9IGRhdGFCYW5uZXJQcm9kdWN0c1tpXS5pbWFnZTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVzYy1wcm9kdWN0JykuaW5uZXJIVE1MID0gZGF0YUJhbm5lclByb2R1Y3RzW2ldLnRpdGxlO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGJhbm5lclByb2R1Y3QgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdib2R5LWNvbnRlbnQtcHJvZHVjdC1iYW5uZXInKTtcclxubGV0IHByb2R1Y3QgPSBzZXRJbnRlcnZhbChuZXh0UHJvZHVjdEJhbm5lciwgMzAwMCk7XHJcbmlmICghYmFubmVyUHJvZHVjdCkge1xyXG4gICAgY2xlYXJJbnRlcnZlbChwcm9kdWN0KTtcclxufVxyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLUlOQ1JFQVNFIC0gREVDUkVBU0UtIEFNT1VOVCAtLS0tLS0tLS0tLS0tLS0tXHJcbmxldCBhbW91bnRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ftb3VudCcpO1xyXG5sZXQgdmFsdWVBbW91bnQgPSBhbW91bnRFbGVtZW50LnZhbHVlO1xyXG5sZXQgaGFuZGxlRGVjcmVhc2UgPSAoKSA9PiB7XHJcbiAgICBpZiAodmFsdWVBbW91bnQgPiAxKVxyXG4gICAgICAgIHZhbHVlQW1vdW50LS07XHJcbiAgICBhbW91bnRFbGVtZW50LnZhbHVlID0gdmFsdWVBbW91bnQ7XHJcbn07XHJcbmxldCBoYW5kbGVJbmNyZWFzZSA9ICgpID0+IHtcclxuICAgIHZhbHVlQW1vdW50Kys7XHJcbiAgICBhbW91bnRFbGVtZW50LnZhbHVlID0gdmFsdWVBbW91bnQ7XHJcbn07XHJcbi8vQuG6r3Qgc+G7sSBraeG7h24gaW5wdXQgXHJcbmFtb3VudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICBjb252ZXJ0VmFsdWVBbW91bnQgPSBwYXJzZUludCh2YWx1ZUFtb3VudCk7XHJcbiAgICBjb25zb2xlLmxvZyhjb252ZXJ0VmFsdWVBbW91bnQpO1xyXG4gICAgY29udmVydFZhbHVlQW1vdW50ID0gKGlzTmFOKGNvbnZlcnRWYWx1ZUFtb3VudCkgfHwgY29udmVydFZhbHVlQW1vdW50ID09IDApID8gMSA6IGNvbnZlcnRWYWx1ZUFtb3VudDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbW91bnQnKS52YWx1ZSA9IGNvbnZlcnRWYWx1ZUFtb3VudDtcclxufSk7XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1DTElDSyBTTUFMTCBJTUFHRSBTSE9XIExBUkdFIElNQUdFIC0tLS0tLS0tLS0tLS0tLS1cclxuZnVuY3Rpb24gaGFuZGxlQ2hhbmdlSW1hZ2UoaWQpIHtcclxuICAgIGxldCBpbWFnZVBhdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuZ2V0QXR0cmlidXRlKCdzcmMnKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1pbWdcIikuc2V0QXR0cmlidXRlKCdzcmMnLCBpbWFnZVBhdGgpO1xyXG59XHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tQ0FSVC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4vL0FERCBUTyBDQVJUIiwiKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlTG9naW4oKSB7XHJcbiAgICAgICAgJCgnI2xvZ2luLXRvZ2dsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJC5iYWNrZHJvcF9zaG93KHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrc2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJyNsb2dpbi10b2dnbGUnKS5wYXJlbnQoKS5hZGRDbGFzcygnY3VycmVudC1tZW51LWl0ZW0nKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFuZWwtbG9naW4nKS5hZGRDbGFzcygnZXhwYW5kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J0bi1tZW51LXNwJykudHJpZ2dlcignY2xpY2snKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja2hpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcjbG9naW4tdG9nZ2xlJykucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2N1cnJlbnQtbWVudS1pdGVtJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnLnBhbmVsLWxvZ2luJykucmVtb3ZlQ2xhc3MoJ2V4cGFuZCcpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNsYXNzOiBcImZvci1wYW5lbC1tZW51XCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoJyNidG4tY2xvc2UtbG9naW4nKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQuYmFja2Ryb3BfaGlkZSh7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja2hpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKCcucGFuZWwtbG9naW4nKS5yZW1vdmVDbGFzcygnZXhwYW5kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI2xvZ2luLXRvZ2dsZScpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdjdXJyZW50LW1lbnUtaXRlbScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVMb2dpblNpZ251cCgpIHtcclxuICAgICAgICAkKCcjc2lnbi11cC1zaG93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcjc2lnbnVwLWZpZWxkcycpLmhpZGUoKTtcclxuICAgICAgICAgICAgJCgnI2xvZ2luLWZpZWxkcycpLmZhZGVJbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJyNsb2dpbi1zaG93Jykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkKCcjbG9naW4tZmllbGRzJykuaGlkZSgpO1xyXG4gICAgICAgICAgICAkKCcjc2lnbnVwLWZpZWxkcycpLmZhZGVJbigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXJ0X2JhZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcuYnRuLWNhcnQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAvLyBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHZhciBjYXJ0YmFnID0gJCh0aGlzKTtcclxuICAgICAgICAgICAgY2FydGJhZy50b2dnbGVDbGFzcygnb3BlbmVkJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3V0c2lkZUNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICghJChldmVudC50YXJnZXQpLmZpbmQoJy5idG4tY2FydCcpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnLmJ0bi1jYXJ0JykuaGFzQ2xhc3MoJ29wZW5lZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5idG4tY2FydCcpLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlQ2xpY2tMaXN0ZW5lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ21vZGFsLW9wZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3V0c2lkZUNsaWNrTGlzdGVuZXIpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG91dHNpZGVDbGlja0xpc3RlbmVyKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGNhcnRfYmFnX2hvdmVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoJy5idG4tY2FydCcpLm1vdXNlZW50ZXIoZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgJChcImJvZHlcIikuZGlzYWJsZXNjcm9sbCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSkubW91c2VsZWF2ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmRpc2FibGVzY3JvbGwoXCJ1bmRvXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoXCJib2R5XCIpLm9uKFwibW91c2VlbnRlclwiLCBcIi5iYWctaG92ZXIgLnNjcm9sbC13cmFwcGVyXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5mb2N1cygpO1xyXG4gICAgICAgICAgICAkKHRoaXMpLnNlbGVjdCgpO1xyXG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKFwiLnNjcm9sbC15IC5zY3JvbGwtYmFyXCIpLmhlaWdodCgpID4gMCkgeyB3aW5kb3cuVXNlclNjcm9sbERpc2FibGVyX0lzID0gZmFsc2U7IH1cclxuICAgICAgICB9KS5vbihcIm1vdXNlbGVhdmVcIiwgXCIuYmFnLWhvdmVyIC5zY3JvbGwtd3JhcHBlclwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5Vc2VyU2Nyb2xsRGlzYWJsZXJfSXMgPSB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiB2ZW5fY2xpY2thYmxlX2NhcnQoKSB7XHJcbiAgICAgICAgJCgnLmhlYWRlci1wYWdlIC5zaG93LWNhcnQnKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFyIF9fdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgICQuYmFja2Ryb3Bfc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja3Nob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmJhZy1ob3ZlclwiKS5hZGRDbGFzcyhcIm9wZW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja2hpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmJhZy1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcIm9wZW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIi5iYWctaG92ZXJcIikub24oXCJjbGlja1wiLCBcIi5idG4tY2xvc2UtY2FydFwiLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICQuYmFja2Ryb3BfaGlkZSh7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFja2hpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLmJhZy1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcIm9wZW5lZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB1aV92aWRlb0NsaWNrKCkge1xyXG4gICAgICAgICQoXCIuaG9tZS1wbGF5LWJ0blwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGZyYW1lID0gJCh0aGlzKS5jbG9zZXN0KFwiLnZpZGVvLWhvbGRlclwiKSxcclxuICAgICAgICAgICAgICAgIGxpbmtWaWQgPSBmcmFtZS5kYXRhKFwibGlua1wiKTtcclxuICAgICAgICAgICAgJCh0aGlzKS5oaWRlKCk7XHJcbiAgICAgICAgICAgIGZyYW1lLmZpbmQoXCJpbWdcIikuZmFkZU91dCgpO1xyXG4gICAgICAgICAgICBpZiAobGlua1ZpZC5pbmRleE9mKFwidmltZW9cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kKCc8aWZyYW1lIHNyYz1cImh0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS92aWRlby8nICsgdmltZW9fcGFyc2VyKGxpbmtWaWQpICsgJz9hdXRvcGxheT0xJnRpdGxlPTAmYnlsaW5lPTAmcG9ydHJhaXQ9MFwiIGZyYW1lYm9yZGVyPVwiMFwiIHdlYmtpdGFsbG93ZnVsbHNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZnJhbWUuYXBwZW5kKCc8aWZyYW1lIHNyYz1cImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLycgKyB5b3V0dWJlX3BhcnNlcihsaW5rVmlkKSArICc/YXV0b3BsYXk9MVwiICBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW5cIj48L2lmcmFtZT4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHlvdXR1YmVfcGFyc2VyKHVybCkge1xyXG4gICAgICAgIHZhciByZWdFeHAgPSAvXi4qKCh5b3V0dS5iZVxcLyl8KHZcXC8pfChcXC91XFwvXFx3XFwvKXwoZW1iZWRcXC8pfCh3YXRjaFxcPykpXFw/P3Y/PT8oW14jXFwmXFw/XSopLiovO1xyXG4gICAgICAgIHZhciBtYXRjaCA9IHVybC5tYXRjaChyZWdFeHApO1xyXG4gICAgICAgIHJldHVybiAobWF0Y2ggJiYgbWF0Y2hbN10ubGVuZ3RoID09IDExKSA/IG1hdGNoWzddIDogZmFsc2U7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB2aW1lb19wYXJzZXIodXJsKSB7XHJcbiAgICAgICAgdmFyIG0gPSB1cmwubWF0Y2goL14uK3ZpbWVvLmNvbVxcLyguKlxcLyk/KFteI1xcP10qKS8pO1xyXG4gICAgICAgIHJldHVybiBtID8gbVsyXSB8fCBtWzFdIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAkKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgLy8gUFJFTE9BREVSXHJcbiAgICAgICAgaWYgKHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oXCJpc0ZpcnN0UnVuXCIpKSB7ICQoXCIjcHJlbG9hZGVyXCIpLmFkZENsYXNzKFwiZC1ub25lXCIpOyB9XHJcbiAgICAgICAgJCh3aW5kb3cpLm9uKFwibG9hZFwiLCBmdW5jdGlvbiAoZSkgeyAkKFwiI3ByZWxvYWRlclwiKS5mYWRlT3V0KCk7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImlzRmlyc3RSdW5cIiwgdHJ1ZSk7IH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyAkKFwiI3ByZWxvYWRlclwiKS5mYWRlT3V0KCk7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShcImlzRmlyc3RSdW5cIiwgdHJ1ZSk7IH0sIDQwMDApO1xyXG5cclxuICAgICAgICB0b2dnbGVMb2dpbigpO1xyXG4gICAgICAgIHRvZ2dsZUxvZ2luU2lnbnVwKCk7XHJcbiAgICAgICAgLy8gY2FydF9iYWcoKTtcclxuICAgICAgICB2ZW5fY2xpY2thYmxlX2NhcnQoKTtcclxuICAgICAgICAvKkNBUlQgRVZFTlQqL1xyXG4gICAgICAgICQoJy5kZWxldGUtaGVhZGVyLWNhcnQnKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCdsaScpLmZhZGVPdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLypFTkQgQ0FSVCBFVkVOVCovXHJcblxyXG4gICAgICAgICQoXCIubGlzdC1zb2NpYWwtanNcIikuanNTb2NpYWxzKHtcclxuICAgICAgICAgICAgc2hvd0xhYmVsOiB0cnVlLFxyXG4gICAgICAgICAgICBzaGFyZXM6IFtcclxuICAgICAgICAgICAgICAgIHsgc2hhcmU6IFwiZmFjZWJvb2tcIiwgbGFiZWw6IFwiRmFjZWJvb2tcIiwgbG9nbzogXCJmYSBmYS1mYWNlYm9va1wiIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB1aV92aWRlb0NsaWNrKCk7XHJcbiAgICB9KTtcclxufSkoalF1ZXJ5KTtcclxuXHJcblxyXG4iXX0=
