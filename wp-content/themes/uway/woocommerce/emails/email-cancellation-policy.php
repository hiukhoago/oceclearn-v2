<?php
	if($order) {
		$appointment = check_if_order_has_appointment_item($order);
		if ( $appointment ) {
			$term_id = get_field('appointment_cancellation_policy','option');
		}
		else {
			$term_id = get_field('default_term_condition','option');
		}
	}
	
?>
</div>
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>

<?php if (isset($term_id) && $term_id > 0 ) : ?>
<?php 
	$terms         = get_post( $term_id );
	$terms_content = has_shortcode( $terms->post_content, 'woocommerce_checkout' ) ? '' : wc_format_content( $terms->post_content );
?>
<div style="background-color:transparent;">
  <div style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;"
      class="block-grid ">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
			<div style="line-height: inherit; color: #000000; padding: 20px;">

				<div style="line-height: 28px; font-family: 'AvenirNext', Helvetica, Arial, sans-serif; font-weight: 400; font-size: 18px; margin: 0 auto; letter-spacing: 0.2px;">
					<?php echo $terms_content; ?></div>
			</div>
		</div>
	</div>
</div>
<?php endif; ?>