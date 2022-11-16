jQuery(document).ready(function ($) {
	var _is_handle = false;
	var _cart_params = {};
	$('#modal-alert').on('hidden.bs.modal', function (e) {
		_is_handle = false;
	})
	var cart_system = {
		init: function () {
			cart_system._add_cart();
			cart_system._add_cart_health();
			cart_system._add_multiple();
			cart_system._update_quanity();
			cart_system._remove_cart();
			cart_system._applies_coupon();
			cart_system._remove_coupon();

			cart_system._check_onbackorder();
			cart_system._confirm_appointment_popup();
		},
		_add_cart: function () {
			//update product quantity
			$(".qty-box").on('change', function (event) {
				event.preventDefault();
				$(".add-to-cart").attr('data-quantity', $(this).val());
			});
			$(".add-to-cart").on('click', function (event) {
				event.preventDefault ? event.preventDefault() : (event.returnValue = false);
				if (_is_handle) { return; } _is_handle = true;

				var $variation_form = $('.variations_form'),
					publish_date    = $(this).data('publish_date'),
					product_id      = $(this).data('product_id'),
					quantity        = $(this).data('quantity') ? $(this).data('quantity') : 1,
					variation_id    = $variation_form.find('input[name=variation_id]').val() ? $variation_form.find('input[name=variation_id]').val() : null,
					item            = {},
					$this           = $(this);

				$this.append('<div class="ven-loading opening"><div class="img"><i class="icon spinner"></i></div></div>');
				var variations = $variation_form.find('select[name^=attribute]');
				if (!variations.length) {
					variations = $variation_form.find('[name^=attribute]:checked');
				}
				if (!variations.length) {
					variations = $variation_form.find('input[name^=attribute]');
				}

				// push item into _cart_params
				_cart_params = {
					'publish_date': publish_date,
					'product_id'  : product_id,
					'quantity'    : quantity,
					'variation_id': variation_id,
					'variations'  : variations,
					'item'        : item,
					'target'      : $this,
					'type'		  : 'normal'
				};

				// check is product onbackorder
				var is_onbackorder = $this.data('onbackorder');
				if ( is_onbackorder != undefined && is_onbackorder ) {
					var popup_onbackorder = $('#product-onbackorder');
					popup_onbackorder.modal('show');
					popup_onbackorder.on('hidden.bs.modal', function (e) {
						_is_handle = false;
						$('.ven-loading').removeClass('opening');
						return false;
					});
				} else {
					cart_system._check_cart_contain_appointment();
				}
			});
		},
		_add_cart_health: function () {
			$(".row-health-hub").on('click', '.add-to-cart-health', function (event) {
				event.preventDefault();
				/* Act on the event */
				if (_is_handle) { return; } _is_handle = true;
				var $this = $(this),
					product_id = $this.data('product_id'),
					quantity = $this.data('quantity') ? $this.data('quantity') : 1;

				$this.append('<div class="ven-loading opening"><div class="img"><i class="icon spinner"></i></div></div>');

				$.ajax({
					url: ajax_object.admin_url + '?action=add-to-cart',
					type: 'POST',
					data: {
						'product_id': product_id,
						'quantity': quantity,
						'datatype': 'health-hub',
					},
				})
					.done(function (res) {
						_is_handle = false;
						if (res.error) { $.ven_noti(res.errorMsg, 2000); }
						else {

							$.ven_noti(res.product_name + ' has been added to cart !', 2000);
							$(".bag-hover").html(res.html);
							$(".header-btn-cart span").text(res.count);
							$('.header-cart-list.scrollbar-macosx').scrollbar();

							var $lock = '<div class="pos">Already in the cart</div>';
							$this.addClass('disabled').html($lock);
							$this.parents(".check-active-next-product").next().find(".add-to-cart-health." + $this.data("cateh")).removeClass("disabled");
						};
						//HIDE LOADING
						$('.ven-loading').removeClass('opening');
						setTimeout(function () {
							$('.ven-loading').remove();
						}, 400);
					});

			});
		},
		_add_multiple: function () {
			$(".add-multiple-to-cart").on('click', function (event) {
				event.preventDefault();
				if (_is_handle) { return; } _is_handle = true;
				var $this = $(this),
					product_id = $(this).data('pid');
				if (!product_id) { return; }
				$.ajax({
					url: ajax_object.admin_url + '?action=add-multiple-to-cart',
					type: 'POST',
					data: {
						'product_id': product_id
					},
				})
					.done(function (res) {
						_is_handle = false;
						if (res.error) { $.ven_noti(res.errorMsg, 2000); }
						else {
							if (res.product_name) {
								$.ven_noti(res.product_name + ' has been added to cart !', 2000);
							} else {
								$.ven_noti('Products already in the cart !', 2000);
							}

							$(".bag-hover").html(res.html);
							$(".header-btn-cart span").text(res.count);
							$('.header-cart-list.scrollbar-macosx').scrollbar();
						};
						//HIDE LOADING
						$('.ven-loading').removeClass('opening');
						setTimeout(function () {
							$('.ven-loading').remove();
						}, 3000);
					});

			});
		},
		_update_quanity: function () {
			$(document).on('change', '.header-cart-quanity input[name="cart-quantity"]', function (event) {
				event.preventDefault();
				var $this_bag = $('.bag-hover'),
					$this = $(this),
					cart_key = $this.data('cart-key'),
					quantity = $this.val();
				$.ajax({
					url: ajax_object.admin_url + '?action=cart-update-quantity',
					type: 'POST',
					data: {
						'cart_key': cart_key,
						'quantity': quantity
					},
					beforeSend: function () {
						$this_bag.ven_loading_show();
					}
				})
					.done(function (res) {
						$(".header-btn-cart span").text(res.count);
						$('.bag-hover').html(res.html);
						$this_bag.ven_loading_hide();
					});

			});
		},
		_remove_cart: function () {
			$(".bag-hover").on('click', '.delete-header-cart', function (event) {
				event.preventDefault();
				var $this = $(this),
					key = $this.data('ckey');
				$.ajax({
					url: ajax_object.admin_url + '?action=remove-cart-item',
					type: 'POST',
					data: { "key": key, "datatype": $this.data("type") },
					beforeSend: function (xhr) {
						$('.bag-hover').ven_loading_show();
					}
				}).done(function (res) {
					if (!res.error) {
						$.ven_noti(res.msg, 2000);
						$(".bag-hover").html(res.html);
						$(".header-btn-cart span").text(res.count);
						$('.header-cart-list.scrollbar-macosx').scrollbar();
						if (res.count < 1) { $("body").disablescroll("undo"); }
						if (res.type == "programs") {
							var $btnRemove = $(".cateh-" + res.cateh + "[data-product_id='" + res.product_id + "']");
							$btnRemove.removeClass("disabled").find(".pos").html($btnRemove.data("price"));
							$(".cateh-" + res.cateh + ":gt(" + res.purchase_order + ")").each(function () {
								var $btnEach = $(this);
								$btnEach.addClass("disabled").find(".pos").html($btnEach.data("price"));
							});
						}
					}
					$('.bag-hover').ven_loading_hide();
				});
			});
		},
		_applies_coupon: function () {
			$(document).on('click', '#cart-mini-coupon', function (event) {
				event.preventDefault();
				var $this = $(this),
					coupon = $('input#coupon_code').val();
				if (coupon.length < 0)
					return;
				var data = {
					'coupon_code': coupon,
					'security': ajax_object.coupon_security
				};
				$.ajax({
					url: ajax_object.admin_url + '?action=mini-cart-apply-coupon',
					type: 'POST',
					data: data,
					beforeSend: function (xhr) {
						$('.bag-hover').ven_loading_show();
					}
				})
					.done(function (res) {
						$.ven_noti(res.message, 2000);
						if (res.status) {
							$('.bag-hover').html(res.cart.html);
						}
						$('.bag-hover').ven_loading_hide();
						return;
					});
			});
		},
		_remove_coupon: function () {
			$(document).on('click', '.bag-hover .coupon a', function (event) {
				event.preventDefault();
				var $this = $(this);
				if (!$this)
					return;
				$.ajax({
					url: ajax_object.admin_url + '?action=mini-cart-remove-coupon',
					type: 'GET',
					data: {
						'code': $this.data('coupon')
					},
					beforeSend: function (xhr) {
						$('.bag-hover').ven_loading_show();
					}
				})
					.done(function (res) {
						$.ven_noti(res.message, 2000);
						if (res.status) {
							$('.bag-hover').html(res.cart.html);
						}
						$('.bag-hover').ven_loading_hide();
						return;
					});
			});
		},
		_check_onbackorder: function () {
			$('#product-onbackorder').on('click', '.confirm-add-onbackorder', function(event) {
				event.preventDefault();
				$('#product-onbackorder').modal('hide');
				cart_system._check_cart_contain_appointment();
			});
		},
		_check_cart_contain_appointment: function () {
			$.get(ajax_object.admin_url + '?action=has-appointment-in-cart', function (data) {
				if (data) {
					var target = $('#modal-alert');
					target.modal('show');
					target.on('hidden.bs.modal', function (e) {
						_is_handle = false;
					});
				} else {
					cart_system._processing_addcart();
				}
			});
		},
		_confirm_appointment_popup: function() {
			if (!ajax_object.not_appointment) {
				$('#modal-alert').on('click', '.cofirm-remove-appointment', function(event) {
					event.preventDefault();
					$('#modal-alert').modal('hide');
					cart_system._processing_addcart();
				});
			}
		},
		_processing_addcart: function() {
			_cart_params.variations.each(function (index, el) {
				var attributeName = _cart_params.target.attr('name'),
					attributevalue = _cart_params.target.val();
				_cart_params.item[attributeName] = attributevalue;
			});
			$.ajax({
				url: ajax_object.admin_url + '?action=add-to-cart',
				type: 'POST',
				data: {
					'publish_date': _cart_params.publish_date,
					'product_id'  : _cart_params.product_id,
					'quantity'    : _cart_params.quantity,
					'variation_id': _cart_params.variation_id,
					'variation'   : _cart_params.item,
				},
			}).done(function (res) {
				_is_handle = false;
				if (res.error) { $.ven_noti(res.errorMsg, 2000); }
				else {
					$.ven_noti(res.product_name + ' has been added to cart !', 2000);
					$(".bag-hover").html(res.html);
					$(".header-btn-cart span").text(res.count);
					$('.header-cart-list.scrollbar-macosx').scrollbar();
				};
				//HIDE LOADING
				$('.ven-loading').removeClass('opening');
				setTimeout(function () {
					$('.ven-loading').remove();
				}, 400);
			});
		}
	};
	cart_system.init();

	var system = {
		init: function () {
			system.login();
			system.signup();
			system.checkStep();
			system.nextStep();
			system.loginFB();
		},
		login: function () {
			$("#login-form").submit(function (event) {
				/* Act on the event */
				event.preventDefault();

				$("#panel-login").ven_loading_show();

				if ($("#login-form input[name='txt_email']").val() === "" && $("#login-form input[name='txt_pass']").val() === "") {
					$("#login-form .show-mes-response").html("<div class='text-center'><b>Please enter your correct login details.</b></div>");
					return false;
				}
				if (_is_handle) { return; }
				_is_handle = true;
				$.ajax({
					url: ajax_object.admin_url + '?action=site-login',
					type: 'POST',
					data: $(this).serialize(),
				}).done(function (res) {
					$("#panel-login").ven_loading_hide();
					if (res.error) { $("#login-form .show-mes-response").html(res.errorMes); _is_handle = false; }
					if (res.success) {
						if (location.href.indexOf('/health-hub') >= 0 || location.href.indexOf('/checkout') >= 0) { location.reload(); return; }
						location.href = res.myaccount;
					}
				});
			});
		},
		signup: function () {
			$("#signup-form").submit(function (event) {
				/* Act on the event */
				event.preventDefault();
				$("#panel-login").ven_loading_show();
				if (_is_handle) { return; }
				_is_handle = true;
				$.ajax({
					url: ajax_object.admin_url + '?action=site-signup',
					type: 'POST',
					data: $(this).serialize(),
				}).done(function (res) {
					$("#panel-login").ven_loading_hide();
					if (res.error) { $("#signup-form .show-mes-response").html(res.errorMes); _is_handle = false; }
					if (res.success) {
						if (location.href.indexOf('/health-hub') >= 0 || location.href.indexOf('/checkout') >= 0) { location.reload(); return; }
						location.href = res.myaccount;
					}
				});
			});
		},
		checkStep: function () {
			$(".btn-step").on('click', function (event) {
				var step = $(this).attr('href'),
					pid = $(this).data('pid'),
					uid = $(this).data('uid');
				$.ajax({
					url: ajax_object.rest_url + 'api/v1/first-step/',
					type: 'GET',
					data: {
						'step': step,
						'pid': pid,
						'uid': uid
					},
				}).done(function (res) {
					// console.log('success');
					$(".sticky-bar nav li").removeClass("finished");
				});

			});
		},
		nextStep: function () {
			$(".btn-next-step").on('click', function (event) {
				var step = $(this).attr('href'),
					pid = $(this).data('pid'),
					uid = $(this).data('uid');
				$.ajax({
					url: ajax_object.rest_url + 'api/v1/next-step/',
					type: 'GET',
					data: {
						'step': step,
						'pid': pid,
						'uid': uid
					},
				}).done(function (res) {
					// console.log('success');
					step = parseInt(step.replace("#day-", ""));
					$(".sticky-bar nav li").removeClass("finished");
					$(".sticky-bar nav li").slice(1, step).addClass("finished");
				});

			});
		},
		loginFB: function () {
			if (!ajax_object.fb_app_id) { return; }

			// init fb sdk
			window.fbAsyncInit = function () {
				FB.init({
					appId: ajax_object.fb_app_id,
					autoLogAppEvents: true,
					xfbml: true,
					version: 'v3.2'
				});
			};

			(function (d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) { return; }
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			// login facebook
			$('#panel-login').on('click', '.fb_login', function (event) {
				event.preventDefault();
				FB.login(function (res) {
					if (res.status === 'connected') {
						facebook_login_connected_callback();
					}
				}, { scope: 'public_profile,email' });
			});

			function facebook_login_connected_callback() {
				FB.api('/me', { fields: 'id,name,first_name,last_name,picture,verified,email' }, function (response) {
					jQuery.ajax({
						url: ajax_object.admin_url + '?action=fb-login',
						type: 'POST',
						data: {
							"provide_id": response.id,
							"first_name": response.first_name,
							"last_name": response.last_name,
							"display_name": response.name,
							"email": response.email
						},
					})
						.done(function (res) {
							if (res.error) { alert(res.errorMes); isLogin = false; }
							if (res.success) {
								if (ajax_object.is_health_hub || ajax_object.is_checkout) {
									location.reload();
								} else {
									location.href = ajax_object.myaccount_url;
								}
							}
						});
				});
			}
		}
	}
	system.init();
});