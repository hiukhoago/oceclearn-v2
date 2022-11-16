<?php
/**
 * WooCommerce Compatibility File
 *
 * @link https://woocommerce.com/
 *
 * @package Uway
 */

/**
 * WooCommerce setup function.
 *
 * @link https://docs.woocommerce.com/document/third-party-custom-theme-compatibility/
 * @link https://github.com/woocommerce/woocommerce/wiki/Enabling-product-gallery-features-(zoom,-swipe,-lightbox)-in-3.0.0
 *
 * @return void
 */
function uway_woocommerce_setup() {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );
}
add_action( 'after_setup_theme', 'uway_woocommerce_setup' );

/**
 * WooCommerce specific scripts & stylesheets.
 *
 * @return void
 */
function uway_woocommerce_scripts() {
	wp_enqueue_style( 'uway-woocommerce-style', get_template_directory_uri() . '/woocommerce.css' );

	$font_path   = WC()->plugin_url() . '/assets/fonts/';
	$inline_font = '@font-face {
			font-family: "star";
			src: url("' . $font_path . 'star.eot");
			src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
				url("' . $font_path . 'star.woff") format("woff"),
				url("' . $font_path . 'star.ttf") format("truetype"),
				url("' . $font_path . 'star.svg#star") format("svg");
			font-weight: normal;
			font-style: normal;
		}';

	wp_add_inline_style( 'uway-woocommerce-style', $inline_font );
}
add_action( 'wp_enqueue_scripts', 'uway_woocommerce_scripts' );

/**
 * Disable the default WooCommerce stylesheet.
 *
 * Removing the default WooCommerce stylesheet and enqueing your own will
 * protect you during WooCommerce core updates.
 *
 * @link https://docs.woocommerce.com/document/disable-the-default-stylesheet/
 */
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

/**
 * Add 'woocommerce-active' class to the body tag.
 *
 * @param  array $classes CSS classes applied to the body tag.
 * @return array $classes modified to include 'woocommerce-active' class.
 */
function uway_woocommerce_active_body_class( $classes ) {
	$classes[] = 'woocommerce-active';

	return $classes;
}
add_filter( 'body_class', 'uway_woocommerce_active_body_class' );

/**
 * Products per page.
 *
 * @return integer number of products.
 */
function uway_woocommerce_products_per_page() {
	return 12;
}
add_filter( 'loop_shop_per_page', 'uway_woocommerce_products_per_page' );

/**
 * Product gallery thumnbail columns.
 *
 * @return integer number of columns.
 */
function uway_woocommerce_thumbnail_columns() {
	return 4;
}
add_filter( 'woocommerce_product_thumbnails_columns', 'uway_woocommerce_thumbnail_columns' );

/**
 * Default loop columns on product archives.
 *
 * @return integer products per row.
 */
function uway_woocommerce_loop_columns() {
	return 3;
}
add_filter( 'loop_shop_columns', 'uway_woocommerce_loop_columns' );

/**
 * Related Products Args.
 *
 * @param array $args related products args.
 * @return array $args related products args.
 */
function uway_woocommerce_related_products_args( $args ) {
	$defaults = array(
		'posts_per_page' => 3,
		'columns'        => 3,
	);

	$args = wp_parse_args( $defaults, $args );

	return $args;
}
add_filter( 'woocommerce_output_related_products_args', 'uway_woocommerce_related_products_args' );

if ( ! function_exists( 'uway_woocommerce_product_columns_wrapper' ) ) {
	/**
	 * Product columns wrapper.
	 *
	 * @return  void
	 */
	function uway_woocommerce_product_columns_wrapper() {
		$columns = uway_woocommerce_loop_columns();
		echo '<div class="columns-' . absint( $columns ) . '">';
	}
}
add_action( 'woocommerce_before_shop_loop', 'uway_woocommerce_product_columns_wrapper', 40 );

if ( ! function_exists( 'uway_woocommerce_product_columns_wrapper_close' ) ) {
	/**
	 * Product columns wrapper close.
	 *
	 * @return  void
	 */
	function uway_woocommerce_product_columns_wrapper_close() {
		echo '</div>';
	}
}
add_action( 'woocommerce_after_shop_loop', 'uway_woocommerce_product_columns_wrapper_close', 40 );

/**
 * Remove default WooCommerce wrapper.
 */
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );

if ( ! function_exists( 'uway_woocommerce_wrapper_before' ) ) {
	/**
	 * Before Content.
	 *
	 * Wraps all WooCommerce content in wrappers which match the theme markup.
	 *
	 * @return void
	 */
	function uway_woocommerce_wrapper_before() {
		?>
		<div id="primary" class="content-area">
			<main id="main" class="site-main" role="main">
			<?php
	}
}
add_action( 'woocommerce_before_main_content', 'uway_woocommerce_wrapper_before' );

if ( ! function_exists( 'uway_woocommerce_wrapper_after' ) ) {
	/**
	 * After Content.
	 *
	 * Closes the wrapping divs.
	 *
	 * @return void
	 */
	function uway_woocommerce_wrapper_after() {
			?>
			</main><!-- #main -->
		</div><!-- #primary -->
		<?php
	}
}
add_action( 'woocommerce_after_main_content', 'uway_woocommerce_wrapper_after' );

/**
 * Sample implementation of the WooCommerce Mini Cart.
 *
 * You can add the WooCommerce Mini Cart to header.php like so ...
 *
	<?php
		if ( function_exists( 'uway_woocommerce_header_cart' ) ) {
			uway_woocommerce_header_cart();
		}
	?>
 */

if ( ! function_exists( 'uway_woocommerce_cart_link_fragment' ) ) {
	/**
	 * Cart Fragments.
	 *
	 * Ensure cart contents update when products are added to the cart via AJAX.
	 *
	 * @param array $fragments Fragments to refresh via AJAX.
	 * @return array Fragments to refresh via AJAX.
	 */
	function uway_woocommerce_cart_link_fragment( $fragments ) {
		ob_start();
		uway_woocommerce_cart_link();
		$fragments['a.cart-contents'] = ob_get_clean();

		// re-render cart items count
		ob_start();
		uway_woocommerce_cart_items_count();
		$fragments['span.render-cart-items-count'] = ob_get_clean();
		
		return $fragments;
	}
}
add_filter( 'woocommerce_add_to_cart_fragments', 'uway_woocommerce_cart_link_fragment' );

if ( ! function_exists( 'uway_woocommerce_cart_link' ) ) {
	/**
	 * Cart Link.
	 *
	 * Displayed a link to the cart including the number of items present and the cart total.
	 *
	 * @return void
	 */
	function uway_woocommerce_cart_link() {
		?>
		<a class="cart-contents" href="<?php echo esc_url( wc_get_cart_url() ); ?>" title="<?php esc_attr_e( 'View your shopping cart', 'uway' ); ?>">
			<?php
			$item_count_text = sprintf(
				/* translators: number of items in the mini cart. */
				_n( '%d item', '%d items', WC()->cart->get_cart_contents_count(), 'uway' ),
				WC()->cart->get_cart_contents_count()
			);
			?>
			<span class="amount"><?php echo wp_kses_data( WC()->cart->get_cart_subtotal() ); ?></span> <span class="count"><?php echo esc_html( $item_count_text ); ?></span>
		</a>
		<?php
	}
}

if ( ! function_exists( 'uway_woocommerce_cart_items_count' )) {
	/**
	 * Cart items count
	 *
	 * Re-render cart items count after update cart
	 * 
	 * @return void
	 */
	function uway_woocommerce_cart_items_count () {
		?>
		<span class="render-cart-items-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
		<?php
	}
}

if ( ! function_exists( 'uway_woocommerce_header_cart' ) ) {
	/**
	 * Display Header Cart.
	 *
	 * @return void
	 */
	function uway_woocommerce_header_cart() {
		if ( is_cart() ) {
			$class = 'current-menu-item';
		} else {
			$class = '';
		}
		?>
		<ul id="site-header-cart" class="site-header-cart">
			<li class="<?php echo esc_attr( $class ); ?>">
				<?php uway_woocommerce_cart_link(); ?>
			</li>
			<li>
				<?php
				$instance = array(
					'title' => '',
				);

				the_widget( 'WC_Widget_Cart', $instance );
				?>
			</li>
		</ul>
		<?php
	}
}

add_filter( 'woocommerce_variable_price_html', 'bbloomer_variation_price_format', 10, 2 );
 
function bbloomer_variation_price_format( $price, $product ) {
 
$min_var_reg_price = $product->get_variation_regular_price( 'min', true );
$min_var_sale_price = $product->get_variation_sale_price( 'min', true );
 
// 2. New $price
 
if ( $min_var_sale_price < $min_var_reg_price ) {
	$price = sprintf( __( '<del>%1$s</del><ins>%2$s</ins>', 'woocommerce' ), wc_price( $min_var_reg_price ), wc_price( $min_var_sale_price ) );
} else {
	$price = sprintf( __( '%1$s', 'woocommerce' ), wc_price( $min_var_reg_price ) );
}
 
// 3. Return edited $price
 
return $price;
}

add_filter ( 'woocommerce_account_menu_items', 'my_account_menu_order' );

function my_account_menu_order() {
 	$menuOrder = array(
 		'edit-account'    	 => __( 'Personal details', 'woocommerce' ),
 		'orders'             => __( 'Order history', 'woocommerce' ),
 		'edit-address'       => __( 'Address book', 'woocommerce' ),
		'customer-logout'    => __( 'Log out', 'woocommerce' )
 	);
 	return $menuOrder;
}

add_action( 'woocommerce_save_account_details', 'woocommerce_save_account_details_custome_fields', 12, 1 );

if ( ! function_exists( 'woocommerce_save_account_details_custome_fields' ) ) {
	function woocommerce_save_account_details_custome_fields( $uid ) {
		if ( isset( $_POST['account_title'] ) ) {
			update_user_meta( $uid, 'account_title', sanitize_text_field( $_POST['account_title'] ) );
		}
	}
}

add_filter('woocommerce_save_account_details_required_fields', 'wc_save_account_details_required_fields' );

if (!function_exists('wc_save_account_details_required_fields')) {
	function wc_save_account_details_required_fields( $required_fields ){
	    unset( $required_fields['account_email'] );
	    return $required_fields;
	}
}

// custome checkout billing form
add_filter( 'woocommerce_checkout_fields', 'custom_override_checkout_fields');
if ( ! function_exists( 'custom_override_checkout_fields' ) ) {
	function custom_override_checkout_fields( $fields ) {

		$fields['billing']['billing_title'] = array(
	        'type'          => 'select',
	        'options'       => array(
	            'mr' => 'Mr',
	            'ms' => 'Ms',
	            'mrs' => 'Mrs',
	            'other' => 'Other'
	        ),
	        'label'     => __('Title', 'woocommerce'),
	        'required'  => false,
	        'class'     => array('form-row form-row-one'),
	        'clear'     => true,
	    );

	    $fields['billing']['billing_first_name']['class'] = array('form-row form-row-two validate-required');
	    $fields['billing']['billing_last_name']['class'] = array('form-row form-row-three validate-required');
	    $fields['billing']['billing_address_2']['label'] = 'Apartment/Unit #';
	    $fields['billing']['billing_address_2']['class'] = array('form-row form-row-last');
	    $fields['billing']['billing_city']['class'] = array('form-row form-row-first');
    	$fields['billing']['billing_state']['class'] = array('form-row form-row-last');
    	$fields['billing']['billing_postcode']['class'] = array('form-row form-row-last');
    	$fields['billing']['billing_phone']['class'] = array('form-row form-row-first');
    	$fields['billing']['billing_email']['class'] = array('form-row form-row-last');

    	$fields['shipping']['shipping_address_2']['label'] = 'Apartment/Unit #';
    	$fields['shipping']['shipping_address_2']['class'] = array('form-row form-row-first');
    	$fields['shipping']['shipping_city']['class'] = array('form-row form-row-last');
    	$fields['shipping']['shipping_postcode']['class'] = array('form-row form-row-first');
    	$fields['shipping']['shipping_state']['class'] = array('form-row form-row-last');

    	$order = array(
    		"billing_title",
	        "billing_first_name",
	        "billing_last_name",
	        "billing_company",
	        "billing_country",
	        "billing_address_1", 
	        "billing_address_2",
	        "billing_city",
	        "billing_state",
	        "billing_postcode",
	        "billing_phone",
	        "billing_email", 
	    );

	    foreach( $order as $field )
	    {
	        $ordered_fields[$field] = $fields["billing"][$field];
	    }

	    $fields["billing"] = $ordered_fields;

	    return $fields;

	}
}

add_filter( 'woocommerce_update_order_review_fragments', 'checkout_form_custome_update');

function checkout_form_custome_update( $fragments ) {
     
    ob_start(); ?>
	<div class="hl_order_shipping_totals">
		<?php wc_cart_totals_shipping_html(); ?>
	</div>
    <?php $woocommerce_shipping_methods = ob_get_clean();
	$fragments['.hl_order_shipping_totals'] = $woocommerce_shipping_methods;
	
	ob_start(); ?>
	<div class="checkout-total-panel">
		<div class="total"><?php echo wc_price(WC()->cart->total);?></div>
		<?php $total_items = WC()->cart->cart_contents_count; ?>
		<label for="show-bag-checkout" class="items"><?php printf(($total_items<=1?"%d item":"%d items"), $total_items); ?></label>
	</div>
    <?php $woocommerce_total_prices = ob_get_clean();
    $fragments['.checkout-total-panel'] = $woocommerce_total_prices;
    
    return $fragments;
}


function is_woocommerce_page () {
    if( function_exists ( "is_woocommerce" ) && is_woocommerce()){
        return true;
    }
    $woocommerce_keys = array ( "woocommerce_shop_page_id" ,
        // "woocommerce_terms_page_id" ,
        "woocommerce_cart_page_id" ,
        "woocommerce_checkout_page_id" ,
        "woocommerce_pay_page_id" ,
        "woocommerce_thanks_page_id" ,
        "woocommerce_myaccount_page_id" ,
        "woocommerce_edit_address_page_id" ,
        "woocommerce_view_order_page_id" ,
        "woocommerce_change_password_page_id" ,
        "woocommerce_logout_page_id" ,
        "woocommerce_lost_password_page_id" ) ;

    foreach ( $woocommerce_keys as $wc_page_id ) {
        if ( get_the_ID () == get_option ( $wc_page_id , 0 ) ) {
            return true ;
        }
    }
    return false;
}

add_filter( 'woocommerce_helper_suppress_admin_notices', '__return_true' );

add_filter( 'filter_appointment_variation', 'appointment_variation' );
function appointment_variation($variations) {
	$appointment = array();
	foreach ($variations as $key => $var) {
		foreach ($var['attributes'] as $attr => $val) {
			$tax = str_replace('attribute_', '', $attr );
			$term = get_term_by( 'slug', $val, $tax );
			$appointment[$key] = array(
				'title'       => $term->name,
				'slug'        => $term->slug,
				'description' => $term->description,
				'cost'		  => $var['display_price'],
				'time'		  => get_field( 'time', $term ),
				'id'		  => $var['variation_id'],
			);
		}
	}
	$toJson = json_encode($appointment, JSON_FORCE_OBJECT);
	return $toJson;
}

class add_more_to_cart {

    private $prevent_redirect = false; //used to prevent WC from redirecting if we have more to process

    function __construct() {
        if ( ! isset( $_REQUEST[ 'add-more-to-cart' ] ) ) return; //don't load if we don't have to
        $this->prevent_redirect = 'no'; //prevent WC from redirecting so we can process additional items
        add_action( 'wp_loaded', [ $this, 'add_more_to_cart' ], 21 ); //fire after WC does, so we just process extra ones
		add_action( 'pre_option_woocommerce_cart_redirect_after_add', [ $this, 'intercept_option' ], 9000 ); //intercept the WC option to force no redirect
    }

    function intercept_option() {
        return $this->prevent_redirect;
    }

    function add_more_to_cart() {
        $product_ids = explode( ',', $_REQUEST['add-more-to-cart'] );
        $count       = count( $product_ids );
        $number      = 0;

        foreach ( $product_ids as $product_id ) {
            if ( ++$number === $count ) $this->prevent_redirect = false; //this is the last one, so let WC redirect if it wants to.
            $_REQUEST['add-to-cart'] = $product_id; //set the next product id
            WC_Form_Handler::add_to_cart_action(); //let WC run its own code
		}

		wc_clear_notices(); 
		wp_redirect( preg_replace("/\?.*$/","",$_SERVER["REQUEST_URI"]));
		exit;

    }
}
new add_more_to_cart;

/**
 * Remove shipping if product type is appointment
 */
add_filter( 'woocommerce_package_rates', 'remove_shipping_when_checkout_appointment', 10, 2 );
function remove_shipping_when_checkout_appointment($rates, $package)
{
	$found = false;

	foreach ($package['contents'] as $cart_item) {
		if (!has_term( 'appointment', 'product_cat', $cart_item['product_id'] ))
			continue;
		foreach ($appointment_type as $term) {
			if ('appointment' == $term->slug) {
				$found = true;
	 			break;
			}
		}
	}

	if ($found) {
		foreach ($rates as $rate_id => $rate) {
	 		unset($rates[$rate_id]);
		} 	
	} 
	return $rates;
}

add_filter( 'woocommerce_cart_needs_shipping', 'appointment_remove_choose_shipping_method' );
function appointment_remove_choose_shipping_method($needs_shipping)
{	
	if ( check_if_cart_has_appointment_item() ) {
		$needs_shipping = false;
	}
	return $needs_shipping;
}

/**
 * Appointment custom save order
 */
add_action( 'woocommerce_checkout_update_order_meta', 'custom_appointment_before_save_order', 10, 2 );
//add_action( 'woocommerce_checkout_create_order', 'custom_appointment_before_save_order', 10, 2 );
function custom_appointment_before_save_order($order_id, $data)
{	
	global $wpdb;
	$order = wc_get_order($order_id);

	foreach ( $order->get_items() as $item_id => $item ) {
		$variations = wc_get_product($item->get_variation_id());
		if (has_term( 'appointment', 'product_cat', $item->get_product_id() )) {
			// check if staff busy during time bofore
			do_action( 'appointment_validation_before_save', $item->get_product_id(), $data );
			
			// Add order meta field if has product appointment
			$order->update_meta_data( '_appointment_order_type', 1 );
			$add_appointment = wp_insert_post( array(
				'post_title'  => 'Appointment#' . date('His'),
				'post_status' => 'publish',
				'post_type'   => 'appointment'
			) );
			if ($add_appointment) {
				// -- Schedule
				$employee_id = $item->get_product_id();

				$service  	 = wc_get_product($item->get_variation_id())->get_attributes()['pa_appointment-options'];
				$service_id  = get_term_by('slug', $service, 'pa_appointment-options')->term_id;
				
				$method      = $data['appointment_method'];
				$date        = $data['appointment_booking_date'];
				$time_start  = $data['appointment_time_start'];
				$time_end    = $data['appointment_time_end'];
				// -- Customer Information
				$customer_name     = $order->get_billing_first_name() . ' ' . $order->get_billing_last_name();
				$customer_company  = $order->get_billing_company();
				$customer_address  = $order->get_billing_address_1();
				$customer_address2 = $order->get_billing_address_2();
				$customer_city     = $order->get_billing_city();
				$customer_state    = $order->get_billing_state();
				$customer_postcode = $order->get_billing_postcode();
				$customer_country  = $order->get_billing_country();
				$customer_email    = $order->get_billing_email();
				$customer_phone    = $order->get_billing_phone();

				update_post_meta($order->ID, 'appointment_id', $add_appointment);

				$insert_acf  = $wpdb->query(
					"INSERT INTO {$wpdb->prefix}postmeta (post_id, meta_key, meta_value)
					 VALUES 
					 	-- Schedule
				 		($add_appointment, 'employee', $employee_id), ($add_appointment, '_employee', 'field_5d230f4fb3db9'), 
				 		($add_appointment, 'service', $service_id), ($add_appointment, '_service', 'field_5d230f66b3dbb'),
				 		($add_appointment, 'method', '$method'), ($add_appointment, '_method', 'field_5d25bcb7c3c0c'),
				 		($add_appointment, 'booking_date', '$date'), ($add_appointment, '_booking_date', 'field_5d230f70b3dbc'),
				 		($add_appointment, 'time_start', '$time_start'), ($add_appointment, '_time_start', 'field_5d230f84b3dbd'),
				 		($add_appointment, 'time_end', '$time_end'), ($add_appointment, '_time_end', 'field_5d230f8eb3dbe'),
				 		($add_appointment, 'status', 'pending'), ($add_appointment, '_status', 'field_5d2d4c38c2540'),
				 		-- Customer Information
				 		($add_appointment, 'customer_name', '$customer_name'), ($add_appointment, '_customer_name', 'field_5d26b81450673'),
				 		($add_appointment, 'customer_company', '$customer_company'), ($add_appointment, '_customer_company', 'field_5d26b82350674'),
				 		($add_appointment, 'customer_address', '$customer_address'), ($add_appointment, '_customer_address', 'field_5d26b82f50675'),
				 		($add_appointment, 'customer_address2', '$customer_address2'), ($add_appointment, '_customer_address2', 'field_5d26b83850676'),
				 		($add_appointment, 'customer_city', '$customer_city'), ($add_appointment, '_customer_city', 'field_5d26b84750678'),
				 		($add_appointment, 'customer_state', '$customer_state'), ($add_appointment, '_customer_state', 'field_5d26b8575067a'),
				 		($add_appointment, 'customer_postcode', '$customer_postcode'), ($add_appointment, '_customer_postcode', 'field_5d26b8ac5067c'),
				 		($add_appointment, 'customer_country', '$customer_country'), ($add_appointment, '_customer_country', 'field_5d26b8b75067d'),
				 		($add_appointment, 'customer_email', '$customer_email'), ($add_appointment, '_customer_email', 'field_5d26b8c45067e'),
				 		($add_appointment, 'customer_phone', '$customer_phone'), ($add_appointment, '_customer_phone', 'field_5d26b8d350680')
					"
				);
			}
			break;
		}
		
	}
}

/**
 * Add custom fields data for appointment checkout
 */
add_filter( 'woocommerce_checkout_posted_data', 'add_custom_fields_data_for_appointment_checkout' );
function add_custom_fields_data_for_appointment_checkout($data)
{	
	if ( check_if_cart_has_appointment_item() ) {
		// add meta data
		$data['appointment_method']       = $_POST['appointment_method'] ?? null;
		$data['appointment_booking_date'] = $_POST['appointment_booking_date'] ?? null;
		$data['appointment_time_start']   = $_POST['appointment_time_start'] ?? null;
		$data['appointment_time_end']     = $_POST['appointment_time_end'] ?? null;
	}
	
	return $data;
}

/**
 * Hide order appointment
 */
add_filter( 'pre_get_posts', 'custom_hide_order_appointment' );
function custom_hide_order_appointment( $query )
{
	global $pagenow, $post_type;
	if ($query->is_admin and 'edit.php' === $pagenow and 'shop_order' === $post_type) {
		$query->set( 'meta_query', array(
			array(
				'key'     => '_appointment_order_type',
				'value'   => 1,
				'compare' => 'NOT EXISTS',
			)
		) );
	}
}

/**
 * re-count orders status
 */
add_filter( 'views_edit-shop_order', 'ven_re_count_orders_status_hook' );
function ven_re_count_orders_status_hook ($views) {
	global $current_user, $wp_query;
	foreach ( $views as $status => $view ) {
        $query = array(
			'post_type'   => 'shop_order',
			'post_status' => $status
        );
        if ($status == 'mine') {
        	$query['author'] = $current_user->ID;
        }
        $result = new WP_Query( $query );
		$views[$status] = sprintf(
			__('<a href="%s" %s>%s <span class="count">(%d)</span></a>', $status),
        	simplexml_load_string($view)->xpath("//@href")[0],
        	$wp_query->query_vars['post_status'] == $status ? 'class="current"' : '',
        	preg_replace('/[^a-zA-Z]/', '', wp_strip_all_tags( $view )),
        	$result->found_posts
		);
    }
	
	return $views;
}

add_action( 'admin_menu', 'customize_post_admin_submenu_labels', 99 );
function customize_post_admin_submenu_labels () {
	global $menu;
	global $submenu;
	if (isset($submenu['woocommerce'])) {
		unset( $submenu['woocommerce'][0] );
		foreach ( $submenu['woocommerce'] as $key => $menu_item ) {
			if ( 0 === strpos( $menu_item[0], _x( 'Orders', 'Admin menu name', 'woocommerce' ) ) ) {
				$processing_count = new WP_Query( array(
					'post_type'      => 'shop_order',
					'post_status'    => 'wc-processing',
					'posts_per_page' => -1,
					'meta_query'     => array(
			 			array(
							'key'     => '_appointment_order_type',
							'value'   => 1,
							'compare' => 'NOT EXISTS',
			 			)
			 		),
				) );
				$submenu['woocommerce'][ $key ][0] = ' ';
				$submenu['woocommerce'][ $key ][0] .= 'Orders <span class="awaiting-mod update-plugins count-'.$processing_count->found_posts.'"><span class="processing-count">'.$processing_count->found_posts.'</span></span>';
			}
		}
	}
}

/**
 * Remove Woocommerce Deposits hook
 */
remove_action( 'woocommerce_after_dashboard_status_widget', 'wcdp_status_widget_partially_paid' );

/**
 * Dashboard - Custom Woocommerce Dashboard Order Status Widget
 */
add_action( 'woocommerce_after_dashboard_status_widget', 'custom_woocommerce_dashboard_order_status_callback' );
function custom_woocommerce_dashboard_order_status_callback() {
	if (!current_user_can( 'edit_shop_orders' ))
		return;

	$processing_count = new WP_Query( array(
		'post_type'      => 'shop_order',
		'post_status'    => 'wc-processing',
		'posts_per_page' => -1,
		'meta_query'     => array(
 			array(
				'key'     => '_appointment_order_type',
				'value'   => 1,
				'compare' => 'NOT EXISTS',
 			)
 		),
	) );
	$processing_count = $processing_count->have_posts() ? $processing_count->found_posts : 0;
	ob_start(); ?>
	<a href="<?php echo esc_url( admin_url( 'edit.php?post_status=wc-processing&post_type=shop_order' ) ); ?>">
    <?php
        printf(
            /* translators: %s: order count */
            _n( '<strong>%s order</strong> awaiting processing', '<strong>%s orders</strong> awaiting processing', $processing_count, 'woocommerce' ),
            $processing_count
        ); // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped
    ?>
    </a>
    <?php $processing_html = ob_get_clean(); ?>
	<script type="text/javascript">
		var $processing_html = `<?php echo $processing_html; ?>`;
		jQuery('ul.wc_status_list').find('li.processing-orders').html($processing_html);
	</script>
	<?php
	$partially_paid = new WP_Query( array(
		'post_type'      => 'shop_order',
		'post_status'    => 'wc-partially-paid',
		'posts_per_page' => -1,
		'meta_query'     => array(
 			array(
				'key'     => '_appointment_order_type',
				'value'   => 1,
				'compare' => 'NOT EXISTS',
 			)
 		),
	) );
	$partially_paid_count = $partially_paid->have_posts() ? $partially_paid->found_posts : 0;
	?>
	<li class="partially-paid-orders">
        <a href="<?php echo admin_url( 'edit.php?post_status=wc-partially-paid&post_type=shop_order' ); ?>">
            <?php
            printf(
                _n( '<strong>%s order</strong> partially paid', '<strong>%s orders</strong> partially paid', $partially_paid_count, 'woocommerce-deposits' ),
                $partially_paid_count
            );
            ?>
        </a>
    </li>
    <style>
        #woocommerce_dashboard_status .wc_status_list li.partially-paid-orders a::before {
            content: '\e011';
            color: #ffba00;
    </style>
	<?php
}

/**
 * Change email subject of appointment order
 */
add_filter( 'woocommerce_email_subject_customer_processing_order', 'customizing_processing_email_subject', 10, 2 );
function customizing_processing_email_subject( $subject, $order ){
	if ( check_if_order_has_appointment_item($order) ) {

		$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);

		$subject = sprintf( 'Your %s booking has been received!', $blogname );
	}
	return $subject;
}

add_filter( 'woocommerce_email_subject_failed_order', 'customizing_failed_email_subject', 10, 2 );
function customizing_failed_email_subject( $subject, $order ){
	if ( check_if_order_has_appointment_item($order) ) {

		$blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);

		$subject = sprintf( '[%s]: Booking #%s has failed!', $blogname, $order->get_order_number() );
	}
	return $subject;
} 

add_action( 'init', 'remove_print_notices_in_checkout_page' );
function remove_print_notices_in_checkout_page() {
	// remove hook print notices
	remove_action( 'woocommerce_before_checkout_form_cart_notices', 'woocommerce_output_all_notices', 10 );
}

/*Cancellation Policy*/
add_action( 'ven_custom_email_cancellation_policy', 'ven_custom_email_cancellation_policy_hook', 10 );
function ven_custom_email_cancellation_policy_hook($order) {
	wc_get_template( 'emails/email-cancellation-policy.php', array('order' => $order) );
}