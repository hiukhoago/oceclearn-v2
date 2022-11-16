<?php 
	add_action( 'rest_api_init', 'register_api_hooks' );
	if ( !function_exists( 'register_api_hooks' ) ) {
		function register_api_hooks() {
			register_rest_route( 'api/v1', '/blog-load-more/', $args = array('methods' => 'GET', 'callback' => 'blog_load_more'), $override = false );
			register_rest_route( 'api/v1', '/recipes-load-more/', $args = array('methods' => 'GET', 'callback' => 'recipes_load_more'), $override = false );
			register_rest_route( 'api/v1', '/get_stockist/', $args = array( 'methods' => 'GET', 'callback' => 'get_stockist'), $override = false );
			register_rest_route( 'api/v1', '/get-recipes/(?P<id>[\d]+)', $args = array( 'methods' => 'GET', 'callback' => 'get_recipes' ), $override = false );
			register_rest_route( 'api/v1', '/get-short-des-programs/(?P<id>[a-zA-Z0-9-]+)', $args = array( 'methods' => 'GET', 'callback' => 'get_short_des_programs' ), $override = false );
			register_rest_route( 'api/v1', '/first-step/', $args = array( 'methods' => 'GET', 'callback' => 'first_step' ), $override = false );
			register_rest_route( 'api/v1', '/next-step/', $args = array( 'methods' => 'GET', 'callback' => 'next_step' ), $override = false );
		}
	}

	if ( !function_exists( 'blog_load_more' ) ) {
		function blog_load_more() {
			extract( $_GET );

			$args = array(
				'post__not_in' => get_option('sticky_posts'),
				// Type & Status Parameters
				'post_type'   => 'post',
				'post_status' => 'publish',
				// Order & Orderby Parameters
				'order'               => 'DESC',
				'orderby'             => 'date',
				// Pagination Parameters
				'posts_per_page'         => 8,
				'nopaging'               => false,
				'paged'                  => $page,
			);

	    	$posts = new WP_Query( $args );

	    	if ( $posts->have_posts() ) {
	    		$html = '';
	    		while ( $posts->have_posts() ) {
	    			$posts->the_post();

	    			$html .= '<div class="col-lg-3 col-md-4 col-sm-6">';
	    			$html .= '<a class="item-posts" href="'.esc_url( get_the_permalink() ).'">';

    				$alt = get_post_meta( get_post_thumbnail_id( get_the_ID() ), '_wp_attachment_image_alt', true );
    				if ( !$alt ) $alt = get_the_title();
	    			$html .= '<div class="img-drop"><img src="'.get_the_post_thumbnail_url(get_the_ID(), 'post-thumbnail').'" alt="'.$alt.'"></div>';
                    $html .= '<h3 class="wrap-post">'.get_the_title().'</h3>';
                    $html .= '</a>';
                    $html .= '</div>';
	    		}

	    		return $html;
	    	}
		}
	}

	if ( !function_exists( 'recipes_load_more' ) ) {
		function recipes_load_more() {
			extract( $_GET );

			$args = array(
				'post__not_in' => (array) $except,
				// Type & Status Parameters
				'post_type'   => 'recipes',
				'post_status' => 'publish',
				// Order & Orderby Parameters
				'order'               => 'DESC',
				'orderby'             => 'date',
				// Pagination Parameters
				'posts_per_page'         => 8,
				'nopaging'               => false,
				'paged'                  => $page,
				// 'meta_key'     => 'recipes_type',
				// 'meta_value'   => 'normal',
				// 'meta_compare' => '=',
			);

			$recipes = new WP_Query( $args );

			if ( $recipes->have_posts() ) {
				$html = '';

				while ( $recipes->have_posts() ) {
					$recipes->the_post();
					$isHealthHub = get_field('recipes_type')!='normal';
					$urlPost = $isHealthHub?site_url()."/health-hub/":esc_url( get_the_permalink() );

					$html .= '<div class="col-lg-3 col-sm-6">';
					$html .= '<div class="item-post '.($isHealthHub?'lock':'').'">';
					$html .= '<a class="img-drop ratio-11" href="'.$urlPost.'">';
					$alt = get_post_meta( get_post_thumbnail_id( get_the_ID() ), '_wp_attachment_image_alt', true );
    				if ( !$alt ) $alt = get_the_title();
					$html .= '<img src="'.get_the_post_thumbnail_url( get_the_ID(), "post-thumbnail").'" alt="'.$alt.'">';
					if ( get_field( 'recipes_servers' ) ):
						$html .= '<div class="label-servers"><i class="icon person"></i><span>'.get_field( 'recipes_servers' ).'</span></div>';
					endif;
					if ( $isHealthHub ) : 
						$html .= '<div class="label-lock"></div>';
					endif;
					$html .= '</a>';
					$html .= '<div class="wrap-info">';
					$html .= '<h3>'.get_the_title().'</h3>';
                   	if ( get_field( 'recipes_kj' ) or get_field( 'recipes_cooking_time' ) ){
                   		$html .= '<div class="d-flex">';
                   		// if ( get_field( 'recipes_kj' ) ) {
                   		// 	$html .= '<div class="qty-info">'.get_field( 'recipes_kj' ).'</div>';
                   		// }
                   		if ( get_field( 'recipes_cooking_time' ) ) {
                   			$html .= '<div class="time-info">'.get_field( 'recipes_cooking_time' ).'</div>';
                   		}
                   		$html .= '</div>';
                   	}
                   	$html .= '<div class="row-read-btn">';
                   	$html .= '<a class="btn-common trans" href="'.$urlPost.'">';
                   	$html .= '<div class="pos">read now</div>';
                   	$html .= '</a>';
                   	$html .= '</div>';
                   	$html .= '</div>';
                   	$html .= '</div>';
                   	$html .= '</div>';
				}

				return $html;
			}
		}
	}

	if ( !function_exists( 'get_stockist' ) ) {
		function get_stockist() {
				
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
				'meta_value'             => 'physical',
				'meta_compare'           => '=',
				
				// Parameters relating to caching
				'no_found_rows'          => false,
				'cache_results'          => true,
				'update_post_term_cache' => true,
				'update_post_meta_cache' => true,
			);
			$result = new WP_Query( $args );
			
			if ( $result->have_posts() ) {
				$stockist = array();
				while ( $result->have_posts() ) {
					$result->the_post();

					// ACF Google Map
					$location = get_field( 'stockist_address' );

					if ( $location ) {
						$stockist[] = array(
							'id'      => get_the_ID(),
							'locname' => get_the_title(),
							'lat'     => $location['lat'],
							'lng'     => $location['lng'],
							'address' => $location['address'],
							'phone'   => get_field( 'stockist_phone' ),
							'website' => get_field( 'stockist_website' ),
							'openhours' => get_field( 'stockist_open_now' ),
							'image'	  => get_the_post_thumbnail_url( get_the_ID(), $size = 'post-thumbnail' ),
						);
					}
				}

				return new WP_REST_Response( $stockist, 200 );
			}else{
				return null;
			}
		}
	}

	if ( !function_exists( 'get_recipes' ) ) {
		function get_recipes( $request ) {

			$pid = (string) $request[ 'id' ];

			$recipes = get_post( $pid );

			ob_start();

			get_header( 'iframe' ); ?>

			<section class="blog-content bg-skin">
				<?php if ( has_post_thumbnail( $pid ) ): ?>
					<div class="img-drop img-food"><img src="<?php echo get_the_post_thumbnail_url( $pid, 'full' ); ?>" alt=""></div>
				<?php endif ?>
                <div class="container spacing-section spacing-end">
                    <div class="row">
                        <!-- Main Content Blog-->
                        <div class="col-lg-8">
                            <h5 class="sub-cate text-green">RECIPES</h5>
                            <h1 class="title-product mb-15"><?php echo $recipes->post_title; ?></h1>
                            <?php if ( has_excerpt( $pid ) ): ?>
								<div class="desc"><?php echo $recipes->post_excerpt; ?></div>
							<?php else:?>
								<div>&nbsp;</div>
                            <?php endif ?>

                            <?php
                            	$ingredients = get_field( 'recipes_ingredients', $pid );
                    			$instructions = get_field( 'recipes_instructions', $pid );
                            ?>
                            <ul class="recipes-tab nav">
                            	<?php if ( $ingredients ): ?>
                            		<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#recipes-extra1">ingredients</a></li>
                            	<?php endif ?>
                                
                                <?php if ($instructions): ?>
	                                <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#recipes-extra2">method</a></li>
	                            <?php endif ?>
                            </ul>
                            <div class="tab-content recipes-info">
                            	<?php if ($ingredients): ?>
	                                <div class="tab-pane show active fade" id="recipes-extra1">
	                                	<?php if ( have_rows( 'recipes_ingredients', $pid ) ) : ?>
											<?php while ( have_rows( 'recipes_ingredients', $pid ) ) : the_row(); ?>
												<?php if(get_sub_field( 'recipes_ingredients_content_title' )): ?>
												<h5><?php the_sub_field( 'recipes_ingredients_content_title' ); ?></h5>
												<?php endif; ?>
                                    			<?php the_sub_field( 'recipes_ingredients_content' ); ?>
                                			<?php endwhile; ?>
	                                	<?php endif; ?>
	                                </div>
	                            <?php endif ?>
	                            <?php if ( $instructions ): ?>
	                            	<div class="tab-pane fade" id="recipes-extra2">
	                            		<?php if ( have_rows( 'recipes_instructions', $pid ) ) : ?>
                            				<?php while ( have_rows( 'recipes_instructions', $pid ) ) : the_row(); ?>
												<?php if(get_sub_field( 'recipes_instructions_title' )): ?>
												<h5><?php the_sub_field( 'recipes_instructions_title' ); ?></h5>
												<?php endif; ?>
                                    			<?php the_sub_field( 'recipes_instructions_content' ); ?>
                            				<?php endwhile; ?>
	                            		<?php endif; ?>
	                                </div>
	                            <?php endif ?>
                            </div>
                        </div>
                        <!-- Related Post-->
                        <div class="col-lg-4">
                            <div class="wrap-sidebar-blog-single">
                                <div class="gallery-sidebar">
                                    <h6>Information</h6>
                                </div>
                                <ul class="gray-tag-list">
                                    <?php if ( get_field( 'recipes_kj', $pid ) ) : ?><li><span><?php the_field( 'recipes_kj', $pid ); ?></span></li><?php endif ?>
                                    <?php if ( get_field( 'recipes_cooking_time', $pid ) ) : ?><li> <span><?php the_field( 'recipes_cooking_time', $pid ); ?></span></li><?php endif ?>
                                </ul>
                                <!-- Gallery sidebar-->
                                <?php $images = get_field( 'recipes_gallery', $pid ); ?>
                                <?php if ( $images ): ?>
                                	<div class="gallery-sidebar"> 
	                                    <h6>GALLERY</h6>
	                                    <div class="gallery-thumb-list">
	                                    	<?php foreach ( $images as $image ) : ?>
			                                    <a href="<?php echo $image['url']; ?>">
			                                        <div class="img-drop ratio-11"><img src="<?php echo $image['sizes']['large']; ?>" alt="<?php echo $image['alt']; ?>"></div>
			                                    </a>
			                                <?php endforeach; ?>
	                                    </div>
	                                </div>
                                <?php endif ?>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

			<?php get_footer( 'iframe' );

			$content = ob_get_contents();

			ob_end_clean();

			header('Content-Type: text/html');
			echo $content;
			exit();
		}
	}

	if ( !function_exists( 'get_short_des_programs' ) ) {
		function get_short_des_programs( $request ) {

			$pid = (string) $request[ 'id' ];

			$programs = wc_get_product( $pid );
			if(!$programs){
				$programs = get_page_by_path( $pid, OBJECT, 'educations' );
				$pid = $programs->ID;
			}

			ob_start();

			get_header( 'iframe' ); ?>

			<section class="blog-content bg-skin">
				<?php if ( has_post_thumbnail( $pid ) ): ?>
					<div class="img-drop img-food"><img src="<?php echo get_the_post_thumbnail_url( $pid, 'full'); ?> "></div>
				<?php endif ?>
                <div class="container spacing-section spacing-end">
                    <div class="row">
                        <!-- Main Content Blog-->
                        <div class="col-lg-12">
                            <h5 class="sub-cate text-green">Health Programs</h5>
                            <h1 class="title-product mb-15"><?php echo $programs->name?$programs->name:$programs->post_title; ?></h1>
							<div class="desc"><?php echo $programs->short_description?apply_filters('the_content', $programs->short_description):apply_filters('the_content', $programs->post_content); ?></div>
                        </div>
                    </div>
                </div>
            </section>

			<?php get_footer( 'iframe' );

			$content = ob_get_contents();

			ob_end_clean();

			header('Content-Type: text/html');
			echo $content;
			exit();
		}
	}

	if ( !function_exists( 'first_step' ) ) {
		function first_step() {
			extract( $_GET );

			$step = str_replace( '#', '', $step );

			$meta_key = 'product_' . $pid . '_step';

			if ( get_user_meta( $uid, $meta_key, true ) ) {
				$update = update_user_meta( $uid, $meta_key, $step, $prev_value = '' );
			}else{
				$update = add_user_meta( $uid, $meta_key, $step, true );
			}

			return $update;
		}
	}

	if ( !function_exists( 'next_step' ) ) {
		function next_step() {
			extract( $_GET );

			$step = str_replace( '#', '', $step );

			$meta_key = 'product_' . $pid . '_step';

			$update = null;

			if ( get_user_meta( $uid, $meta_value, true ) ) {
				$update = update_user_meta( $uid, $meta_key, $step );
			}

			return $update;
		}
	}
