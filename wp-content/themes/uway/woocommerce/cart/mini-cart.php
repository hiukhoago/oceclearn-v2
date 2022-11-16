<?php
/**
 * Mini-cart
 *
 * Contains the markup for the mini-cart, used by the cart widget.
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/mini-cart.php.
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
 * @version 3.5.0
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

do_action( 'woocommerce_before_mini_cart' ); ?>

<?php if ( ! WC()->cart->is_empty() ) : ?>
	<div class="ul-cart fixed">
        <div class="name">Product</div>
        <div class="quanity gray">Quantity</div>
        <div class="price">Price</div>
        <div class="delete"><a class="btn-close-cart" href="#"><i class="icon close"></i></a></div>
    </div>
    <ul class="header-cart-list scrollbar-macosx">
    	<?php do_action( 'woocommerce_before_mini_cart_contents' ); ?>
    	<?php foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item): ?>
    		<?php
				$_product     = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
				$product_id   = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );
			?>
			<?php if (
				$_product && 
				$_product->exists() && 
				$cart_item['quantity'] > 0 && 
				apply_filters( 'woocommerce_widget_cart_item_visible', true, $cart_item, $cart_item_key )
			): ?>
				<?php
					$product_name      = apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key );
					$thumbnail         = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
					$product_price     = apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key );
					$product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
				?>
				<li>
					<div class="wrap-cart-item-information">
						<div class="wrap-infor-image-title">
			                <div class="header-cart-img">
			                    <div class="img-drop ratio-11"><?php echo $thumbnail; ?></div>
			                </div>
			                <div class="header-cart-info">
			                    <h5><?php echo $product_name; ?></h5>
			                    <?php if ( $_product->get_stock_status() === 'onbackorder' ): ?>
			                    	<div class="note-onbackorder-item version-desktop">This product is on back order and will be back in stock shortly! We won't ship your order until everything has arrived.</div>
			                    <?php endif ?>
			                </div>
			            </div>
			            <div class="header-cart-quanity item-qty">
			                <div class="qty-holder">
			                    <input type="number" name="cart-quantity" value="<?php echo $cart_item['quantity']; ?>" data-cart-key="<?php echo $cart_item_key; ?>"><i class="square-minus"></i><i class="square-plus"></i>
			                </div>
			            </div>
			            <div class="header-cart-price"><?php echo WC()->cart->get_product_subtotal($_product, $cart_item['quantity']); ?></div>
			            <div 
			            	class="delete-header-cart" 
			            	data-ckey="<?php echo $cart_item_key; ?>" 
			            	data-type="<?php the_field("product_type", $cart_item['product_id']) ?>"
			            ></div>
					</div>
					<?php if ( $_product->get_stock_status() === 'onbackorder' ): ?>
						<div class="note-onbackorder-item version-mobile">This product is on back order and will be back in stock shortly! We won't ship your order until everything has arrived.</div>
					<?php endif ?>
		        </li>
			<?php endif ?>
	    <?php endforeach ?>
        <?php do_action( 'woocommerce_mini_cart_contents' ); ?>
    </ul>
    <div class="wrap-cart-panel-bottom">
        <div class="row">
        	<?php if (wc_coupons_enabled()): ?>
        		<div class="coupon">
					<?php if (WC()->cart->get_coupons()): ?>
						<div class="wrap-coupon-complete">
							<?php foreach (WC()->cart->get_coupons() as $code => $coupon): ?>
								<div class="wrap-txt">
									<?php echo esc_attr( wc_cart_totals_coupon_label( $coupon, false ) ); ?>
								</div>
								<div class="wrap-price">
									<?php wc_cart_totals_coupon_html( $coupon ); ?>
								</div>								
							<?php endforeach ?>
						</div>
        			<?php else: ?>
        				<input type="text" name="coupon_code" id="coupon_code" placeholder="Coupon Code">
                		<button type="submit" id="cart-mini-coupon" name="apply_coupon">APPLY</button>
        			<?php endif ?>
	            </div>
        	<?php endif ?>
            <div class="header-cart-buttons header-total">
                <div>Total</div>
                <div class="cart-refresh-total"><?php echo sprintf( get_woocommerce_price_format(), get_woocommerce_currency_symbol(), WC()->cart->cart_contents_total + WC()->cart->tax_total); ?><small> (inc. tax)</small></div>
            </div>
            <div class="row-cart-buttons"> 
            	<a class="header-cart-buttons header-viewbag" href="<?php echo esc_url( wc_get_cart_url() ); ?>">View bag</a>
            	<a class="header-cart-buttons header-checkout" href="<?php echo esc_url( wc_get_checkout_url() ); ?>">check out</a>
            </div>
        </div>
    </div>
<?php else : ?>
	<div class="ul-cart fixed empty">
        <div class="delete"><a class="btn-close-cart" href="#"><i class="icon close"></i></a></div>
    </div>			
	<div class="wrap-empty">
		<div class="cart-text text-center">Your cart is currently empty</div>
		<a class="btn-common green" href="<?php echo get_permalink( woocommerce_get_page_id( 'shop' ) );  ?>"> 
			<div class="pos">Shop Here</div>
		</a>
	</div>
<?php endif; ?>

<?php do_action( 'woocommerce_after_mini_cart' ); ?>
