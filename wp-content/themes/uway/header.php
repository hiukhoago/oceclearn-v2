<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Uway
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<!-- Anti-flicker snippet (recommended)  -->
	<style>.async-hide { opacity: 0 !important} </style>
	<script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
	h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
	(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
	})(window,document.documentElement,'async-hide','dataLayer',4000,
	{'GTM-544Z4DL':true});</script>
				
	<?php $dir = get_template_directory_uri() . '/html/'; ?>

	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no">
	<meta name="google-site-verification" content="NOXU4MW-xs_2ntpJlH7pThBj2r9EFLs1e94-iEtxJLM" />

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link rel="profile" href="http://gmpg.org/xfn/11">
	
	<!-- Favicon-->
    <link rel="shortcut icon" href="<?php echo $dir; ?>upload/favicon.ico" type="image/x-icon">
    <link rel="apple-touch-icon" href="<?php echo $dir; ?>upload/favicon.png">
    <!-- CSS-->
    <link rel="stylesheet" href="<?php echo $dir; ?>src/scss/plugins.css">
    <link rel="stylesheet" href="<?php echo $dir; ?>src/scss/style.css">
    <!-- Title-->
    <script>window.jQuery || document.write('<script src="<?php echo $dir; ?>src/js/jquery.js"><\/script>')</script>
	
	<?php wp_head(); ?>
	
	<!-- Google Tag Manager -->
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-KXS8BM9');</script>
	<!-- End Google Tag Manager -->

    <?php global $wp; ?>
</head>

<body <?php body_class(); ?>>
	<!-- Google Tag Manager (noscript) -->
	<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KXS8BM9"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<!-- End Google Tag Manager (noscript) -->
	
    <!-- HEADER PAGE -->
    <header class="header-page">
        <?php if ($site_logo = get_field( 'site_logo', 'options' )): ?>
            <a class="logo" href="<?php echo esc_url( home_url() ); ?>">
                <img src="<?php echo $site_logo['sizes']['large']; ?>" alt="<?php echo $site_logo['alt']; ?>"/>
            </a>
        <?php endif ?>
    	<a class="btn-menu-sp" href="#" id="btn-menu-sp"><span></span></a>
        <?php if (is_cart() or is_checkout()): ?>
            <a class="header-btn-cart show-cart mobile-show" href="<?php wc_get_cart_url(); ?>">
                <span class="render-cart-items-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
            </a>
        <?php else: ?>
            <a class="header-btn-cart show-cart mobile-show" href="#">
                <span class="render-cart-items-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
            </a>
        <?php endif ?>
        
        <div class="wrap-content-mobile">
            <div class="wrap-inner">
                <!--HEADER CONTENT-->
                <div class="container-fluid">
                    <div class="row row-header">             

                        <?php $left_menus = get_nav_menu_items_by_location( 'header-left' ); // get list menu items in left header ?>
                        <?php if ( $left_menus ): ?>

                            <?php $left_menus = recursiveMenu( $left_menus ); ?>
                            <div class="col-6">
                                <ul class="menu-top">
                                    <?php foreach ( $left_menus as $menu_key => $menu_item ): ?>
                                        <li class="<?php if ( home_url( $wp->request ) . '/' == $menu_item->url ) echo 'current-menu-item'; ?>
                                         <?php echo $menu_item->children ? 'has-sub-menu' : '' ?> ">
                                            <a href="<?php echo esc_url( $menu_item->url ); ?>"><?php echo $menu_item->title; ?></a>     
                                            <?php if($menu_item->children) : ?>
                                                <i class="dropdown-carret"></i>
                                                <ul class="dropdown-menu">
                                                    <?php foreach($menu_item->children as $children_key => $menu_children) : ?>
                                                        <li>
                                                            <a href="<?php echo $menu_children->url ;?>"><?php echo $menu_children->title ;?></a>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            <?php endif; ?>      
                                        </li>
                                    <?php endforeach ?>
                                </ul>
                            </div>

                        <?php endif ?>
                        
                        <div class="col-6 row-custom">
                            <?php $right_menus = get_nav_menu_items_by_location( 'header-right' ); // get list menu items in right header ?>
                            <ul class="menu-top right">
                                <?php if ( $right_menus ): ?>
                                    <?php $right_menus = recursiveMenu( $right_menus ); ?>
                                    
                                    <?php foreach ( $right_menus as $menu_key => $menu_item ): ?>
                                        <li class="<?php if ( home_url( $wp->request ) . '/' == $menu_item->url ) echo 'current-menu-item'; ?>
                                        <?php echo $menu_item->children ? 'has-sub-menu' : '' ?>">
                                            <a href="<?php echo esc_url( $menu_item->url ); ?>"><?php echo $menu_item->title; ?></a>
                                            <?php if($menu_item->children) : ?>
                                                <i class="dropdown-carret"></i>
                                                <ul class="dropdown-menu">
                                                    <?php foreach($menu_item->children as $children_key => $menu_children) : ?>
                                                        <li>
                                                            <a href="<?php echo $menu_children->url ;?>"><?php echo $menu_children->title ;?></a>
                                                        </li>
                                                    <?php endforeach; ?>
                                                </ul>
                                            <?php endif; ?> 
                                        </li>
                                    <?php endforeach ?>
                                <?php endif ?>

                                <?php if ( is_user_logged_in() ): ?>
                                    <li class="login"><a href="<?php echo get_permalink( get_option('woocommerce_myaccount_page_id') ); ?>">My Account</a></li>
                                <?php else: ?>
                                    <li class="login"><a href="#" id="login-toggle">Login / Register</a></li>
                                <?php endif ?>
                                <li class="info-user"><a href="#">Hi, <b><?php echo wp_get_current_user()->display_name; ?></b></a></li>
                            </ul>

                            <?php if ( is_cart() or is_checkout() ): ?>
                                <a class="header-btn-cart desktop-show" href="<?php wc_get_cart_url(); ?>">
                                    <span class="render-cart-items-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                                </a>
                            <?php else: ?>
                                <a class="header-btn-cart show-cart desktop-show" href="#">
                                    <span class="render-cart-items-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
                                </a>
                            <?php endif ?>
                        </div>
                    </div>
                </div>
                <!--SIDEBAR LEFT-->
                <section class="sidebar-left">
                    <ul class="list-social">
                        <?php if ( get_field( 'side_bar_instagram', 'options' ) ) : ?><li class="ins"><a href="<?php echo esc_url( get_field( 'side_bar_instagram', 'options' ) ); ?>" target="_blank">Instagram </a></li><?php endif; ?>
                        <?php if ( get_field( 'side_bar_facebook', 'options' ) ) : ?><li class="fb"><a href="<?php echo esc_url( get_field( 'side_bar_facebook', 'options' ) ); ?>" target="_blank">Facebook</a></li><?php endif; ?>
                    </ul>
                    <ul class="list-mobile-contact d-lg-none d-block">
                        <?php if ( get_field( 'footer_phone', 'options' ) ) : ?><li><a href="tel:<?php the_field( 'footer_phone', 'options' ); ?>"><?php the_field( 'footer_phone', 'options' ); ?></a></li><?php endif; ?>
                        <?php if ( get_field( 'footer_email', 'options' ) ) : ?><li><a href="mailto:<?php the_field( 'footer_email', 'options' ); ?>"><?php the_field( 'footer_email', 'options' ); ?> </a></li><?php endif; ?>
                    </ul>
                </section>
                <div class="sidebar-right"></div>
            </div>
        </div>
        <!-- FOOTER PAGE-->
        <section class="side-bottom">
            <div class="container-fluid">
                <ul class="item-footer">
                    <?php if ( get_field( 'footer_company_name', 'options' ) ) : ?>
                        <li class="d-lg-block d-none">&copy; <?php echo date('Y'); ?> <?php the_field( 'footer_company_name', 'options' ); ?></li>
                    <?php endif; ?>
                    <?php if ( get_field( 'footer_free_shipping', 'options' ) ) : ?>
                        <li><?php the_field( 'footer_free_shipping', 'options' ); ?></li>
                    <?php endif; ?>
                    <li> 
                        <?php if ( get_field( 'footer_phone', 'options' ) ) : ?>
                            <a href="tel:<?php the_field( 'footer_phone', 'options' ); ?>"><span><?php the_field( 'footer_phone', 'options' ); ?></span><i class="icon tel"></i></a>
                        <?php endif; ?>
                        <?php if ( get_field( 'footer_email', 'options' ) ) : ?>
                            <a href="mailto:<?php the_field( 'footer_email', 'options' ); ?>"><span><?php the_field( 'footer_email', 'options' ); ?></span><i class="icon mail"> </i></a>
                        <?php endif; ?>
                    </li>
                </ul>
            </div>
        </section>
    </header>

    <!-- PANEL-LOGIN-->
    <div class="panel-login" id="panel-login"><a href="#" title="Close the panel" id="btn-close-login"></a>
        <div class="scrollbar-macosx">
            <div class="login-panel-container">
                <div id="signup-fields">
                    <h1 class="title-product text-center">Welcome back !</h1>
                    <?php if ( get_field( 'facebook_id', 'options' ) ): ?>
                        <p class="text-center mb-15">Please login or signup to your Flourish account!</p>
                        <a class="btn-white fb_login" href="javascript:void(0)"><i class="icon fb-square"></i> Login with Facebook</a>
                        <div class="white-textline"></div>
                    <?php endif ?>
                    <form class="woocommerce-form woocommerce-form-login" id="login-form" action="">                       
                        <div class="form-text-input">
                            <label for="">Email</label>
                            <input type="email" required name="txt_email"/>
                        </div>
                        <div class="form-text-input">
                            <label for="">Password</label>
                            <input type="password" required name="txt_pass"/>
                        </div>
                        <div class="lost-pw text-center"><a class="text-futura" href="<?php echo esc_url( wc_lostpassword_url() ); ?>">Forgot your password?</a></div>
                        <div class="show-mes-response"></div> <br />
                        <input type="submit" value="LOG IN"/>
                        <div class="text-center footer-login">
                            <p>Don't have an account? <strong><a href="javascript:;" id="sign-up-show">Sign up here</a></strong></p>
                        </div>
                    </form>
                </div>
                <div id="login-fields">
                    <h1 class="title-product text-center">Hello there !</h1>
                    <?php if ( get_field( 'facebook_id', 'options' ) ): ?>
                        <p class="text-center mb-15">Fill in your details below to create a Flourish account</p>
                        <a class="btn-white fb_login" href="javascript:void(0)"><i class="icon fb-square"></i> Login or Sign up with Facebook</a>
                    <div class="white-textline"></div>
                    <?php endif ?>
                    
                    <form class="woocommerce-form woocommerce-form-login" id="signup-form" action="">                       
                        <div class="form-text-input">
                            <label for="">Email</label>
                            <input type="email" required name="txt_s_email"/>
                        </div>
                        <div class="form-text-input form-half">
                            <label for="">Password</label>
                            <input type="password" required name="txt_s_password"/>
                        </div>
                        <div class="form-text-input form-half">
                            <label for="">Confirm Password</label>
                            <input type="password" required name="txt_s_confirm"/>
                        </div>
                        <div class="show-mes-response"></div> <br />
                        <input type="submit" value="SIGN UP"/>
                        <div class="text-center footer-login">
                            <p>Already have an account? <strong><a href="javascript:;" id="login-show">Sign in here</a></strong></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- PANEL-CART -->
    <?php if ( !(is_cart() or is_checkout()) ): ?>
        <div class="bag-hover"><?php woocommerce_mini_cart(); ?></div>
    <?php endif ?>

    <!-- Popup show confirm remove appointment before add product to card -->
    <div class="fade modal modal-alert" id="modal-alert">
        <div class="modal-dialog modal-lg modal-dialog-centered">          
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close" type="button" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <?php if (get_field( 'has_appointment_in_cart', 'options' )): ?>
                        <h6 class="text-center"><?php the_field( 'has_appointment_in_cart', 'options' ); ?></h6>
                    <?php endif ?>
                    <div class="d-flex flex-wrap justify-content-center">
                        <a class="btn-black cofirm-remove-appointment" href="#">Confirm</a>
                        <a class="btn-transparent cancel-remove-appointment" href="#" data-dismiss="modal">Cancel</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Popup show confirm add product onbackorder to cart -->
    <div class="fade modal modal-alert" id="product-onbackorder">
        <div class="modal-dialog modal-lg modal-dialog-centered">          
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close" type="button" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <h6 class="text-center">This item is on back order. Would you like to continue adding to your cart? If you do, please note that your items won't be shipped until they are all in stock.</h6>
                    <div class="d-flex flex-wrap justify-content-center">
                        <a class="btn-black confirm-add-onbackorder" href="#">Confirm</a>
                        <a class="btn-transparent cancel-add-onbackorder" href="#" data-dismiss="modal">Cancel</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- WRAP PAGE-->
    <div <?php if ( is_checkout() ) echo 'class="bg-skin mh-100vh spacing-checkout"'; ?> id="wrap-page">
        <!--WRAP CONTENT-->
        <?php if(is_home()) : ?><div class="c-frame__content"><?php endif; ?>
