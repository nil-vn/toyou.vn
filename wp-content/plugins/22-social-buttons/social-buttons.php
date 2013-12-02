<?php
/*
Plugin Name: 22 Social Buttons
Plugin URI: http://wordpress.org/plugins/
Description: Get one of 22 cool social buttons with few clicks!
Author: sAlex
Author URI: http://codecanyon.net/user/sAlex
Version: 1.0
*/
if ( !function_exists( 'add_action' ) ) {
	echo 'Can\'t be called directly';
	exit;
}

define('SOCIAL_BUTTONS_WP_URL', plugin_dir_url( __FILE__ ));

#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_install() { 			#install plugin
#-------------------------------------------------------------------------------------------
	
    $option = get_option('SOCIAL_BUTTONS_WP');
    if (false === $option) {
					
	$option = array();
	$option['cursor_id'] = 0;
	$option['locked'] = true;
	$option['cursor'] = "";
	$option['cursor_enabled'] = false;
	$option['version'] = 1.0;
	
	add_option('SOCIAL_BUTTONS_WP', $option);
    }
}	
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_reinstall() { 			#update plugin
#-------------------------------------------------------------------------------------------
	
}				
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_uninstaller() {		#uninstall plugin
#-------------------------------------------------------------------------------------------
    //delete_option('SOCIAL_BUTTONS_WP');
}				
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_build_nw_menu() {					#build admin menu
#-------------------------------------------------------------------------------------------
   $page = add_menu_page(__('Social Buttons','social-buttons-wp'), __('Social Buttons','social-buttons-wp'), 'manage_options', 'social-buttons-wp', 'SOCIAL_BUTTONS_WP_bootPage', 'div');
	add_action( 'admin_print_styles-'.$page, 'SOCIAL_BUTTONS_WP_includeCSS');
	add_action( 'admin_print_scripts-'.$page, 'SOCIAL_BUTTONS_WP_includeJS');
   	wp_register_style('SOCIAL_BUTTONS_WP_admin', SOCIAL_BUTTONS_WP_URL.'css/admin.css');
    wp_enqueue_style( 'SOCIAL_BUTTONS_WP_admin');
}
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_includeJS(){  					#add files
#-------------------------------------------------------------------------------------------
 global $wp_version;
	if($wp_version <= 3.2) {
		wp_deregister_script('jquery'); 
		wp_register_script('jquery', 'http://code.jquery.com/jquery-1.7.2.min.js', false, '1.5.2');
	}
	
	wp_register_script('SOCIAL_BUTTONS_WP_bootstrap', SOCIAL_BUTTONS_WP_URL.'js/bootstrap.js'); 
	wp_register_script('SOCIAL_BUTTONS_WP_bootstrap_modal', SOCIAL_BUTTONS_WP_URL.'js/bootstrap-modal.js'); 
	wp_register_script('SOCIAL_BUTTONS_WP_bootstrap_transition', SOCIAL_BUTTONS_WP_URL.'js/bootstrap-transition.js');
	wp_register_script('SOCIAL_BUTTONS_WP_script', SOCIAL_BUTTONS_WP_URL.'js/script.js');  
    
	wp_enqueue_script('jquery');
	
    wp_enqueue_script( 'SOCIAL_BUTTONS_WP_bootstrap');
    wp_enqueue_script( 'SOCIAL_BUTTONS_WP_bootstrap_transition');
    wp_enqueue_script( 'SOCIAL_BUTTONS_WP_bootstrap_modal');
    wp_enqueue_script( 'SOCIAL_BUTTONS_WP_script');
	}
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_includeCSS(){  					#add files
#-------------------------------------------------------------------------------------------
   wp_register_style('SOCIAL_BUTTONS_WP_style', SOCIAL_BUTTONS_WP_URL.'css/style.css');
    wp_register_style('SOCIAL_BUTTONS_WP_bootstrap', SOCIAL_BUTTONS_WP_URL.'css/bureau.css');
   wp_register_style('SOCIAL_BUTTONS_WP_buttons', SOCIAL_BUTTONS_WP_URL.'css/buttons.css');
	
    wp_enqueue_style( 'SOCIAL_BUTTONS_WP_style');
    wp_enqueue_style( 'SOCIAL_BUTTONS_WP_bootstrap'); 
    wp_enqueue_style( 'SOCIAL_BUTTONS_WP_buttons'); 
}
#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_bootPage() {  					#settings page
#-------------------------------------------------------------------------------------------

	require_once(dirname(__FILE__).'/includes/markup/mk-boot-page.php');
}

#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_init() {  					
#-------------------------------------------------------------------------------------------
	wp_enqueue_style(
		'SOCIAL_BUTTONS_WP_main_css',
		SOCIAL_BUTTONS_WP_URL.'css/buttons.css'
	);
}

#-------------------------------------------------------------------------------------------
function SOCIAL_BUTTONS_WP_shortcode($atts) {  					
#-------------------------------------------------------------------------------------------
	return '<a href="'.$atts['href'].'" class="'.$atts['class'].'">'.$atts['text'].'</a>';
}

#check for update

#register hooks
register_activation_hook( __FILE__, 'SOCIAL_BUTTONS_WP_install'); 
register_deactivation_hook( __FILE__, 'SOCIAL_BUTTONS_WP_uninstaller'); 
#build admin menu
add_action('admin_menu', 'SOCIAL_BUTTONS_WP_build_nw_menu');
#run main logic
add_action('admin_init', 'SOCIAL_BUTTONS_WP_reinstall');
add_action('wp_enqueue_scripts', 'SOCIAL_BUTTONS_WP_init');

add_shortcode( 'social_button_wp', 'SOCIAL_BUTTONS_WP_shortcode' );
?>