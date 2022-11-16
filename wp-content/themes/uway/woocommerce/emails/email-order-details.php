<?php
/**
 * Order details table shown in emails.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-order-details.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails
 * @version 3.3.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$text_align = is_rtl() ? 'right' : 'left';

$appointment = check_if_order_has_appointment_item($order);

if($appointment) {
    $appointment_id = get_post_meta($order->ID, 'appointment_id', true);
    $appointment_id = get_post_meta($order->ID, 'appointment_id', true);

    if(!empty($appointment_id) && get_post($appointment_id)) {
        $appointment_item = get_post($appointment_id);        
    }
}   

//do_action( 'woocommerce_email_before_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>

<div style="font-weight: 700; font-size: 22px;margin-bottom: 10px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight: 700; font-size: 22px;margin-bottom: 10px;"><![endif]-->
    <div style="padding-top: 20px;margin-right:15px;margin-left:15px; padding-bottom: 20px;background-color: #F4F2ED; font-family:'CircularStd', Helvetica, Arial, sans-serif;font-size: 22px; line-height: 30px;text-align: center;color:#000;">
        <?php echo $appointment ? 'Appointment' : 'Order'; ?>: 

        #<?php echo $appointment && isset($appointment_item) ? str_replace('Appointment#', '', $appointment_item->post_title) : $order->get_order_number(); ?>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
</div>

<div style="font-size: 20px; padding-right: 20px; padding-left: 20px; padding-top: 40px; padding-bottom: 40px;margin-bottom: 30px; margin: 0 15px 20px;background:#FAFAFA;" class="custom-pc">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 15px; padding-right: 15px; padding-left: 15px; padding-top: 0px; padding-bottom: 0px;margin-bottom: 50px;"><![endif]-->
    <table cellspacing="0" style="color:#000;font-size: 20px; font-weight: 700;  width: 100%;" class="custom-pc" width="100%">
        <thead>
            <tr>
                <td style="color:#000;padding-top: 20px; padding-bottom: 10px; width: 50%; border-bottom: 3px solid #474202;font-family:'CircularStd', Helvetica, Arial, sans-serif;" width="50%"><?php echo $appointment ? 'Appointment' : 'Order'; ?></td>
                <td style="color:#000;padding-top: 20px; padding-bottom: 10px; padding-left: 10px;border-bottom: 3px solid #474202;font-family:'CircularStd', Helvetica, Arial, sans-serif;">Quantity</td>
                <td align="right" style="color:#000;padding-top: 20px; padding-bottom: 10px; padding-left: 10px;border-bottom: 3px solid #474202;font-family:'CircularStd', Helvetica, Arial, sans-serif;">Price</td>
            </tr>
        </thead>
        <?php 
        	echo wc_get_email_order_items( $order, array( // WPCS: XSS ok.
				'show_sku'      => $sent_to_admin,
				'show_image'    => false,
				'image_size'    => array( 32, 32 ),
				'plain_text'    => $plain_text,
				'sent_to_admin' => $sent_to_admin,
			) );
         ?>
        
        <?php
			$totals = $order->get_order_item_totals();

			if ( $totals ) {
				$i = 0;
				foreach ( $totals as $total ) {
					$i++;
					?>
                    <?php 
                        switch ( $total['label'] ) {
                            case 'Subtotal:': ?>
                            <tr>
                                <td style="color:#000;padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;" width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 18px;letter-spacing: 0.2px;"><?php echo wp_kses_post( $total['value'] ); ?></td>
                            </tr>
                              <?php  break;
                            case 'Total:': ?>
                            <tr>
                                <td style="color:#000;padding-top: 20px; padding-bottom: 20px; width: 50%; font-family:'CircularStd', Helvetica, Arial, sans-serif;"width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;">
                                    <p style="color:#000;font-weight: 700;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-size: 36px;letter-spacing: 0.2px; margin: 0; padding: 0;" ><?php echo sprintf(get_woocommerce_price_format(), get_woocommerce_currency_symbol(), $order->get_total());?></p>
                                    <?php if($order->get_total_tax()!=0):?>
                                    <p style="color:#000;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 16px;letter-spacing: 0.2px; margin: 0; padding: 0;">(includes <?php echo sprintf(get_woocommerce_price_format(), get_woocommerce_currency_symbol(), $order->get_total_tax());?> Tax)</p>
                                    <?php endif; ?>
                                </td>
                            </tr>
                              <?php  break;
                            default: ?>
                            <tr>
                                <td style="color:#000;padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;" width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 18px;letter-spacing: 0.2px;"><?php echo wp_kses_post( $total['value'] ); ?></td>
                            </tr>
                              <?php  break;
                        }
                     ?>
					<?php
				}
			}
		?>
    </table>

    <!--[if mso]></td></tr></table><![endif]-->
    <div style="font-weight:700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-top: 20px; padding-bottom: 20px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight:700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-top: 20px; padding-bottom: 20px;"><![endif]-->
        <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px;margin: 0 auto; color: #000000" class="medium-title"><?php _e( 'Customer details', 'woocommerce' ); ?></div>
        <!--[if mso]></td></tr></table><![endif]-->
    </div>

    <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 18px;  padding-top: 0px; padding-bottom: 0px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="'CircularStd', Helvetica, Arial, sans-serif; font-size: 18px;  padding-top: 0px; padding-bottom: 0px;"><![endif]-->
        <table style="CircularStd', Helvetica, Arial, sans-serif; font-size: 18px;  margin: 0 auto; width: 100%">
            <tr>
                <td style="font-weight: 700; padding-top: 5px; padding-bottom: 5px; font-family:'CircularStd', Helvetica, Arial, sans-serif; color: #000000">
                    <b>Email:</b>
                </td>
                <td style="font-weight:400;font-size: 18px;padding-top: 5px; padding-bottom: 5px;color: #000!important; font-family:'AvenirNext', Helvetica, Arial, sans-serif; text-decoration: none!important;">
                    <span><a href="mailto:<?php echo $order->get_billing_email(); ?>" style="color: #000; text-decoration: none;!important;"><?php echo $order->get_billing_email(); ?></a></span>
                </td>
            </tr>
            <tr>
                <td style="font-weight: 700; padding-top: 0; padding-bottom: 0; font-family:'CircularStd', Helvetica, Arial, sans-serif; color: #000000">
                    <b>Tel:</b>
                </td>
                <td style="font-weight: 400;font-size: 18px; color: #000; font-family:'AvenirNext', Helvetica, Arial, sans-serif;">
                    <span><?php echo $order->get_billing_phone(); ?></span>
                </td>
            </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
    </div>

<?php do_action( 'woocommerce_email_after_order_table', $order, $sent_to_admin, $plain_text, $email ); ?>
