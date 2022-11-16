<?php 
	/**
	 * Template Name: Blog Page
	 */
	get_header();
 ?>

	<section class="spacing-header"></section>

	<?php if ( get_field( 'banner_show_page' ) ): ?>
 	<!-- BLOG: BANNER-->
    <section class="banner-product spacing-around">
        <div class="text-cover">
            <h1 class="title-page"><?php the_title(); ?></h1>
            <?php if ( get_field( 'blog_page_descrption' ) ) : ?><p class="des-page"><?php the_field( 'blog_page_descrption' ); ?></p><?php endif ?>
        </div>
        <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
        <div class="img-drop lazyload" data-src="<?php the_post_thumbnail_url(); ?>"></div>
    </section>
	<?php endif;?>

    <!-- BLOG: CONTENT -->
    <?php $sticky = get_option('sticky_posts'); ?>
    <?php if ( $sticky ): ?>
    	<?php 
    		rsort( $sticky );
    		$sticky_posts = new WP_Query( array( 'post__in' => $sticky, 'ignore_sticky_posts' => 1 ) );
    	 ?>
    	<section class="bg-skin spacing-around blog-content-archive">
	        <div class="container spacing-section"> 
	            <div class="row">
	            	<?php $count = 0; ?>
	            	<?php while ( $sticky_posts->have_posts() ) : $sticky_posts->the_post(); ?>
	            		<?php $count++; ?>
		                <div class="col-lg-<?php echo ( $count % 2 == 0 ) ? '5' : '7'; ?>">
		                	<a class="item-inner" href="<?php echo esc_url( get_the_permalink() ); ?>">
		                		<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
		                        <div class="img-drop width-<?php echo ( $count % 2 == 0 ) ? 'small' : 'big'; ?>"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
		                        <div class="wrap-text">
		                        	<span>featured post</span>
		                            <h3><?php the_title(); ?></h3>
		                        </div>
		                    </a>
		                </div>
                    <?php endwhile; wp_reset_postdata(); ?>
	            </div>
	        </div>
	    </section>
    <?php endif ?>
    
    <!-- BLOG: CONTENT LOAD MORE-->
    <?php 
    		
		$args = array(
			'post__not_in' => $sticky,
			// Type & Status Parameters
			'post_type'   => 'post',
			'post_status' => 'publish',
			// Order & Orderby Parameters
			'order'               => 'DESC',
			'orderby'             => 'date',
			// Pagination Parameters
			'posts_per_page'         => 8,
			'nopaging'               => false,
			'paged'                  => get_query_var( 'paged' ) ?? 1,
		);
    	
    	$posts = new WP_Query( $args );
     ?>
    <?php if ( $posts->have_posts() ): ?>
    	<section class="bg-skin spacing-around blog-load-more">
	        <div class="container spacing-end">
	            <div class="row" id="loading-blog-data">
	            	<?php while ( $posts->have_posts() ) : $posts->the_post(); ?>
		                <div class="col-lg-3 col-md-4 col-sm-6">
		                	<a class="item-posts" href="<?php echo esc_url( get_the_permalink() ); ?>">
		                		<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
		                        <div class="img-drop"><img src="<?php the_post_thumbnail_url( 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
		                        <h3 class="wrap-post"><?php the_title(); ?></h3>
		                    </a>
		                </div>
	                <?php endwhile ?>
	            </div>
	            <?php if ( 1 < $posts->max_num_pages ): ?>
	            	<div class="loading-more-row hide-with-me">
	            		<i class="icon loading"></i>
	            		<span class="loading-more-data scroll-auto-trigger" data-urljson="<?php echo esc_url( site_url( 'wp-json/api/v1/blog-load-more/' ) ); ?>" data-totalpage="<?php echo $posts->max_num_pages; ?>" data-text="Load more" data-except="" data-target="#loading-blog-data">load more</span>
	            	</div>
	            <?php endif ?>
	        </div>
	    </section>
    <?php endif ?>
 <?php 
 	get_footer();