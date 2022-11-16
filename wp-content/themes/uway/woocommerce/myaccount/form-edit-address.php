<?php
/**
 * Edit address form
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/myaccount/form-edit-address.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

$current_user = wp_get_current_user();

global $wp, $woocommerce;

?>

<?php 
	if ( isset( $_POST[ 'save_address' ] ) ) {

		if ( 'POST' !== strtoupper( $_SERVER['REQUEST_METHOD'] ) ) {
			return;
		}

		if ( empty( $_POST['action'] ) || 'edit_address' !== $_POST['action'] ) {
			return;
		}

		wc_nocache_headers();

		$user_id = get_current_user_id();

		if ( $user_id <= 0 ) {
			return;
		}

		$different_shipping = $_POST[ 'different-shipping-address' ] ?? 'no';

		$load_address = ( 'on' === $different_shipping ) ? array( 'billing', 'shipping' ) : array( 'billing' );

		foreach ( $load_address as $address_title ) {

			if ( $_POST[ $address_title . '_country' ] ) {
				$address = new WC_Countries;
				$address = $address->get_address_fields( esc_attr( $_POST[ $address_title . '_country' ] ), $address_title . '_' );
			}

			foreach ( $address as $key => $field ) {

				if ( ! isset( $field['type'] ) ) {
					$field['type'] = 'text';
				}

				// Get Value.
				switch ( $field['type'] ) {
					case 'checkbox' :
						$_POST[ $key ] = (int) isset( $_POST[ $key ] );
						break;
					default :
						$_POST[ $key ] = isset( $_POST[ $key ] ) ? wc_clean( $_POST[ $key ] ) : '';
						break;
				}

				$_POST[ $key ] = apply_filters( 'woocommerce_process_myaccount_field_' . $key, $_POST[ $key ] );

				if ( ! empty( $field['required'] ) && empty( $_POST[ $key ] ) ) {
					wc_add_notice( sprintf( __( '%s %s is a required field.', 'woocommerce' ), ucfirst( $address_title ), lcfirst( $field['label'] ) ), 'error' );
				}

				if ( ! empty( $_POST[ $key ] ) ) {
					if ( ! empty( $field['validate'] ) && is_array( $field['validate'] ) ) {
						foreach ( $field['validate'] as $rule ) {
							switch ( $rule ) {
								case 'postcode' :
									$_POST[ $key ] = strtoupper( str_replace( ' ', '', $_POST[ $key ] ) );
									if ( ! WC_Validation::is_postcode( $_POST[ $key ], $_POST[ $address_title . '_country' ] ) ) {
										wc_add_notice( __( 'Please enter a valid ' .$address_title. ' postcode / ZIP.', 'woocommerce' ), 'error' );
									} else {
										$_POST[ $key ] = wc_format_postcode( $_POST[ $key ], $_POST[ $address_title . '_country' ] );
									}
									break;
								case 'phone' :
									if ( ! WC_Validation::is_phone( $_POST[ $key ] ) ) {
										wc_add_notice( sprintf( __( '%s is not a valid ' .$address_title. ' phone number.', 'woocommerce' ), '<strong>' . $field['label'] . '</strong>' ), 'error' );
									}
									break;
								case 'email' :
									$_POST[ $key ] = strtolower( $_POST[ $key ] );

									if ( ! is_email( $_POST[ $key ] ) ) {
										wc_add_notice( sprintf( __( '%s is not a valid ' .$address_title. ' email address.', 'woocommerce' ), '<strong>' . $field['label'] . '</strong>' ), 'error' );
									}
									break;
							}
						}
					}
				}

				do_action( 'woocommerce_after_save_address_validation', $user_id, $address_title, $address );
			}
		}

		if ( 0 === wc_notice_count( 'error' ) ) {
			$customer = new WC_Customer( $user_id );

			if ( $customer ) {
				foreach ( $load_address as $address_title ) {
					if ( $_POST[ $address_title . '_country' ] ) {
						$address = new WC_Countries;
						$address = $address->get_address_fields( esc_attr( $_POST[ $address_title . '_country' ] ), $address_title . '_' );
					}

					foreach ( $address as $key => $field ) {
						if ( is_callable( array( $customer, "set_$key" ) ) ) {
							$customer->{"set_$key"}( wc_clean( $_POST[ $key ] ) );
						} else {
							$customer->update_meta_data( $key, wc_clean( $_POST[ $key ] ) );
						}

						if ( WC()->customer && is_callable( array( WC()->customer, "set_$key" ) ) ) {
							WC()->customer->{"set_$key"}( wc_clean( $_POST[ $key ] ) );
						}
					}
				}

				$customer->save();
			}

			wc_add_notice( __( 'Address changed successfully.', 'woocommerce' ) );

			foreach ( $load_address as $address_title ) {
				do_action( 'woocommerce_customer_save_address', $user_id, $address_title );
			}
		}
	}
 ?>

<div class="row">
	<div class="col-md-3">  
        <h2 class="title-page animated fadeInUp margin-bottom">Address<br> book</h2>
    </div>
    <div class="col-md-9">
		<?php wc_print_notices(); ?>

		<?php do_action( 'woocommerce_before_edit_account_address_form' ); ?>
		
		<div class="custom-form">
			<form method="post" action="#">
				<?php 
					wp_enqueue_script( 'wc-country-select' );
					wp_enqueue_script( 'wc-address-i18n' );
				?>

				<div class="fieldset billing">
					<h3>Billing address</h3>
					<?php do_action( "woocommerce_before_edit_address_form_billing" ); ?>

					<?php 
						$billing = WC()->countries->get_address_fields( get_user_meta( get_current_user_id(), 'billing_country', true ), 'billing_' );
						foreach ( $billing as $key => $field ) {

							$value = get_user_meta( get_current_user_id(), $key, true );

							if ( ! $value ) {
								switch ( $key ) {
									case 'billing_email':
										$value = $current_user->user_email;
										break;
									case 'billing_country':
										$value = WC()->countries->get_base_country();
										break;
									case 'billing_state':
										$value = WC()->countries->get_base_state();
										break;
								}
							}

							$billing[ $key ]['value'] = apply_filters( 'woocommerce_my_account_edit_address_field_value', $value, $key, 'billing' );
						}
						$billing = apply_filters( 'woocommerce_address_to_edit', $billing, 'billing' );

						foreach ( $billing as $key => $field ) {
							if ( isset( $field['country_field'], $billing[ $field['country_field'] ] ) ) {
								$field['country'] = wc_get_post_data_by_key( $field['country_field'], $billing[ $field['country_field'] ]['value'] );
							}
							woocommerce_form_field( $key, $field, wc_get_post_data_by_key( $key, $field['value'] ) );
						}
					?>
					
					<?php do_action( "woocommerce_after_edit_address_form_billing" ); ?>

				</div>
				
				<?php $customer_shipping = get_user_meta( get_current_user_id(), 'shipping_country', true ); ?>
				<div class="active-show-shipping-fieldset">
                    <input type="checkbox" name="different-shipping-address" id="show-shipping-fieldset" <?php if ( !empty( $customer_shipping ) ) echo 'checked'; ?> />
                    <label for="show-shipping-fieldset">Different shipping address ?</label>
                </div>

                <div class="fieldset shipping" style="display: none">
                    <h3>Shipping address</h3>

                    <?php do_action( "woocommerce_before_edit_address_form_shipping" ); ?>

					<?php 
						$shipping = WC()->countries->get_address_fields( get_user_meta( get_current_user_id(), 'shipping_country', true ), 'shipping_' );
						foreach ( $shipping as $key => $field ) {

							$value = get_user_meta( get_current_user_id(), $key, true );

							if ( ! $value ) {
								switch ( $key ) {
									case 'shipping_email':
										$value = $current_user->user_email;
										break;
									case 'shipping_country':
										$value = WC()->countries->get_base_country();
										break;
									case 'shipping_state':
										$value = WC()->countries->get_base_state();
										break;
								}
							}

							$shipping[ $key ]['value'] = apply_filters( 'woocommerce_my_account_edit_address_field_value', $value, $key, 'shipping' );
						}
						$shipping = apply_filters( 'woocommerce_address_to_edit', $shipping, 'shipping' );

						foreach ( $shipping as $key => $field ) {
							if ( isset( $field['country_field'], $shipping[ $field['country_field'] ] ) ) {
								$field['country'] = wc_get_post_data_by_key( $field['country_field'], $shipping[ $field['country_field'] ]['value'] );
							}
							woocommerce_form_field( $key, $field, wc_get_post_data_by_key( $key, $field['value'] ) );
						}
					 ?>

					<?php do_action( "woocommerce_after_edit_address_form_shipping" ); ?>

                </div>
				
				<p class="form-row no-margin">
					<button type="submit" class="button btn-black" name="save_address" value="<?php esc_attr_e( 'Save address', 'woocommerce' ); ?>"><?php esc_html_e( 'Save changes', 'woocommerce' ); ?></button>
					<input type="hidden" name="action" value="edit_address" />
				</p>

			</form>
		</div>

    </div>
</div>



<!-- <?php if ( ! $load_address ) : ?>
	<?php wc_get_template( 'myaccount/my-address.php' ); ?>
<?php else : ?>

	<form method="post">

		<h3><?php echo apply_filters( 'woocommerce_my_account_edit_address_title', $page_title, $load_address ); ?></h3><?php // @codingStandardsIgnoreLine ?>

		<div class="woocommerce-address-fields">
			<?php do_action( "woocommerce_before_edit_address_form_{$load_address}" ); ?>

			<div class="woocommerce-address-fields__field-wrapper">
				<?php
				foreach ( $address as $key => $field ) {
					if ( isset( $field['country_field'], $address[ $field['country_field'] ] ) ) {
						$field['country'] = wc_get_post_data_by_key( $field['country_field'], $address[ $field['country_field'] ]['value'] );
					}
					woocommerce_form_field( $key, $field, wc_get_post_data_by_key( $key, $field['value'] ) );
				}
				?>
			</div>

			<?php do_action( "woocommerce_after_edit_address_form_{$load_address}" ); ?>

			<p>
				<button type="submit" class="button" name="save_address" value="<?php esc_attr_e( 'Save address', 'woocommerce' ); ?>"><?php esc_html_e( 'Save address', 'woocommerce' ); ?></button>
				<?php wp_nonce_field( 'woocommerce-edit_address', 'woocommerce-edit-address-nonce' ); ?>
				<input type="hidden" name="action" value="edit_address" />
			</p>
		</div>

	</form>

<?php endif; ?> -->

<?php do_action( 'woocommerce_after_edit_account_address_form' ); ?>
