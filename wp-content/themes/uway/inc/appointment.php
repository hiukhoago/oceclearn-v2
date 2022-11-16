<?php

/**
 * Function Support
 */
function support_method_date($start, $end) {
    $unbookable = array();
    $start      = new DateTime($start);
    $end        = new DateTime($end);
    $end        = $end->modify( '+1 day' );
    $list_date  = new DatePeriod($start, new DateInterval('P1D'), $end);

    return $list_date;
}

/**
 * Match appointment booking date has same with unbookable date
 */
function match_unbookable_date( $unbookable, $booking ) {
    foreach ( $unbookable as $date ) {
        if ( $booking == $date->format('Ymd') ) {
            return true;
            break;
        }
    }

    return false;
}

/**
 * Function check unbookable
 */
function checking_unbookable_date( $unbookable, $bookingDate ) {
    foreach ($unbookable as $date) {
        if ($date['start_day'] and $date['end_day']) {
            $dates = support_method_date($date['start_day'], $date['end_day']);
            $validate_dates = match_unbookable_date( $dates, $bookingDate );
            if ($validate_dates) {
                $_SESSION['errors'] = array(
                    'appointment' => 'The booking date you selected is not available!'
                );
                return true;
                break;
            }
        }
    }

    return false;
}

/**
 * Function check unbookable method
 */
function checking_unbookable_method( $unbookable, $type, $bookingDate ) {

    switch ($type) {
        case 'face to face':
            $type = 'ftf_unbookable_date';
            break;
        case 'phone':
            $type = 'over_phone_unbookable_date';
            break;
        case 'skype':
            $type = 'skype_unbookable_date';
            break;
    }

    if ($unbookable[$type]) {
        foreach ($unbookable[$type] as $date) {
            if ($date['start_day'] and $date['end_day']) {
                $dates = support_method_date($date['start_day'], $date['end_day']);
                $validate_dates = match_unbookable_date( $dates, $bookingDate );
                if ($validate_dates) {
                    $_SESSION['errors'] = array(
                        'appointment' => 'The booking method you selected is not available!'
                    );
                    return true;
                    break;
                }
            }
        }
    }

    return false;
}


/**
 * Functions check unbookable schedules
 */
function checking_unbookable_schedules( $exclude = null, $employeeID, $bookingDate, $startTime, $endTime ) {

    $args = array(
        'post_type'      => 'appointment',
        'post_status'    => 'publish',
        'posts_per_page' => '-1',
        'meta_query'     => array(
            'relation' => 'AND',
            array(
                'key'     => 'employee',
                'value'   => $employeeID,
                'compare' => '='
            ),
            array(
                'key' => 'booking_date',
                'value' => $bookingDate,
                'type' => 'DATE',
            )
        )
    );

    if ($exclude) {
        $args['post__not_in'] = array($exclude);
    }

    $appointments = get_posts( $args );
    if ($appointments) {
        $up_start = _to_minutes( $startTime );
        $up_end   = _to_minutes( $endTime );
        foreach ($appointments as $appointment) {
            $date      = get_fields( $appointment->ID );
            $old_start = _to_minutes($date['time_start']);
            $old_end   = _to_minutes($date['time_end']);
            if ($bookingDate != str_replace('/', '', $date['booking_date'])) {
                continue;
            }
            // check after
            if ( $up_start >= $old_end ) {
                if ($up_end < $old_end) {
                    $error = true;
                }
            } elseif ( $up_start >= $old_start ) {
                if ($up_start <= $old_end) {
                    $error = true;
                }
            // check before
            } elseif ( $up_start <= $old_start ) {
                if ($up_end > $old_start) {
                    $error = true;
                }
            } elseif ( $up_end - $up_start >= 90 ) {
                $error = true;
            }

            if ($error) {
                $_SESSION['errors'] = array(
                    'appointment' => 'The time you have requested has already been booked!'
                );
                return true;
                break;
            }
        }
    }

    return false;
}

// Add the custom columns to the appointment post type:
add_filter( 'manage_appointment_posts_columns', 'set_custom_edit_appointment_columns' );
function set_custom_edit_appointment_columns($columns) {
    unset( $columns['author'] );
    unset( $columns['date'] );
    unset( $columns['title'] );
    $columns['customer_name'] = __( 'Customer Name', 'uway' );
    $columns['booking_date'] = __( 'Booking Date', 'uway' );
    $columns['employee'] = __( 'Employee', 'uway' );
    $columns['service'] = __( 'Package Name', 'uway' );
    $columns['time_start'] = __( 'Start Time', 'uway' );
    $columns['time_end'] = __( 'End Time', 'uway' );
    $columns['date'] = __( 'Date', 'uway' );
    $columns['status'] = __( 'Status', 'uway' );
    return $columns;
}


// Add the data to the custom columns for the appointment post type:
add_action( 'manage_appointment_posts_custom_column' , 'custom_appointment_column', 10, 2 );
function custom_appointment_column( $column, $post_id ) {
    $data = get_fields( $post_id );
    switch ( $column ) {
        case 'employee' :
            echo $data[$column]->post_title;
            break;
        case 'service' :
            echo $data[$column]->name;
            break;
        case 'booking_date':
            $date = date_create(str_replace('/', '-', $data[$column]));
            echo date_format($date, 'd/m/Y');
            break;
        case 'status' :
            echo get_field ( 'status', $post_id );
            break;
        default:
            echo $data[$column];
            break;
    }
}

// Add sort time start and booking date
add_filter( 'manage_edit-appointment_sortable_columns', 'manage_edit_appointment_sortable_columns_hooks' );
function manage_edit_appointment_sortable_columns_hooks ($columns) {
    $columns['time_start'] = 'time_start';
    $columns['booking_date'] = 'booking_date';
    return $columns;
}

add_action( 'pre_get_posts', 'appointment_date_orderby_hook' );
function appointment_date_orderby_hook ($query) {
    global $pagenow, $post_type;
    if ($query->is_admin and 'edit.php' === $pagenow and 'appointment' === $post_type) {
        $orderby = $query->get('orderby');
        $order = $query->get('order');
        if ($orderby == 'time_start') {
            $query->set('meta_key', 'time_start');
            $query->set('orderby', 'meta_value');
        }
        if ($orderby == 'booking_date') {
            $query->set('meta_key', 'booking_date');
            $query->set('orderby', 'meta_value');
        }
    }
}

// add filter appointment disable time
add_action( 'filter_appointment_disable_time', 'custom_filter_appointment_disable_time' );
if (!function_exists('custom_filter_appointment_disable_time')) {
    function custom_filter_appointment_disable_time($employee_id)
    {
        $time = array();
        // schedule handle
        $schedules = get_posts( array(
            'post_type'      => 'appointment',
            'post_status'    => 'publish',
            'posts_per_page' => '-1',
            'meta_query'     => array(
                array(
                    'key'     => 'employee',
                    'value'   => $employee_id,
                    'compare' => '='
                )
            )
        ) );
        if ($schedules) {
            foreach ($schedules as $schedule) {
                $data         = get_fields( $schedule->ID );
                $booking_date = $data['booking_date'];
                $time_start   = $data['time_start'];
                $time_end     = $data['time_end'];
                if (!$booking_date or !$time_start or !$time_end) {
                    continue;
                }
                $time['schedule'][$booking_date][] = array(
                    'time_start' => $time_start,
                    'time_end'   => $time_end
                );
            }
        }

        // unbookable handle
        $unbookable = get_field( 'unbookable', $employee_id );
        if ($unbookable) {
            foreach ($unbookable as $date) {
                if ($date['start_day'] and $date['end_day']) {
                    $list_date = support_method_date($date['start_day'], $date['end_day']);
                    if ($list_date) {
                        foreach ($list_date as $day) {
                            $time['unbookable'][] = $day->format('Y/m/d');
                        }
                    }
                }
            }
        }
        echo json_encode($time);
    }
}

/**
 * add filter appointment method information
 */
add_action( 'filter_appointment_method_information', 'custom_filter_appointment_method_information' );
if (!function_exists('custom_filter_appointment_method_information')) {
    function custom_filter_appointment_method_information($employee_id) {
        $data = array();

        $methods = get_field( 'method_information', $employee_id );

        if ($methods) {
            // face to face
            if ( $methods['address'] ) {
                $data['ftf_unbookable_date']['infor'] = $methods['address'];
            }

            $list_unbookable = array( 'ftf_unbookable_date', 'over_phone_unbookable_date', 'skype_unbookable_date' );
            foreach ($list_unbookable as $item) {
                if ($methods[$item]) {
                    foreach ($methods[$item] as $date) {
                        $unbookable = support_method_date($date['start_day'], $date['end_day']);
                        if ($unbookable) {
                            foreach ($unbookable as $unbookitem) {
                                $data[$item]['unbookable'][] = $unbookitem->format('Y/m/d');
                            }
                        }
                    }
                }
            }
        }

        echo json_encode($data);
    }
}

// check if staff busy during time before
add_action( 'appointment_validation_before_save', 'check_appointment_validation_before_save', 10, 2 );
if (!function_exists('check_appointment_validation_before_save')) {
    function check_appointment_validation_before_save($employee_id, $data)
    {   
        if (!$data['appointment_booking_date']) {
            wc_add_notice( __( 'Please choose booking date', 'uway' ), 'error' );
        }

        if (!$data['appointment_time_start']) {
            wc_add_notice( __( 'Please choose time start', 'uway' ), 'error' );
        }

        if (!$data['appointment_time_end']) {
            wc_add_notice( __( 'Please choose time end', 'uway' ), 'error' );
        }

        $unbookable_schedules = checking_unbookable_schedules( 
            null, 
            $employee_id, 
            str_replace('/', '', $data['appointment_booking_date']), 
            $data['appointment_time_start'], 
            $data['appointment_time_end']
        );

        if ($unbookable_schedules) {
            unset($_SESSION['errors']['appointment']);
            wc_add_notice( __( 'Our service is not available at this time, please select another choice', 'uway' ), 'error' );
        }

        if ( wc_notice_count( 'error' ) > 0 ) {
            ob_start();
            wc_print_notices();
            $messages = ob_get_clean();
            wp_send_json( array( 'result' => 'failure', 'messages' => $messages ) );
        }
    }
}

/**
 * Only save allow fields
 */
// add_filter('acf/update_value', 'validation_update_appointment', 10, 3);
function validation_update_appointment( $value, $post_id, $field  ) {
    // only do it to certain custom fields
    if ('appointment' == get_post_type($post_id)) {
        $list_exclude = array( 'booking_date', 'time_start', 'time_end', 'status' );
        if( !in_array($field['name'], $list_exclude) )
            $value = get_field($field['name'], $post_id);
    }
    
    return $value;
}

/**
 * Validate date/time before update
 */
add_filter( 'wp_insert_post_empty_content', 'validate_date_time_data_before_update', 10, 2 );
function validate_date_time_data_before_update( $maybe_empty, $postarr ) {
    global $post;
    
    if ($post->post_type != 'appointment') {
        return;
    }

    $error = false;

    // do not allow edit fields key in acf
    $data = array(
        'up_time_start' => $postarr['acf']['field_5d230f84b3dbd'],
        'up_time_end'   => $postarr['acf']['field_5d230f8eb3dbe'],
        'up_date'       => $postarr['acf']['field_5d230f70b3dbc']
    );

    $employee = get_fields( $post->ID );

    // check unbookable day
    $unbookable_date = get_field( 'unbookable', $postarr['acf']['field_5d230f4fb3db9'] );
    if ($unbookable_date) {
        $maybe_empty = checking_unbookable_date( $unbookable_date, $data['up_date'] );
        if ($maybe_empty) {
            return $maybe_empty;
        }
    }

    // check method
    $unbookable_method = get_field( 'method_information', $postarr['acf']['field_5d230f4fb3db9'] );
    if ($unbookable_method) {
        $maybe_empty = checking_unbookable_method( $unbookable_method, $postarr['acf']['field_5d25bcb7c3c0c'], $data['up_date'] );
        if ($maybe_empty) {
            return $maybe_empty;
        }
    }

    // check schedules
    $unbookable_schedules = checking_unbookable_schedules( 
        $post->ID, 
        $employee['employee']->ID, 
        $data['up_date'], 
        $data['up_time_start'], 
        $data['up_time_end']
    );

    if ($unbookable_schedules) {
        $maybe_empty = true;
    } 
    return $maybe_empty;
}

add_filter( 'post_updated_messages', 'customize_admin_actions_messages' );
function customize_admin_actions_messages( $messages ) {
    global $post;
    if ( !$_SESSION['errors']['appointment'] ) {
        return $messages;
    }
    
}

add_action( 'admin_notices', 'customizer_appointment_update_error_notices' );
function customizer_appointment_update_error_notices() {
    if ($_SESSION['errors']['appointment']) {
        $class = 'notice notice-error';
        $message = __( $_SESSION['errors']['appointment'], 'uway' );
        printf( '<div id="message" class="%s is-dismissible"><p>%s</p><button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>', esc_attr( $class ), esc_html( $message ) ); 
        unset($_SESSION['errors']['appointment']);
    }
}

/**
 * Send email confirmation
 */
add_action( 'woocommerce_email_appointment_details', 'woocommerce_email_appointment_details_hooks', 10, 3 );
function woocommerce_email_appointment_details_hooks( $order, $appointment_item, $product_appointment_item )
{
    if (!$appointment_item)
        return;
    $appointment_item = $appointment_item[0];
    $details = get_fields( $appointment_item->ID );
    $booking_details = array(
        'Practitioner' => $details['employee']->post_title,
        'Method'       => $details['method'],
        'Booking Date' => $details['booking_date'],
        'Start Time'   => $details['time_start'],
        'End Time'     => $details['time_end']
    );
    ?>

    <div style="font-weight: 700; font-size: 22px;margin-bottom: 10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight: 700; font-size: 22px;margin-bottom: 10px;"><![endif]-->
        <div style="padding-top: 20px;margin-right:15px;margin-left:15px; padding-bottom: 20px;background-color: #F4F2ED; font-family:'CircularStd', Helvetica, Arial, sans-serif;font-size: 22px; line-height: 30px;text-align: center; color:#000;">
            Appointment: <?php echo str_replace('Appointment', '', $appointment_item->post_title); ?>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
    </div>

    <div style="font-size: 20px; padding-right: 20px; padding-left: 20px; padding-top: 40px; padding-bottom: 40px;margin-bottom: 30px; margin: 0 15px 20px;background:#FAFAFA;" class="custom-pc">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style=" padding-right: 15px; padding-left: 15px; padding-top: 0px; padding-bottom: 0px;margin-bottom: 50px;"><![endif]-->
        <table cellspacing="0" style="font-size: 20px; font-weight: 700;  width: 100%;" class="custom-pc" width="100%">
            <thead>
                <tr>
                    <td style="color:#000;padding-top: 20px; padding-bottom: 10px; width: 50%; border-bottom: 3px solid #474202;font-family:'CircularStd', Helvetica, Arial, sans-serif;" width="50%">Package Name</td>
                    <td align="right" style="padding-top: 20px; padding-bottom: 10px; padding-left: 10px;border-bottom: 3px solid #474202;font-family:'CircularStd', Helvetica, Arial, sans-serif; color:#000;">Price</td>
                </tr>
            </thead>
            <tr>
                <td style="padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8; font-weight: 700; font-size: 16px;font-family:'CircularStd', Helvetica, Arial, sans-serif;text-transform: capitalize;letter-spacing: 0.2px;color:#000;line-height: 24px;" class="custom-pc2" width="50%">
                    <?php echo wp_kses_post( apply_filters( 'woocommerce_order_item_name', $product_appointment_item->get_name(), $product_appointment_item, false ) ); ?>
                    <?php if ('initial-consultation' == $details['service']->slug): ?>
                        <p style="font-size:14px; font-weight: 400;">Please click here to complete this questionnaire at least 1 day before your appointment.</p>
                        <a href="https://forms.gle/ZbDfV5fnVHVPGfCHA" target="_blank">https://forms.gle/ZbDfV5fnVHVPGfCHA</a>
                    <?php endif ?>
                </td>
                <td class="custom-pc2" align="right" style="padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-weight: 500; font-size: 18px;font-family:'CircularStd', Helvetica, Arial, sans-serif;letter-spacing: 0.2px;color:#000;"><?php echo wp_kses_post( $order->get_formatted_line_subtotal( $product_appointment_item ) ); ?></td>
            </tr>
            <?php
                $totals = $order->get_order_item_totals();

                if ( $totals ) {
                    $i = 0;
                    foreach ( $totals as $total ) {
                        $i++;
                        ?>
                        <?php 
                            switch ( $total['label'] ) {
                                case 'Subtotal:': ?>
                                <tr>
                                    <td style="color:#000; padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;color:#000;" width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                    <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 18px;letter-spacing: 0.2px;color:#000;"><?php echo wp_kses_post( $total['value'] ); ?></td>
                                </tr>
                                  <?php  break;
                                case 'Total:': ?>
                                <tr>
                                    <td style="color:#000; padding-top: 20px; padding-bottom: 20px; width: 50%; font-family:'CircularStd', Helvetica, Arial, sans-serif;"width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                    <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;">
                                        <p style="color:#000; font-weight: 700;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-size: 36px;letter-spacing: 0.2px; margin: 0; padding: 0;" ><?php echo sprintf(get_woocommerce_price_format(), get_woocommerce_currency_symbol(), $order->get_total());?></p>
                                        <?php if($order->get_total_tax()!=0):?>
                                        <p style="color:#000; font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 16px;letter-spacing: 0.2px; margin: 0; padding: 0;">(includes <?php echo sprintf(get_woocommerce_price_format(), get_woocommerce_currency_symbol(), $order->get_total_tax());?> Tax)</p>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                                  <?php  break;
                                default: ?>
                                <tr>
                                    <td style="color:#000;padding-top: 20px; padding-bottom: 20px; width: 50%; border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;" width="50%"><?php echo wp_kses_post( $total['label'] ); ?></td>
                                    <td colspan="2" align="right" class="custom-pc2" style="color:#000;padding-top: 20px; padding-bottom: 20px; padding-left: 10px;border-bottom: 1px solid #D8D8D8;font-family:'CircularStd', Helvetica, Arial, sans-serif;font-weight: 500;font-size: 18px;letter-spacing: 0.2px;"><?php echo wp_kses_post( $total['value'] ); ?></td>
                                </tr>
                                  <?php  break;
                            }
                         ?>
                        <?php
                    }
                }
            ?>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
        <div style="font-weight:700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-top: 20px; padding-bottom: 20px;">
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-weight:700; font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px; padding-top: 20px; padding-bottom: 20px"><![endif]-->
            <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 28px;margin: 0 auto" class="medium-title">Booking details</div>
            <!--[if mso]></td></tr></table><![endif]-->
        </div>

        <div style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 18px;  padding-top: 0px; padding-bottom: 0px;">
            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 18px; padding-right: 15px; padding-left: 15px; padding-top: 0px; padding-bottom: 0px;"><![endif]-->
            <table style="font-family:'CircularStd', Helvetica, Arial, sans-serif; font-size: 18px;  margin: 0 auto; width: 100%">
                <?php foreach ($booking_details as $key => $bd): ?>
                    <tr>
                        <td style="font-weight: 700; padding-top: 5px; padding-bottom: 5px; font-family:'CircularStd', Helvetica, Arial, sans-serif">
                            <b><?php echo $key; ?>:</b>
                        </td>
                        <td style="font-weight:400;font-size: 18px;padding-top: 5px; padding-bottom: 5px;color: #000!important; font-family:'AvenirNext', Helvetica, Arial, sans-serif; text-decoration: none!important;">
                            <span><?php echo $bd; ?></span>
                        </td>
                    </tr>
                <?php endforeach ?>
                
                <tr>
                    <td style="font-weight: 700; padding-top: 5px; padding-bottom: 5px; font-family:'CircularStd', Helvetica, Arial, sans-serif">
                        <b>Customer Email:</b>
                    </td>
                    <td style="font-weight:400;font-size: 18px;padding-top: 5px; padding-bottom: 5px;color: #000!important; font-family:'AvenirNext', Helvetica, Arial, sans-serif; text-decoration: none!important;">
                        <span><?php echo $details['customer_email']; ?></span>
                    </td>
                </tr>
                <tr>
                    <td style="font-weight: 700; padding-top: 0; padding-bottom: 0; font-family:'CircularStd', Helvetica, Arial, sans-serif;">
                        <b>Customer Phone Number:</b>
                    </td>
                    <td style="font-weight: 400;font-size: 18px; color: #000; font-family:'AvenirNext', Helvetica, Arial, sans-serif;">
                        <span><?php echo $details['customer_phone']; ?></span>
                    </td>
                </tr>
            </table>
            <!--[if mso]></td></tr></table><![endif]-->
        </div>

    <?php
}

/**
 * BOOK APPOINTMENT - Step 3 - Pick a date time
 */
add_action( 'wp_ajax_appointment-pick-a-date-time', 'appointment_pick_a_date_time_callback' );
add_action( 'wp_ajax_nopriv_appointment-pick-a-date-time', 'appointment_pick_a_date_time_callback' );
function appointment_pick_a_date_time_callback() {
    extract($_GET);

    $methods_block = array();
    $block_method = get_field( 'method_information', $employee_id );
    if (!$block_method)
        return;
    switch ($type) {
        case 'face to face':
            $type = 'ftf_unbookable_date';
            break;
        case 'phone':
            $type = 'over_phone_unbookable_date';
            break;
        case 'skype':
            $type = 'skype_unbookable_date';
            break;
    }

    if ($unbookable[$type]) {
        foreach ($unbookable[$type] as $date) {
            if ($date['start_day'] and $date['end_day']) {
                $dates = support_method_date($date['start_day'], $date['end_day']);
                $validate_dates = match_unbookable_date( $dates, $bookingDate );
                if ($validate_dates) {
                    $_SESSION['errors'] = array(
                        'appointment' => 'The booking method you selected is not available!'
                    );
                    return true;
                    break;
                }
            }
        }
    }
    $methods = array('ftf_unbookable_date', 'over_phone_unbookable_date', 'skype_unbookable_date');
    foreach ($methods as $method) {
        if ($block_method[$method]) {
            foreach ($block_method[$method] as $item) {
                if ($item['start_day'] and $item['end_day']) {
                    $dates = support_method_date($item['start_day'], $item['end_day']);
                    foreach ($dates as $date) {
                        if (0 === strcmp($pick_date, $date->format('Y/m/d'))) {
                            $methods_block[] = $method;
                            break;
                        }
                    }
                }
            }
        }
    }

    wp_send_json( $methods_block );
}

/**
 * Check unbookable date before add appointment to card
 */
add_action( 'wp_ajax_before-add-appointment-to-cart', '_before_add_appointment_to_cart' );
add_action( 'wp_ajax_nopriv_before-add-appointment-to-cart', '_before_add_appointment_to_cart' );
if (!function_exists('_before_add_appointment_to_cart')) {
    function _before_add_appointment_to_cart() {

        extract($_GET);
        $unbookable_schedules = checking_unbookable_schedules( 
            null, 
            $employeeID, 
            str_replace('/', '', $bookingDate), 
            $timeStart, 
            $timeEnd
        );
        if ($unbookable_schedules) {
            $message = $_SESSION['errors']['appointment'];
            unset($_SESSION['errors']['appointment']);
            wp_send_json( array(
                'error' => true,
                'message' => $message
            ) );
            exit();
        }

        $check = false;
        if (sizeof( WC()->cart->get_cart() ) > 0) {
            $check = true;
        }
        wp_send_json( $check );
    }
}

if ( !function_exists ( 'appointment_get_posts') ) {
	add_filter ( 'parse_query', 'appointment_get_posts' );
	/**
     * Add custom pre_gets_posts appointments.
     *
	 * @param $query
	 */
	function appointment_get_posts( $query ) {
		if ( 'appointment'  == $query->query['post_type'] && $query->is_main_query()  ) {
			if ( isset( $_GET['status'] ) ) {
                $meta = array(
                    array(
                        'key' => 'status',
                        'value' => $_GET['status'],
                        'compare' => '=='
                    )
                );
			    $query->set('meta_query',$meta );
			}
		}
	}
}

if ( !function_exists ( 'appointment_filter_screen') ) {
	add_filter ( 'views_edit-appointment', 'appointment_filter_screen', 99, 1 );
	/**
     * Add custom filter screen appointments.
	 * @param $views
	 *
	 * @return mixed
	 */
    function appointment_filter_screen( $views ) {
        unset( $views['publish'] );
        unset( $views['mine'] );
        unset( $views['trash'] );

        $count_completed = get_screen_status_count_appointments( 'completed');
        $count_canceled = get_screen_status_count_appointments( 'canceled');
        $count_pending = get_screen_status_count_appointments( 'pending');
        $count_trash = get_screen_status_count_appointments( 'trash');

        if ( $_GET['status'] == 'completed' ) {
            $views['completed'] = sprintf (
                    '<a class="current" href="%s">' . __ ( 'Completed' ) . ' <span class="count">(%d)</span></a>',
                    admin_url ( 'edit.php?status=completed&post_type=' . get_query_var ( 'post_type' ) . '&c=1'),
                    $count_completed['count_post']
            );
        } else {
            $views['completed'] = sprintf (
                    '<a class="" href="%s">' . __ ( 'Completed' ) . ' <span class="count">(%d)</span></a>',
                    admin_url ( 'edit.php?status=completed&post_type=' . get_query_var ( 'post_type' ) . '&c=1'),
                    $count_completed['count_post']
            );
        }
        if ( $_GET['status'] == 'canceled' ) {
            $views['canceled'] = sprintf (
                    '<a class="current" href="%s">' . __ ( 'Cancelled' ) . ' <span class="count">(%d)</span></a>',
                    admin_url ( 'edit.php?status=canceled&post_type=' . get_query_var ( 'post_type' ) . '&b=1'),
                    get_screen_status_count_appointments( 'canceled'),
                    $count_canceled['count_post']
            );
        } else {
            $views['canceled'] = sprintf (
                '<a class="" href="%s">' . __ ( 'Cancelled' ) . ' <span class="count">(%d)</span></a>',
                admin_url ( 'edit.php?status=canceled&post_type=' . get_query_var ( 'post_type' ) . '&b=1'),
                get_screen_status_count_appointments( 'canceled'),
                $count_canceled['count_post']
            );
        }

        if ( $_GET['status'] == 'pending' ) {
            $views['pending'] = sprintf (
                    '<a class="current" href="%s">' . __ ( 'Pending' ) . ' <span class="count">(%d)</span></a>',
                    admin_url ( 'edit.php?status=pending&post_type=' . get_query_var ( 'post_type' ) ),
                    $count_pending['count_post']
            );
        } else {
            $views['pending'] = sprintf (
                    '<a class="" href="%s">' . __ ( 'Pending' ) . ' <span class="count">(%d)</span></a>',
                    admin_url ( 'edit.php?status=pending&post_type=' . get_query_var ( 'post_type' ) ),
                    $count_pending['count_post']
            );
        }

        $views['trash'] = sprintf (
                '<a class="" href="%s">' . __ ( 'Trash' ) . ' <span class="count">(%d)</span></a>',
                admin_url ( 'edit.php?post_status=trash&post_type=' . get_query_var ( 'post_type' ) ),
                $count_trash['count_post']
        );

        return $views;
    }
}

if ( !function_exists ( 'get_screen_status_count_appointments') ) {

    /**
    * @param $status
    *
    * @return mixed
    */
    function get_screen_status_count_appointments( $status ) {
    	$status_info = array();
        $args = array(
            'post_type' => 'appointment',
            'numberposts' => -1
        );

        if ( 'trash' == $status ) {
            $args['post_status'] = 'trash';
        } else {
            $args['meta_query'] = array(
                array(
                    'key' => 'status',
                    'value' => $status,
                    'compare' => 'NOT EXITS',
                )
            );
        }
        $query = new WP_Query( $args );

        if ( !empty( $query->found_posts) ) {
        	$status_info['count_post'] = $query->found_posts;
        }

        return $status_info;
    }
}

if ( !function_exists ( 'add_custom_admin_css') ) {
	add_action('admin_head', 'add_custom_admin_css');
	/**
    * Add custom css for admin
    */
    function add_custom_admin_css() {
        ?>
            <style type="text/css">
                td.status.column-status {
                    text-transform: uppercase;
                    font-weight: bold;
                }
            </style>
        <?php
    }
}