<?php  
	/**
	 * Template Name: The Cleanse Page
	 */
	get_header();
?>
		<?php $uid = get_current_user_id(); ?>

		<section class="spacing-header"></section>

		<?php if ( get_field( 'banner_show_page' ) ): ?>
		<!-- HEALTH HUB: BANNER-->
	    <section class="banner-product spacing-around">
	        <div class="text-cover">
	            <h1 class="title-page"><?php the_title(); ?></h1>
	            <?php if ( get_field( 'health_hub_page_description' ) ): ?>
	            	<p class="des-page"><?php the_field( 'health_hub_page_description' ); ?></p>
	            <?php endif ?>
	        </div>
	        <?php if ( has_post_thumbnail() ): ?>
	        	<div class="img-drop lazyload" data-src="<?php the_post_thumbnail_url(); ?>"></div>
	        <?php endif ?>
		</section>
		<?php endif;?>
		
		<?php if (get_field( 'video_field', 'product_health_40' )): $intro_video = get_field( 'video_field', 'product_health_40'); ?>
			<!-- HEALTH HUB VIDEO POP UP-->
			<div class="popup-video">
				<div class="close-btn health"><span></span></div>
				<div class="img-drop video-holder">
					<div id="vimeo-player" data-vimeo-url="<?php echo $intro_video; ?>" data-vimeo-autoplay="true" data-vimeo-muted="true"></div>
					<div id="mute-video"><i class="fa fa-volume-off"></i></div>
				</div>
			</div>
		<?php endif ?>
		
	    <!-- HEALTH HUB-->
		<?php 
		
	    	$healths = get_terms( array(
				'taxonomy' => 'product_health',
				'hide_empty' => false,
			));
			$curr = get_woocommerce_currency_symbol();
			
		?>
		<?php if ( $healths ): ?>
			<?php foreach ($healths as $key => $health): ?>
				<?php 
					// get products by cleanse taxonomy
					$product_by_health = get_posts( array(
						// Type & Status Parameters
						'post_type'      => 'product',
						'post_status'    => 'publish',
						// Pagination Parameters
						'posts_per_page' => -1,
            			// Taxonomy Parameters
            			'tax_query' => array(
            				'relation' => 'AND',
            				array(
								'taxonomy' => 'product_health',
								'field'    => 'slug',
								'terms'    => $health->slug,
            				),
            			),
            			'orderby'	=> 'purchase_order',
            			'order'		=> 'ASC',
					) );

					$_curridb = -1;
					$_buycount = 0;
					$_url_add_all = "";
					if ($product_by_health) {
						$products_id = array();
						foreach ($product_by_health as $product) {
							$products_id[] = $product->ID;
						}
					}
				?>
				<section class="health-hub bg-skin spacing-around">
			        <div class="container spacing-section spacing-end">
						<div class="wrap-title-health">
							<?php if (get_field( 'video_field', 'product_health_' .$health->term_id )): ?>
								<div class="btn-play-popup order-md-2">play introduction<i class="fa fa-play"></i></div>
							<?php endif ?>
							<?php if ( $sub_title = get_field( 'health_hub_sub_title', 'product_health_' .$health->term_id ) ): ?>
								<h5 class="sub-cate text-green order-md-1"><?php echo $sub_title; ?></h5>
							<?php endif ?>
						</div>
			            <h1 class="title-product mb-15"><?php echo $health->name; ?></h1>
		            	<div class="mb-30 not-reset-p">
		            		<?php echo apply_filters('the_content', $health->description); ?>
		            		<?php the_field( 'promotion_ruels_title', 'product_health_' .$health->term_id ); ?>
				            <?php if ($rules = get_field( 'promotion_rules', 'product_health_' .$health->term_id )): ?>
				            	<div class="wrap-btn-health">
				            		<ul class="product-tag-list">
				            			<?php foreach ($rules as $rule): ?>
				            				<li
			            					<?php if ($rule['description']): ?>
			            						data-toggle="tooltip"
			            						data-html="true"
			            						data-placement="bottom"
			            						data-original-title="<?php echo $rule['description']; ?>"
			            					<?php endif ?>
				            				>
				            					<?php echo $rule['title']; ?>
				            				</li>
				            			<?php endforeach ?>
				            		</ul>
				            		<?php if( ! has_bought_items( array( $products_id ) ) ): ?>
					            		<?php if (get_field( 'promotion_buy_all_button', 'product_health_' .$health->term_id )): ?>
					            			<a class="btn-common green-border no-hover add-multiple-to-cart" href="#"
								            <?php if ($products_id): ?>
								            	data-pid="<?php echo json_encode($products_id); ?>"
								            <?php endif ?>
								            >
					            				<div class="pos">BUY <?php echo $health->name; ?></div>
					            			</a>
					            		<?php endif ?>
				            		<?php endif ?>
				            	</div>
				            <?php endif ?>
		            	</div>
						<?php if ( $product_by_health ): ?>
							<div class="row row-health-hub">
								<?php foreach ($product_by_health as $key => $product): ?>
									<?php 
										// check step
										$user_step = get_user_meta( $uid, 'product_' . $product->ID . '_step', true );

										$_product = wc_get_product( $product->ID );
										
									?>
									<?php $preid = 'data-preid='.$product_by_health[ $key - 1 ]->ID; ?>
					                <div class="col-md-4 check-active-next-product" >
						                <div class="item-health">											
											<div class="img-drop <?php if( false == has_bought_items( (array) $product->ID, false ) ) { echo 'disabled'; } ?>"><?php echo $_product->get_image( 'post-thumbnails' ); ?></div>
											<div class="wrapper-text"><p><?php echo $_product->get_name(); ?></p><?php if( false == has_bought_items( (array) $product->ID, false ) ) { ?><div class="icon locker"></div><?php } ?></div>
										</div>
										<div class="text-center">
											<a class="btn-detail" href="#" data-toggle="modal-edit" data-url="<?php echo site_url( 'wp-json/api/v1/get-short-des-programs/'.$product->ID ); ?>">See details</a>
										</div>
					                    <?php 
											if ( true == has_bought_items( (array) $product->ID, false ) ) { ?>
												<?php $_buycount++; ?>
												<a class="btn-common green-border full-width <?php echo "cateh-".$health->term_id;?>" href="<?php echo $_product->get_permalink().($user_step?"#".$user_step:""); ?>">
													<div class="pos">START PROGRAM</div>
												</a>
											<?php } ?>	
					                </div>
				                <?php endforeach ?>
				            </div>
							
							<?php if($_buycount < count($product_by_health)): ?>
								<?php $promotion = get_field( 'health_hub_promotion', 'product_health'. '_' .$health->term_id ); ?>
								<?php $promotion_mobile = get_field( 'health_hub_promotion_mobile', 'product_health'. '_' .$health->term_id ); ?>
								<?php $_url_add_all = substr($_url_add_all, 1)?(preg_replace("/\?.*$/","",$_SERVER["REQUEST_URI"])."?add-more-to-cart=".substr($_url_add_all, 1)):"#";?>
								<?php if ( $promotion ): ?>
									<div class="banner-promotion-health-hub">
										<a href="<?php echo $_url_add_all; ?>">
											<img src="<?php echo $promotion[ 'url' ]; ?>" alt="<?php echo $promotion[ 'alt' ]; ?>">
										</a>
									</div>
								<?php endif ?>
								<?php if ( $promotion_mobile ): ?>
									<div class="banner-promotion-health-hub-mobile">
										<a href="<?php echo $_url_add_all; ?>">
											<img src="<?php echo $promotion_mobile[ 'url' ]; ?>" alt="<?php echo $promotion_mobile[ 'alt' ]; ?>">
										</a>
									</div>
								<?php endif ?>
							<?php endif; ?>
						<?php endif ?>
			        </div>
			    </section>
			<?php endforeach ?>
			
			<!-- MODAL SHORT DES -->
			<div class="health-hub">
				<div class="modal fade" id="health-hub-modal">
					<div class="modal-dialog modal-dialog-centered">
						<div class="modal-content">
							<button class="close" data-dismiss="modal"><span>&times;</span></button>
							<div class="modal-body">
								<div class="iframe_div no-height"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

		<?php endif ?>

<?php 
	get_footer();