<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Uway
 */

$dir = get_template_directory_uri() . '/html/';

?>

				<!-- FOOTER PAGE-->
                <footer class="footer-page section-scroll">
                    <div class="container">
                        <?php if ( function_exists( 'gravity_form') ) : ?>
                        <div class="form-subcribe">
                            <h3>Subscribe to our Newsletter</h3>
                            <div class="wrap-form"> 
                                <?php gravity_form('Newsletter', false, false, false, '', true, 100); ?>
                            </div>
                        </div>
                        <?php endif; ?>
                        <?php 
                            $menu_items = wp_get_nav_menu_items( 'Footer Menu' );
                            if ($menu_items) {
                                _wp_menu_item_classes_by_context($menu_items);

                                foreach ($menu_items as $k => $menu) {
                                    $nav_menu[$menu->ID] = $menu;
                                    $nav_menu[$menu->ID]->children = array();
                                }

                                foreach ($nav_menu as $k => $list_menu) {
                                    if ($list_menu->menu_item_parent != '0') {
                                        $nav_menu[$list_menu->menu_item_parent]->children[$k] = $list_menu;
                                        unset($nav_menu[$k]);
                                    }
                                }
                            }
                        ?>
                        <?php if ( $nav_menu ) : ?>
                        <div class="row">
                            <?php foreach ( $nav_menu as $key => $list_parent): ?>
                                <div class="col-md-4 col-6">
                                    <ul class="list-menu-footer">
                                        <?php if ( $list_parent->children ): ?>
                                            <?php foreach ( $list_parent->children as $list_child ): ?>
                                                <li><a href="<?php echo esc_url( $list_child->url ); ?>"><?php echo $list_child->title; ?></a></li>
                                            <?php endforeach ?>
                                        <?php endif ?>
                                    </ul>
                                </div>
                            <?php endforeach ?>
                        </div>
                        <?php endif; ?>
                        <div class="img-animation">
                            <div class="item">  <img src="<?php echo $dir; ?>upload/img-footer-1.png" alt=""></div>
                            <div class="item">  <img src="<?php echo $dir; ?>upload/img-footer-2.png" alt=""></div>
                            <div class="item">  <img src="<?php echo $dir; ?>upload/img-footer-3.png" alt=""></div>
                        </div>
                        <div class="copyright">
                            <span>© <?php echo date("Y"); ?> Ecoclean</span> Website by <strong><a href="https://uway.asia" target="_blank" title="Uway Technology">Uway Technology</a></strong>
                        </div>
                    </div>
                </footer>
            </div>
        <?php if(is_home()) : ?> </div> <?php endif; ?>

        <script src="<?php echo $dir; ?>src/js/plugins.min.js"></script>
        <script src="<?php echo $dir; ?>src/js/main.js"></script>
        <script data-src="https://maps.google.com/maps/api/js?libraries=places&amp;key=AIzaSyApEpQ5tDwzlRfH1vuo4351Bwdar8OzyUI" id="google-map"></script>
        <script src="<?php echo $dir; ?>src/js/initmap.js"></script>
		<?php wp_footer(); ?>
    </body>
</html>
