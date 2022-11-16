<?php
/**
 * Gravity Forms anchor - disable auto scrolling of forms
 */

add_filter('gform_confirmation_anchor', '__return_false');

/**
 * CHANGE SPINER LOADING
 */
function htl_custom_gforms_spinner( $src ) {
	return get_template_directory_uri().'/html/src/img/loading.svg';
}
add_filter( 'gform_ajax_spinner_url', 'htl_custom_gforms_spinner' );