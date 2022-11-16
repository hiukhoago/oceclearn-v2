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