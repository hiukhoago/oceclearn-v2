<?php
/**
 * Uway functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Uway
 */

/* AUTOMATIC COMPLETE ORDER STATUS was really add here: thankyou.php:49 */

if ( ! function_exists( 'uway_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function uway_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Uway, use a find and replace
		 * to change 'uway' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'uway', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', 'uway' ),
			'header-left' => esc_html__( 'Header Left', 'uway' ),
			'header-right' => esc_html__( 'Header Right', 'uway' ),
			'sub_menu' => true,
			'show_parent' => true
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'uway_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'uway_setup' );


/**
 * Init session
 */
function register_my_session() {
	if( !session_id() ) session_start();
}
add_action('init', 'register_my_session');
	
/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function uway_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'uway_content_width', 640 );
}
add_action( 'after_setup_theme', 'uway_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function uway_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'uway' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'uway' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'uway_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function uway_scripts() {
	wp_enqueue_style( 'uway-style', get_stylesheet_uri() );

	wp_enqueue_script( 'uway-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );

	wp_enqueue_script( 'uway-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );

	wp_enqueue_script( 'ajax_init', get_template_directory_uri() . '/js/ajax_init.js', '', '', true );
	wp_localize_script( 'ajax_init', 'ajax_object', array( 
		'admin_url' => admin_url( 'admin-ajax.php' ), 
		'home' => home_url(), 
		'site_url' => site_url(),
		'rest_url' => rest_url(),
		'fb_app_id' => get_field( 'facebook_id', 'options' ),
		'is_health_hub' => is_page('the-cleanse'),
		'is_checkout' => is_checkout(),
		'myaccount_url' => get_permalink( get_option('woocommerce_myaccount_page_id') ),
		'coupon_security' => wp_create_nonce( 'apply-coupon', 'security' ),
		'not_appointment' => is_page( 'appointments' )
	) );

	wp_enqueue_script( 
		'booking-appointment', 
		get_template_directory_uri() . '/js/booking-appointment.js', 
		array(), current_time( 'timestamp' ), 
		$in_footer = true 
	);
	wp_localize_script( 'booking-appointment', 'params', array(
		'rest' => rest_url(),
		'ajax' => admin_url( 'admin-ajax.php' ),
	) );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'uway_scripts' );

add_action( 'admin_enqueue_scripts', 'customize_admin_enqueue_scripts' );
function customize_admin_enqueue_scripts( $hook  ) {
	if ( 'post.php' != $hook ) {
		return;
	}

	wp_enqueue_script( 'admin-scripts', get_template_directory_uri() . '/js/admin/admin-scripts.js', array( 'jquery' ), $ver = false, $in_footer = true );
}

add_action( 'wp', 'custom_wp_redirect' );
if ( !function_exists('custom_wp_redirect')) {
	function custom_wp_redirect() {
		if (!class_exists('WooCommerce')) {
    		return;
    	}
        $woo_endpoint = new WC_Query;
        $woo_endpoint = $woo_endpoint->get_current_endpoint();

        if ( is_user_logged_in() and is_account_page() and null == $woo_endpoint ) {
            wp_safe_redirect( wc_get_endpoint_url('edit-account') ); exit();
        }
	}
}

/**
 * Check if order has appointment item
 */
if (!function_exists('check_if_order_has_appointment_item')) {
	function check_if_order_has_appointment_item( $order ) {
		foreach ( $order->get_items() as $item_id => $item ) {
			if ( has_term( 'appointment', 'product_cat', $item->get_product_id() ) ) {
				return true;
				break;
			}
		}

		return false;
	}
}

/**
 * Check if cart has appointment item
 */
if (!function_exists('check_if_cart_has_appointment_item')) {
    function check_if_cart_has_appointment_item( $check = false )
    {   
    	if ( is_admin() ) {
    		return; 
    	}
    	
    	if ( ! WC()->cart->is_empty() ) {
            foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                if (has_term( 'appointment', 'product_cat', $cart_item['product_id'] )) {
                    $check = true;
                    break;
                }
            }
            return $check;
        }
        return $check;
    }
}

if ( ! function_exists( 'is_processing_order' ) ) {
	function is_processing_order( array $itemID, bool $key ) {

		if ( ! is_user_logged_in() ) {
			return $key = false;
		}

		$customer_orders = get_posts( array(
	        'numberposts' => -1,
	        'meta_key'    => '_customer_user',
	        'meta_value'  => get_current_user_id(),
	        'post_type'   => 'shop_order', // WC orders post type
	        'post_status' => array( 'wc-processing' ) // Only orders with status "completed"
	    ) );

	    foreach ( $customer_orders as $customer_order ) {
	    	$order = wc_get_order( $customer_order );

	    	foreach ( $order->get_items() as $item ) {
                $product_id = $item->get_product_id();
	            // Your condition related to your 2 specific products Ids
	            if ( in_array( $product_id, $itemID ) ) 
	                $key = true;
	        }
	    }

	    return $key;
	}
}

if ( ! function_exists( 'has_bought_items' ) ) {
	function has_bought_items( array $itemID, $key = false ) {

		if ( ! is_user_logged_in() )
			__return_false();

		$customer_orders = get_posts( array(
	        'numberposts' => -1,
	        'meta_key'    => '_customer_user',
	        'meta_value'  => get_current_user_id(),
	        'post_type'   => 'shop_order', // WC orders post type
	        'post_status' => array( /*'wc-processing',*/ 'wc-completed' ) // Only orders with status "completed"
	    ) );

	    foreach ( $customer_orders as $customer_order ) {
	    	$order = wc_get_order( $customer_order );

	    	foreach ( $order->get_items() as $item ) {
                $product_id = $item->get_product_id();
	            // Your condition related to your 2 specific products Ids
	            if ( in_array( $product_id, $itemID ) ) 
	                $key = true;
	           	break;
	        }
	    }

	    return $key;
	}
}

if ( ! function_exists( 'matched_cart_items' ) ) {
	function matched_cart_items( int $pid, bool $check = false ) {
		if ( ! WC()->cart->is_empty() ) {

			foreach ( WC()->cart->get_cart() as $cart_item ) {
				$cart_item_id = $cart_item[ 'product_id' ];

				if ( $pid == $cart_item_id ) {
					$check = true;
				}
			}

			return $check;
		}
	}
}

if ( ! function_exists( 'has_health_programs_in_cart' ) ) {
	function has_health_programs_in_cart( bool $check = false ) {
		if ( ! WC()->cart->is_empty() ) {
			foreach ( WC()->cart->get_cart() as $item ) {
				$item_id = $item[ 'product_id' ];

				if ( get_the_terms( $item_id, 'product_health' ) ) {
                    return $check = true;
                }
			}
			return $check;
		}
	}
}

function _to_minutes($time) {
	if (!$time)
		return;
	$time = explode(':', $time);

	$minutes = ((int) $time[0] * 60) + (int) $time[1];
	return $minutes;
}

function cc_mime_types($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  return $mimes;
}
add_filter('upload_mimes', 'cc_mime_types');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/manh-custom.php';

/**
 * Appointment additions
 */
require get_template_directory() . '/inc/appointment.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load WooCommerce compatibility file.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/inc/woocommerce.php';
}

/**
 * Register post type
 */
require get_template_directory() . '/inc/register-post-type.php';

require get_template_directory() . '/inc/options-page.php';

require get_template_directory() . '/inc/handle-ajax.php';

require get_template_directory() . '/inc/register-json-handle.php';

require get_template_directory() . '/inc/backup-pluginname.php';
