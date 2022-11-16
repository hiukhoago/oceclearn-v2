<?php
/**
 * Checkout Form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/checkout/form-checkout.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.5.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$appointment_check = check_if_cart_has_appointment_item();
?>
<!-- Modal for cancellation policy -->
<?php if ( $appointment_check ) : ?>
    <div class="modal fade policy-modal" tabindex="-1" role="dialog" id="policy-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <a href="#" class="close-modal" data-dismiss="modal"></a>
                    <div class="in-modal"></div>
                </div>
            </div>
        </div>
    </div>
<?php endif;?>>

<div class="checkout-page spacing-header spacing-around spacing-section-medium">
	<div class="container">
		<div class="row">
			<div class="col-lg-3">
                <div class="checkout-sidebar wrap-sidebar-blog-single">
                    <div class="checkout-total-panel">
						<div class="total"><?php echo wc_price(WC()->cart->total);?></div>
						<?php $total_items = WC()->cart->cart_contents_count; ?>
                        <label class="items" for="show-bag-checkout"><?php printf(($total_items<=1?"%d item":"%d items"), $total_items); ?></label>
                    </div>

                    <input class="d-none" type="checkbox" id="show-bag-checkout">
                    <div class="bag-checkout">
                        <h6>CART <label for="show-bag-checkout"><i class="icon close"></i></label></h6>
                        <ul class="header-cart-list scrollbar-macosx">
                            <?php foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                                $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
                                if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_checkout_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
                                    ?>
                                    <li>
                                        <div class="header-cart-img">
                                            <div class="img-drop ratio-11"><img src="<?php echo get_the_post_thumbnail_url( $_product->get_ID(), $size = 'post-thumbnail' ); ?>" alt="<?php echo apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;'; ?>"></div>
                                        </div>
                                        <div class="header-cart-info">
                                            <h5><?php echo apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) . '&nbsp;'; ?></h5>
                                            <div class="header-cart-price">
                                                <?php echo apply_filters( 'woocommerce_cart_item_subtotal', WC()->cart->get_product_subtotal( $_product, $cart_item['quantity'] ), $cart_item, $cart_item_key ); ?> x <?php echo apply_filters( 'woocommerce_checkout_cart_item_quantity', sprintf( '%s', $cart_item['quantity'] ), $cart_item, $cart_item_key ); ?>
                                            </div>
                                        </div>
                                    </li>
                                    <?php
                                }
                            } ?>
                        </ul>
                    </div>
                    
                    <ul class="acc-menu-siderbar nav for-checkout">
                        <?php $tempCheckHealth = has_health_programs_in_cart(); ?>
                        <?php if ( $checkout->is_registration_enabled() && ! is_user_logged_in() ): ?>
                            <li id="checkout-login-li" class="active <?php if ($tempCheckHealth) echo 'login-require'; ?>"><a href="#login">Log in</a></li>
                        <?php endif; ?>
                        
                        <?php if(!$tempCheckHealth || is_user_logged_in()): ?>
                        <li id="shipping-details-li" <?php if ( is_user_logged_in() ) echo 'class="active"'; ?>>
                            <?php $billing_label = $appointment_check ? 'Billing' : 'Shipping'; ?>
                            <a href="#shipping-detail"><?php echo $billing_label; ?> Details</a>
                        </li>
                        <li id="payment-details-li"><a href="#payment">Payment</a></li>
                        <?php endif; ?>
                        <div></div>
                    </ul>
                </div>
            </div>

			<div class="col-lg-9">
                
				<?php do_action( 'woocommerce_before_checkout_form', $checkout );
                    // If checkout registration is disabled and not logged in, the user cannot checkout.
                    if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
                        echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'woocommerce' ) ) );
                        return;
                    }
				?>

				<h1 class="d-none">Checkout</h1>

				<form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">
					<!-- CHECKOUT TAB -->
					<div class="section-checkout <?php if ( ! is_user_logged_in() ) echo 'd-none'; ?>">
	                    <div class="custom-form checkout-width">

	                        <h1 class="title-product mb-45">Where would you like your order sent?</h1>

							<div class="form" id="shipping-details">
								<?php if ( $checkout->get_checkout_fields() ) : ?>

									<?php do_action( 'woocommerce_checkout_before_customer_details' ); ?>

										<?php do_action( 'woocommerce_checkout_billing' ); ?>
                                        <?php if (!$appointment_check): ?>
                                            <?php do_action( 'woocommerce_checkout_shipping' ); ?>
                                        <?php endif ?>

									<?php do_action( 'woocommerce_checkout_after_customer_details' ); ?>

								<?php endif; ?>
							

								<?php if ( WC()->cart->needs_shipping() && WC()->cart->show_shipping() ) : ?>

									<?php do_action( 'woocommerce_review_order_before_shipping' ); ?>
									
									<div class="hl_order_shipping_totals">

										<?php wc_cart_totals_shipping_html(); ?>
										
									</div>

									<?php do_action( 'woocommerce_review_order_after_shipping' ); ?>

								<?php endif; ?>

								<p class="form-row no-margin">
									<button class="btn-black" id="show-payment">GO TO PAYMENT</button>
								</p>
							</div> <!-- /.form -->
					 	</div>
	                </div>

					<!-- PAYMENT TAB -->
	                <div class="section-payment d-none">

	                    <h2 class="title-product mb-30 for-checkout">Order placed by
	                    	<a class="btn-common gray btn-back-section-shipping" href="#shipping-detail">
	                            <div class="pos">change</div>
	                        </a>
	                    </h2>
	                    <div class="shipping-review-info">
							<p>
								<payment id="p-fullname-more"></payment><br>
								<payment id="p-email"></payment><br>
							</p>
	                    </div>
	                    <h2 class="title-product mb-30 for-checkout for-shipping-medthod-revirew">Shipping details
	                    	<a class="btn-common gray btn-back-section-shipping" href="#shipping-detail">
	                            <div class="pos">change</div>
	                        </a>
	                    </h2>
	                    <div class="shipping-review-info for-shipping-medthod-revirew">
							<p>
								<payment id="p-fullname"></payment><br>
								<payment id="p-address"></payment><br>
								<payment id="p-address2"></payment>
								<payment id="p-suburb"></payment>
                                <payment id="p-state"></payment>
                                <payment id="p-country"></payment>
                                <payment id="p-postcode"></payment>
							</p>
							<p>
								<payment id="p-method-ship">Shipping Method</payment>
							</p>
	                    </div>
	                    
						<h2 class="title-product mb-45"><?php esc_html_e( 'Review your order', 'woocommerce' ); ?></h2>
						
						<?php do_action( 'woocommerce_checkout_before_order_review' ); ?>
						<div class="box-order-review">
                            <?php include_once('list-product-cart.php' ); ?>
							<?php do_action( 'woocommerce_checkout_order_review' ); ?>
						</div>
						<?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

	                </div>

                </form>

				<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
			</div>
		</div>
	</div>
</div>

<script>
(function ($) {
    $(function () {
        
        // AUTO GENERATORATION SHIPPING DETAIL
        var autoGeneratorShippingDetail = function(){
            var isShippingCheck = $("#show-shipping-fieldset").is(":checked");
            var fullname = isShippingCheck?$("#shipping_first_name").val()+" "+$("#shipping_last_name").val():$("#billing_first_name").val()+" "+$("#billing_last_name").val(),
                address = isShippingCheck?$("#shipping_address_1").val():$("#billing_address_1").val(),
                address2 = isShippingCheck?$("#shipping_address_2").val():$("#billing_address_2").val(),
                suburb = isShippingCheck?$("#shipping_city").val():$("#billing_city").val(),
                postcode = isShippingCheck?$("#shipping_postcode").val():$("#billing_postcode").val(),
				state = isShippingCheck?$("#shipping_state").val():$("#billing_state").val();
				email = $("#billing_email").val();
            var shipping_country = $("#shipping_country").hasClass("select2-hidden-accessible")?$("#shipping_country").select2("data")[0].text:$("#shipping_country_field .woocommerce-input-wrapper").text(),
                billing_country = $("#billing_country").hasClass("select2-hidden-accessible")?$("#billing_country").select2("data")[0].text:$("#billing_country_field .woocommerce-input-wrapper").text(),
                country = isShippingCheck?shipping_country:billing_country;
            
            $("#p-fullname, #p-fullname-more").text(fullname);
            $("#p-email").text(email);

            if($("#show-shipping-fieldset").length>0){
                $(".for-shipping-medthod-revirew").show();
                $("#p-address").text(address);
                $("#p-address2").text(address2);
                $("#p-suburb").text(suburb + (suburb.length>0?", ":""));
                $("#p-postcode").text(postcode);
                $("#p-state").text(state + (state.length>0?", ":""));
                $("#p-country").text(country + (country.length>0?", ":""));
                $("#p-method-ship").html("<br/><b>Shipping Method:</b><br/>"+$("#shipping_method input:checked, #shipping_method input[type='hidden']").next().text());
            }
            else{
                $(".for-shipping-medthod-revirew").hide();
            }
        };

        var checkError = function(e){
            e.preventDefault();
            var firstRun = true;
            $(".woocommerce-billing-fields__field-wrapper .validate-required").each(function(){
                $input = $(this).find("input, select");
                if(!$input.val() || $(this).hasClass("woocommerce-invalid")){
                    if(firstRun) {$("html, body").animate({scrollTop: $input.offset().top - 150}); firstRun = false}
                    $(this).addClass("woocommerce-invalid");
                }
            });
            if($("#show-shipping-fieldset").is(":checked")){
                $(".woocommerce-shipping-fields .validate-required").each(function(){
                    $input = $(this).find("input, select");
                    if(!$input.val() || $input.val().trim().length == 0){
                        if(firstRun) {$("html, body").animate({scrollTop: $input.offset().top - 150}); firstRun = false}
                        $(this).addClass("woocommerce-invalid");
                    }
                });
			}
			else{
				$(".woocommerce-shipping-fields .validate-required").removeClass("woocommerce-invalid");
			}
            
            if($("#shipping-details .woocommerce-invalid").length<1){
                $(".section-checkout").addClass("d-none");
                $(".section-payment").removeClass("d-none");
                $(".acc-menu-siderbar.for-checkout li.active").removeClass("active");
                $(".acc-menu-siderbar.for-checkout a[href='#payment']").parent().addClass("active");
                autoGeneratorShippingDetail();
                $(window).scrollTop($("#wrap-page").offset().top + 30);
            }
        };
        $("#show-payment, #payment-details-li a").on("click", checkError);
        $(".btn-back-section-shipping").on("click", function (e) {
            e.preventDefault();
            $(".acc-menu-siderbar.for-checkout a[href='#shipping-detail']").trigger("click");
        });

        // GO BACK SHIPPING FORM
        $("#shipping-details-li a").on("click", function(){
            $(".section-checkout").removeClass("d-none");
            $(".section-payment").addClass("d-none");
            $(".checkout-login").addClass("d-none");
            $(".acc-menu-siderbar.for-checkout li.active").removeClass("active");
            $(".acc-menu-siderbar.for-checkout a[href='#shipping-detail']").parent().addClass("active");
            $(".woocommerce-error, .woocommerce-notices-wrapper").remove();
            $(window).scrollTop($("#wrap-page").offset().top + 30);
        })

        //GO BACK LOGIN FORM
        $('#checkout-login-li a').on('click',function(){
            $(".section-checkout").addClass("d-none");
            $(".section-payment").addClass("d-none");
            $(".checkout-login").removeClass("d-none");
            $(".acc-menu-siderbar.for-checkout li.active").removeClass("active");
            $(".acc-menu-siderbar.for-checkout a[href='#login']").parent().addClass("active");
            $(".woocommerce-error, .woocommerce-notices-wrapper").remove();
            $(window).scrollTop($("#wrap-page").offset().top + 30);
        });

        //GUEST CHECKOUT
        $('#guest-checkout').on('click',function(e){
            e.preventDefault();
            $(".acc-menu-siderbar.for-checkout a[href='#shipping-detail']").trigger("click");
        });

        /* 
        * Stripe Validation
        * Long winded validation
        */

        $( document.body ).on( 'stripeError', function (e, result){
            if (result.elementType){
                // console.log('type', result);
                if (result.elementType == 'cardNumber'){
                    $('#stripe-card-element').closest('.form-row').addClass('woocommerce-invalid');
                }
                if (result.elementType == 'cardExpiry'){
                    $('#stripe-exp-element').closest('.form-row').addClass('woocommerce-invalid');
                }
                if (result.elementType == 'cardCvc'){
                    $('#stripe-cvc-element').closest('.form-row').addClass('woocommerce-invalid')
                }
            }
        });

        $( 'form.woocommerce-checkout' ).on('submit', function(e){
            $(".error_msg_stripe").remove();
            if ($('#stripe-card-element').length && !$('#stripe-card-element').hasClass('invalid')){
                $('#stripe-card-element').closest('.form-row').removeClass('woocommerce-invalid');
            }
            if ($('#stripe-cvc-element').length && !$('#stripe-cvc-element').hasClass('invalid')){
                $('#stripe-cvc-element').closest('.form-row').removeClass('woocommerce-invalid');
            }
            if ($('#stripe-exp-element').length && !$('#stripe-exp-element').hasClass('invalid')){
                $('#stripe-exp-element').closest('.form-row').removeClass('woocommerce-invalid');
            }
        });
        

        // COUPON AJAX PRO :)) Đây là hàm viết thay thế cho Thịnh, tại Thịnh kêu thịnh đít được
        var edit_for_coupon_payment = function(){
            var coupon = $("#coupon_code_edit").val(),
                url = $("form.woocommerce-form-coupon-edit").data("url")+"/?wc-ajax=apply_coupon",
                security_code = $("#coupon_code_secutity_code").val();
            if(coupon.length<1){return;}
            $.post(url, {coupon_code: coupon, security: security_code}, function(res){
                $(document.body).trigger('update_checkout');
                $(".woocommerce-message").remove();
                sessionStorage.setItem('coupon_msg_ajax', res);
            })
        };
        $("body").on("click", "#btn_coupon_code_edit", function(e){
            e.preventDefault();
            edit_for_coupon_payment();
        });
        $("body").on("keydown", "#coupon_code_edit", function(e){
            if(e.keyCode===13){
                e.preventDefault();
                edit_for_coupon_payment();
            }
        });
        $(document.body).on('update_checkout', function(){
            sessionStorage.removeItem('coupon_msg_ajax');
        });

    });
})(jQuery);
</script>