<?php
/**
 * Customer new account email
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/customer-new-account.php.
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
	exit; // Exit if accessed directly.
}

?>

<?php 
include_once("email-header.php"); ?>

<div style="line-height: 24px;font-size: 16px;font-weight: 300; letter-spacing: 0.2px;color:#020202;font-family:'Futura', Helvetica, Arial, sans-serif; padding-right: 15px; padding-left: 15px; padding-top: 10px; padding-bottom: 30px;">
	<div style="font-family:'Futura', Helvetica, Arial, sans-serif;font-weight: 300; max-width: 500px; margin: 0 auto;text-align: center;letter-spacing: 0.2px;">

		<?php /* translators: %s Customer first name */ ?>
		<p><?php printf( esc_html__( 'Hi %s,', 'woocommerce' ), esc_html( $user_login ) ); ?></p>
		<?php /* translators: %1$s: Site title, %2$s: Username, %3$s: My account link */ ?>
		<p><?php printf( __( 'Thanks for creating an account on %1$s. As a reminder, the username you chose is %2$s. You can access your account area to view orders, change your password, and more at: %3$s', 'woocommerce' ), esc_html( $blogname ), '<strong>' . esc_html( $user_login ) . '</strong>', make_clickable( esc_url( wc_get_page_permalink( 'myaccount' ) ) ) ); ?></p><?php // phpcs:ignore WordPress.XSS.EscapeOutput.OutputNotEscaped ?>

		<?php if ( 'yes' === get_option( 'woocommerce_registration_generate_password' ) && $password_generated ) : ?>
			<?php /* translators: %s Auto generated password */ ?>
			<p><?php printf( esc_html__( 'Your password has been automatically generated: %s', 'woocommerce' ), '<strong>' . esc_html( $user_pass ) . '</strong>' ); ?></p>
		<?php endif; ?>
	
	</div>
</div>

</div>
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
<?php
include_once("email-footer.php"); 
