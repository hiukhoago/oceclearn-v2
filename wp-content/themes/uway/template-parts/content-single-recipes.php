<!-- RECIPE: BANNER-->
<section class="banner-product spacing-around spacing-header">
    <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
    <div class="img-drop"><img class="lazygo" data-src="<?php the_post_thumbnail_url(); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
</section>

<!-- RECIPE: CONTENT -->
<section class="blog-content bg-skin spacing-around">
    <div class="container spacing-section spacing-end">
        <div class="row">
            <!-- Main Content Blog-->
            <div class="col-lg-8">
                <h5 class="sub-cate text-green">RECIPES</h5>
                <h1 class="title-product mb-15"><?php the_title(); ?></h1>
                <div class="mb-30">
                    <?php the_content(); ?>
                </div>
                <?php if ( get_field( 'recipes_kj' ) or get_field( 'recipes_cooking_time' ) or get_field( 'recipes_servers' ) ): ?>
                    <ul class="gray-tag-list">
                        <?php if ( get_field( 'recipes_kj' ) ) : ?><li><span><?php the_field( 'recipes_kj' ); ?></span></li><?php endif ?>
                        <?php if ( get_field( 'recipes_cooking_time' ) ) : ?><li> <span><?php the_field( 'recipes_cooking_time' ); ?></span></li><?php endif ?>
                        <?php if ( get_field( 'recipes_servers' ) ) : ?><li> <span>Serves <?php the_field( 'recipes_servers' ); ?> People</span></li><?php endif ?>
                    </ul>
                <?php endif ?>

                <?php 
                    $ingredients = get_field( 'recipes_ingredients' );
                    $instructions = get_field( 'recipes_instructions' );
                 ?>
                <ul class="recipes-tab nav tabs-anim-ul">
                    <?php if ($ingredients): ?>
                        <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#recipes-extra1">ingredients</a></li>
                    <?php endif ?>

                    <?php if ($instructions): ?>
                        <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#recipes-extra2">method</a></li>
                    <?php endif ?>
                </ul>
                <div class="tab-content recipes-info tabs-anim">
                    <?php if ($ingredients): ?>
                        <div class="tab-pane show active fade" id="recipes-extra1">
                            <?php if ( have_rows( 'recipes_ingredients' ) ) : ?>
                                <?php while ( have_rows( 'recipes_ingredients' ) ) : the_row(); ?>
                                    <?php if(get_sub_field( 'recipes_ingredients_content_title' )): ?>
                                    <h5><?php the_sub_field( 'recipes_ingredients_content_title' ); ?></h5>
                                    <?php endif; ?>
                                    <?php the_sub_field( 'recipes_ingredients_content' ); ?>
                                <?php endwhile; ?>
                            <?php endif; ?>
                        </div>    
                    <?php endif ?>
                    
                    <?php if ($instructions): ?>
                        <div class="tab-pane fade" id="recipes-extra2">
                            <?php if ( have_rows( 'recipes_instructions' ) ) : ?>
                                <?php while ( have_rows( 'recipes_instructions' ) ) : the_row(); ?>
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
                    <?php if ( 'normal' == get_field( 'recipes_type' ) ): ?>
                        <!-- Share Social-->
                        <div class="group-share-social">
                            <h5>Share</h5>
                            <div class="list-social-js"></div>
                        </div>
                    <?php endif ?>
                    <!-- Print to PDF-->
                    <a class="btn-black full-width mb-30 btn-print-pdf" href="javascript:window.print();"><i class="icon pdf-icon"></i> PRINT TO PDF</a>
                    <!-- Gallery sidebar-->
                    <?php // ACF Image Gallery
                    $images = get_field( 'recipes_gallery' );
                    if ( $images ) : ?>
                        <div class="gallery-sidebar"> 
                            <h6>Gallery</h6>
                            <div class="gallery-thumb-list" id="aniimated-thumbnials">
                                <?php foreach ( $images as $image ) : ?>
                                    <a href="<?php echo $image['url']; ?>">
                                        <div class="img-drop ratio-11"><img src="<?php echo $image['sizes']['large']; ?>" alt="<?php echo $image['alt']; ?>"></div>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- RECIPES: RELATED -->
<?php if ( get_field( 'recipes_related' ) ) : ?>
    <?php $recipes_page_id = get_page_by_title( 'Recipes' ); ?>
    <section class="related-recipes pb-150 spacing-section bg-green spacing-around">
        <div class="container">
            <?php if ( get_field( 'recipes_related_title', $recipes_page_id ) ) : ?><h2 class="title-product wow fadeIn"><?php the_field( 'recipes_related_title', $recipes_page_id ); ?></h2><?php endif ?>
            <div class="wrap-text">
                <?php if ( get_field( 'recipes_related_description', $recipes_page_id ) ) : ?><div class="font-product"><?php the_field( 'recipes_related_description', $recipes_page_id ); ?></div><?php endif; ?>
                <a class="btn-common green big-btn" href="<?php echo esc_url( site_url( 'Recipes' ) ); ?>"><div class="pos">see all recipes</div></a>
            </div>
            <div class="row row-recipes">
                <?php foreach ( get_field( 'recipes_related' ) as $post ): setup_postdata( $post ); ?>
                    <div class="col-lg-3 col-sm-6">
                        <div class="item-post">
                            <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
                            <div class="img-drop ratio-11"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo (!empty($alt)) ? $alt : get_the_title(); ?>"></div>
                            <div class="wrap-info">
                                <h3><?php the_title(); ?></h3>
                                <div class="row-read-btn">
                                    <a class="btn-common trans" href="<?php echo esc_url( get_the_permalink() ); ?>"><div class="pos">read now</div></a>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php endforeach; wp_reset_postdata(); ?>
            </div>
        </div>
    </section>
<?php endif ?>