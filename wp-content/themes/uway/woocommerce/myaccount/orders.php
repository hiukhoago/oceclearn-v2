<?php
/**
 * Orders
 *
 * Shows orders on the account page.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/orders.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 3.2.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="row">
	<div class="col-md-3">  
        <h2 class="title-page animated fadeInUp margin-bottom">Order <br>history</h2>
    </div>
    <div class="col-md-9">      
		<ul class="nav nav-tab-order justify-content-center">
			<li class="nav-item">
				<a class="nav-link active" href="#" data-toggle="tab" data-target="#order-product">Products</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="#" data-toggle="tab" data-target="#order-appointment">Appointments</a>
			</li>
		</ul>
		<div class="tab-content tab-order-history">
			<div class="tab-pane fade show active" id="order-product">
				<div class="wrap-list" id="wrap-list-order">

					<?php do_action( 'woocommerce_before_account_orders', $has_orders ); ?>

						<div class="list-order-history">
							<ul>
								<?php if ( $has_orders ) : ?>
									<?php foreach ( $customer_orders->orders as $customer_order ) :
										$order      = wc_get_order( $customer_order );
										$item_count = $order->get_item_count();
										if ($order->get_meta('_appointment_order_type', true)) {
											continue;
										}
										?>

										<li>
											<div class="order-number">
												<p>Order#: <b><?php echo $order->get_order_number(); ?></b></p><span><?php echo $item_count; ?> items</span>
											</div>
											<div class="order-date"><?php echo esc_attr( $order->get_date_created()->date( 'm/d/Y' ) ); ?></div>
											<div class="order-price"> 
												<p class="price"> <?php echo wp_strip_all_tags( $order->get_formatted_order_total() ); ?></p>
												<span><?php echo esc_html( wc_get_order_status_name( $order->get_status() ) ); ?></span>
											</div>
											<div class="view-detail-order"><a class="toggle-review" href="<?php echo esc_url( $order->get_view_order_url() ); ?>">View</a></div>
										</li>

									<?php endforeach; ?>
								<?php else : ?>	

									<li class="no-orders">
										<p><?php _e( 'You haven\'t placed any orders yet.', 'woocommerce' ); ?></p>
									</li>
									<a class="btn-black" href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>">RETURN SHOP</a>

								<?php endif; ?>
							</ul>
						</div>

					<?php do_action( 'woocommerce_after_account_orders', $has_orders ); ?>

				</div> 
			</div>
			<?php 
				$appointment_history = get_posts( array(
					'post_type'      => 'appointment',
		            'post_status'    => 'publish',
		            'posts_per_page' => '-1',
		            'meta_query'     => array(
		                array(
		                    'key'     => 'customer_email',
		                    'value'   => wp_get_current_user()->user_email,
		                    'compare' => '='
		                )
		            )
				) );
			?>
			<div class="tab-pane fade" id="order-appointment">
				<?php if ($appointment_history): ?>
					<?php foreach ($appointment_history as $ap): ?>
						<?php $data = get_fields( $ap->ID ); ?>
						<div class="box-info-pick">
							<?php if ($data['employee']): ?>
								<div class="item-inner">
									<div class="title">Practitioner</div>
									<div class="text"><span class="practitioner-name"><?php echo $data['employee']->post_title; ?></span></div>
								</div>
							<?php endif ?>
							<?php if ($data['service']): ?>
								<div class="item-inner">
									<div class="title">Consultation</div>
									<div class="text"><span class="consultation-title"><?php echo $data['service']->name; ?></span></div>
								</div>
							<?php endif ?>
							<?php if ($data['method']): ?>
								<div class="item-inner">
									<div class="title">Method of appointment</div>
									<div class="text"><span class="method-name"></span><?php echo $data['method']; ?></div>
								</div>
							<?php endif ?>
							<?php if ($data['booking_date']): ?>
								<?php $booking_date = date_create($data['booking_date']); ?>
								<div class="item-inner">
									<div class="title">Date</div>
									<div class="text"><span class="date-chosen"><?php echo date_format($booking_date, 'jS F Y'); ?></span></div>
								</div>
							<?php endif ?>
							<?php if ($data['time_start'] and $data['time_end']): ?>
								<div class="item-inner">
									<div class="title">Time</div>
									<div class="text">
										<span class="time-start"><?php echo $data['time_start']; ?></span>
										<span class="time-end"> - <?php echo $data['time_end']; ?></span>
									</div>
								</div>
							<?php endif ?>
							<div class="item-inner">
								<div class="title">Status</div>
								<div class="text"><?php echo $data['status']; ?></div>
							</div>
						</div>
					<?php endforeach ?>
				<?php endif ?>
			</div>
		</div>
	</div>

</div>
