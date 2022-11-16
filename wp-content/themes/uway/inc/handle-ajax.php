<?php 

	function reload_cart() {
		global $woocommerce;
		$carts_number = $woocommerce->cart->cart_contents_count;
		ob_start();
		woocommerce_mini_cart();
		$html = ob_get_clean();

		return array('html' => $html, 'count' => $carts_number);
	}

	add_action( 'wp_ajax_mini-cart-apply-coupon', 'mini_cart_apply_coupon' );
	add_action( 'wp_ajax_nopriv_mini-cart-apply-coupon', 'mini_cart_apply_coupon' );
	if (!function_exists('mini_cart_apply_coupon')) {
		function mini_cart_apply_coupon () {
			extract($_POST);
			global $woocommerce;
			if (!$coupon_code)
				wp_send_json( array('status' => false, 'message' => 'Can\'t apply coupon.') );
			$apply = WC()->cart->add_discount( $coupon_code );
			// re calc cart
			WC()->cart->calculate_totals();
			ob_start();
			wc_print_notices();
			$message = ob_get_clean();
			wp_send_json( array('status' => $apply, 'message' => wp_strip_all_tags( $message ), 'cart' => reload_cart()) );
		}
	}

	add_action( 'wp_ajax_mini-cart-remove-coupon', 'mini_cart_remove_coupon' );
	add_action( 'wp_ajax_nopriv_mini-cart-remove-coupon', 'mini_cart_remove_coupon' );
	if (!function_exists('mini_cart_remove_coupon')) {
		function mini_cart_remove_coupon () {
			extract($_GET);
			global $woocommerce;
			$res = WC()->cart->remove_coupon($code);
			if (!$res)
				wp_send_json( array('status' => false, 'message' => 'Sorry there was a problem removing this coupon.') );
			
			WC()->cart->calculate_totals();
            WC()->cart->set_session();
            WC()->cart->maybe_set_cart_cookies();
			wp_send_json( array('status' => true, 'message' => 'Coupon code removed successfully.', 'cart' => reload_cart()) );
		}
	}

	add_action( 'wp_ajax_has-appointment-in-cart', '_has_appointment_in_cart' );
	add_action( 'wp_ajax_nopriv_has-appointment-in-cart', '_has_appointment_in_cart' );
	if (!function_exists('_has_appointment_in_cart')) {
		function _has_appointment_in_cart()
		{
			$check = check_if_cart_has_appointment_item();

			wp_send_json( $check );
		}
	}

	add_action( 'wp_ajax_add-to-cart', 'add_to_cart' );
	add_action( 'wp_ajax_nopriv_add-to-cart', 'add_to_cart' );
	if ( !function_exists('add_to_cart')) {
		function add_to_cart($datatype = null) {
			global $woocommerce;
			extract($_POST);

			$product = wc_get_product( $product_id );
			$stock_status = $product->get_stock_status();

			if ($stock_status === "outofstock"){
				wp_send_json( array( 'error' => true, 'errorMsg' => 'Product is out of stock!' ) ); 
			}

			if ( 'health-hub' == $datatype ) {
				if ( true == matched_cart_items( $product_id ) ) {
					wp_send_json( array( 'error' => true, 'errorMsg' => 'Product already in the cart' ) ); 
				}
			}
			
			wc_clear_notices();
			$product_id        = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $product_id ) );
			$quantity          = empty( $quantity ) ? 1 : apply_filters( 'woocommerce_stock_amount', $quantity );
			$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $product_id, $quantity );
			// appointment handle
			if (has_term( 'appointment', 'product_cat', $product_id )) {
				$woocommerce->cart->empty_cart();
				if ( WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation ) ) {
					wp_send_json( array( 'error' => false, 'url' => get_permalink( wc_get_page_id( 'checkout' ) ) ) );
				} else {
					wp_send_json( array( 'error' => true, 'message' => wc_get_notices( 'error' ) ) );
				}
			}

			// empty cart if already has appointment in cart
			foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
			    if ( has_term( 'appointment', 'product_cat', $cart_item['product_id'] ) ) {
			        $woocommerce->cart->empty_cart();
			        break;
			    }
			}
				
			if ( $passed_validation and WC()->cart->add_to_cart( $product_id, $quantity, $variation_id, $variation  ) ) {
				do_action( 'woocommerce_ajax_added_to_cart', $product_id );
				if ( get_option('woocommerce_cart_redirect_after_add' == 'yes') ) wc_add_to_cart_message( $product_id );
				$wc_message = wc_get_notices( 'success' );
				$reload = reload_cart();
				$data = array( 
					'message' => $wc_message, 
					'product_name' => wc_get_product($product_id)->get_name(), 
					'html' => $reload['html'], 
					'count' => $reload['count'],
				);
				wp_send_json($data);
			}

			$wc_message = wc_get_notices( 'error' );

			$data = array(
				'error' => true,
				'errorMsg' => $wc_message,
				'product_url' => apply_filters( 'woocommerce_cart_redirect_after_error', get_permalink( $product_id ), $product_id ),
			);
			wp_send_json($data);
		}
	}

	add_action( 'wp_ajax_add-multiple-to-cart', 'add_multiple_to_cart' );
	add_action( 'wp_ajax_nopriv_add-multiple-to-cart', 'add_multiple_to_cart' );
	if ( ! function_exists( 'add_multiple_to_cart' ) ) {
		function add_multiple_to_cart() {
			extract( $_POST );

			if ( ! $product_id ) {
				die();
			}

			wc_clear_notices();

			$product_name = array();

			foreach ( $product_id as $pid ) {
				if ( true == matched_cart_items( $pid ) ) {
					continue;
				}
				$pid = apply_filters( 'woocommerce_add_to_cart_product_id', absint( $pid ) );
				$passed_validation = apply_filters( 'woocommerce_add_to_cart_validation', true, $pid, 1 );

				if ( $passed_validation and WC()->cart->add_to_cart( $pid, 1 ) ) {
					do_action( 'woocommerce_ajax_added_to_cart', $pid );
					if ( get_option('woocommerce_cart_redirect_after_add' == 'yes') ) {
						wc_add_to_cart_message( $pid );
					}
					$product_name[] = wc_get_product( $pid )->get_name();
				}
			}

			$wc_message = wc_get_notices( 'success' );

			$reload = reload_cart();

			$product_name_to_string = implode( ', ', $product_name );

			wp_send_json( array( 'message' => $wc_message, 'product_name' => $product_name_to_string, 'html' => $reload['html'], 'count' => $reload['count'] ) ); 
			exit();
		}
	}

	add_action( 'wp_ajax_cart-update-quantity', 'cart_update_quantity' );
	add_action( 'wp_ajax_nopriv_cart-update-quantity', 'cart_update_quantity' );
	if ( !function_exists('cart_update_quantity')) {
		function cart_update_quantity () {
			extract($_POST);
			global $woocommerce;
			$add_cart = $woocommerce->cart->set_quantity($cart_key, $quantity, true);

			$refresh_total = $woocommerce->cart->get_cart_total();
			$cart_count = $woocommerce->cart->cart_contents_count;
			wp_send_json( reload_cart() );
		}
	}

	add_action( 'wp_ajax_remove-cart-item', 'remove_cart_item');
	add_action( 'wp_ajax_nopriv_remove-cart-item', 'remove_cart_item');
	if (!function_exists('remove_cart_item')) {
		function remove_cart_item() {
			extract($_POST);
			foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item){
		        if( $cart_item_key == esc_attr($key) ){
		        	$product = wc_get_product( $cart_item['product_id'] );
		            WC()->cart->remove_cart_item($key);
		        }
		    }

		    if ( 'programs' == $datatype ) {
				$health_programs = get_the_terms( $product->get_id(), 'product_health' )[0]; //term_id
		    	if ( $health_programs ) {
		    		$products = get_posts( array(
						// Type & Status Parameters
						'post_type'      => 'product',
						'post_status'    => 'publish',
						// Pagination Parameters
						'posts_per_page' => -1,
            			// Taxonomy Parameters
            			'tax_query' => array(
            				'relation' => 'AND',
            				array(
								'taxonomy' => 'product_health',
								'field'    => 'slug',
								'terms'    => $health_programs->slug,
            				),
            			),
            			'meta_key'       => 'purchase_order',
			    		'meta_value'     => get_field( 'purchase_order', $product->get_id() ),
			    		'meta_compare'   => '>',
					) );
					if ( $products ) {
						foreach ( $products as $pkey => $pval ) {
							foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
								$c_product = wc_get_product( $cart_item['product_id'] );
								if ( $pval->ID == $c_product->get_id() ) {
									WC()->cart->remove_cart_item( $cart_item_key );
								}
							}
						}
					}
		    	}
		    }

			$reload = reload_cart();
			$data = array(
				'error' => false, 
				'msg' => 'Remove product '.$product->get_name().' successfully', 
				'product_id' => $product->get_id(), 
				'html' => $reload['html'], 
				'count' => $reload['count'],
				'type' => $datatype,
			);
			if ('programs' == $datatype ) {
				$data['purchase_order'] = get_field( 'purchase_order', $product->get_id() );
				$data['cateh'] = $health_programs->term_id;
			}
		    wp_send_json( $data ); exit();
		}
	}

	add_action( 'wp_ajax_fb-login', 'fb_login');
	add_action( 'wp_ajax_nopriv_fb-login', 'fb_login');

	if (!function_exists('fb_login')) {
		function fb_login() {
			extract($_POST);
			$creds = array(
				'user_login' => $email,
				'user_password' => $provide_id,
				'remember'	=> true
			);
			//check  emailexists
			if ( false === email_exists( $email )) {
				$user_args = array(
					'user_login'   => esc_attr( $email ),
					'user_email'   => esc_attr( $email ),
					'user_pass'    => esc_attr( $provide_id ),
					'first_name'   => esc_attr( $first_name ),
					'last_name'    => esc_attr( $last_name ),
					'display_name' => esc_attr( $display_name ),
				);
				//create user
				$newUser = wp_insert_user( $user_args );
				if (is_wp_error( $newUser ) and $newUser->errors) {
					wp_send_json( array('error' => true, 'errorMes' => $newUser->get_error_message()) );
					exit();
				}else{
					$user = get_user_by_email( $email );
						add_user_meta( $user->ID, 'fb_provide', $provide_id, $unique = true );
					$login = wp_signon( $creds, false );
					if (is_wp_error( $login ) and $login->errors) {
						wp_send_json( array('error' => true, 'errorMes' => $login->get_error_message()) );
						exit();
					}else{
						wp_send_json( array('success' => true) );
						exit();
					}
				}
			}else{
				// get user info by email
				$user = get_user_by_email( $email );
				wp_clear_auth_cookie();
				wp_set_current_user( $user->ID );
				wp_set_auth_cookie( $user->ID, $remember = true );
				$user = wp_signon( $creds, false );
				if (is_wp_error( $user ) and $user->errors) {
					wp_send_json( array('error' => true, 'errorMes' => $user->get_error_message()) );
					exit();
				}else{
					wp_send_json( array('success' => true) );
					exit();
				}
			}
		}
	}


	add_action( 'wp_ajax_site-login', 'site_login');
	add_action( 'wp_ajax_nopriv_site-login', 'site_login');

	if (!function_exists('site_login')) {
		function site_login() {
			$email = $_POST["txt_email"];
			$password = $_POST["txt_pass"];

			//login
			$creds = array( 'user_login' => $email, 'user_password' => $password, 'remember' => true);
			$login = wp_signon( $creds, false );
			if (is_wp_error( $login ) and $login->errors) {
				wp_send_json( array('error' => true, 'errorMes' => $login->get_error_message()) );
				exit();
			}else{
				wp_send_json( array('success' => true, 'myaccount' => get_permalink( get_option('woocommerce_myaccount_page_id') ) ) );
				exit();
			}
		}
	}

	add_action( 'wp_ajax_site-signup', 'site_signup');
	add_action( 'wp_ajax_nopriv_site-signup', 'site_signup');

	if (!function_exists('site_signup')) {
		function site_signup() {
			$email    = esc_attr($_POST["txt_s_email"]);
			$password = esc_attr($_POST["txt_s_password"]);
			$pass_cf  = esc_attr($_POST["txt_s_confirm"]);
			$userdata = array(
				'user_login'   => $email,
				'user_email'   => $email,
				'user_pass'    => $password,
				'display_name' => strstr( $email, '@', true),
			);
			if ( strcmp($password, $pass_cf) !== 0 ) {
				wp_send_json( array('error' => true, 'errorMes' => 'Confirm password is incorrect') );
				exit();
			}
			$signup = wp_insert_user( $userdata );
			if (is_wp_error( $signup ) and $signup->errors) {
				wp_send_json( array('error' => true, 'errorMes' => $signup->get_error_message()) );
				exit();
			}else{
				//send email
				$wc_emails = new WC_Emails();
	            $new_account_email = $wc_emails->get_emails();
	            $account_e = $new_account_email["WC_Email_Customer_New_Account"];
	            $account_e->trigger($signup);

				//login
				$login = wp_signon( array('user_login' => $email, 'user_password' => $password, 'remember' => true), false );
				if (is_wp_error( $login ) and $login->errors) {
					wp_send_json( array('error' => true, 'errorMes' => $login->get_error_message()) );
				exit();
				}else{
					wp_send_json( array('success' => true, 'myaccount' => get_permalink( get_option('woocommerce_myaccount_page_id') ) ) );
					exit();
				}
			}
		}
	}