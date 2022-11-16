<?php
/**
 * My Account page
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/my-account.php.
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

/**
 * My Account navigation.
 *
 * @since 2.6.0
 */
?>

<section class="banner-product spacing-around spacing-header">
    <div class="text-cover">
        <?php if ( get_field( 'my_account_page_title' ) ) : ?><h1 class="title-page"><?php the_field( 'my_account_page_title' ); ?></h1><?php endif; ?>
        <?php if ( get_field( 'my_account_page_description' ) ) : ?><p class="des-page"><?php the_field( 'my_account_page_description' ); ?></p><?php endif; ?>
    </div>
    <?php $my_account_page_id = get_option( 'woocommerce_myaccount_page_id' ); ?>
    <?php $alt = get_post_meta( get_post_thumbnail_id( $my_account_page_id ), '_wp_attachment_image_alt', true ); ?>
    <div class="img-drop"><img class="lazygo" data-src="<?php echo get_the_post_thumbnail_url( $my_account_page_id ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
</section>

<section class="account spacing-around bg-skin">

	<?php do_action( 'woocommerce_account_navigation' ); ?>

	<div class="container spacing-end">
		<div class="tab-content content-account">
			<?php wc_print_notices(); ?>
			<?php
				/**
				 * My Account content.
				 *
				 * @since 2.6.0
				 */
				do_action( 'woocommerce_account_content' );
			?>
		</div>
	</div>
</section>
