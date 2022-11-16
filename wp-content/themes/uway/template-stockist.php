<?php 
	/**
	 * Template Name: Stockists Page
	 */
	get_header();
 ?>
	<section class="spacing-header"></section>

	<section class="search-stockist spacing-around">
        <div class="wrap-content-stockist">
        	<?php // ACF Google Map
        	$location = get_field( 'stockists_map' );
        	if ( ! empty($location) ) : ?>

        	<div id="f-map" data-json="{&quot;lat&quot;:<?php echo $location['lat']; ?>, &quot;lng&quot;: <?php echo $location['lng']; ?>}" data-icon="<?php echo get_template_directory_uri() . '/html/'; ?>src/img/marker-map.svg" data-url="<?php echo site_url('wp-json/api/v1/get_stockist');?>"></div>
        	<?php endif; ?>
            
            <div class="wrap-mobile">
                <div class="box-search form-find-a-stoctlist">
                    <form action="">
                        <input id="input-text" type="text" placeholder="Enter address or post code"><a class="btn-click" id="btn-stockist-search">SEARCH</a>
                    </form>
                    <div class="box-result" id="box-result">
                        <div class="wrap-ani">
                            <div class="des"><span>Stores closest to you</span><a class="toggle-stockist" href="#">Looking for an online Stockist?</a></div>
                            <div class="list-add-result scrollbar-macosx" id="list-add-result"></div>
                        </div>
                    </div>
                </div>

				<?php 
					$args = array(
						// Type & Status Parameters
						'post_type'              => 'stockist',
						'post_status'            => 'publish',
						// Order & Orderby Parameters
						'order'                  => 'DESC',
						'orderby'                => 'date',
						// Pagination Parameters
						'posts_per_page'         => -1,
						
						'meta_key'               => 'stockist_store_type',
						'meta_value'             => 'online',
						'meta_compare'           => '=',
						
						// Parameters relating to caching
						'no_found_rows'          => false,
						'cache_results'          => true,
						'update_post_term_cache' => true,
						'update_post_meta_cache' => true,
					);
					$result = new WP_Query( $args );
				 ?>
				<?php if ( $result->have_posts() ) : ?>
	                <div class="box-search form-online-stoctlist d-none">
	                    <div class="box-result" id="box-online-result">
	                        <div class="wrap-ani">
	                            <div class="des">
	                            	<span class="bigger">Online Stockists</span>
	                            	<a class="toggle-stockist" href="#">Looking for a physical store?</a>
	                            </div>
	                            <div class="list-add-result scrollbar-macosx">
	                            	<?php while ( $result->have_posts() ) : $result->the_post(); ?>
		                                <div class="item-online-result">
		                                	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
		                                    <div class="avatar"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
		                                    <div class="info">
		                                        <h6><?php the_title(); ?></h6>
		                                        <p><a href="<?php the_field( 'stockist_website' ); ?>"><?php the_field( 'stockist_website' ); ?></a></p>
		                                    </div>
		                                </div>
		                            <?php endwhile; ?>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            <?php endif; ?>
            </div>
        </div>
    </section>

 <?php
 	get_footer();