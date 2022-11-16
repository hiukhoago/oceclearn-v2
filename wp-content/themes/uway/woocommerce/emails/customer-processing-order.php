<?php
/**
 * Customer processing order email
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/customer-processing-order.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates/Emails
 * @version 3.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/*
 * @hooked WC_Emails::email_header() Output the email header
 */

// check $order have appointment
$appointment = false;
$appointment_item = null;
$product_appointment_item = null;
foreach ($order->get_items() as $item_id => $item) {
    if ( has_term( 'appointment', 'product_cat', $item->get_product_id() ) ) {
        $appointment = true;

        $appointment_id = get_post_meta($order->ID, 'appointment_id', true);
        if(!empty($appointment_id) && get_post($appointment_id)) {
            $appointment_item[0] = get_post($appointment_id);
        } else {
            $appointment_item = get_post( array(
                'post_type'      => 'appointment',
                'post_status'    => 'publish',
                'posts_per_page' => '1',
                'meta_query'     => array(
                    array(
                        'key'     => 'employee',
                        'value'   => $item->get_product_id(),
                        'compare' => '='
                    )
                )
            ) );
        }

        
        $product_appointment_item = $item;
        break;
    }
}


$dir = get_template_directory_uri() . '/html/email-template/';

do_action( 'woocommerce_email_header', $email_heading, $email ); ?>

<?php $thankyou_img = $appointment ? 'thankyoubooking.png' : 'thankyou.png'; ?>
<div style="padding-right: 15px; padding-left: 15px; padding-top: 40px; padding-bottom: 20px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background: #000000 url('bg-confirmation.png'); color:#ffffff;padding-right: 15px; padding-left: 15px; padding-top: 40px; padding-bottom: 40px;"><![endif]-->
    <div style=" max-width: 500px; margin: 0 auto; text-align: center"
        class="small-title"><img src="<?php echo $dir; ?><?php echo $thankyou_img; ?>" width="100%" alt=""></div>
    <!--[if mso]></td></tr></table><![endif]-->
</div>

<?php if ($appointment): ?>
    <div style="color:#020202; padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 50px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="letter-spacing: 0.2px;color:#020202;padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
        <div style="font-family:'AvenirNext', Helvetica, Arial, sans-serif;font-weight:400; font-size: 18px;max-width: 500px; margin: 0 auto;text-align: center;letter-spacing: 0.2px; line-height: 28px;">Your booking has been received and is now being processed
            <br />Below are your booking details.
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
    </div>
<?php else: ?>
    <div style="color:#020202; padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 50px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="letter-spacing: 0.2px;color:#020202;padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
        <div style="font-family:'AvenirNext', Helvetica, Arial, sans-serif;font-weight:400; font-size: 18px;max-width: 500px; margin: 0 auto;text-align: center;letter-spacing: 0.2px; line-height: 28px;">Your order has been received and is now being processed
            <br />Your order details are shown below for your reference:
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
    </div>
<?php endif ?>


<?php

/*
 * @hooked WC_Emails::order_details() Shows the order details table.
 * @hooked WC_Structured_Data::generate_order_data() Generates structured data.
 * @hooked WC_Structured_Data::output_structured_data() Outputs structured data.
 * @since 2.5.0
 */
if ($appointment) {
    do_action( 'woocommerce_email_appointment_details', $order, $appointment_item, $product_appointment_item );
} else {
    do_action( 'woocommerce_email_order_details', $order, $sent_to_admin, $plain_text, $email );
}

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
do_action( 'woocommerce_email_footer', $email );
