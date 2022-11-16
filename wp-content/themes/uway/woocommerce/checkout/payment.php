<?php
/**
 * Checkout Payment Section
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/payment.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

if ( ! is_ajax() ) {
	do_action( 'woocommerce_review_order_before_payment' );
}
$appointment_check = check_if_cart_has_appointment_item();
?>

<div id="payment" class="woocommerce-checkout-payment">

<div class="custom-form" id="payment">

	<div class="wc_payment_methods payment_methods methods">
		
		<?php if ( WC()->cart->needs_payment() ) : ?>
			<?php
				if ( ! empty( $available_gateways ) ) { ?>

				<h2 class="title-product mb-30">How would you like to pay?</h2>

				<?php foreach ( $available_gateways as $gateway ) { ?>
					<div class="wc_payment_method payment_method_<?php echo $gateway->id; ?>">
							<input type="radio" class="input-radio" id="payment_method_<?php echo $gateway->id; ?>" name="payment_method" value="<?php echo esc_attr( $gateway->id ); ?>" <?php checked( $gateway->chosen, true ); ?> data-order_button_text="<?php echo esc_attr( $gateway->order_button_text ); ?>">
							<label for="payment_method_<?php echo $gateway->id; ?>">
								<?php if($gateway->get_title()!=="PayPal"): ?>
									<?php echo $gateway->get_title(); ?>
							<?php endif;?>
							</label>
					</div>
				<?php }
				foreach ($available_gateways as $gateway ) { ?>
					<?php if ( $gateway->has_fields() || $gateway->get_description() ) : ?>
						<div class="payment_box payment_method_<?php echo $gateway->id; ?>" <?php if ( ! $gateway->chosen ) : ?>style="display:none;"<?php endif; ?> >
							<?php $gateway->payment_fields(); ?>
						</div>
					<?php endif; ?>
				<?php }
			} else {
				echo '<li class="woocommerce-notice woocommerce-notice--info woocommerce-info">' . apply_filters( 'woocommerce_no_available_payment_methods_message', WC()->customer->get_billing_country() ? esc_html__( 'Sorry, it seems that there are no available payment methods for your state. Please contact us if you require assistance or wish to make alternate arrangements.', 'woocommerce' ) : esc_html__( 'Please fill in your details above to see available payment methods.', 'woocommerce' ) ) . '</li>'; // @codingStandardsIgnoreLine
			}
			?>
		<?php endif; ?>
	</div>
	<div class="form-row place-order">
		<noscript>
			<?php esc_html_e( 'Since your browser does not support JavaScript, or it is disabled, please ensure you click the <em>Update Totals</em> button before placing your order. You may be charged more than the amount stated above if you fail to do so.', 'woocommerce' ); ?>
			<br/><button type="submit" class="button alt" name="woocommerce_checkout_update_totals" value="<?php esc_attr_e( 'Update totals', 'woocommerce' ); ?>"><?php esc_html_e( 'Update totals', 'woocommerce' ); ?></button>
		</noscript>

		<?php if ( !$appointment_check ): ?>
			<?php wc_get_template( 'checkout/terms.php' ); ?>	
		<?php endif;?>

		<?php do_action( 'woocommerce_review_order_before_submit' ); ?>
	
		<?php $order_button_text = 'Complete payment'; ?>

		<?php echo apply_filters( 'woocommerce_order_button_html', '<button type="submit" class="btn-black button alt" name="woocommerce_checkout_place_order" id="place_order" value="' . esc_attr( $order_button_text ) . '" data-value="' . esc_attr( $order_button_text ) . '">' . esc_html( $order_button_text ) . '</button>' ); // @codingStandardsIgnoreLine ?>

		<?php do_action( 'woocommerce_review_order_after_submit' ); ?>

		<?php wp_nonce_field( 'woocommerce-process_checkout', 'woocommerce-process-checkout-nonce' ); ?>
	</div>
</div>
<?php
if ( ! is_ajax() ) {
	do_action( 'woocommerce_review_order_after_payment' );
}
