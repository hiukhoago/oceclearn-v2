<?php 
	/**
	 * Template Name: Recipes Page
	 */
	get_header();
 ?>
	
	<section class="spacing-header"></section>

	<?php if ( get_field( 'banner_show_page' ) ): ?>
	<!-- RECIPES: BANNER-->
    <section class="banner-product spacing-around">
        <div class="text-cover">
            <h1 class="title-page"><?php the_title(); ?></h1>
            <?php if ( get_field( 'recipes_page_descrption' ) ) : ?><p class="des-page"><?php the_field( 'recipes_page_descrption' ); ?></p><?php endif ?>
        </div>
        <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
        <div class="img-drop lazyload" data-src="<?php the_post_thumbnail_url(); ?>"></div>
    </section>
	<?php endif;?>

    <!-- RECIPES: CONTENT ARCHIVE-->
    <section class="recipes-content-archive spacing-around bg-skin">
        <div class="container spacing-section spacing-end">
        	<?php 
    			$featured = array(
    				// Type & Status Parameters
    				'post_type'   => 'recipes',
    				'post_status' => 'publish',
    				// Order & Orderby Parameters
    				'order'               => 'DESC',
    				'orderby'             => 'date',
    				// Pagination Parameters
    				'posts_per_page'         => 1,
    				// Custom Field Parameters
    				'meta_query'	=> array(
    					'relation'	=> 'AND',
    					array(
    						'key'		=> 'recipes_featured',
    						'value'		=> 1,
    						'compare'	=> '='
    					),
    					array(
    						'key'		=> 'recipes_type',
    						'value'		=> 'normal',
    						'compare'	=> '='
    					),
    				),
    			);
        		$featured = new WP_Query( $featured );
        	 ?>
        	<?php if ( $featured->have_posts() ): $featured->the_post(); $featured_post_id = get_the_ID(); ?>
        		<div class="featured-recipe row">
        			<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
	                <div class="col-md-5"><a class="img-drop" href="<?php echo esc_url( get_the_permalink() ); ?>">
	                	<img src="<?php the_post_thumbnail_url('post-thumbnail'); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></a>
	                </div>
	                <div class="col-md-7">
	                    <div class="d-flex align-items-center">
	                        <div class="wrap-text">
	                            <h5 class="sub-cate text-green">featured post</h5>
	                            <a href="<?php echo esc_url( get_the_permalink() ); ?>">
	                                <h2 class="title-featured"><?php the_title(); ?></h2>
	                            </a>
	                            <?php if ( has_excerpt() ): ?>
	                            	<div class="des-page"><?php echo wp_trim_words( get_the_excerpt(), $num_words = 55, $more = '...' ); ?></div>
	                            <?php endif ?>

	                            <?php if ( get_field( 'recipes_kj' ) or get_field( 'recipes_cooking_time' ) or get_field( 'recipes_servers' ) ): ?>
	                            	<ul class="product-tag-list">
		                                <?php if ( get_field( 'recipes_kj' ) ) : ?><li><span><?php the_field( 'recipes_kj' ); ?></span></li><?php endif ?>
		                                <?php if ( get_field( 'recipes_cooking_time' ) ) : ?><li><span><?php the_field( 'recipes_cooking_time' ); ?></span></li><?php endif ?>
										<?php if ( get_field( 'recipes_servers' ) ) : ?><li> <span>Serves <?php the_field( 'recipes_servers' ); ?> People</span></li><?php endif ?>
		                            </ul>
	                            <?php endif ?>
	                        </div>
	                    </div>
	                </div>
	            </div>
        	<?php endif; wp_reset_postdata(); ?>
            
			<?php 
				$recipes = array(
					// Type & Status Parameters
					'post_type'   => 'recipes',
					'post_status' => 'publish',
					// Order & Orderby Parameters
					'order'               => 'DESC',
					'orderby'             => 'date',
					// Pagination Parameters
					'posts_per_page'         => 8,
					'paged'                  => get_query_var( 'paged' ) ?? 1,
					// Custom Meta Field
					// 'meta_key'     => 'recipes_type',
					// 'meta_value'   => 'normal',
					// 'meta_compare' => '=',
				);

				if ( $featured_post_id ) {
					$recipes = array( 'post__not_in' => (array) $featured_post_id ) + $recipes;
				}

				$recipes = new WP_Query( $recipes );
			 ?>
			<?php if ( $recipes->have_posts() ) : ?>
	            <div class="list-recipe-archive row" id="loading-put-data">
	            	<?php while ( $recipes->have_posts() ) : $recipes->the_post(); ?>
						<?php 
							$isHealthHub = get_field( 'recipes_type' ) != 'normal';
							$urlPost = $isHealthHub ? site_url()."/health-hub/" : esc_url( get_the_permalink() );
						?>
		                <div class="col-lg-3 col-sm-6">
		                	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
							<div class="item-post <?php echo $isHealthHub ? 'lock' : ''; ?>">
								<a class="img-drop ratio-11" href="<?php echo $urlPost; ?>">
								<img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>">									
								<?php if ( get_field( 'recipes_servers' ) ) : ?>
									<div class="label-servers"><i class="icon person"></i><span><?php the_field( 'recipes_servers' ); ?> </span></div>	
								<?php endif; ?>
								<?php if ( $isHealthHub ) : ?>
									<div class="label-lock"></div>	
								<?php endif; ?>
								</a>
		                        <div class="wrap-info">
									<h3><?php the_title(); ?></h3>
		                            <?php if ( get_field( 'recipes_kj' ) or get_field( 'recipes_cooking_time' ) ): ?>
			                            <div class="d-flex">
			                                <!-- <?php if ( get_field( 'recipes_kj' ) ) : ?><div class="qty-info"><?php the_field( 'recipes_kj' ); ?></div><?php endif ?> -->
			                                <?php if ( get_field( 'recipes_cooking_time' ) ) : ?><div class="time-info"><?php the_field( 'recipes_cooking_time' ); ?></div><?php endif ?>											
			                            </div>
			                        <?php endif ?>
		                            <div class="row-read-btn">
		                            	<a class="btn-common trans" href="<?php echo $urlPost; ?>">
		                                    <div class="pos">read now</div>
		                                </a>
		                            </div>
		                        </div>
		                    </div>
		                </div>
		            <?php endwhile; wp_reset_postdata(); ?>
	            </div>

	            <?php if ( 1 < $recipes->max_num_pages ): ?>
	            	<div class="loading-more-row hide-with-me"><i class="icon loading"></i><span class="loading-more-data scroll-auto-trigger" data-urljson="<?php echo esc_url( site_url( 'wp-json/api/v1/recipes-load-more/' ) ); ?>" data-totalpage="<?php echo $recipes->max_num_pages; ?>" data-text="Load more" data-except="<?php echo $featured_post_id; ?>" data-target="#loading-put-data">load more</span></div>
	            <?php endif ?>
	        <?php endif ?>
        </div>
    </section>

 <?php 
 	get_footer();
