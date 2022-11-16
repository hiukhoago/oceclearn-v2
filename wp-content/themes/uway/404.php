<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Uway
 */

get_header();
?>

	<div class="bg-skin mh-100vh spacing-checkout" id="wrap-page">
		<div class="payment-success spacing-header spacing-around">
			<h1 class="title-product text-center mb-30"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'uway' ); ?></h1>
			<p class="text-center mb-45"><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'uway' ); ?></p>
			<div class="text-center"><a class="btn-black" href="<?php echo site_url(); ?>">BACK HOME</a></div>
		</div>
	</div>

<?php
get_footer();
