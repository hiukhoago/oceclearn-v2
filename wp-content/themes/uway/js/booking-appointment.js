(function ($) {
	var _is_handle = false;
	var booking = {
		init: function () {
			// booking.step2();
			booking.step3();
			booking.stepFinal();
		},
		step2: function () {
			$('.book-appointment-btn').on('click', function (event) {
				event.preventDefault();
				var $this = $(this),
					variation = $this.data('appointment-variation');
			});
		},
		step3: function () {
			$('#calendar').on('changeDate', function (e) {
				var $calendar = $(this)
				var date = e.format();
				var employee_id = $('.book-step-next').attr('data-id');
				var $method_wrapper = $('.method-wrapper');
				// get data here: employee_id, pick_date
				var data = {
					'employee_id': employee_id,
					'pick_date': date
				};
				$method_wrapper.show();
				$('.wrap-calendar').ven_loading_show();
				if (data && date && employee_id) {
					$.get(ajax_object.admin_url + '?action=appointment-pick-a-date-time', data, function (res) {
						/*optional stuff to do after success */
						//FADE IN TIME PICKER
						$calendar.fadeOut(function () {
							$('.wrap-calendar').ven_loading_hide();
							$('.wrap-slide-time-picker').fadeIn();
						});

						$.calculate_height_step($('.row-step-1'));

						if (res.length > 0) {
							var skype = (res.indexOf("skype_unbookable_date") > -1);
							var face_to_face = (res.indexOf("ftf_unbookable_date") > -1);
							var over_phone = (res.indexOf("over_phone_unbookable_date") > -1);
							if (skype) $method_wrapper.eq(2).fadeOut();
							if (face_to_face) $method_wrapper.eq(0).fadeOut();
							if (over_phone) $method_wrapper.eq(1).fadeOut();
							$('.method-name').text('');
							$method_wrapper.find('input').prop('checked', false);
						}
					});
				}
			});
		},
		stepFinal: function () {
			$('.book-step-final').on('click', function (event) {
				event.preventDefault();
				if (_is_handle) { return; } _is_handle = true;

				var time_start = $('.box-info-pick .time-start');
				var time_end = $('.box-info-pick .time-end');
				var $method_name = $('.method-name').text();
				var booking_date = $(this).attr('booking_date');
				if (time_start.text() == '' || time_end.text() == '' || !booking_date) {
					$.ven_noti("Please select time and date");
					_is_handle = false;
					return;
				}
				if ($method_name == '') {
					$.ven_noti("Please select method of appointment");
					_is_handle = false;
					return;
				}
				var $this = $(this),
					productID = $this.data('product-id'),
					serviceID = $this.data('service-id'),
					quantity = 1;
				if (!productID || !serviceID)
					return;
				var data = {
					'product_id': productID,
					'variation_id': serviceID,
					'quantity': quantity,
					'variation': null
				};

				var checkData = {
					'timeStart': time_start.text().replace(' - ', ''),
					'timeEnd': time_end.text(),
					'bookingDate': booking_date,
					'employeeID': productID,
					'packageID': serviceID
				};
				$.get(ajax_object.admin_url + '?action=before-add-appointment-to-cart', checkData, function (res) {
					if (res.error) {
						$.ven_noti(res.message, 2000);
						_is_handle = false;
					} else {
						if (res) {
							var target = $('#modal-alert');
							target.modal('show');
							target.on('click', '.cofirm-remove-appointment', function (event) {
								event.preventDefault();
								add_appointment_to_cart();
								target.modal('hide');
							});

							target.on('hidden.bs.modal', function (e) {
								_is_handle = false;
							});

						} else {
							add_appointment_to_cart();
						}
					}
				});
				function add_appointment_to_cart() {
					$('.book-step-final').ven_loading_show();
					$.post(params.ajax + '?action=add-to-cart', data, function (data, textStatus, xhr) {
						/*optional stuff to do after success */
						if (data.error) {
							_is_handle = false;
							$.ven_noti(res.errorMsg, 2000);
							$('.book-step-final').ven_loading_hide();
							return;
						}
						// redirect checkout page
						window.location.href = data.url;
					});
				}
			});
		}
	};
	booking.init();
})(jQuery);