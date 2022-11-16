<?php
/**
 * Email Order Items
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-order-items.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;

$text_align = is_rtl() ? 'right' : 'left';

$appointment_id = get_post_meta($order->ID, 'appointment_id', true);

if(!empty($appointment_id) && get_post($appointment_id)) {
    $appointment_item = get_post($appointment_id);
    $details = get_fields( $appointment_id );
    $booking_details = array(
        'Practitioner' => $details['employee']->post_title,
        'Method'       => $details['method'],
        'Booking Date' => $details['booking_date'],
        'Start Time'   => $details['time_start'],
        'End Time'     => $details['time_end']
    );
}

foreach ( $items as $item_id => $item ) :
	$product       = $item->get_product();
	$sku           = '';
	$purchase_note = '';
	$image         = '';

	if ( ! apply_filters( 'woocommerce_order_item_visible', true, $item ) ) {
		continue;
	}

	if ( is_object( $product ) ) {
		$sku           = $product->get_sku();
		$purchase_note = $product->get_purchase_note();
		$image         = $product->get_image( $image_size );
	}

	?>
	
	<tr>
		<td style="padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8; font-weight: 700; font-size: 16px;font-family:'CircularStd', Helvetica, Arial, sans-serif;text-transform: capitalize;letter-spacing: 0.2px;line-height: 24px;" class="custom-pc2" width="50%"><?php echo wp_kses_post( apply_filters( 'woocommerce_order_item_name', $item->get_name(), $item, false ) ); ?>

			<?php if(is_array($booking_details) && count($booking_details) > 0) : ?>
			<p style="font-size:14px; font-weight: 400;">Booking Date: <?php echo $booking_details['Booking Date']; ?></p>
			<p style="font-size:14px; font-weight: 400;">Start Time: <?php echo $booking_details['Start Time']; ?></p>
			<p style="font-size:14px; font-weight: 400;">End Time: <?php echo $booking_details['End Time']; ?></p>
			<?php endif; ?>
		</td>
	    <td class="custom-pc2" style="padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-weight: 500; font-size: 18px;font-family:'CircularStd', Helvetica, Arial, sans-serif;letter-spacing: 0.2px;"><?php echo wp_kses_post( apply_filters( 'woocommerce_email_order_item_quantity', $item->get_quantity(), $item ) ); ?></td>

	    <td class="custom-pc2" align="right" style="padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-weight: 500; font-size: 18px;font-family:'CircularStd', Helvetica, Arial, sans-serif;letter-spacing: 0.2px;"><?php echo wp_kses_post( $order->get_formatted_line_subtotal( $item ) ); ?></td>
    </tr>
    
	<!-- <?php

	if ( $show_purchase_note && $purchase_note ) {
		?>
		<tr>
			<td colspan="3" style="text-align:<?php echo esc_attr( $text_align ); ?>; vertical-align:middle; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;">
				<?php
				echo wp_kses_post( wpautop( do_shortcode( $purchase_note ) ) );
				?>
			</td>
		</tr>
		<?php
	}
	?> -->

<?php endforeach; ?>
