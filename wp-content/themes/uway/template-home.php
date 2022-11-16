<?php 
	/**
	 * Template Name: Home Page
	 */
	get_header();
 ?>
	<?php if (get_field( 'heading_title' )): ?>
		<h1 class="d-none"><?php the_field( 'heading_title' ); ?></h1>
	<?php endif ?>

	<div class="c-frame__content">  
	    <!-- BANNER HOME-->
	    <section class="banner-home spacing-around scrollpage active opa-transition">
	        <div class="container-fluid">
	            <div class="row">  
		            <?php if ( get_field( 'home_slider_products' ) ) : ?>                     
		                <div class="col-md-6 bg-green order-md-2 order-1 a-center">
		                    <div class="owl-carousel wrap-owl-carousel">
		                    	<?php foreach ( get_field( 'home_slider_products' ) as $post ) : setup_postdata( $post ); ?>
									<?php $product = wc_get_product( get_the_ID() ); ?>
									<?php $image_banner = get_field('image_slider_home');?>
			                        <div class="item-intro">
			                        	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
			                            <div class="wrap-img"><a class="img-drop" href="<?php echo esc_url( get_the_permalink() ); ?> "  data-img="<?php echo $image_banner["url"]; ?>"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( ! empty( $alt ) ) ? $alt : get_the_title(); ?>"></a></div>
                                        <div class="wrap-text">
                                        	<a href="<?php echo esc_url( get_the_permalink() ); ?>"><h2 class="title-medium"><?php the_title(); ?></h2></a>
                                            <?php if ( $product->get_short_description() ) : ?><div class="desc"><?php echo wp_trim_words( $product->get_short_description(), 18, '...' ); ?></div><?php endif; ?>
                                        </div>
			                        </div>
		                        <?php endforeach; wp_reset_postdata(); ?>
		                    </div>
		                </div>
		            <?php endif; ?>
	                <div class="col-md-6 order-md-1 order-2">
						<?php if ( get_field( 'home_slider_products' ) ) : ?>      
							<?php 
								$count = 0;
								foreach ( get_field( 'home_slider_products' ) as $post ) : setup_postdata( $post ); ?>
								<?php 
									if($count > 0){ break;}
									$image_banner = get_field('image_slider_home');?>
								<div class="img-drop img-banner" id="banner-change-img"><img src="<?php echo $image_banner["url"]; ?>" alt=""></div>
							<?php $count++; endforeach; wp_reset_postdata(); ?>
						<?php endif; ?>
	                </div>
	            </div>
	        </div>
	    </section>
		<?php
			$image_left_array = get_field( 'image_feature_left' );
			$image_left       = $image_left_array['url'];
			$alt_left         = $image_left_array['alt'];
		
			$image_right_array = get_field( 'image_feature_right' );
			$image_right       = $image_right_array['url'];
			$alt_right         = $image_right_array['alt'];
		?>
	    <!-- <section class="scrollpage"> -->
	        <!--SECTION 1-->
	        <?php if ( get_field( 'home_featured_products' ) ): ?>

				<section class="section-scroll feature-home spacing-around white-layer" id="content-<?php echo $count; ?>">
					<?php if ($image_left_array) : ?>
						<div class="img-bg-1"><img src="<?php echo $image_left ;?>" alt="<?php echo $alt_left; ?>"></div>	
					<?php endif; ?>
					<?php if ($image_right_array) : ?>
						<div class="img-bg-2"><img src="<?php echo $image_right ;?>" alt="<?php echo $alt_right; ?>"></div>	
					<?php endif; ?>
					<div class="container-fluid">
						<div class="wrap-title text-center">
							<div class="text-green fadeToLeft" data-duration="300ms">featured products</div>
							<?php if (get_field('feature_product_title')) : ?>
								<h2 class="title-medium fadeToLeft" data-duration="500ms"><?php the_field('feature_product_title') ;?></h2>
							<?php endif;?>
						</div>
						<div class="owl-carousel owl-featured-product-home">
							<?php foreach ( get_field( 'home_featured_products' ) as $post ) : setup_postdata( $post ); ?>
								<?php $product = wc_get_product( get_the_ID() ); ?>
								<div class="text-center product-wrapblock">
									<div class="feature-block-holder">
										<a href="<?php the_permalink(); ?>" class="button-wrap">
											<div class="img-custom-mobile">
												<div class="img-drop"><?php echo $product->get_image($size = 'large'); ?></div>
											</div>
											<?php if (get_field( 'product_kilo' )): ?>
												<div class="text-green fadeToLeft" data-duration="300ms">
													<strong><?php the_field( 'product_kilo' ); ?></strong>
												</div>
											<?php endif ?>
											<h3 class="title-medium fadeToLeft product-feature-title" data-duration="500ms"><?php the_title(); ?></h3>
											<div class="button-wrap">
												<div class="wrap-product-information">
													<?php if ( get_field( 'archive_content' ) ) : ?>
														<div class="desc fadeToLeft" data-duration="700ms"><?php echo wp_trim_words( get_field( 'archive_content' ), $num_words = 15, $more = '...' ); ?></div>
													<?php elseif ( $product->get_short_description() ) : ?>
														<div class="desc fadeToLeft" data-duration="700ms"><?php echo wp_trim_words( $product->get_short_description(), $num_words = 15, $more = '...' ); ?></div>
													<?php endif;?>												
													<span class="learn-more fadeToLeft" href="<?php the_permalink(); ?>" data-duration="900ms">Learn more</span>
												</div>
											</div>
										</a>
										<div class="wrap-text-4-item">
                                            <a 
                                            class="btn-common green trans add-to-cart fadeToLeft ow" 
                                            data-product_id="<?php the_ID(); ?>" 
                                            data-duration="1200ms"
											<?php if ( $product->get_stock_status() === 'onbackorder' ): ?>
											data-onbackorder="true"
											<?php endif ?>
                                            href="#">
                                                <div class="pos">
                                                    <span><?php echo wp_strip_all_tags( $product->get_price_html() ); ?>&nbsp;-</span> 
                                                    add to cart
                                                </div>
                                            </a>
										</div>
									</div>
								</div>
							<?php endforeach; wp_reset_postdata(); ?>
						</div>
					</div>
				</section>
	        <?php endif ?>
	        <!--SECTION 3-->
	        <section class="section-scroll row-center opa-transition" id="content-3">
	            <div class="container">
	                <div class="row">
	                    <div class="col-md-6 order-md-2">
	                        <div class="wrap-text-4-item">
	                            <div class="text-green fadeToLeft" data-duration="500ms">about</div>
	                            <?php if ( get_field( 'home_author_name' ) ) : ?><h4 class="title-medium fadeToLeft" data-duration="700ms"><?php the_field( 'home_author_name' ); ?></h4><?php endif ?>
	                            <?php if ( get_field( 'home_author_position' ) ) : ?><h4 class="title-small fadeToLeft" data-duration="900ms"><?php the_field( 'home_author_position' ); ?></h4><?php endif ?>

	                            <?php // ACF Image Object
		                            $image     = get_field( 'home_author_image' );
		                            $alt       = $image['alt'];
		                            $imageSize = $image['url'];
	                             ?>
	                            <div class="img-circle d-md-none d-block">
	                                <div class="img-drop"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
	                            </div>

	                            <?php if ( get_field( 'home_author_description' ) ) : ?><div class="desc fadeToLeft" data-duration="1100ms"><?php the_field( 'home_author_description' ); ?></div><?php endif ?>
	                            <a class="btn-common bg-green fadeToLeft" href="<?php echo esc_url( site_url( 'about-us' ) ); ?>" data-duration="1300ms"><div class="pos">book with <?php echo explode(' ', get_field( 'home_author_name' ))[0]; ?> </div></a>
	                        </div>
	                    </div>
	                    <div class="col-md-6 order-md-1">
	                        <div class="img-circle d-md-block d-none fadeToLeft" data-duration="300ms"> 
	                            <div class="img-drop"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </section>
	        <!--SECTION 4-->
	        <?php if ( get_field( 'home_choose_books' ) ) : ?>
		        <section class="section-scroll row-center opa-transition" id="content-4">
		            <div class="container">
		                <div class="row">
		                    <div class="col-md-6">
		                        <div class="wrap-text-4-item">
		                            <div class="text-green fadeToLeft" data-duration="300ms">books</div>
		                            <?php if ( get_field( 'home_books_name' ) ) : ?>
		                            	<h4 class="title-medium fadeToLeft" data-duration="500ms">by <?php the_field( 'home_books_name' ); ?></h4>
		                            <?php endif ?>
		                            <?php if ( get_field( 'home_books_description' ) ) : ?>
		                            	<div class="desc fadeToLeft" data-duration="700ms"><?php the_field( 'home_books_description' ); ?></div>
		                            <?php endif ?>
		                            <a class="btn-common green gray" href="<?php echo get_permalink( woocommerce_get_page_id( 'shop' ) ) . '#books'; ?>">
                                        <div class="pos">add to cart</div>
                                    </a>
		                        </div>
		                    </div>
		                    <div class="col-md-6">
		                        <div class="wrap-book">
									<?php $k = 0; ?>
									<?php foreach ( get_field( 'home_choose_books' ) as $post ): setup_postdata( $post ); ?>
										<?php $k++; ?>
										<?php $product = wc_get_product( get_the_ID() ); ?>
										<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
										<?php if ($k == 1) : ?>
											<div class="book-add under fadeToLeft" data-duration="1200ms">
												<div class="inner">
													<img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>">
													<!-- <a class="btn-common trans" href="<?php echo esc_url( get_the_permalink() ); ?>"> 
														<div class="pos"><span><?php echo wp_strip_all_tags( $product->get_price_html() ); ?>&nbsp;-</span> add to cart</div>
													</a> -->
												</div>
											</div>
										<?php endif; ?>
										<?php if ($k == 2) : ?>
											<div class="book-add upper fadeToLeft" data-duration="2000ms">
												<div class="inner">
													<img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>">
													<!-- <a class="btn-common trans" href="<?php echo esc_url( get_the_permalink() ); ?>"> 
														<div class="pos"><span><?php echo wp_strip_all_tags( $product->get_price_html() ); ?>&nbsp;-</span> add to cart</div>
													</a> -->
												</div>
											</div>
										<?php endif; ?>
									<?php endforeach; wp_reset_postdata(); ?>								
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </section>
		    <?php endif ?>
	        <!--SECTION 5-->

	        <?php if ( get_field( 'home_featured_choose_blogs' ) ) : ?>
		        <section class="spacing-around opa-transition" id="content-5">
		            <div class="container-fluid">
		                <div class="row">   
		                    <div class="col-md-6 bg-green white-layer-effect">
		                        <div class="wrap-text-4-item">
		                            <?php if ( get_field( 'home_featured_blogs_title' ) ) : ?><h4 class="title-medium"><?php the_field( 'home_featured_blogs_title' ); ?></h4><?php endif ?>
		                            <?php if ( get_field( 'home_featured_blogs_description' ) ) : ?><div class="desc"><?php the_field( 'home_featured_blogs_description' ); ?></div><?php endif ?>
		                            <?php if ( $link = get_field( 'home_featured_blogs_link' ) ): ?>
		                            	<a class="btn-common green" href="<?php echo $link['url']; ?>">
		                            		<div class="pos"><?php echo $link['title']; ?></div>
		                            	</a>
		                            <?php endif ?>
		                        </div>
		                    </div>
		                    <div class="col-md-6">
		                        <div class="row">
		                        	<?php $count = 0; ?>
		                        	<?php foreach ( get_field( 'home_featured_choose_blogs' ) as $post ): setup_postdata( $post ); ?>
		                        		<?php $count++; ?>
		                        		<div class="col-lg-<?php echo ( 3 == $count ) ? '12' : '6'; ?>">
		                        			<a class="item-health white-layer-effect" href="<?php echo esc_url( get_the_permalink() ); ?>">   
		                        				<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
			                                    <div class="img-drop ratio-<?php echo ( 3 == $count ) ? '169' : '11'; ?>"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
			                                    <div class="wrap-title"><span>featured post</span>
			                                        <h3><?php the_title(); ?></h3>
			                                    </div>
			                                </a>
		                                </div>
		                                <?php if ( 3 == $count ) break; ?>
		                        	<?php endforeach ?>
		                        </div>
		                    </div>
		                </div>
		            </div>
		        </section>
		    <?php endif ?>
	    <!-- </section> -->
	</div>

 <?php
 	get_footer();