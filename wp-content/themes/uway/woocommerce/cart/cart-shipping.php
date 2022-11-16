<?php
/**
 * Shipping Methods Display
 *
 * In 2.1 we show methods per package. This allows for multiple methods per order if so desired.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart-shipping.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;

$formatted_destination    = isset( $formatted_destination ) ? $formatted_destination : WC()->countries->get_formatted_address( $package['destination'], ', ' );
$has_calculated_shipping  = ! empty( $has_calculated_shipping );
$show_shipping_calculator = ! empty( $show_shipping_calculator );
$calculator_text          = '';
?>

<div class="fieldset orders-addons" id="shipping_method">
    <div class="radio-style-inline">
    	<?php if ( $available_methods ) : ?>
	        <div class="big-label">Please Choose Your Preferred Shipping Method</div>
	        <p class="form-row">
	        	<?php foreach ( $available_methods as $method ) : ?>
	        		<?php if ( 1 < count( $available_methods ) ): ?>
	        			<?php printf( '<input type="radio" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" %4$s />', $index, esc_attr( sanitize_title( $method->id ) ), esc_attr( $method->id ), checked( $method->id, $chosen_method, false ) ); ?>
	        		<?php else: ?>
	        			<?php printf( '<input type="hidden" name="shipping_method[%1$d]" data-index="%1$d" id="shipping_method_%1$d_%2$s" value="%3$s" class="shipping_method" />', $index, esc_attr( sanitize_title( $method->id ) ), esc_attr( $method->id ) ); ?>
	        		<?php endif; ?>
					
					<?php 
						$label = $method->get_label();
						$total = get_woocommerce_currency_symbol() . $method->cost;
						$sub_label = '';
						if ( 'Standard' == $label ) $sub_label = '2-6 business days';
						if ( 'Express' == $label ) $sub_label = '1-3 business days';
						// $sub_label = 
					 ?>
	        		<?php printf( '<label for="shipping_method_%1$s_%2$s">%3$s <span>%4$s</span> <span>%5$s</span> </label>', $index, esc_attr( sanitize_title( $method->id ) ), $label, $total, $sub_label ); ?>
	            <?php endforeach; ?>
	        </p>

	        <?php if ( is_cart() ) : ?>
				<p class="woocommerce-shipping-destination">
					<?php
					if ( $formatted_destination ) {
						// Translators: $s shipping destination.
						printf( esc_html__( 'Estimate for %s.', 'woocommerce' ) . ' ', '<strong>' . esc_html( $formatted_destination ) . '</strong>' );
						$calculator_text = __( 'Change address', 'woocommerce' );
					} else {
						echo esc_html__( 'This is only an estimate. Prices will be updated during checkout.', 'woocommerce' );
					}
					?>
				</p>
			<?php endif; ?>

		<?php
		elseif ( ! $has_calculated_shipping || ! $formatted_destination ) : ?>
			<div class="big-label"><?php esc_html_e( 'Enter your address to view shipping options.', 'woocommerce' ); ?></div>
		<?php elseif ( ! is_cart() ) : ?>
			<div class="big-label"><?php echo wp_kses_post( apply_filters( 'woocommerce_no_shipping_available_html', __( 'There are no shipping methods available. Please ensure that your address has been entered correctly, or contact us if you need any help.', 'woocommerce' ) ) ); ?></div>
		<?php else : ?>
			<div class="big-label"> <?php echo wp_kses_post( apply_filters( 'woocommerce_cart_no_shipping_available_html', sprintf( esc_html__( 'No shipping options were found for %s.', 'woocommerce' ) . ' ', '<strong>' . esc_html( $formatted_destination ) . '</strong>' ) ) );
			$calculator_text = __( 'Enter a different address', 'woocommerce' ); ?></div>
		<?php endif;
		?>

		<?php if ( $show_package_details ) : ?>
			<?php echo '<p class="woocommerce-shipping-contents"><small>' . esc_html( $package_details ) . '</small></p>'; ?>
		<?php endif; ?>

		<!-- <?php if ( $show_shipping_calculator ) : ?>
			<?php woocommerce_shipping_calculator( $calculator_text ); ?>
		<?php endif; ?> -->

    </div>
</div>
