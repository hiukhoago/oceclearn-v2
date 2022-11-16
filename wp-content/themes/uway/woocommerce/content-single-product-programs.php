<?php  
	defined( 'ABSPATH' ) || exit;

	global $product, $post;
?>

<?php if ( ! is_user_logged_in() ): ?>

	<section class="account spacing-around bg-skin">
		<div class="container spacing-end">
			<div class="tab-content content-account">
				<div class="row">
					<div class="col-md-6">  
					    <h2 class="title-page animated fadeInUp margin-bottom">Please login before access to this page !</h2>
					</div>
				</div>
			</div>
		</div>
	</section>

	<script type="text/javascript">
		jQuery(document).ready(function($) {
			setTimeout(function(){
				$("#login-toggle").trigger('click');
			},500)
		});
	</script>

	<style type="text/css">
		.backdrop-core {
			pointer-events: none;
		}
		#btn-close-login {
			display: none;
		}
	</style>
<?php else: ?>
	<?php $uid = get_current_user_id(); ?>
	<?php $user_step = get_user_meta( $uid, 'product_' . $product->get_ID() . '_step', true ); ?>
	<?php if ( ! has_bought_items( array( $product->get_ID() ), false ) ): // check product is purchased ?>
		<div class="bg-skin mh-100vh spacing-checkout" id="wrap-page">
			<div class="payment-success spacing-header spacing-around">
				<h1 class="title-product text-center mb-30"><?php esc_html_e( 'Oops! This product is not purchased.', 'uway' ); ?></h1>
				<p class="text-center mb-45"><?php esc_html_e( 'Please purchase to see more details.', 'uway' ); ?></p>
				<div class="text-center"><a class="btn-black" href="<?php echo site_url( 'health-hub' ); ?>">BACK TO BUY</a></div>
			</div>
		</div>
	<?php else: ?>
		<!-- HEALTH PROGRAM: BANNER-->
		<?php if ( get_field( 'book_link_video' ) ): ?>
			<section class="banner-health-video spacing-around spacing-header">
			    <div class="img-drop video-holder" data-link="<?php the_field( 'book_link_video' ); ?>">
			    	<?php 
			    		// ACF Image Object
			    		$image     = get_field( 'book_video_image' );
			    		$alt       = $image['alt'];
			    		$imageSize = $image['url'];
					?>
					<button class="close-btn"><span> </span></button>
			        <button class="play-btn"><i class="fa fa-play"></i></button><img class="lazygo" data-src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>">
			    </div>
			</section>
		<?php endif ?>

		<?php 
			$count = 0;
			$total_content = count( get_field( 'programs_content' ) );
		?>
		
		<?php if ( have_rows( 'programs_content' ) ) : ?>
		<!-- HEALTH PROGRAM : STICKY-->
		<section class="sticky-bar">
		<div class="toggle-nav"></div>
			<div class="wrap-sticky">
				<div class="container normal">
					<div class="content-center">
						<nav>
							<ul class="list-days">
								<li><a href="#introduction">Introduction</a></li>
								<?php while ( have_rows( 'programs_content' ) ) : the_row(); $count++;  ?>
								<?php $checkDay = strtolower( str_replace( ' ', '-', get_sub_field( 'programs_content_title' ) ) ); ?>
								<li class="<?php if ( $user_step > $checkDay ) echo 'finished'; ?>"><a href="#day-<?php echo $count; ?>"><?php the_sub_field( 'programs_content_title' ); ?></a></li>
								<?php endwhile; ?>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</section>
		<?php endif;?>
		
		<!-- HEALTH PROGRAM: CLEANSE-->
		<section class="spacing-around spacing-section content-health bg-skin">
		    <div class="container normal">

		        <div class="container" id="introduction">
		            <div class="wrap-text-4-item text-center">
		                <?php if ( get_field( 'programs_infor_title' ) ): ?>
		                	<div class="text-green"><?php the_field( 'programs_infor_title' ); ?></div>
		                <?php endif ?>
		                <?php if ( get_field( 'programs_infor_sub_title' ) ): ?>
		                	<div class="title-medium"><?php the_field( 'programs_infor_sub_title' ); ?></div>
		                <?php endif ?>
		            </div>
		            <?php if ( get_field( 'programs_infor_description' ) ): ?>
		            	<div class="description"><?php the_field( 'programs_infor_description' ); ?></div>
		            <?php endif ?>
		            <?php if ( $file = get_field( 'programs_infor_file' ) ): ?>
		            	<a download class="btn-common trans large gray" href="<?php echo $file['url']; ?>"><div class="pos">DOWNLOAD SHOPPING LIST</div></a>
		            <?php endif ?>
		            
					<div class="text-center"><a class="btn-black-get btn-step" data-uid="<?php echo $uid; ?>" data-pid="<?php echo $product->get_ID(); ?>" href="#day-1">GET STARTED</a></div>
		            
				</div>
				
		        <?php if ( have_rows( 'programs_content' ) ) : $count=0; ?>
	        		<?php while ( have_rows( 'programs_content' ) ) : the_row(); ?>
	        			<?php 
	        				$count++; 
	        				$checkDay = strtolower( str_replace( ' ', '-', get_sub_field( 'programs_content_title' ) ) );
	        			?>
				        <div class="box-day-scroll <?php if ( $user_step == $checkDay ) echo 'current-day'; ?>" id="day-<?php echo $count; ?>">
				        	<?php
				        		// ACF Image Object
				        		$image     = get_sub_field( 'programs_content_image' );
				        		$alt       = $image['alt'];
				        		$imageSize = $image['url'];
				        	?>
				        	<?php if ( $image ): ?>
				        		<div class="img-drop img-food"><img src="<?php echo $imageSize; ?>" alt="<?php echo $alt; ?>"></div>
				        	<?php endif ?>
				            
				            <div class="container">
				                <?php if ( get_sub_field( 'programs_content_title' ) ): ?>
				                	<h3 class="title-medium text-center"><?php the_sub_field( 'programs_content_title' ); ?></h3>
				                <?php endif ?>

				                <?php if ( have_rows( 'programs_list_content' ) ) : ?>
					                <div class="introduction">
					                	<?php while ( have_rows( 'programs_list_content' ) ) : the_row(); ?>
						                    <dl>
						                        <?php if ( get_sub_field( 'programs_list_content_title' ) ) : ?>
						                        	<dt><?php the_sub_field( 'programs_list_content_title' ); ?></dt>
						                        <?php endif ?>
						                        <?php  
						                        	switch ( get_sub_field( 'programs_list_content_type' ) ) {
						                        		case 'instructions': ?>
						                        			<?php if ( get_sub_field( 'programs_list_content_cooking_instructions' ) ): ?>
						                        				<dd><?php the_sub_field( 'programs_list_content_cooking_instructions' ); ?></dd>
						                        			<?php endif ?>
					                        			<?php break;
						                        		case 'recipes': ?>
						                        			<?php if ( $recipes = get_sub_field( 'programs_list_content_recipes' ) ): ?>
						                        				<dd>
							                        				<a class="btn-common bg-green" href="#" data-toggle="modal-edit" data-url="<?php echo site_url( 'wp-json/api/v1/get-recipes/'.$recipes->ID ); ?>"> 
							                                			<div class="pos"><?php echo $recipes->post_title; ?></div>
							                                		</a>
																	<div style="margin-top: 20px;"><?php the_sub_field( 'programs_list_content_recipes_content' ); ?></div>
							                                	</dd>
						                        			<?php endif ?>
					                        			<?php break;
						                        	}
						                        ?>
						                    </dl>
										<?php endwhile; ?>
					                </div>
								<?php endif ?>
				            </div>
				            <?php if ( $count -1 < $total_content ): ?>
				            	<div class="text-center"><a class="btn-black-get btn-next-step" data-uid="<?php echo $uid; ?>" data-pid="<?php echo $product->get_ID(); ?>" href="#day-<?php echo $count + 1; ?>">Finish <?php the_sub_field( 'programs_content_title' ); ?></a></div>
							<?php endif ?>
				        </div>
					<?php endwhile; ?>

					<div class="pb-80"></div>


					<!-- Modal iframe -->
					<div class="modal fade" id="recipes-modal">      
						<div class="modal-dialog modal-dialog-centered">
							<div class="modal-content">
								<button class="close" data-dismiss="modal"><span>&times;</span></button>
								<div class="modal-body">                        
									<div class="iframe_div"></div>
								</div>
							</div>
						</div>
					</div>
					
				<?php endif ?>
		    </div>
		</section>
	<?php endif ?>
<?php endif ?>
