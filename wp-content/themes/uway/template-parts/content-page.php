<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Uway
 */

?>

<?php if(!is_woocommerce_page()): ?>

    <!-- PAGE: BANNER-->
    <section class="page-default-template spacing-around spacing-header">
        <div class="text-center spacing-section-medium ">
            <h1 class="title-page"><?php the_title(); ?></h1>
        </div>
        <div class="container">
            <?php the_content(); ?>
        </div>
    </section>

    


<?php else: ?>

<?php the_content(); ?>

<?php endif; ?>
