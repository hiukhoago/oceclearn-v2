<?php
/**
 * Email Addresses
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-addresses.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates/Emails
 * @version     3.2.1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$text_align = is_rtl() ? 'right' : 'left';

?>
<div style="padding-top: 0px; padding-bottom: 0px; margin-bottom: 0px;">

	<table style="width:100%; margin: 0 auto;">
		<tr>
			<td style="width: 50%; padding-right: 20px;" width="50%">
				<div style="font-weight: 700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-right: 0px; padding-left: 0px; padding-top: 60px; padding-bottom: 20px;">
                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight: 700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-right: 0px; padding-left: 0px; padding-top: 60px; padding-bottom: 20px;"><![endif]-->
                    <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; color: #000000" class="medium-title"><?php _e( 'Billing address', 'woocommerce' ); ?></div>
                </div>
                <div style="font-family:'AvenirNext', Helvetica, Arial, sans-serif; font-size: 18px; padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;">
                    <table style="font-family:'AvenirNext', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400">
                        <tr>
                            <td style="padding-bottom:0; color: #000; font-family:'AvenirNext', Helvetica, Arial, sans-serif;" class="custom-pc2">
                                <?php echo ( $address = $order->get_formatted_billing_address() ) ? $address : __( 'N/A', 'woocommerce' ); ?>
                                <?php if ( $order->get_billing_phone() ): ?>
                                    <br/><?php echo esc_html( $order->get_billing_phone() ); ?>
                                <?php endif ?>
                            </td>
                        </tr>
                    </table>
                </div>
			</td>
			<?php if ( ! wc_ship_to_billing_address_only() && $order->needs_shipping_address() && ( $shipping = $order->get_formatted_shipping_address() ) ) : ?>
				<td style="width: 50%" width="50%">
					<div style="font-weight: 700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-right: 0px; padding-left: 0px; padding-top: 60px; padding-bottom: 20px;">
                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight: 700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-right: 0px; padding-left: 0px; padding-top: 60px; padding-bottom: 20px;"><![endif]-->
                        <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; color: #000000" class="medium-title"><?php _e( 'Shipping details', 'woocommerce' ); ?></div>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </div>
					<div style="font-family:'AvenirNext', Helvetica, Arial, sans-serif; font-size: 18px; padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;">
                        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'AvenirNext', Helvetica, Arial, sans-serif; font-size: 18px; padding-right: 0px; padding-left: 0px; padding-top: 0px; padding-bottom: 0px;"><![endif]-->
                        <table style="font-family:'AvenirNext', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400">
                            <tr>
                                <td style="padding-bottom:0; color: #000; font-family:'AvenirNext', Helvetica, Arial, sans-serif;"
                                    class="custom-pc2"><?php echo $shipping; ?></td>
                            </tr>
                        </table>
                        <!--[if mso]></td></tr></table><![endif]-->
                    </div>
				</td>
			<?php endif; ?>
		</tr>
	</table>

</div>
