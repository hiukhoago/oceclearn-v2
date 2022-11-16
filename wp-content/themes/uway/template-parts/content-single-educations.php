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
            <div class="col-lg-8 offset-lg-2">
                <h5 class="sub-cate text-green">EDUCATIONS</h5>
                <h1 class="title-product mb-15"><?php the_title(); ?></h1>
                <div class="mb-30 not-reset-p">
                    <?php the_content(); ?>
                </div>
            </div>
        </div>
    </div>
</section>