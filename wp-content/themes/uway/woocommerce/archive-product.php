<?php
/**
 * The Template for displaying product archives, including the main shop page which is a post type archive
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
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

get_header();

/**
 * Hook: woocommerce_before_main_content.
 *
 * @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
 * @hooked woocommerce_breadcrumb - 20
 * @hooked WC_Structured_Data::generate_website_data() - 30
 */
//do_action( 'woocommerce_before_main_content' );

?>
<?php $page_id = wc_get_page_id( 'shop' ); ?>
<section class="banner-product spacing-around spacing-header">
    <div class="text-cover">
        <?php if ( apply_filters( 'woocommerce_show_page_title', true ) ) : ?><h1 class="title-page"><?php woocommerce_page_title(); ?></h1><?php endif; ?>
        <?php if ( get_field( 'product_page_description', $page_id ) ) : ?><p class="des-page"><?php the_field( 'product_page_description', $page_id ); ?></p><?php endif; ?>
    </div>
    <?php 
    	$image = wp_get_attachment_url(get_post_thumbnail_id($page_id));
    	$alt = get_post_meta( get_post_thumbnail_id( $page_id ), '_wp_attachment_image_alt', true ); 
	?>
    <div class="img-drop"><img class="lazygo" data-src="<?php echo $image; ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
</section>

<?php
if ( woocommerce_product_loop() ) {

	/**
	 * Hook: woocommerce_before_shop_loop.
	 *
	 * @hooked woocommerce_output_all_notices - 10
	 * @hooked woocommerce_result_count - 20
	 * @hooked woocommerce_catalog_ordering - 30
	 */
	// do_action( 'woocommerce_before_shop_loop' );

	// woocommerce_product_loop_start();

	/*if ( wc_get_loop_prop( 'total' ) ) {
		while ( have_posts() ) {
			the_post();

			*
			 * Hook: woocommerce_shop_loop.
			 *
			 * @hooked WC_Structured_Data::generate_product_data() - 10
			 
			do_action( 'woocommerce_shop_loop' );
			
			wc_get_template_part( 'content', 'product' );
	}*/

	// woocommerce_product_loop_end();

	/**
	 * Hook: woocommerce_after_shop_loop.
	 *
	 * @hooked woocommerce_pagination - 10
	 */
	// do_action( 'woocommerce_after_shop_loop' );
	?>
	<?php $category = get_categories( array( 'taxonomy' => 'product_cat' ) ); ?>
	<!-- PRODUCTS: LIST PRODUCT-->
	<?php if ( $category and !empty($category) ) : ?>
		<?php $total_cate = count($category); $count = 0; ?>
		<?php foreach ( $category as $key => $cate ): ?>
			<?php if ( 'uncategorized' == $cate->slug or 'health-hub' == $cate->slug or 'appointment' == $cate->slug ) {
				continue;
			} ?>
			<?php $count++; ?>
		    <section class="list-product bg-skin spacing-around <?php if ( $total_cate == $count ) echo 'spacing-footer'; ?>" <?php if ( 'books' == $cate->slug ) echo 'data-target="books"';?> >
		        <div class="container spacing-section">
		            <?php if ( $cate->name ) : ?><h2 class="title-page"><?php echo $cate->name; ?></h2><?php endif; ?>
		            <?php if ( $cate->description ) : ?><p class="des-page"><?php echo $cate->description; ?></p><?php endif; ?>

		            <?php 
	            		$product_args = array(
							// Type & Status Parameters
							'post_type'      => 'product',
							'post_status'    => 'publish',
							// Pagination Parameters
							'posts_per_page' => -1,
	            			// Taxonomy Parameters
	            			'tax_query' => array(
	            				'relation' => 'AND',
	            				array(
									'taxonomy' => 'product_cat',
									'field'    => 'slug',
									'terms'    => $cate->slug,
	            				),
	            			),
	            		);
		            	
		            	$products = new WP_Query( $product_args );
		             ?>
		            <?php if ( $products->have_posts() ) : ?>
		            	<?php if ( 'books' == $cate->slug ): ?>
		            		<div class="row row-list-book">
		            			<?php while ( $products->have_posts() ) : $products->the_post(); ?>
		            				<?php $book = wc_get_product( $post->ID ); ?>
					                <div class="col-md-4">
					                	<div class="item-book <?php if( get_field( 'book_check_highlight' ) ) echo 'highlight'; ?>">
					                		<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
					                        <a href="<?php echo esc_url( get_the_permalink() ); ?>" class="img-drop">
					                        	<img class="lazygo" data-src="<?php the_post_thumbnail_url('post-thumbnails'); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>">
					                        </a>
					                        <a href="<?php echo esc_url( get_the_permalink() ); ?>"><h3 class="name"><?php the_title(); ?></h3></a>
											<div class="price"><?php echo wc_price($product->get_price()); ?></div>
											<a class="addcart-btn add-to-cart" data-product_id="<?php the_ID(); ?>" href="#addcart"><span></span></a>
										</div>
					                </div>
					            <?php endwhile; wp_reset_postdata(); ?>
				            </div>
		            	<?php else : ?>
		            		<div class="row row-list-product">
				            	<?php while ( $products->have_posts() ) : $products->the_post(); ?>
									<?php 
										$product = wc_get_product( $post->ID ); 
										$stock_status = $product->get_stock_status();
									?>
					                <div class="col-md-4">
					                    <div class="text-center item-product <?php if ( $stock_status === "outofstock" ) { echo 'no-event';  } ?>">
					                    	<div class="wrap-product-information">
					                    		<a href="<?php echo esc_url( get_the_permalink() ); ?>">
						                            <div class="img-drop">
						                            	<img class="lazygo" data-src="<?php the_post_thumbnail_url('post-thumbnails'); ?>" alt="<?php the_title(); ?>">
						                            </div>
						                        </a>
												
												<?php if ( $stock_status === "outofstock" ): ?>
													<h3 class="name">Coming soon</h3>
												<?php else: ?>
													<?php if (get_field( 'product_kilo' )): ?>
														<div class="text-green fadeToLeft" data-duration="300ms">
															<strong><?php the_field( 'product_kilo' ); ?></strong>
														</div>
													<?php endif ?>
						                        	<a href="<?php echo esc_url( get_the_permalink() ); ?>">
							                            <h3 class="name"><?php the_title(); ?></h3>
							                            <div class="wrap-product-information">
															<?php if ( get_field( 'archive_content' ) ) : ?>
																<div class="product-description"><?php echo wp_trim_words( get_field( 'archive_content' ), $num_words = 15, $more = '...' ); ?></div>
															<?php else : ?>
								                        		<div class="product-description"><?php echo wp_trim_words( $product->get_short_description(), $num_words = 15, $more = '...' ); ?></div>
															<?php endif;?>
								                        	<span class="learn-more fadeToLeft" href="<?php the_permalink(); ?>" data-duration="900ms">Learn more</span>
								                        </div>
							                        </a>
							                    <?php endif ?>
					                    	</div>

					                    	<?php if ( $stock_status !== "outofstock" ): ?>
						                        <div class="wrap-buttons-cart">
						                        	<a 
						                        	class="btn-common green trans add-to-cart fadeToLeft ow" 
	                                                data-product_id="<?php echo $product->get_id(); ?>" 
	                                                data-duration="1200ms"
	                                                <?php if ( $product->get_stock_status() === 'onbackorder' ): ?>
													data-onbackorder="true"
													<?php endif ?>
	                                                href="#">
	                                                    <div class="pos">
	                                                        <span><?php echo wc_price( $product->get_price() ); ?>&nbsp;-</span> 
	                                                        add to cart
	                                                    </div>
	                                                </a>
						                        </div>
					                        <?php endif ?>	

					                    </div>
					                </div>
					            <?php endwhile; wp_reset_postdata(); ?>
				            </div>
		            	<?php endif ?>
			        <?php endif; ?>
		        </div>
		    </section>
	    <?php endforeach ?>
	<?php endif; ?>
    <!-- PRODUCTS: LIST BOOK-->
<?php } else {
	/**
	 * Hook: woocommerce_no_products_found.
	 *
	 * @hooked wc_no_products_found - 10
	 */
	do_action( 'woocommerce_no_products_found' );
}

/**
 * Hook: woocommerce_after_main_content.
 *
 * @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
 */
// do_action( 'woocommerce_after_main_content' );

/**
 * Hook: woocommerce_sidebar.
 *
 * @hooked woocommerce_get_sidebar - 10
 */
// do_action( 'woocommerce_sidebar' );

get_footer();
