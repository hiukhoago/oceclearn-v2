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
 * @version     3.3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<table class="shop_table woocommerce-checkout-review-order-table">
	<tbody>
		<?php if (wc_coupons_enabled() ): ?>
			<tr class="coupon-code">
				<td colspan="3">
					<form class="form-coupon checkout_coupon woocommerce-form-coupon-edit" method="post" data-url="<?php echo site_url(); ?>">
						<?php wp_nonce_field('apply-coupon', 'coupon_code_secutity_code', false, true ); ?>
						<input type="text" name="coupon_code" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" id="coupon_code_edit" value="" />
						<button type="submit" class="button" id="btn_coupon_code_edit" name="apply_coupon" value="<?php esc_attr_e( 'Apply', 'woocommerce' ); ?>"><?php esc_html_e( 'Apply', 'woocommerce' ); ?></button>
					</form>
					<div id="coupon-msg-ajax"></div>
					<script>document.getElementById("coupon-msg-ajax").innerHTML=sessionStorage.getItem("coupon_msg_ajax");</script>
				</td>
			</tr>
		<?php endif; ?>
	</tbody>
	<tfoot>

		<tr class="cart-subtotal">
			<th><?php _e( 'Subtotal', 'woocommerce' ); ?></th>
			<td><?php wc_cart_totals_subtotal_html(); ?></td>
		</tr>

		<tr class="fee">
			<?php 	
				$chosen_methods = WC()->session->get( 'chosen_shipping_methods' );
				if($chosen_methods[0]!=""){
					$chosen_shipping_id = $chosen_methods[0];
					$packages = WC()->shipping->get_packages();
					foreach ( $packages as $i => $package ) {
						if ( isset( $package['rates'] ) && isset( $package['rates'][ $chosen_shipping_id ] ) ) {
							$chosen_methods = $package['rates'][ $chosen_shipping_id ];
							break;
						}
					}
				}
				else{
					unset($chosen_methods);
				}
			?>
			<?php if(isset($chosen_methods) && gettype($chosen_methods) != "array"): ?>
				<th><?php echo $chosen_methods->get_label(); ?></th>
				<td><?php echo wc_price($chosen_methods->get_cost()); ?></td>
			<?php endif; ?>
		</tr>

		<?php foreach ( WC()->cart->get_coupons() as $code => $coupon ) : ?>
			<tr class="fee cart-discount coupon-<?php echo esc_attr( sanitize_title( $code ) ); ?>">
				<th><?php wc_cart_totals_coupon_label( $coupon ); ?></th>
				<td><?php wc_cart_totals_coupon_html( $coupon ); ?></td>
			</tr>
		<?php endforeach; ?>

		<?php foreach ( WC()->cart->get_fees() as $fee ) : ?>
			<tr class="fee">
				<th><?php echo esc_html( $fee->name ); ?></th>
				<td><?php wc_cart_totals_fee_html( $fee ); ?></td>
			</tr>
		<?php endforeach; ?>

		<?php if ( wc_tax_enabled() && ! WC()->cart->display_prices_including_tax() ) : ?>
			<?php if ( 'itemized' === get_option( 'woocommerce_tax_total_display' ) ) : ?>
				<?php foreach ( WC()->cart->get_tax_totals() as $code => $tax ) : ?>
					<tr class="fee tax-rate tax-rate-<?php echo sanitize_title( $code ); ?>">
						<th><?php echo esc_html( $tax->label ); ?></th>
						<td><?php echo wp_kses_post( $tax->formatted_amount ); ?></td>
					</tr>
				<?php endforeach; ?>
			<?php else : ?>
				<tr class="tax-total">
					<th><?php echo esc_html( WC()->countries->tax_or_vat() ); ?></th>
					<td><?php wc_cart_totals_taxes_total_html(); ?></td>
				</tr>
			<?php endif; ?>
		<?php endif; ?>

		<?php do_action( 'woocommerce_review_order_before_order_total' ); ?>

		<tr class="order-total">
			<th><?php _e( 'Total', 'woocommerce' ); ?></th>
			<td><?php wc_cart_totals_order_total_html(); ?></td>
		</tr>

		<?php do_action( 'woocommerce_review_order_after_order_total' ); ?>

	</tfoot>
</table>