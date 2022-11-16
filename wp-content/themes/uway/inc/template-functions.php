<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Uway
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function uway_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of home-effect to front page.

	if ( is_front_page() ) {
		$classes[] = 'home-effect';
	}

	if ( is_cart() ) {
		$classes[] = 'checkout-page';
	}

	if ( is_account_page() and is_user_logged_in() ) {
		$classes[] = 'logged';
	}

	if ( is_checkout() ) {
		$classes[] = 'checkout-page';
	}

	return $classes;
}
add_filter( 'body_class', 'uway_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function uway_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
	}
}
add_action( 'wp_head', 'uway_pingback_header' );

/**
 * Recursive Menu
 * @param  object $menus     The object menus
 * @param  number $parent_id The level of recursive
 * @param  sting  $char      The specified character of recursive
 */
function recursiveMenu($menus, $parent_id = 0, $char = '') {
    $new = array();
    foreach ($menus as $key => $menu) {
        if ($menu->menu_item_parent == $parent_id) {
        	$menu->children = recursiveMenu($menus, $menu->ID);
        	unset($menus[$key]);
        	$new[] = $menu;
        }
    }
    return $new;
}

/**
 * Get nav menu items by location
 * @param  STRING $location menu location
 * @return OBJECT           list items menu
 */
function get_nav_menu_items_by_location( $location, $args = [] ) {

	// get all locations
	$locations = get_nav_menu_locations();
	if ( ! isset( $locations[$location] ) OR empty( $locations[$location] ) ) {
		return;
	}
	$object = wp_get_nav_menu_object( $locations[$location] );
	$menu_items = wp_get_nav_menu_items( $object->name, $args );

	return $menu_items;
}