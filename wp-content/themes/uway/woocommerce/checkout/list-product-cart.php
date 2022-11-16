<?php
/**
 * Review order table
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/review-order.php.
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
 * @version     3.5.10
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$appointment_check = check_if_cart_has_appointment_item();
?>

<div class="scrollbar-macosx">                   
    <table class="product-review">
        <thead>
            <tr>
            	<?php $name_label = $appointment_check ? 'Booking' : 'Product'; ?>
                <td class="img-prod" colspan="2"><?php _e( $name_label, 'woocommerce' ); ?> (<?php echo count( WC()->cart->get_cart() ); ?>)</td>
                <?php if (!$appointment_check): ?>
					<td class="quality"><?php _e( 'Quantity', 'woocommerce' ); ?></td>
				<?php else :?>
					<td class="quality"><?php _e( 'Details', 'woocommerce' ); ?></td>
                <?php endif ?>                
                <td class="price"><?php _e( 'Price', 'woocommerce' ); ?></td>
            </tr>
        </thead>
        <tbody>
			<?php
				do_action( 'woocommerce_review_order_before_cart_contents' );

				foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
					$_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );

					if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
						?>
						<tr class="<?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?>">
							<?php if (!$appointment_check): ?>
								<td class="img-prod"><img src="<?php echo get_the_post_thumbnail_url( $_product->get_ID(), $size = 'post-thumbnail' ); ?>" alt="<?php echo apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;'; ?>"></td>	
							<?php endif ?>
					        <td class="<?php echo $appointment_check ?'booking-info' : 'name-prod';?>" colspan="2">
					        	<?php echo apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;'; ?>
								<?php $service = wc_get_product($_product->get_variation_id())->get_attributes()['pa_appointment-options']; ?>
								<?php if ($service and 'initial-consultation' == $service): ?>
									<div class="initial-consultation-wrap">
										<p>Please click here to complete this questionnaire at least 1 day before your appointment.</p>
										<a href="https://forms.gle/ZbDfV5fnVHVPGfCHA" target="_blank">https://forms.gle/ZbDfV5fnVHVPGfCHA</a>
									</div>
								<?php endif ?>
				        	</td>
					        <?php if (!$appointment_check): ?>
								<td class="quality"><?php echo apply_filters( 'woocommerce_checkout_cart_item_quantity', sprintf( '%s', $cart_item['quantity'] ), $cart_item, $cart_item_key ); ?></td>
							<?php else :?>
								<td class="details-appointment text-center"></td>		
					        <?php endif ?>
					        <td class="price"><?php echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); ?></td>
						</tr>
						<?php
					}
				}

				do_action( 'woocommerce_review_order_after_cart_contents' );
			?>
		</tbody>
    </table>
</div>
<?php if ( $appointment_check ): ?>
	<?php wc_get_template( 'checkout/terms.php' ); ?>
<?php endif;?>