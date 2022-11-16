<?php
/**
 * Thankyou page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/thankyou.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="payment-success spacing-header spacing-around">
	<?php if ( $order ) : ?>

		<?php if ( $order->has_status( 'failed' ) ) : ?>
			<h1 class="title-product text-center mb-30">Payment failed !<br>Your order has failed. Please contact the administrator for more details.</h1>
		    <div class="text-center"><a class="btn-black" href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">CONTINUE SHOPPING</a></div>
		<?php else : ?>

			<?php 
				// auto completed order if product type is virtual
				$items = $order->get_items();
				$check = 0;
				$check_appointment = false;
				if ( $items ) {
					foreach ( $items as $item ) {
						if ( '0' != $item['variation_id'] ) {
							$_product = wc_get_product( $item['variation_id'] );
						} else {
							$_product = wc_get_product( $item[ 'product_id' ] );
						}

						if (has_term( 'appointment', 'product_cat', $item['product_id'] )) {
							$check_appointment = true;
						}

						if ( ! $_product->is_virtual() ) {
							$check++;
						}
					}
				}
				if ( $check == 0 and !$check_appointment ) {
					$order->update_status( 'completed' );
				}
			?>

			<?php if($check > 0): ?>
				<h1 class="title-product text-center mb-30">Payment success !<br>Thank you for shopping with us.</h1>
				<p class="text-center mb-45">An order confirmation email will be sent to you shortly.</p>
				<div class="text-center"><a class="btn-black" href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">CONTINUE SHOPPING</a></div>
			<?php else: ?>
				<h1 class="title-product text-center mb-30">Payment success !<br>Thanks for your purchase.</h1>
				<p class="text-center mb-45">Visit the <b>Health Hub</b> now.</p>
				<div class="text-center"><a class="btn-black" href="<?php echo site_url()."/health-hub"; ?>">Go Health Hub</a></div>
			<?php endif; ?>
		<?php endif; ?>

	<?php endif; ?>
</div>
