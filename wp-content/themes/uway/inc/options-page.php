<?php

$options = acf_add_options_page( array(
	'page_title'	=> 'Page Options',
	'redirect'	=> true
));

acf_add_options_sub_page( array(
	'page_title'	=> 'Setup',
	'parent_slug'	=> $options['menu_slug']
));

add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');

function my_acf_google_map_api( $api ){
    $api['key'] = 'AIzaSyAaOFV_u-6HaUILSUUsrvzGUPHz0r8Vfic';
    
    return $api;
}

/**
 * Re-render acf taxonomy fields
 */
add_filter( 'acf/field_wrapper_attributes', 'customizer_acf_taxonomy_before_render', $priority = 10, $accepted_args = 2 );
function customizer_acf_taxonomy_before_render( $wrapper, $field ) {
    global $post;

    if ( !is_admin() and $post->post_type !== 'appointment' ) {
        return $wrapper;
    }

    // only package field
    if ( $field['key'] != 'field_5d230f66b3dbb' ) {
        return $wrapper;
    }

    $packages = get_terms( $field['taxonomy'], array(
        'hide_empty' => false
    ) );

    $attributes = array();

    if ( $packages ) {
        foreach ( $packages as $key => $package ) {
            $attributes[$key] = array(
                'id' => $package->term_id,
                'name' => $package->name,
                'slug' => $package->slug,
                'time' => preg_replace( '/[^0-9\.]/', '', get_field( 'time', 'term_' . $package->term_id ) ),
            );
        }
    }

    $wrapper['data-attributes'] = json_encode( $attributes );

    return $wrapper;
}