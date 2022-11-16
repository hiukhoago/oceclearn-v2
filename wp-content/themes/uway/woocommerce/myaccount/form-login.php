<?php
/**
 * Login Form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/form-login.php.
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

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

do_action( 'woocommerce_before_customer_login_form' ); ?>
<section class="account spacing-around bg-skin">
	<div class="container spacing-end">
		<div class="tab-content content-account">
			<div class="row">
				<div class="col-md-6">  
				    <h2 class="title-page animated fadeInUp margin-bottom">Please login before access to account page !</h2>
				</div>
			</div>
		</div>
	</div>
</section>

<script type="text/javascript">
	jQuery(document).ready(function($) {
		setTimeout(function(){
			$("#login-toggle").trigger('click');
		},500)
	});
</script>

<style type="text/css">
	.backdrop-core {
		pointer-events: none;
	}
	#btn-close-login {
		display: none;
	}
</style>

<?php do_action( 'woocommerce_after_customer_login_form' ); ?>
