<?php
/**
 * Admin new order email
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/admin-new-order.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails/HTML
 * @version 3.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * @hooked WC_Emails::email_header() Output the email header
 */
do_action( 'woocommerce_email_header', $email_heading, $email ); ?>

<div style="color:#020202; padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 50px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="letter-spacing: 0.2px;color:#020202;padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
    <div style="font-family:'AvenirNext', Helvetica, Arial, sans-serif;font-weight:400; font-size: 18px;max-width: 500px; margin: 0 auto;text-align: center;letter-spacing: 0.2px; line-height: 28px;"><?php printf( __( 'You’ve received the following order from %s:', 'woocommerce' ), $order->get_formatted_billing_full_name() ); ?>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
</div>

<?php

/*
 * @hooked WC_Emails::order_details() Shows the order details table.
 * @hooked WC_Structured_Data::generate_order_data() Generates structured data.
 * @hooked WC_Structured_Data::output_structured_data() Outputs structured data.
 * @since 2.5.0
 */
do_action( 'woocommerce_email_order_details', $order, $sent_to_admin, $plain_text, $email );

/*
 * @hooked WC_Emails::order_meta() Shows order meta data.
 */
do_action( 'woocommerce_email_order_meta', $order, $sent_to_admin, $plain_text, $email );

/*
 * @hooked WC_Emails::customer_details() Shows customer details
 * @hooked WC_Emails::email_address() Shows email address
 */
do_action( 'woocommerce_email_customer_details', $order, $sent_to_admin, $plain_text, $email );
?>

<?php
	do_action( 'ven_custom_email_cancellation_policy', $order); 
?>

<?php
/*
 * @hooked WC_Emails::email_footer() Output the email footer
 */
do_action( 'woocommerce_email_footer', $email);
