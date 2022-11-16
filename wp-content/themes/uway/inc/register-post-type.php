<?php 

add_action( 'init', 'create_post_types' );

if ( !function_exists('create_post_types')) {
	function create_post_types() {
		register_post_type( 'recipes',
			array(
				'labels'        => array(
				'name'          => __( 'Recipes' ),
				'singular_name' => __( 'Flourish Recipes' )
		      ),
				'public'             => true,
				'menu_position'      => 4,
				'menu_icon'          => 'dashicons-carrot',
				'has_archive'        => false,
				'rewrite'            => array('slug' => 'recipes'),
				'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ),
			)
		);

		register_post_type( 'educations',
			array(
				'labels'        => array(
				'name'          => __( 'Educations' ),
				'singular_name' => __( 'Flourish Education' )
		      ),
				'public'              => true,
				'menu_position'       => 5,
				'menu_icon'           => 'dashicons-book',
				'has_archive'         => false,
				// 'publicly_queryable'  => false,
				'query_var'           => false,
				'exclude_from_search' => true,
				'rewrite'             => array('slug' => 'educations'),
				'supports'            => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
			)
		);

		register_post_type( 'stockist',
	        array(
	            'labels'        => array(
	            'name'          => __( 'Stockist' ),
	            'singular_name' => __( 'Stockist' )
	          ),
	            'public'              => true,
	            'menu_position'       => 5,
	            'menu_icon'           => 'dashicons-admin-site',
	            'has_archive'         => false,
	            'publicly_queryable'  => false,
	            'query_var'           => false,
	            'exclude_from_search' => true,
	            'rewrite'             => array('slug' => 'stockist'),
	            'supports'            => array( 'title', 'thumbnail', 'excerpt', 'page-attributes' ),
	        )
	    );

	   register_post_type( 'appointment',
	        array(
	            'labels'        => array(
	            'name'          => __( 'Appointments' ),
	            'singular_name' => __( 'Appointment' )
	          ),
	            'public'              => true,
	            'menu_position'       => 5,
	            'menu_icon'           => 'dashicons-welcome-write-blog',
	            'has_archive'         => false,
	            'publicly_queryable'  => false,
	            'query_var'           => false,
	            'exclude_from_search' => true,
	            'rewrite'             => array( 'slug' => 'appointment'),
	            'supports'            => array( 'title' ),
	            'capabilities'		  => array(
	            	'create_posts'	=> 'do_not_allow'
	            ),
	            'map_meta_cap'		  => true
	        )
	    ); 

		register_taxonomy(
	        'product_ingredients',  //The name of the taxonomy. Name should be in slug form (must not contain capital letters or spaces).
	        'product',        //post type name
	        array(
	            'hierarchical' => false,
	            'label' => 'Ingredients',  //Display name
	            'query_var' => true,
	            'rewrite' => array(
	                'slug' => 'product_ingredients', // This controls the base slug that will display before each term
	                'with_front' => false // Don't display the category base before
	            )
	        )
	    );

	    register_taxonomy(
	        'product_health',  //The name of the taxonomy. Name should be in slug form (must not contain capital letters or spaces).
	        'product',        //post type name
	        array(
	            'hierarchical' => true,
			    'label' => 'Health Programs',
			    'show_ui' => true,
			    'show_admin_column' => true,
			    'query_var' => true,
	            'rewrite' => array(
	                'slug' => 'product_health', // This controls the base slug that will display before each term
	                'with_front' => false // Don't display the category base before
	            )
	        )
	    );

		flush_rewrite_rules( false );
	}	
}
