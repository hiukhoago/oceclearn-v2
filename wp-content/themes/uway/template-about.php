<?php 
	/**
	 * Template name: About Page
	 */
	get_header();
 ?>
	<section class="spacing-header"></section>

	<?php if ( get_field( 'banner_show_page' ) ): ?>
	<!-- ABOUT: BANNER-->
    <section class="banner-product spacing-around">
        <div class="text-cover">
            <h1 class="title-page"><?php the_title(); ?></h1>
            <?php if ( get_field( 'about_page_descrption' ) ) : ?><p class="des-page"><?php the_field( 'about_page_descrption' ); ?></p><?php endif; ?>
        </div>
        <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
        <div class="img-drop"><img class="lazygo" data-src="<?php the_post_thumbnail_url(); ?>" alt="<?php echo $alt; ?>"></div>
    </section>
	<?php endif;?>
	
    <!-- SUPPLEMENT CONTENT-->
    <section class="about-nutritional spacing-around bg-green section-scroll row-center">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div class="wrap-text-4-item">
                        <?php if ( get_field( 'about_flourish_title' ) ) : ?><h4 class="title-medium"><?php the_field( 'about_flourish_title' ); ?></h4><?php endif; ?>
                        <?php if ( get_field( 'about_flourish_description' ) ) : ?><div class="desc"><?php the_field( 'about_flourish_description' ); ?></div><?php endif; ?>
                    </div>
                </div>

                <?php // ACF Image Object
	                $image     = get_field( 'about_flourish_image' );
	                $alt       = $image['alt'];
	                $imageSize = $image['sizes'][ 'large' ];
                 ?>
                <div class="col-md-6">
                    <div class="img-drop"><img class="lazygo" data-src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
                </div>
            </div>
        </div>
    </section>
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
        <div class="wrapper-effect">
            <!--INTRO PRACTITIONERS-->
            <div class="container-fluid row-intro active">
                <div class="owl-profile owl-carousel owl-about-profile">
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
                                    <h2 class="title-page text-green">Meet Our Practitioners</h2>
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
                                </div>
                            </div>
                        </div>
                    <?php endwhile; wp_reset_postdata(); ?>
                </div>
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
                                        <h5><?php echo explode(' ', get_the_title())[0]; ?></h5>
                                    </a>
                                    <?php $k++; ?>
                                <?php endwhile; wp_reset_postdata(); ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
	<?php endif ?>
    <!-- OUR PROMISE-->
    <?php if ( have_rows( 'about_promise_group_items' ) ) : ?>
	    <section class="our-promise spacing-around bg-skin">
	        <div class="container">
	            <div class="wrap-text-4-item">
	                <?php if ( get_field( 'about_promise_title' ) ) : ?><h4 class="title-medium"><?php the_field( 'about_promise_title' ); ?></h4><?php endif; ?>
	                <?php if ( get_field( 'about_promise_note' ) ) : ?><div class="desc"><?php the_field( 'about_promise_note' ); ?></div><?php endif; ?>
	            </div>
	            <div class="list-nutritional">
	            	<?php while ( have_rows( 'about_promise_group_items' ) ) : the_row(); ?>
		                <div class="items">
		                	<?php // ACF Image Object
			                	$image     = get_sub_field( 'about_promise_group_items_image' );
			                	$alt       = $image['alt'];
			                	$imageSize = $image['sizes'][ 'large' ];
		                	 ?>
		                    <div class="icon"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
		                    <div class="wrap-item">
		                        <?php if ( get_sub_field( 'about_promise_group_items_title' ) ) : ?><h5><?php the_sub_field( 'about_promise_group_items_title' ); ?></h5><?php endif; ?>
		                        <?php if ( get_sub_field( 'about_promise_group_items_description' ) ) : ?><div class="desc"><?php the_sub_field( 'about_promise_group_items_description' ); ?></div><?php endif; ?>
		                    </div>
		                </div>
	                <?php endwhile; ?>
	            </div>
	            <div class="box-quote">
	            	<?php // ACF Image Object
		            	$image     = get_field( 'about_people_avatar' );
		            	$alt       = $image['alt'];
		            	$imageSize = $image['sizes'][ 'large' ];
	            	 ?>
	                <div class="avatar">
	                    <div class="img-drop"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
	                </div>
	                <?php if ( get_field( 'about_people_quote' ) ) : ?><div class="desc"><?php the_field( 'about_people_quote' ); ?></div><?php endif; ?>
	                <?php if ( get_field( 'about_people_name' ) ) : ?><div class="signature"><?php the_field( 'about_people_name' ); ?> <?php if ( get_field( 'about_people_position' ) ) : ?><span><?php the_field( 'about_people_position' ); ?></span><?php endif; ?></div><?php endif; ?>
	            </div>
	        </div>
	    </section>
    <?php endif; ?>
    <!-- CONTACT CONTENT-->
    <section class="about-contact spacing-around bg-green section-scroll">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <div class="wrap-text-4-item">
                        <?php if ( get_field( 'about_contact_title' ) ) : ?><h4 class="title-medium"><?php the_field( 'about_contact_title' ); ?></h4><?php endif; ?>
                        <?php if ( get_field( 'about_contact_description' ) ) : ?><div class="desc"><?php the_field( 'about_contact_description' ); ?></div><?php endif; ?>
                    </div>
                </div>

                <?php if ( get_field( 'about_form_contact' ) ) : ?>
	                <div class="col-md-8">
	                    <div class="wrap-contact">
	                        <?php the_field( 'about_form_contact' ); ?>
	                    </div>
	                </div>
	            <?php endif; ?>
            </div>
        </div>
    </section>
 <?php 
 	get_footer();