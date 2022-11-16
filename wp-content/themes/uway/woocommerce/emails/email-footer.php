<?php
/**
 * Email Footer
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/emails/email-footer.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates/Emails
 * @version     2.3.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

?>
<?php $dir = get_template_directory_uri() . '/html/email-template/'; ?>

					<!-- FOOTER EMAIL TEMPLATE -->
                    <div style="background-color:transparent;">
                        <div style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #EBEBEB;"
                            class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#F8F6F4;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 700px;"><tr class="layout-full-width" style="background-color:#eaeaea;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="700" style=" width:700px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"
                            class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 700px;"><tr class="layout-full-width" style="background-color:#ffffff;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="700" style=" width:700px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 700px;display: table-cell;vertical-align: top;">
                                    <div style="background-color: transparent; width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:10px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <?php if ( have_rows( 'email_socials_media', 'options' ) ) : ?>
                                            <div align="center" style="padding-right: 10px; padding-left: 10px; padding-bottom: 10px;"
                                                class="">
                                                <div style="line-height:30px;font-size:1px">&nbsp;</div>
                                                <div style="display: table; max-width:171px;">
                                                    <!--[if (mso)|(IE)]><table width="151" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse; padding-right: 10px; padding-left: 10px; padding-bottom: 10px;"  align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:151px;"><tr><td width="34" style="width:34px; padding-right: 15px;" valign="top"><![endif]-->
                                            		<?php $count=0; $total_count = count(get_field('email_socials_media', 'options'));  while ( have_rows( 'email_socials_media', 'options' ) ) : the_row(); ?>
                                            			<?php 
                                            				$link = get_sub_field( 'email_socials_media_link', 'options' ); 
                                            				$name = get_sub_field( 'email_socials_media_name', 'options' );
                                            			?>
                                                    <table align="left" border="0" cellspacing="0" cellpadding="0"
                                                        width="34" height="22" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: middle;margin-right: 15px; <?php echo $count<$total_count-1?"border-right:1px solid #d2d2d2;":""; ?>display:table-cell;">
                                                        <tbody>
                                                            <tr style="vertical-align: top">
                                                                <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;">
                                                                    <a href="<?php echo esc_url( $link ); ?>" title="<?php echo $name; ?>" target="_blank">
                                                                        <img src="<?php echo $dir; ?><?php echo $name; ?>.png" alt="<?php echo $name; ?>" title="<?php echo $name; ?>" width="20" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 20px !important;">
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <?php $count++; endwhile; ?>
                                                    <!--[if (mso)|(IE)]></td><td width="21" style="width:21px; padding-right: 15px;" valign="top"><![endif]-->
                                                </div>
                                            </div>
                                            <?php endif; ?>

                                            <div class="">
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;"><![endif]-->
                                                <div style="color:#313131;line-height:150%;font-family:'CircularStd', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">
                                                    <div style="font-size:16px;line-height:18px;color:#313131;font-family:'CircularStd', Helvetica, Arial, sans-serif;text-align:left;font-weight: 500;">
                                                        <ul style="list-style: none; text-align: center;padding-left: 0;">
                                                            <li style="display: inline-block; margin-bottom: 5px;">
                                                                <a href="<?php echo get_permalink( get_option( 'woocommerce_myaccount_page_id' ) ); ?>" style="text-decoration: none;color:#313131;font-size:16px;">My Account &nbsp; |</a>
                                                            </li>
                                                            <li style="display: inline-block; margin-left: 10px;margin-bottom: 5px;">
                                                                <a href="<?php echo esc_url( site_url('privacy-policy') ); ?>" style="text-decoration: none;color:#313131;font-size:16px;">Privacy Policy
                                                                    &nbsp; |</a>
                                                            </li>
                                                            <li style="display: inline-block; margin-left: 10px;margin-bottom: 5px;font-size:16px;">
                                                                <a href="#" style="text-decoration: none;color:#313131;font-size:16px;">Delivery, Refund and Returns</a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>

                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
