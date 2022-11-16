<?php
/**
 * Template Name: Health Hub New Page
 */
get_header();
?>
<!-- HEALTH HUB: BANNER-->
<section class="banner-product spacing-around spacing-header">
    <div class="text-cover">
        <h1 class="title-page"><?php the_title(); ?></h1>
        <?php while(have_posts()) : the_post();?>
        	<p class="des-page"><?php the_content(); ?></p>
        <?php endwhile ?>
    </div>
    <?php if (has_post_thumbnail()): ?>
    	<div class="img-drop lazyload" data-src="<?php the_post_thumbnail_url( $size = 'full' ); ?>"></div>
    <?php endif ?>
</section>
<!--SECTION PAGES ROW-->
<?php if ($pages = get_field( 'list_pages' )): ?>
	<section class="pages-row spacing-around">
	    <div class="row">
	    	<?php foreach ($pages as $page): ?>
	    		<div class="col-lg-4">
		            <div class="wrapper">
		                <?php if ($page['title']): ?>
		                	<h2 class="title-page"><?php echo $page['title']; ?></h2>
		                <?php endif ?>
		                <?php echo $page['description']; ?>
		                <?php if ($link = $page['link']): ?>
		                	<a class="btn-common trans" href="<?php echo $link['url']; ?>">
			                    <div class="pos"><?php echo $link['title']; ?></div>
			                </a>	
		                <?php endif ?>
		                <?php if ($image = $page['image']): ?>
		                	<img class="img-bg" src="<?php echo $image['sizes']['large']; ?>" alt="<?php echo $image['alt']; ?>">	
		                <?php endif ?>
		            </div>
		        </div>
	    	<?php endforeach ?>
	    </div>
	</section>
<?php endif ?>
<?php get_footer();