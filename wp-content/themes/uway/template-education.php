<?php 
	/**
	 * Template Name: Education Page
	 */
	get_header();
 ?>
	<section class="spacing-header"></section>

	<?php if ( get_field( 'banner_show_page' ) ): ?>
	<!-- EDUCATION: BANNER-->
    <section class="banner-product spacing-around">
        <div class="text-cover">
            <h1 class="title-page"><?php the_title(); ?></h1>
            <?php if ( get_field( 'education_page_description' ) ) : ?>
            	<p class="des-page"><?php the_field( 'education_page_description' ); ?></p>
            <?php endif ?>
        </div>
        <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
        <div class="img-drop"><img class="lazygo" data-src="<?php the_post_thumbnail_url(); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
    </section>
	<?php endif;?>

    <!-- EDUCATION: CONTENT TAB-->
    <?php 
		$education = array(
			// Type & Status Parameters
			'post_type'      => 'educations',
			'post_status'    => 'publish',
			// Order & Orderby Parameters
			'order'          => 'DESC',
			'orderby'        => 'date',
			// Pagination Parameters
			'posts_per_page' => -1,
			'meta_query'     => array(
				array(
					'key'     => 'hide_from_education_page',
					'compare' => '=',
					'value'   => '1'
				)
			)
		);
    	$education = new WP_Query( $education );
     ?>
    <section class="education spacing-around bg-skin">
    	<?php if ( $education->have_posts() ) : ?>
    		<?php $count = 0; ?>
	        <!-- Tab page ul-->
	        <ul class="nav tab-navi-learn" role="tablist">
	        	<?php while ( $education->have_posts() ) : $education->the_post(); ?>
	        		<?php $count++; ?>
		            <li class="wow fadeInUp" data-wow-delay=".<?php echo $count; ?>s"><a href="#<?php echo $post->post_name; ?>" <?php if ( 1 == $count ) echo 'class="active"'; ?> data-toggle="tab" data-hash="<?php echo $post->post_name; ?>"><?php the_title(); ?></a></li>
		        <?php endwhile; wp_reset_postdata(); ?>
	        </ul>
	        <div class="container spacing-end">
	            <!-- Tab page content-->
	            <div class="tab-content content-learn">
	            	<?php $count = 0; ?>
	            	<?php while ( $education->have_posts() ) : $education->the_post(); ?>
	            		<?php $count++; ?>
		                <div class="tab-pane fade <?php if ( 1 == $count ) echo 'active show'; ?>" id="<?php echo $post->post_name; ?>">
		                    <h2 class="title-page animated fadeInUp margin-bottom"><?php the_title(); ?></h2>
		                    <?php if ( has_excerpt() ): ?>
		                    	<div class="des-intro fw-600"><?php the_excerpt(); ?></div>
		                    <?php endif ?>
		                    <?php if ( null != $post->post_content ): ?>
		                    	<div class="des-page"><?php the_content(); ?></div>
		                    <?php endif ?>

		                    <?php if ( have_rows( 'education_group_item' ) ) : ?>
		                    	<div class="learn-text-editor">
			                        <select class="ingredients-select">
			                            <option value="*">All</option>
			                        </select>
			                        <div class="clearfix"></div>
		                    		<?php while ( have_rows( 'education_group_item' ) ) : the_row(); ?>
		                    			<div class="ingredient-item">
				                            <div class="ingredient-img">
				                            	<?php // ACF Image Object
					                            	$image     = get_sub_field( 'education_group_item_image' );
					                            	$alt       = $image['alt'];
					                            	$imageSize = $image['sizes'][ 'large' ];
				                            	 ?>
				                                <div class="img-drop"><img class="animated fadeInLeft" src="<?php echo $imageSize; ?>" alt="<?php echo (!empty($alt)) ? $alt : get_sub_field( 'education_group_item_name' ); ?>"></div>
				                            </div>
				                            <div class="ingredient-des">
				                                <?php if ( get_sub_field( 'education_group_item_name' ) ) : ?><h4 class="title-featured"><?php the_sub_field( 'education_group_item_name' ); ?></h4><?php endif ?>
				                                <?php if ( get_sub_field( 'education_group_item_description' ) ) : ?><div class="des-page"><?php the_sub_field( 'education_group_item_description' ); ?></div><?php endif ?>
				                            </div>
				                        </div>
		                    		<?php endwhile; ?>
		                    	</div>
		                    <?php endif; ?>
		                </div>
		            <?php endwhile ?>
	            </div>
	        </div>
        <?php else : ?>
        	<h3><?php __( 'No Data', 'uway' ); ?></h3>
    	<?php endif ?>
    </section>

 <?php 
 	get_footer();