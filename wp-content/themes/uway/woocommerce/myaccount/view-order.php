<?php
/**
 * View Order
 *
 * Shows the details of a particular order on the account page.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/view-order.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

?>


<!-- <p><?php
	/* translators: 1: order number 2: order date 3: order status */
	printf(
		__( 'Order #%1$s was placed on %2$s and is currently %3$s.', 'woocommerce' ),
		'<mark class="order-number">' . $order->get_order_number() . '</mark>',
		'<mark class="order-date">' . wc_format_datetime( $order->get_date_created() ) . '</mark>',
		'<mark class="order-status">' . wc_get_order_status_name( $order->get_status() ) . '</mark>'
	);
?></p> -->

<?php 
	$order_items = $order->get_items( apply_filters( 'woocommerce_purchase_order_item_types', 'line_item' ) );
 ?>

<div class="row">
    <div class="col-md-3">  
        <h2 class="title-page animated fadeInUp margin-bottom">Order <br>history</h2>
    </div>
    <div class="col-md-9">
        <div class="wrap-list" id="wrap-list-order">
            <div class="list-order-detail"><a class="btn-back-list toggle-review" href="<?php echo esc_url( wc_get_endpoint_url( 'orders' ) ); ?>">Back</a>
                <div class="order-number">Order#: <b><?php echo $order->get_order_number(); ?></b></div>
                <div class="scrollbar-macosx">
                    <ul class="product-review">
                    	<?php foreach ( $order_items as $item_id => $item ): ?>

                    		<?php $product = $item->get_product(); ?>

							<li>
	                            <div class="img-prod"><img src="<?php echo get_the_post_thumbnail_url( $product->get_ID(), $size = 'post-thumbnail' ); ?>" alt="<?php echo $product->get_name(); ?>"></div>
	                            <div class="name-prod"><?php echo $product->get_name(); ?></div>
	                            <div class="quality">Quantity: <span><?php echo apply_filters( 'woocommerce_order_item_quantity_html', sprintf( '%s', $item->get_quantity() ), $item ); ?></span></div>
	                            <div class="price"><?php echo $order->get_formatted_line_subtotal( $item ); ?></div>
	                        </li>

                    	<?php endforeach; ?>
                    </ul>
                </div>
                <div class="wrap-box">
                    <div class="preview-detail">
                        <div class="bg-gray">
                        	<?php 
                        		$ship_title = wp_kses_post( $order->get_formatted_shipping_address() ) ? '<h3>Shipping details </h3>' : '<h3>Billing details </h3>';
                        		$ship_address = wp_kses_post( $order->get_formatted_shipping_address() ) ? wp_kses_post( $order->get_formatted_shipping_address( __( 'N/A', 'woocommerce' ) ) ) : wp_kses_post( $order->get_formatted_billing_address( __( 'N/A', 'woocommerce' ) ) );  
                    		?>
                        	<?php 
                        		echo $ship_title; 
                        		echo $ship_address;
                    		?>

                    		<?php if ( $order->get_payment_method() ): ?>
                    			<h3>Payment type</h3>
                            	<p><?php echo $order->get_payment_method_title(); ?></p>
                    		<?php endif ?>
                            
                        </div>
                    </div>

                    <div class="box-total">
                        <ul class="list-subtotal">
                        	<?php foreach ( $order->get_order_item_totals() as $key => $total ): ?>
                        		<?php if ( $total['label'] == 'Total:' ): ?>
                        			<?php 
                        				$order_total = $total;
										unset($total);
                        			 ?>
                        		<?php else: ?>
                        			<li>
										<p><?php echo $total['label']; ?></p>
										<p><?php echo $total['value']; ?></p>
									</li>
                        		<?php endif; ?>
                        	<?php endforeach; ?>
                        </ul>
                        <ul class="total">
                            <li> 
                                <p><?php echo $order_total['label']; ?></p>
                                <p class="price-total"><?php echo $order_total['value']; ?></p>
                            </li>
                        </ul>
                        <?php if ( 'Completed' === wc_get_order_status_name( $order->get_status() ) ): ?>
                        	<a class="btn-black full-width" href="<?php echo wp_nonce_url( add_query_arg( 'order_again', $order->get_id() ) , 'woocommerce-order_again' ); ?>">ORDER AGAIN </a>
                        <?php endif ?>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
