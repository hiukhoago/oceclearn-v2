<?php
/**
 * Login form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/global/form-login.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     3.3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( is_user_logged_in() ) {
	return;
}

?>


    <!-- <h1 class="title-product mb-45">Who is placing this order?</h1><a class="btn-white mb-45" href="#"><i class="icon fb-square"></i> Sign up with Facebook</a>
    <form action="">
        <p class="form-row form-row-wide">
            <label for="">Email address</label>
            <input type="email" value="">
        </p>
        <p class="form-row form-row-wide">
            <label for="">Password</label>
            <input type="password" value="">
        </p>
        <div class="lost-pw text-center"><a class="text-futura" href="<?php echo esc_url( wc_lostpassword_url() ); ?>">Forgot your password?</a></div>
        <p class="form-row form-row-first"> 
            <button class="btn-black full-width" type="submit">GO TO SHIPPING DETAILS</button>
        </p>
        <p class="form-row form-row-last"><a id="guest-checkout" class="btn-transparent full-width" href="#">CONTINUE AS GUEST</a></p>
    </form>
</div> -->

<div class="checkout-width custom-form checkout-login">
	
	<h1 class="title-product mb-45">Log in or Sign up below</h1>

	<a class="btn-white mb-45" href="javascript:void(0)" onclick="fb_login();"><i class="icon fb-square"></i> Continue with Facebook</a>

	<form class="woocommerce-form woocommerce-form-login login" method="post" <?php echo ( $hidden ) ? 'style="display:none;"' : ''; ?>>

		<?php do_action( 'woocommerce_login_form_start' ); ?>

		<p class="form-row form-row-wide">
			<label for="username"><?php esc_html_e( 'Username or email', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
			<input type="text" class="input-text" name="username" id="username" autocomplete="username" />
		</p>
		<p class="form-row form-row-wide">
			<label for="password"><?php esc_html_e( 'Password', 'woocommerce' ); ?>&nbsp;<span class="required">*</span></label>
			<input class="input-text" type="password" name="password" id="password" autocomplete="current-password" />
		</p>
		<div class="clear"></div>

		<?php do_action( 'woocommerce_login_form' ); ?>

		<p class="form-row form-row-first rememberme">
			<label class="woocommerce-form__label woocommerce-form__label-for-checkbox inline" for="rememberme">
				<input class="woocommerce-form__input woocommerce-form__input-checkbox d-none" name="rememberme" type="checkbox" id="rememberme" value="forever" /> <span><?php esc_html_e( 'Remember me', 'woocommerce' ); ?></span>
			</label>
		</p>

		<p class="form-row form-row-last lost-pw text-right"> 
			<a class="text-futura" href="<?php echo esc_url( wc_lostpassword_url() ); ?>">Forgot your password?</a>
		</p>

		<p class="form-row form-row-first"> 
			<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
			<button type="submit" class="button btn-black full-width" name="login" value="<?php esc_attr_e( 'GO TO SHIPPING DETAILS', 'woocommerce' ); ?>"><?php esc_html_e( 'CONTINUE', 'woocommerce' ); ?></button>
			<input type="hidden" name="redirect" value="<?php echo esc_url( $redirect ) ?>" />
			
		</p>
		<?php if (!has_health_programs_in_cart()): ?>
			<p class="form-row form-row-last"><a id="guest-checkout" class="btn-transparent full-width" href="#">CONTINUE AS GUEST</a></p>
		<?php else: ?>
			<p class="form-row form-row-last"><a class="btn-transparent full-width" href="#" id="showSignUp">Register an account</a></p>
		<?php endif ?>

		<div class="clear"></div>

		<script type="text/javascript">
			jQuery(document).ready(function($) {
				$("#showSignUp").on('click', function(event) {
					event.preventDefault();
					$("#login-toggle").trigger('click');
					$("#sign-up-show").trigger('click');
				});
			});
		</script>

		<?php do_action( 'woocommerce_login_form_end' ); ?>

	</form>
</div>
