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