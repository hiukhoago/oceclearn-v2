<?php
/**
 * The template for displaying product content in the single-product.php template
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/content-single-product.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce/Templates
 * @version 3.4.0
 */

defined( 'ABSPATH' ) || exit;

global $product, $post;
/**
 * Hook: woocommerce_before_single_product.
 *
 * @hooked wc_print_notices - 10
 */
do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // WPCS: XSS ok.
	return;
}

?>
	<?php if ( get_the_terms( $post, 'product_health' ) ): ?>

		<?php wc_get_template( 'content-single-product-programs.php' ); ?>
		
	<?php else: ?>
		<section class="product-single spacing-header spacing-around pb-100 spacing-section bg-skin">
	        <div class="container">
	            <div class="wrap-flex">
	                <div class="product-img-wrap">
	                    <div class="owl-carousel owl-product-single <?php if ( 'book' == get_field( 'product_type' ) ) echo 'for-book'; ?>">
	                    	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
	                    	<div>
	                            <div class="img-drop ratio-11">
	                            	<img 
	                            	class="owl-lazy" 
	                            	data-src="<?php the_post_thumbnail_url( 'post-thumbnail' ); ?>" 
	                            	alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>">
	                            </div>
	                        </div>

	                        <?php $attachment_ids = $product->get_gallery_image_ids(); ?>
	                        <?php if ($attachment_ids): ?>
	                        	<?php foreach ($attachment_ids as $attachment_id ): ?>
	                        		<?php 
	                        			$image = wp_get_attachment_image_src( $attachment_id, $size = 'post-thumbnail', $icon = false );
	                        			$alt = get_post_meta( get_post_thumbnail_id( $attachment_id ), '_wp_attachment_image_alt', true ); 
	                        		?>
	                        		<div>
	                                    <div class="img-drop ratio-11">
	                                    	<img class="owl-lazy" data-src="<?php echo $image[0]; ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>">
	                                    </div>
	                                </div>
	                        	<?php endforeach ?>
	                        <?php endif ?>
	                    </div>
						<?php $educations  = get_field( 'product_educations' );
						 		if ( $educations ) : ?>
							<div class="education-article d-lg-block d-none">
								<h6 class="small-title">Education articles</h6>
								<div class="row">
									<?php foreach ($educations as $post): setup_postdata( $post ); ?>
										<div class="col-sm-6">
											<a href="<?php echo esc_url( site_url('education') . '#' . $post->post_name ); ?>">
												<div class="article-wrap">
													<div class="img-wrap">
														<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
														<div class="img-drop ratio-11"><img src="<?php the_post_thumbnail_url( 'post_thumbnail' ); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
													</div>
													<div class="article-excerpt"><?php the_title(); ?></div>
												</div>
											</a>
										</div>
									<?php endforeach; wp_reset_postdata(); ?>
								</div>
							</div>
						<?php endif ?>
	                </div>
	                <div class="product-single-info get_data_select">
	                    <h1 class="title-product wow fadeIn"><?php the_title(); ?></h1>
	                    <?php $short_description = apply_filters( 'woocommerce_short_description', $post->post_excerpt ); ?>
	                    <?php if ( $short_description ) : ?><div class="product-description no-scroll"><?php echo $short_description; ?></div><?php endif; ?>
						<div class="cta-add-to-cart">
	                        <select class="qty-box">
	                        	<?php $__in_stock = $product->get_stock_quantity() ?? 10; ?>
	                        	<?php for ($i=1; $i <= $__in_stock ; $i++) { 
	                        		echo '<option value="'.$i.'">'.$i.'</option>';
	                        	} ?>
	                        </select>
							<?php 
								$stock_status = $product->get_stock_status();
								if ($stock_status != "instock"): ?>
								<?php if($stock_status != "outofstock"): ?>
									<a 
									class="add-to-cart btn-black" 
									href="#" 
									data-product_id="<?php echo $post->ID; ?>" 
									data-publish_date="<?php echo base64_encode($product_publish_date . 'flourishweb' ); ?>"
									<?php if ( $product->get_stock_status() === 'onbackorder' ): ?>
									data-onbackorder="true"
									<?php endif ?>
									>
										<span><?php echo get_woocommerce_currency_symbol().$product->get_price(); ?></span>&nbsp; - Preorder 
									</a>
								<?php else: ?>
									<a class="btn-black" href="#">Comming soon</a>
								<?php endif; ?>
	                        <?php else: ?>
	                        	<a 
	                        	class="add-to-cart btn-black" 
	                        	href="#" 
	                        	data-product_id="<?php echo $post->ID; ?>"
	                        	<?php if ( $product->get_stock_status() === 'onbackorder' ): ?>
								data-onbackorder="true"
								<?php endif ?>
	                        	>
		                        	<span><?php echo get_woocommerce_currency_symbol().$product->get_price(); ?></span>&nbsp; - add to cart 
		                        </a>
	                        <?php endif; ?>
							<?php 
								if ( 'variable' == $product->get_type() ) {
									wp_enqueue_script( 'wc-add-to-cart-variation' );

									// Get Available variations?
									$get_variations = count( $product->get_children() ) <= apply_filters( 'woocommerce_ajax_variation_threshold', 30, $product );

									// Load the template.
									wc_get_template( 'single-product/add-to-cart/variable.php', array(
										'available_variations' => $get_variations ? $product->get_available_variations() : false,
										'attributes'           => $product->get_variation_attributes(),
										'selected_attributes'  => $product->get_default_attributes(),
									));
								}
							?>
	                    </div>
						
						<?php if ( 'product' == get_field( 'product_type' ) ): ?>
							<?php 
								$ingredients = get_field( 'product_ingredients' );
								$benefits    = get_field( 'product_benefits' );
								$nutritional = get_field( 'product_nutritional' );
	                    	?>
							<ul class="nav product-info-tab">
		                        <?php if ( $benefits ): ?><li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#product-info2">Benefits</a></li><?php endif ?>
								<?php if ( $ingredients ): ?> <li class="nav-item"><a class="nav-link <?php if ( empty($benefits) ) echo 'active'; ?>" data-toggle="tab" href="#product-info1">Ingredients</a></li> <?php endif ?>
		                        <?php if ( $nutritional ): ?><li class="nav-item"><a class="nav-link <?php if ( empty($ingredients) and empty($benefits) ) echo 'active'; ?>" data-toggle="tab" href="#product-info3">Nutritional Information</a></li><?php endif ?>
		                    </ul>
		                    <div class="tab-content tab-info">

								<?php if ( $benefits ): ?>
									<div class="tab-pane show active fade" id="product-info2"><p><?php echo $benefits; ?></p></div>
								<?php endif ?>

		                    	<?php if ( $ingredients ) : ?>
			                        <div class="tab-pane fade <?php if ( empty($benefits) ) echo 'show active'; ?> " id="product-info1">
			                            <ul class="product-tag-list">
			                            	<?php foreach ($ingredients as $ingredient): ?>
			                            		<li><span><?php echo $ingredient->name; ?></span></li>
			                            	<?php endforeach ?>
			                            </ul>
			                        </div>
			                    <?php endif; ?>		                    
		                        
		                        <?php if ( $nutritional ): ?>
		                        	<div class="tab-pane <?php if ( empty($ingredients) and empty($benefits) ) echo 'show active'; ?> fade" id="product-info3">
		                        		<div class="bg-gray">
	                                        <div class="table-nutrition">
	                                            <div class="serving">
	                                                <?php if ( get_field( 'product_nutritional_serving_per_package' ) ) : ?><div class="serving-item">SERVING PER PACKAGE: <?php the_field( 'product_nutritional_serving_per_package' ); ?></div><?php endif; ?>
	                                                <?php if ( get_field( 'product_nutritional_serving_size' ) ) : ?><div class="serving-item">SERVING SIZE: <?php the_field( 'product_nutritional_serving_size' ); ?></div><?php endif; ?>
	                                            </div>
	                                            <?php if ( have_rows( 'product_nutritional' ) ) : ?>
		                                            <table> 
		                                                <thead>
		                                                    <tr>
		                                                        <th>avg. quantity</th>
		                                                        <th>per serving</th>
		                                                        <th>per 100g</th>
		                                                    </tr>
		                                                </thead>
		                                                <tbody>
		                                                	<?php while ( have_rows( 'product_nutritional' ) ) : the_row(); ?>
			                                                    <tr class="basic-nutrition">
			                                                        <td><?php the_sub_field( 'product_nutritional_avg_quantity' ); ?></td>
			                                                        <td><?php the_sub_field( 'product_nutritional_per_serving' ); ?></td>
			                                                        <td><?php the_sub_field( 'product_nutritional_per_100g' ); ?></td>
			                                                    </tr>

			                                                    <?php if ( have_rows( 'product_nutritional_avg_quantity_sub_item' ) ) : ?>
		                                                    		<?php while ( have_rows( 'product_nutritional_avg_quantity_sub_item' ) ) : the_row(); ?>
		                                                    			<tr class="details-nutrition">
			                                                    			<td><?php the_sub_field( 'product_nutritional_avg_quantity_sub_item_name' ); ?></td>
					                                                        <td><?php the_sub_field( 'product_nutritional_avg_quantity_sub_item_per_serving' ); ?></td>
					                                                        <td><?php the_sub_field( 'product_nutritional_avg_quantity_sub_item_per_100g' ); ?></td>
				                                                        </tr>
		                                                    		<?php endwhile; ?>
			                                                    <?php endif; ?>
		                                                    <?php endwhile; ?>
		                                                </tbody>
		                                            </table>
	                                            <?php endif; ?>
	                                        </div>
	                                    </div>
		                        	</div>
		                    	<?php endif ?>
		                    </div>

		                    <?php if ( $educations ) : ?>
			                    <div class="education-article d-lg-none">
			                        <h6 class="small-title">Education articles</h6>
			                        <div class="row">
			                        	<?php foreach ($educations as $post): setup_postdata( $post ); ?>
			                        		<div class="col-sm-6">
				                            	<a href="<?php echo esc_url( site_url('education') . '#' . $post->post_name ); ?>">
				                                    <div class="article-wrap">
				                                        <div class="img-wrap">
				                                        	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
				                                            <div class="img-drop ratio-11"><img src="<?php the_post_thumbnail_url( 'post_thumbnail' ); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
				                                        </div>
				                                        <div class="article-excerpt"><?php the_title(); ?></div>
				                                    </div>
				                                </a>
				                            </div>
			                        	<?php endforeach; wp_reset_postdata(); ?>
			                        </div>
			                    </div>
			                <?php endif ?>
						<?php endif ?>

						<?php if ( 'book' == get_field( 'product_type' ) ): ?>
							<?php if ( get_field( 'book_link_video' ) ) : ?>
								<div class="absolute-video">
									<?php // ACF Image Object
										$image     = get_field( 'book_video_image' );
										$alt       = $image['alt'];
										$imageSize = $image['sizes'][ 'large' ];
									 ?>
		                            <div class="img-drop video-holder shadow-lengo wow fadeIn" data-link="<?php the_field( 'book_link_video' ); ?>">
		                                <button class="home-play-btn"><i class="fa fa-play"></i></button><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>">
		                            </div>
		                        </div>
	                        <?php endif; ?>
						<?php endif ?>
	                    
	                </div>
	            </div>
	        </div>
	    </section>

	    <!--SECTION PRODUCT EXTRA INFO -->
	    <?php if ( 'product' == get_field( 'product_type' ) ): ?>
	    	<?php if ( get_field( 'product_extra_information' ) ): ?>
		    	<section class="bg-skin spacing-around pb-150 extra-info">
			        <div class="container">
			            <div class="wrap-flex">
			            	<?php // ACF Image Object
				            	$image     = get_field( 'product_extra_information_image' );
				            	$alt       = $image['alt'];
				            	$imageSize = $image['sizes'][ 'large' ];
			            	 ?>
			                <div class="product-img-wrap">
			                    <div class="img-drop ratio-extra-info wow fadeIn"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
			                </div>
			                <div class="product-single-info">
			                    <ul class="nav product-info-tab">
			                    	<?php if ( have_rows( 'product_extra_information' ) ) : ?>
			                    		<?php $count = 0; ?>
		                    			<?php while ( have_rows( 'product_extra_information' ) ) : the_row(); ?>
		                    				<?php $count++; ?>
		                    				<li class="nav-item"><a class="nav-link <?php if ( 1 == $count ) echo 'active'; ?>" data-toggle="tab" href="#product-extra<?php echo $count; ?>"><?php the_sub_field( 'product_extra_information_title' ); ?></a></li>
		                    			<?php endwhile; ?>
			                    	<?php endif; ?>
			                    </ul>
			                    <div class="tab-content tab-info">
			                    	<?php if ( have_rows( 'product_extra_information' ) ) : ?>
			                    		<?php $count = 0; ?>
		                    			<?php while ( have_rows( 'product_extra_information' ) ) : the_row(); ?>
		                    				<?php $count++; ?>
		                    				<div class="tab-pane <?php if ( 1 == $count ) echo 'show active'; ?> fade" id="product-extra<?php echo $count; ?>">
					                            <div class="product-description no-scroll"> 
					                                <p class="mb-30"><?php the_sub_field( 'product_extra_information_description' ); ?></p>
					                                <div class="accordion" id="extra-info-tab<?php echo $count; ?>">
					                                	<?php if ( have_rows( 'product_extra_information_content' ) ) : ?>
					                                		<?php $_count = 0; ?>
				                                			<?php while ( have_rows( 'product_extra_information_content' ) ) : the_row(); ?>
				                                				<?php $_count++; ?>
				                                				<div class="row-collapse">
							                                    	<a class="<?php if ( 1 != $_count ) echo 'collapsed'; ?> small-title" href="javascript:;" data-toggle="collapse" data-target="#collapse-tab<?php echo $_count; ?>" aria-expanded="<?php echo ( 1 == $_count ) ? 'true' : 'false'; ?>" aria-controls="collapse-tab<?php echo $_count; ?>"><?php the_sub_field( 'product_extra_information_content_title' ); ?></a>
							                                        <div class="collapse <?php if ( 1 == $_count ) echo 'show'; ?>" id="collapse-tab<?php echo $_count; ?>" data-parent="#extra-info-tab<?php echo $count; ?>">
							                                            <div class="collapse-content"><?php the_sub_field( 'product_extra_information_content_description' ); ?></div>
							                                        </div>
							                                    </div>
				                                			<?php endwhile; ?>
					                                	<?php endif; ?> 
					                                </div>
					                            </div>
					                        </div>
		                    			<?php endwhile; ?>
			                    	<?php endif; ?>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </section>
			<?php endif ?>
			
		    <!--SECTION RELATED RESCIPES -->
		    <?php $recipes = get_field( 'product_recipes' ); ?>
		    <?php if ( $recipes ): ?>
		    	<section class="related-recipes pb-150 spacing-section bg-green spacing-around">
			        <div class="container">
			            <h2 class="title-product wow fadeIn">Related recipes</h2>
			            <div class="wrap-text">
			                <?php if ( get_field( 'product_recipes_description' ) ): ?><div class="font-product"><?php the_field( 'product_recipes_description' ); ?></div><?php endif ?>
			                <a class="btn-common green big-btn" href="<?php echo esc_url( site_url('recipes') ); ?>"><div class="pos">see all recipes</div></a>
			            </div>
			            <div class="row row-recipes">
			            	<?php foreach ($recipes as $post ): setup_postdata( $post ); ?>
			            		<div class="col-lg-3 col-sm-6">
				                    <div class="item-post">
				                    	<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
				                        <div class="img-drop ratio-11"><img src="<?php the_post_thumbnail_url('post_thumbnail'); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
				                        <div class="wrap-info">
				                            <h3><?php the_title(); ?></h3>
				                            <div class="d-flex">
				                                <?php if ( get_field( 'recipe_kj' ) ): ?><div class="qty-info"><?php the_field( 'recipe_kj' ); ?></div><?php endif ?>
				                                <?php if ( get_field( 'recipe_time' ) ): ?><div class="time-info"><?php the_field( 'recipe_time' ); ?></div><?php endif ?>
											</div>
											<div class="row-read-btn">
												<a class="btn-common trans" href="<?php echo esc_url( get_the_permalink() ); ?>">
													<div class="pos">read now</div>
												</a>
											</div>
				                        </div>
				                    </div>
				                </div>
			            	<?php endforeach; wp_reset_postdata(); ?>
			            </div>
			        </div>
			    </section>
		    <?php endif ?>
	    <?php endif ?>

	    <?php if ( 'book' == get_field( 'product_type' ) ): ?>
	    	<?php if ( get_field( 'book_related' ) ): ?>
	    		<section class="related-book bg-green spacing-around">
		            <div class="container spacing-section spacing-end">
		                <div class="row row-book">
		                    <div class="col-md-12 col-lg-4">
		                        <div class="item-book for-intro">
		                            <h2 class="title-product wow fadeIn">You may also like</h2>
		                            <div class="wrap-text">
		                                <?php if ( get_field( 'book_related_description' ) ): ?><div class="font-product"><?php the_field( 'book_related_description' ); ?></div><?php endif ?>
		                            </div>
		                        </div>
		                    </div>
		                    <?php foreach ( get_field( 'book_related' ) as $post ): setup_postdata( $post ); ?>
		                    	<div class="col-md-6 col-lg-4">
		                    		<div class="item-book">
		                    			<?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
			                            <a class="img-drop" href="<?php echo esc_url( get_the_permalink() ); ?>"><img class="lazygo" data-src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></a>
			                            <a class="img-drop" href="<?php echo esc_url( get_the_permalink() ); ?>"><h3 class="name"><?php the_title(); ?></h3></a>
										<div class="price"><?php echo $product->get_price_html(); ?></div>
										<a class="addcart-btn add-to-cart" data-product_id="<?php the_ID(); ?>" href="#addcart"><span></span></a>
									</div>
			                    </div>
		                    <?php endforeach; wp_reset_postdata(); ?>
		                </div>
		            </div>
		        </section>
	    	<?php endif ?>
	    <?php endif ?>
	<?php endif ?>
	
    
    
<?php do_action( 'woocommerce_after_single_product' ); ?>
