<?php
/**
 * Checkout terms and conditions area.
 *
 * @package WooCommerce/Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

if ( check_if_cart_has_appointment_item() ) {
	$term_id = get_field('appointment_cancellation_policy','option');
}
else {
	$term_id = get_field('default_term_condition','option');
}
$terms_page_id = $term_id; 
?>
<!-- $terms_page_id = wc_get_page_id( 'terms' );  -->
<?php /* if ( $terms_page_id > 0 && apply_filters( 'woocommerce_checkout_show_terms', true ) ):  */ ?>
<?php if ( $terms_page_id > 0 ): ?>
	
	<?php 
		$terms         = get_post( $terms_page_id );
		$terms_content = has_shortcode( $terms->post_content, 'woocommerce_checkout' ) ? '' : wc_format_content( $terms->post_content );
	?>

	<?php if ( $terms_content ): ?>
		<?php 
			do_action( 'woocommerce_checkout_before_terms_and_conditions' );
			echo '<div class="woocommerce-terms-and-conditions" style="display: none; max-height: 200px; overflow: auto;">' . $terms_content . '</div>';
		 ?>
	<?php endif; ?>

	<p class="form-row terms wc-terms-and-conditions">
		<input type="checkbox" class="woocommerce-form__input woocommerce-form__input-checkbox input-checkbox" name="terms" <?php checked( apply_filters( 'woocommerce_terms_is_checked_default', isset( $_POST['terms'] ) ), true ); ?> id="terms" /> 
		<label for="terms" class="woocommerce-form__label woocommerce-form__label-for-checkbox checkbox"></label>
		<?php if ( check_if_cart_has_appointment_item() ) : ?>
			<span><?php printf( __( 'I have read and understood the <a href="#" class="pop-up-window">Cancellation Policy.</a>', 'woocommerce' ), esc_url( wc_get_page_permalink( 'terms' ) ) ); ?></span><span class="required">*</span>
		<?php else: ?> 
			<span><?php printf( __( 'I&rsquo;ve read and accept the <a href="%s" target="_blank" class="woocommerce-terms-and-conditions-link">terms &amp; conditions</a>', 'woocommerce' ), esc_url( wc_get_page_permalink( 'terms' ) ) ); ?></span> <span class="required">*</span>
		<?php endif; ?>
		<input type="hidden" name="terms-field" value="1" />
	</p>
	
	<?php do_action( 'woocommerce_checkout_after_terms_and_conditions' ); ?>

<?php endif; ?>
