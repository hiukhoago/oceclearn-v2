<!-- BLOG: BANNER-->
<section class="banner-product spacing-around spacing-header">
    <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
    <div class="img-drop"><img class="lazygo" data-src="<?php the_post_thumbnail_url(); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
</section>

<!-- BLOG: CONTENT -->
<section class="blog-content bg-skin spacing-around">
    <div class="container spacing-section spacing-end">
        <div class="row">
            <!-- Main Content Blog-->
            <div class="col-lg-8">
                <h5 class="sub-cate text-green">Blog</h5>
                <h1 class="title-product"><?php the_title(); ?></h1>
                <?php if ( has_excerpt() ): ?>
                    <div class="intro"><?php the_excerpt(); ?></div>
                <?php endif ?>
                <div class="content"><?php the_content(); ?></div>
            </div>
            <!-- Related Post-->
            <div class="col-lg-4">
                <div class="wrap-sidebar-blog-single">
                    <!-- Share Social-->
                    <div class="group-share-social">
                        <h5>Share</h5>
                        <div class="list-social-js"></div>
                    </div>
                    <!-- Next Post-->
                    
                    <?php 
                        $_prev_post = get_previous_post();
                     ?>
                    <?php if ( $_prev_post ): ?>
                        <div class="next-post">
                            <h5 class="sub-cate">Next Post</h5>
                            <a class="item-posts" href="<?php echo esc_url( get_permalink( $_prev_post->ID ) ); ?>">
                                <?php $alt = get_post_meta( get_post_thumbnail_id( $_prev_post->ID ), '_wp_attachment_image_alt', true ); ?>
                                <div class="img-drop"><img src="<?php echo get_the_post_thumbnail_url( $_prev_post->ID, $size = 'post-thumbnail' ) ?>" alt="<?php echo ( !empty($alt) ) ? $alt : $_prev_post->post_title; ?>"></div>
                                <h3 class="wrap-post"><?php echo $_prev_post->post_title; ?></h3>
                            </a>
                        </div>
                    <?php endif ?>
                    <?php 
                        $_next_post = get_next_post();
                     ?>
                    <?php if ( $_next_post ): ?>
                        <div class="next-post margin-top prev-post">
                            <h5 class="sub-cate">Previous Post</h5>
                            <a class="item-posts" href="<?php echo esc_url( get_permalink( $_next_post->ID ) ); ?>">
                                <?php $alt = get_post_meta( get_post_thumbnail_id( $_next_post->ID ), '_wp_attachment_image_alt', true ); ?>
                                <div class="img-drop"><img src="<?php echo get_the_post_thumbnail_url( $_next_post->ID, $size = 'post-thumbnail' ) ?>" alt="<?php echo ( !empty($alt) ) ? $alt : $_next_post->post_title; ?>"></div>
                                <h3 class="wrap-post"><?php echo $_next_post->post_title; ?></h3>
                            </a>
                        </div>
                    <?php endif ?>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- BLOG: RELATED-->
<?php if ( get_field( 'blog_related' ) ): ?>
    <?php $_blog_page_id = get_page_by_title( 'Blog' ); ?>
    <section class="related-recipes pb-150 spacing-section bg-green spacing-around">
        <div class="container">
            <?php if ( get_field( 'blog_related_title', $_blog_page_id ) ) : ?><h2 class="title-product wow fadeIn"><?php the_field( 'blog_related_title', $_blog_page_id ); ?></h2><?php endif ?>
            <div class="wrap-text">
                <?php if ( get_field( 'blog_related_description', $_blog_page_id ) ) : ?><div class="font-product"><?php the_field( 'blog_related_description', $_blog_page_id ); ?></div><?php endif ?>
                <a class="btn-common green big-btn" href="<?php echo esc_url( site_url( 'blog' ) ); ?>"><div class="pos">see all posts</div></a>
            </div>
            <div class="row row-recipes">
                <?php foreach ( get_field( 'blog_related' ) as $post ): setup_postdata( $post ); ?>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <a class="item-posts" href="<?php echo esc_url( get_the_permalink() ); ?>">
                            <?php $alt = get_post_meta( get_post_thumbnail_id( $post->ID ), '_wp_attachment_image_alt', true ); ?>
                            <div class="img-drop"><img src="<?php the_post_thumbnail_url( $size = 'post-thumbnail' ); ?>" alt="<?php echo ( !empty($alt) ) ? $alt : get_the_title(); ?>"></div>
                            <h3 class="wrap-post"><?php the_title(); ?></h3>
                        </a>
                    </div>
                <?php endforeach; wp_reset_postdata(); ?>
            </div>
        </div>
    </section>
<?php endif ?>
