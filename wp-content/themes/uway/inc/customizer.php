<?php
/**
 * Uway Theme Customizer
 *
 * @package Uway
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function uway_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial( 'blogname', array(
			'selector'        => '.site-title a',
			'render_callback' => 'uway_customize_partial_blogname',
		) );
		$wp_customize->selective_refresh->add_partial( 'blogdescription', array(
			'selector'        => '.site-description',
			'render_callback' => 'uway_customize_partial_blogdescription',
		) );
	}
}
add_action( 'customize_register', 'uway_customize_register' );

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function uway_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function uway_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function uway_customize_preview_js() {
	wp_enqueue_script( 'uway-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', 'uway_customize_preview_js' );

/**
 * Trim zeros in price decimals
 **/
add_filter( 'woocommerce_price_trim_zeros', '__return_true' );


/**
 * EIDT LOGIN PAGE
 */

function my_login_stylesheet() {
	wp_enqueue_style( 'custom-login', get_template_directory_uri().'/html/src/scss/style-login.css' );
	// wp_enqueue_script( 'custom-login', get_stylesheet_directory_uri() . '/style-login.js' );
}
add_action( 'login_enqueue_scripts', 'my_login_stylesheet' );

/**
 * Replace Taxomony Description Field with Visual/WYSIWYG Editor
 */
add_action('product_health_edit_form_fields', 'uway_replace_taxonomy_description', 10, 2);
if (!function_exists('uway_replace_taxonomy_description')) {
	function uway_replace_taxonomy_description($term, $taxonomy) {
		?>
		<script type="text/javascript">
			jQuery(document).ready(function($) {
				$('label[for=description]').parent().parent().remove();
			});
		</script>
		<tr class="form-field term-description-wrap">
			<th scope="row">
				<label for="description-editor">Description</label>
			</th>
			<td>
				<?php wp_editor(html_entity_decode($term->description), 'description', array()); ?>
			</td>
		</tr>
		<?php
	}
}