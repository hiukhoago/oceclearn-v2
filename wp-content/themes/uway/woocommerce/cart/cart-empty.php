<?php
/**
 * Empty cart page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/cart/cart-empty.php.
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

if ( wc_get_page_id( 'shop' ) > 0 ) : ?>
	<section class="cart spacing-header spacing-around spacing-section-medium">
		<div class="container">
	        <div class="row col-gap-medium">
	        	<div class="col-lg-3 d-flex flex-column">
	                <div class="sidebar-cart">
	                    <h1 class="title-product wow fadeInUp mb-15">Cart</h1>
	                    <p class="mb-45">You have <?php echo $woocommerce->cart->cart_contents_count; ?> items in your cart</p>
	                    <?php // ACF Image Object
		                    $image     = get_field( 'cart_page_image' );
		                    $alt       = $image['alt'];
		                    $imageSize = $image['sizes'][ 'large' ];
	                     ?>
						 <?php if($image): ?>
	                    <div class="img-drop ratio-11 wow fadeIn"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
						<?php endif; ?>
	                </div>
	            </div>
	            <div class="col-lg-9">
					<div class="cart-empty">
						<?php /*
							* @hooked wc_empty_cart_message - 10
							*/
							do_action( 'woocommerce_cart_is_empty' ); 
						?>
						<a class="btn-black" href="<?php echo esc_url( apply_filters( 'woocommerce_return_to_shop_redirect', wc_get_page_permalink( 'shop' ) ) ); ?>">
							<?php esc_html_e( 'Return to shop', 'woocommerce' ); ?>
						</a>					
					</div>
	            </div>
			</div>
		</div>
	</section>
<?php endif; ?>
