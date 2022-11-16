<?php
/**
 * Cart Page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.5.0
 */

defined( 'ABSPATH' ) || exit;

global $woocommerce;
?>
<section class="cart spacing-header spacing-around spacing-section-medium bg-skin mh-100vh spacing-checkout">
	<div class="container">
        <div class="row col-gap-medium">
        	<div class="col-lg-3 d-flex flex-column">
                <div class="sidebar-cart">
                    <h1 class="title-product wow fadeInUp mb-15">Cart</h1>
                    <p class="mb-45">You have <span class="render-cart-items-count"><?php echo $woocommerce->cart->cart_contents_count; ?></span> items in your cart</p>
                    <?php // ACF Image Object
	                    $image     = get_field( 'cart_page_image' );
	                    $alt       = $image['alt'];
	                    $imageSize = $image['sizes'][ 'large' ];
					 ?>
					<?php if($image): ?>
					<div class="img-drop ratio-11 wow fadeIn"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
					<?php endif; ?>
                </div>
                <?php if ( get_field( 'cart_page_description' ) ) : ?>
					<div class="mt-auto cart-page-description"><?php the_field( 'cart_page_description' ); ?></div>
				<?php endif; ?>
            </div>
            <div class="col-lg-9">
            	<div class="wrap-woo-notices"><?php do_action( 'woocommerce_before_cart' ); ?></div>
				<form class="woocommerce-cart-form" action="<?php echo esc_url( wc_get_cart_url() ); ?>" method="post">
					<?php do_action( 'woocommerce_before_cart_table' ); ?>

					<table class="shop_table cart woocommerce-cart-form__contents table-list" cellspacing="0">
						<thead class="title-list">
							<tr>
								<td class="item-name" colspan="2">Product&nbsp;(<?php echo $woocommerce->cart->cart_contents_count; ?>)</td>
                                <td class="item-qty"><?php esc_html_e( 'Quantity', 'woocommerce' ); ?></td>
                                <td class="product-remove remove-product">&nbsp;</td>
                                <td class="item-price"><?php esc_html_e( 'Price', 'woocommerce' ); ?></td>
							</tr>
						</thead>
						<tbody class="list-item">
							<?php do_action( 'woocommerce_before_cart_contents' ); ?>

							<?php
							foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
								$_product   = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
								$product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

								if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
									$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
									?>
									<tr class="woocommerce-cart-form__cart-item <?php echo esc_attr( apply_filters( 'woocommerce_cart_item_class', 'cart_item', $cart_item, $cart_item_key ) ); ?> cart_item">

										<td class="product-thumbnail item-img" data-label="Image">
											<?php
											$thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );

											if ( ! $product_permalink ) {
												echo $thumbnail; // PHPCS: XSS ok.
											} else {
												printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail ); // PHPCS: XSS ok.
											}
											?>
										</td>

										<td class="product-name item-name" data-label="product" data-title="<?php esc_attr_e( 'Product', 'woocommerce' ); ?>">
											<span class="span-name">
												<?php
												if ( ! $product_permalink ) {
													echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;' );
												} else {
													echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
												}

												do_action( 'woocommerce_after_cart_item_name', $cart_item, $cart_item_key );

												// Backorder notification.
												if ( $_product->backorders_require_notification() && $_product->is_on_backorder( $cart_item['quantity'] ) ) {
													echo wp_kses_post( apply_filters( 'woocommerce_cart_item_backorder_notification', '<p class="backorder_notification">' . esc_html__( 'Available on backorder', 'woocommerce' ) . '</p>', $product_id ) );
												}
												?>
											</span>
										</td>
										<?php if ( get_the_terms( $_product->get_id(), 'product_health' ) ): ?>
											<td class="product-quantity item-qty" data-label="quantity" data-title="<?php esc_attr_e( 'Quantity', 'woocommerce' ); ?>">
												<?php echo $cart_item['quantity']; // PHPCS: XSS ok. ?>
											</td>
										<?php else: ?>
											<td class="product-quantity item-qty" data-label="quantity" data-title="<?php esc_attr_e( 'Quantity', 'woocommerce' ); ?>">
												<?php
												if ( $_product->is_sold_individually() ) {
													$product_quantity = sprintf( '1 <input type="hidden" name="cart[%s][qty]" value="1" />', $cart_item_key );
												} else {
													$product_quantity = woocommerce_quantity_input( array(
														'input_name'   => "cart[{$cart_item_key}][qty]",
														'input_value'  => $cart_item['quantity'],
														'max_value'    => $_product->get_max_purchase_quantity(),
														'min_value'    => '0',
														'product_name' => $_product->get_name(),
													), $_product, false );
												}

												echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item ); // PHPCS: XSS ok.
												?>
											</td>
										<?php endif ?>

										<td class="remove-product">
											<?php
												// @codingStandardsIgnoreLine
												echo apply_filters( 'woocommerce_cart_item_remove_link', sprintf(
													'<a href="%s" class="remove remove-btn" aria-label="%s" data-product_id="%s" data-product_sku="%s">Remove</a>',
													esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
													__( 'Remove this item', 'woocommerce' ),
													esc_attr( $product_id ),
													esc_attr( $_product->get_sku() )
												), $cart_item_key );
											?>
										</td>

										<td class="product-subtotal item-price" data-label="price" data-title="<?php esc_attr_e( 'Total', 'woocommerce' ); ?>">
											<span>
												<?php
													echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); // PHPCS: XSS ok.
												?>
											</span>
										</td>
									</tr>
									<?php
								}
							}
							?>

							<?php do_action( 'woocommerce_cart_contents' ); ?>

							<tr>
								<td colspan="5" class="actions">									

									<button type="submit" class="button" name="update_cart" value="<?php esc_attr_e( 'Update Cart', 'woocommerce' ); ?>"><?php esc_html_e( 'Update cart', 'woocommerce' ); ?></button>

									<?php if ( wc_coupons_enabled() ) { ?>
										<div class="coupon">
											<input type="text" name="coupon_code" class="input-text" id="coupon_code" value="" placeholder="<?php esc_attr_e( 'Coupon code', 'woocommerce' ); ?>" /> <button type="submit" class="button" name="apply_coupon" value="<?php esc_attr_e( 'Apply coupon', 'woocommerce' ); ?>"><?php esc_attr_e( 'Apply', 'woocommerce' ); ?></button>
											<?php do_action( 'woocommerce_cart_coupon' ); ?>
										</div>
									<?php } ?>

									<?php do_action( 'woocommerce_cart_actions' ); ?>

									<?php wp_nonce_field( 'woocommerce-cart', 'woocommerce-cart-nonce' ); ?>
								</td>
							</tr>

							<?php do_action( 'woocommerce_after_cart_contents' ); ?>
						</tbody>
					</table>
					<?php do_action( 'woocommerce_after_cart_table' ); ?>

					<?php do_action( 'woocommerce_cart_collaterals' ); ?>

					<?php if ( get_field( 'cart_page_description' ) ) : ?>
						<p class="shipping-extra-info"><?php the_field( 'cart_page_description' ); ?></p>
					<?php endif; ?>

					<div class="wc-proceed-to-checkout">
						<?php do_action( 'woocommerce_proceed_to_checkout' ); ?>
					</div>
				</form>
			</div>
		</div>
	</div>
</section>

<?php do_action( 'woocommerce_after_cart' ); ?>
