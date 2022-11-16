<?php
/**
 * Template Name: Appointment Page
 */
get_header();
$uri = get_template_directory_uri()."/html/";
?>
<!-- APPOINTMENT: BANNER-->
<section class="banner-product spacing-around spacing-header appointment-banner">
    <div class="text-cover">
        <h1 class="title-page"><?php the_title(); ?></h1>
        <?php while(have_posts()) : the_post();?>
            <p class="des-page"><?php the_content(); ?></p>
        <?php endwhile ?>
    </div>
    <?php if (has_post_thumbnail()): ?>
        <div class="img-drop lazyload" data-src="<?php the_post_thumbnail_url( $size = 'full' ); ?>"></div>
    <?php endif ?>
</section>
<!-- APPOINTMENT: BENEFITS-->
<section class="appointment-benefits spacing-around bg-skin">
    <div class="container">
        <!--ROW TITLE-->
        <div class="row">
            <?php if (get_field( 'benefits_title' )): ?>
                <div class="col-lg-5">
                    <h2 class="title-page"><?php the_field( 'benefits_title' ); ?></h2>
                </div>
            <?php endif ?>
            <?php if (get_field( 'benefits_description' )): ?>
                <div class="col-lg-7"><?php the_field( 'benefits_description' ); ?></div>
            <?php endif ?>
        </div>
        <!--ROW BENEFITS BLOCK-->
        <?php if ($benefits = get_field( 'benefits' )): ?>
            <div class="row row-benefits-block">
                <?php foreach ($benefits as $benefit): ?>
                    <div class="col-lg-4">
                        <div class="block-benefit">
                            <div class="flex-row">
                                <h3 class="medium-title"><?php echo $benefit['title']; ?></h3>
                                <?php if ($image = $benefit['image']): ?>
                                    <img src="<?php echo $image['sizes']['large']; ?>" alt="<?php echo $image['alt']; ?>">
                                <?php endif ?>
                            </div>
                            <?php echo $benefit['description']; ?>
                        </div>
                    </div>
                <?php endforeach ?>
            </div>
        <?php endif ?>
    </div>
</section>
<?php $dir = get_template_directory_uri() . '/html/'; ?>
<?php
    $appointments = array(
        // Type & Status Parameters
        'post_type'     => 'product',
        'post_status'   => 'publish',
        // Order & Orderby Parameters
        'order'         => 'ASC',
        'orderby'       => 'menu_order date',
        // Pagination Parameters
        'posts_per_page'=> -1,
        // Taxonomy Parameters
        'tax_query' => array(
            array(
                'taxonomy'=> 'product_cat',
                'field'   => 'slug',
                'terms'   => array( 'appointment' ),
                'operator'=> 'IN',
            )
        ),
    );
    $appointments = new WP_Query( $appointments );
?>
<?php if ($appointments->have_posts()): ?>
    <!-- APPOINTMENT: MEET PRACTITIONERS-->
    <section class="booking-appointment spacing-around pb-80">
        <div class="container-stepper">
            <div class="wrapper-effect">
                <div class="holder-box-info">
                    <div class="box-info-pick">
                        <div class="item-inner">
                            <i class="icon edit-icon edit-back" data-step="1"></i>
                            <div class="step-number">STEP 1</div>    
                            <div class="title">Practitioner</div>
                            <div class="text"><span class="practitioner-name"></span></div>
                        </div>
                        <div class="item-inner">
                            <i class="icon edit-icon edit-back" data-step="2"></i>
                            <div class="step-number">STEP 2</div>    
                            <div class="title">Consultation</div>
                            <div class="text"><span class="consultation-title"></span></div>
                        </div>
                        <div class="item-inner">
                            <i class="icon edit-icon edit-back" data-step="3"></i>
                            <div class="step-number">STEP 3</div>
                            <div class="date-time-flex">
                                <div class="datetime-wrapper">
                                    <div class="title">Date</div>
                                    <div class="text"><span class="date-chosen"><span class="mask-data">DD - MM - YYYY</span></span></div>
                                </div>
                                <div class="datetime-wrapper">
                                    <div class="title">Time</div>
                                    <div class="text"><span class="time-start"><span class="mask-data">HH</span></span><span class="time-end"><span class="mask-data">: mm</span></span></div>
                                </div>
                            </div>
                        </div>
                        <div class="item-inner">
                            <i class="icon edit-icon edit-back" data-step="4"></i>
                            <div class="step-number">STEP 4</div>
                            <div class="title">Method of appointment</div>
                            <div class="text"><span class="method-name"><span class="mask-data">SELECT METHOD</span></span></div>
                        </div>
                    </div>
                </div>
                <!--INTRO PRACTITIONERS-->
                <div class="container-fluid row-intro active">
                    <h2 class="title-page text-green text-center mobile-appointment-title">Meet Our Practitioners</h2>
                    <div class="row">
                        <div class="col-12 order-lg-2">
                            <div class="row">
                                <div class="col-lg-7 offset-lg-5">
                                    <div class="wrap-slider">
                                        <?php $k = 0; ?>
                                        <div class="owl-carousel practitioners-slider">
                                            <?php while ($appointments->have_posts()) : $appointments->the_post(); ?>
                                                <a class="practitioner-item <?php echo $k==0?'active':''?>" href="#">
                                                    <?php if (has_post_thumbnail()): ?>
                                                        <div class="img-drop"><img src="<?php the_post_thumbnail_url( 'medium' ) ?>" alt="<?php the_title(); ?>"></div>
                                                    <?php endif ?>
                                                    <div class="practitioner-text">
                                                        <h5><span class="desktop-name"><?php echo explode(' ', get_the_title())[0]; ?></span><span class="mobile-name"><?php echo get_the_title();?></span></h5>
                                                        <?php if (get_field( 'subtitles' )): ?>
                                                            <div class="abbr-pos"><?php the_field( 'subtitles' ); ?></div>
                                                        <?php endif ?>
                                                    </div>
                                                </a>
                                                <?php $k++; ?>
                                            <?php endwhile; wp_reset_postdata(); ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="owl-profile owl-carousel">
                                <?php while ($appointments->have_posts()) : $appointments->the_post(); ?>
                                    <?php $product = wc_get_product(get_the_ID()); ?>
                                    <div class="row">
                                        <?php if (has_post_thumbnail()): ?>
                                            <div class="col-lg-5">
                                                <div class="wrap-avt">
                                                    <div class="img-drop big-avt ratio-11">
                                                        <img src="<?php the_post_thumbnail_url('large'); ?>" alt="<?php the_title(); ?>">
                                                    </div>
                                                </div>
                                            </div>
                                        <?php endif ?>
                                        <div class="col-lg-7">
                                            <div class="wrapper-intro">
                                                <h2 class="title-page text-green desktop-appointment-title">Meet Our Practitioners</h2>
                                                <h3 class="title-section"><?php the_title(); ?></h3>
                                                <?php if (get_field( 'subtitles' )): ?>
                                                    <div class="abbr-pos"><?php the_field( 'subtitles' ); ?></div>
                                                <?php endif ?>
                                                <?php if (has_excerpt()): ?>
                                                    <div class="short-des"><?php the_excerpt(); ?></div>
                                                <?php endif ?>
                                                <?php if (get_field( 'degree' )): ?>
                                                    <div class="degree-info"><?php the_field( 'degree' ); ?></div>
                                                <?php endif ?>
                                                <a 
                                                    class="btn-common bg-green book-appointment-btn" 
                                                    href="#"
                                                    <?php if ($product->is_type('variable')): ?>
                                                    data-appointment-variation='<?php echo apply_filters( 'filter_appointment_variation', $product->get_available_variations() ); ?>'
                                                    <?php endif ?>
                                                    data-appointment-disable='<?php do_action( 'filter_appointment_disable_time', get_the_ID() ); ?>'
                                                    data-appointment-method='<?php do_action( 'filter_appointment_method_information', get_the_ID() ); ?>'
                                                    data-employee-id="<?php echo get_the_ID(); ?>"
                                                >
                                                    <div class="pos">BOOK with <?php echo explode(' ', get_the_title())[0]; ?></div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                <?php endwhile; wp_reset_postdata(); ?>
                            </div>
                        </div>
                    </div>
                  
                </div>
                <!--STEP 1-->
                <div class="container-fluid row-step-1">
                    <div class="row-top-step"><a class="btn-common trans return-step" href="#">
                            <div class="pos">CLOSE</div></a>
                        <h3 class="text-center title-page">Book an appointment</h3>
                    </div>
                    <div class="wrapper-stepper">
                        <form action="">
                            <div class="step-slide-1 stepper">
                                <div class="row default" data-step="1">
                                    <div class="col-xl-2">
                                        <div class="step-number">STEP 1</div>
                                        <div class="step-title" data-step="1">Practitioner of choice</div>                                        
                                        <i class="icon edit-icon edit-back-mobile"></i>
                                    </div>
                                    <div class="col-xl-9">
                                        <div class="text-mobile"><span class="practitioner-name selected-checker"></span></div>
                                        <div class="selection-practitioner-list mobile-toggle-wrapper">
                                            <?php $c = 0; ?>
                                            <?php while ($appointments->have_posts()) : $appointments->the_post(); ?>
                                                <a class="selection-practitioner text-center <?php echo $c==0?'active':''?>" href="#">
                                                    <?php if (has_post_thumbnail()): ?>
                                                        <div class="img-drop"><img src="<?php the_post_thumbnail_url( 'medium' ) ?>" alt="<?php the_title(); ?>"></div>
                                                    <?php endif ?>
                                                    <h5><?php echo explode(' ', get_the_title())[0]; ?></h5>
                                                </a>
                                                <?php $c++; ?>
                                            <?php endwhile; wp_reset_postdata(); ?>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" data-step="2">
                                    <div class="col-xl-2">
                                        <div class="step-number">STEP 2</div>
                                        <div class="step-title" data-step="2">Consultation selection</div>
                                        <i class="icon edit-icon edit-back-mobile"></i>
                                    </div>
                                    <div class="col-xl-9">
                                        <div class="text-mobile"><span class="consultation-title selected-checker"></span></div>
                                        <div class="consult-wrapper-append mobile-toggle-wrapper"></div>
                                    </div>
                                </div>
                                <!-- APPOINTMENT STEP : 3-->
                                <div class="row" data-step="3">
                                    <div class="col-xl-2">
                                        <div class="step-number">STEP 3</div>
                                        <div class="step-title" data-step="3">Pick a date & time</div>
                                        <i class="icon edit-icon edit-back-mobile"></i>
                                    </div>
                                    <div class="col-xl-9">
                                        <div class="text-mobile">
                                            <div class="date-time-flex">
                                                <div class="datetime-wrapper">
                                                    <div class="title">Date</div>
                                                    <div class="text"><span class="date-chosen selected-checker"></span></div>
                                                </div>
                                                <div class="datetime-wrapper">
                                                    <div class="title">Time</div>
                                                    <div class="text"><span class="time-start selected-checker"></span><span class="time-end selected-checker"></span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="wrapper-step-4 mobile-toggle-wrapper">
                                            <div class="calendar-custom">
                                                <div class="wrap-calendar">
                                                    <div id="calendar"></div>
                                                    <div class="wrap-slide-time-picker">
                                                        <div class="title-time-picker">
                                                            <i class="fa fa-chevron-left time-picker-back"></i>Time
                                                        </div>
                                                        <div class="time-picker-box">
                                                            <?php 
                                                                $html = '';
                                                                $hour = 9;
                                                                $minute = 0;
                                                                for ($i = 0; $i <= 16; $i++) {
                                                                    $minute = ($minute == 30) ? '30'  : '00';
                                                                    $html = '<div class="item-time-picker">';
                                                                    $html .= '<input id="time-picker-'.$i.'" type="radio" name="time-picker" 
                                                                    value="'.$hour.'.'.$minute.'">';
                                                                    $html .= '<label for="time-picker-'.$i.'">'.$hour.'.'.$minute.'</label>';
                                                                    $html .= '</div>';
                                                                    $minute = $minute + 30;
                                                                    $hour =  ($minute == 30) ? $hour : ($hour + 1);
                                                                    echo $html;
                                                                }                                             
                                                            ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" data-step="4">
                                    <div class="col-xl-2">
                                        <div class="step-number">STEP 4</div>
                                        <div class="step-title" data-step="4">Method of Appointment</div>
                                        <i class="icon edit-icon edit-back-mobile"></i>
                                    </div>
                                    <div class="col-xl-9">           
                                        <div class="text-mobile"><span class="method-name selected-checker"></span></div>                    
                                        <div class="method-wrapper-append mobile-toggle-wrapper">
                                            <div class="method-wrapper">
                                                <input id="method-1" type="radio" name="method" value="face to face">
                                                <label for="method-1">FACE TO FACE</label>
                                            </div>
                                            <div class="method-wrapper">
                                                <input id="method-2" type="radio" name="method" value="over phone">
                                                <label for="method-2">OVER PHONE</label>
                                            </div>
                                            <div class="method-wrapper">
                                                <input id="method-3" type="radio" name="method" value="skype">
                                                <label for="method-3">SKYPE</label>
                                            </div>
                                        </div>
                                        <div class="method-content-info">
                                            <div class="method-face-info">
                                            </div>
                                            <?php if (get_field( 'appointment_booking_method', 'options' )): ?>
                                                <div class="method-extra-info">
                                                    <?php the_field( 'appointment_booking_method', 'options' ); ?>
                                                </div>
                                            <?php endif ?>
                                        </div>
                                    </div>
                                </div>
                            
                            </div>
                            <div class="text-center row-bottom-step">
                                <a class="book-step-next show" href="#" data-id=""></a>
                                <a class="btn-transparent book-step-prev" href="#">BACK</a>
                                <a class="btn-black book-step-final btn-final-step" href="#" data-product-id="" data-service-id="">$<span></span>&nbsp;- PAY FOR BOOKING</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </section>
<?php endif ?>

<!-- APPOINTMENT: WHAT WILL YOU GET?-->
<section class="what-will-get spacing-around bg-skin pb-80" 
    <?php if ($background = get_field( 'you_will_get_image' )): ?>
        style="background-image: url('<?php echo $background['sizes']['large']; ?>')"
    <?php endif ?>
>
    <div class="container">
        <div class="row">
            <?php if (get_field( 'you_will_get_title' )): ?>
                <div class="col-lg-5">
                    <h2 class="title-page"><?php the_field( 'you_will_get_title' ); ?></h2>
                </div>
            <?php endif ?>
            <div class="col-lg-7">
                <?php if (get_field( 'you_will_get_description' )): ?>
                    <?php the_field( 'you_will_get_description' ); ?>
                <?php endif ?>
                <a class="btn-common bg-green to-booking-section" href="#">
                    <div class="pos">BOOK NOW</div>
                </a>
            </div>
        </div>
    </div>
</section>
<?php if ($pricings = get_field( 'pricings' )): ?>
    <!-- APPOINTMENT: PRICING-->
    <section class="appointment-pricing bg-green pb-80">
        <div class="container">
            <div class="wrap-title text-center">
                <?php if (get_field( 'pricing_title' )): ?>
                    <h2 class="title-page text-center"><?php the_field( 'pricing_title' ); ?></h2>
                <?php endif ?>
                <?php if (get_field( 'pricing_description' )): ?>
                    <div class="desc">
                        <?php the_field( 'pricing_description' ); ?>
                    </div>
                <?php endif ?>
            </div>
            <div class="wrap-appointment-pricing-content">
                <div class="wrap-width">
                    <div class="owl-carousel slider-pricing">
                        <?php foreach ($pricings as $pricing): ?>
                            <div class="block-pricing">
                                <div class="item-pricing text-center">
                                    <?php if ($pricing['title']): ?>
                                        <h3 class="item-top"><?php echo $pricing['title']; ?></h3>
                                    <?php endif ?>
                                    <div class="bg-skin">
                                        <?php if ($image = $pricing['image']): ?>
                                            <div class="item-icon"><img src="<?php echo $image['sizes']['large']; ?>" alt="<?php echo $image['alt']; ?>"></div>
                                        <?php endif ?>
                                        <?php if ($pricing['cost']): ?>
                                            <div class="item-cost"><span class="item-currency">$</span> <?php echo $pricing['cost']; ?></div>
                                        <?php endif ?>
                                        <?php if ($pricing['time']): ?>
                                            <div class="item-time"><?php echo $pricing['time']; ?></div>
                                        <?php endif ?>
                                        <?php echo $pricing['description']; ?>
                                    </div>
                                </div>
                                <a class="btn-common trans to-booking-section" href="#">
                                    <div class="pos">BOOK NOW</div>
                                </a>
                            </div>
                        <?php endforeach ?>
                    </div>
                    <div class="text-center">
                        <a class="btn-common trans to-booking-section mobile-button-booking" href="#">
                            <div class="pos">BOOK NOW</div>
                        </a>                        
                    </div>
                </div>
            </div>
        </div>
    </section>
<?php endif ?>

<?php get_footer();