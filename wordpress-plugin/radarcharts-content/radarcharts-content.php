<?php
/**
 * Plugin Name: RADARCharts Content Bridge
 * Description: Editable RADAR page, navigation, and RadarStore content for the headless Next.js frontend.
 * Version: 0.1.0
 * Author: RADARCharts by REM
 * License: GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

define( 'RADAR_CONTENT_VERSION', '0.1.0' );

function radar_content_post_types() {
	return array( 'radar_page', 'radar_nav', 'radar_service' );
}

function radar_content_register_post_types() {
	register_post_type(
		'radar_page',
		array(
			'labels' => array(
				'name' => 'RADAR Pages',
				'singular_name' => 'RADAR Page',
				'add_new_item' => 'Add RADAR Page',
				'edit_item' => 'Edit RADAR Page',
			),
			'public' => true,
			'show_ui' => true,
			'show_in_rest' => true,
			'rest_base' => 'radar-pages',
			'has_archive' => false,
			'menu_icon' => 'dashicons-layout',
			'supports' => array( 'title', 'editor', 'excerpt', 'revisions' ),
		)
	);

	register_post_type(
		'radar_nav',
		array(
			'labels' => array(
			'name' => 'RADAR Navigation',
			'singular_name' => 'Navigation Item',
			'add_new_item' => 'Add Navigation Item',
			'edit_item' => 'Edit Navigation Item',
		),
		'public' => false,
		'show_ui' => true,
		'show_in_rest' => true,
		'rest_base' => 'radar-navigation',
		'menu_icon' => 'dashicons-menu',
		'supports' => array( 'title', 'revisions' ),
	)
	);

	register_post_type(
		'radar_service',
		array(
			'labels' => array(
				'name' => 'RadarStore Services',
				'singular_name' => 'RadarStore Service',
				'add_new_item' => 'Add RadarStore Service',
				'edit_item' => 'Edit RadarStore Service',
			),
			'public' => true,
			'show_ui' => true,
			'show_in_rest' => true,
			'rest_base' => 'radar-services',
			'has_archive' => false,
			'menu_icon' => 'dashicons-cart',
			'supports' => array( 'title', 'editor', 'revisions' ),
		)
	);
}
add_action( 'init', 'radar_content_register_post_types' );

function radar_content_register_meta() {
	$meta_fields = array(
		'radar_page' => array(
			'radar_route_key' => 'sanitize_key',
			'radar_eyebrow' => 'sanitize_text_field',
			'radar_hero_title' => 'sanitize_text_field',
			'radar_hero_intro' => 'sanitize_textarea_field',
			'radar_archive_links' => 'sanitize_textarea_field',
		),
		'radar_nav' => array(
			'radar_nav_label' => 'sanitize_text_field',
			'radar_nav_href' => 'sanitize_text_field',
			'radar_nav_icon' => 'sanitize_key',
			'radar_nav_group' => 'sanitize_key',
			'radar_nav_order' => 'absint',
		),
		'radar_service' => array(
			'radar_service_category' => 'sanitize_text_field',
			'radar_service_price_ngn' => 'absint',
			'radar_service_featured' => 'rest_sanitize_boolean',
		),
	);
	$meta_fields['post'] = array(
		'_radar_source_url' => 'esc_url_raw',
		'_radar_source_site' => 'sanitize_text_field',
		'_radar_source_id' => 'sanitize_text_field',
	);

	foreach ( $meta_fields as $post_type => $fields ) {
		foreach ( $fields as $key => $sanitize_callback ) {
			register_post_meta(
				$post_type,
				$key,
				array(
					'show_in_rest' => true,
					'single' => true,
					'type' => $key === 'radar_service_price_ngn' || $key === 'radar_nav_order' ? 'integer' : 'string',
					'sanitize_callback' => $sanitize_callback,
				)
			);
		}
	}
}
add_action( 'init', 'radar_content_register_meta' );

function radar_content_add_meta_boxes() {
	add_meta_box( 'radar-page-fields', 'RADAR Page Settings', 'radar_content_page_fields', 'radar_page', 'normal', 'high' );
	add_meta_box( 'radar-nav-fields', 'Navigation Settings', 'radar_content_nav_fields', 'radar_nav', 'normal', 'high' );
	add_meta_box( 'radar-service-fields', 'RadarStore Service Settings', 'radar_content_service_fields', 'radar_service', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'radar_content_add_meta_boxes' );

function radar_content_field( $label, $key, $value, $type = 'text', $description = '' ) {
	printf(
		'<p><label for="%1$s"><strong>%2$s</strong></label><br><input class="widefat" id="%1$s" name="%1$s" type="%3$s" value="%4$s">%5$s</p>',
		esc_attr( $key ),
		esc_html( $label ),
		esc_attr( $type ),
		esc_attr( $value ),
		$description ? '<small>' . esc_html( $description ) . '</small>' : ''
	);
}

function radar_content_page_fields( $post ) {
	wp_nonce_field( 'radar_content_save_meta', 'radar_content_nonce' );
	radar_content_field( 'Route key', 'radar_route_key', get_post_meta( $post->ID, 'radar_route_key', true ), 'text', 'Example: charts, magazine, spotlights.' );
	radar_content_field( 'Hero eyebrow', 'radar_eyebrow', get_post_meta( $post->ID, 'radar_eyebrow', true ) );
	radar_content_field( 'Hero title override', 'radar_hero_title', get_post_meta( $post->ID, 'radar_hero_title', true ) );
	printf( '<p><label for="radar_hero_intro"><strong>Hero intro</strong></label><br><textarea class="widefat" rows="4" id="radar_hero_intro" name="radar_hero_intro">%s</textarea></p>', esc_textarea( get_post_meta( $post->ID, 'radar_hero_intro', true ) ) );
	printf( '<p><label for="radar_archive_links"><strong>Page archive links</strong></label><br><textarea class="widefat" rows="6" id="radar_archive_links" name="radar_archive_links">%s</textarea><small>One per line: Label|/path</small></p>', esc_textarea( get_post_meta( $post->ID, 'radar_archive_links', true ) ) );
}

function radar_content_nav_fields( $post ) {
	wp_nonce_field( 'radar_content_save_meta', 'radar_content_nonce' );
	radar_content_field( 'Visible label', 'radar_nav_label', get_post_meta( $post->ID, 'radar_nav_label', true ) );
	radar_content_field( 'Href', 'radar_nav_href', get_post_meta( $post->ID, 'radar_nav_href', true ), 'text', 'Use a relative path such as /store.' );
	radar_content_field( 'Icon key', 'radar_nav_icon', get_post_meta( $post->ID, 'radar_nav_icon', true ), 'text', 'Example: home, charts, store, articles.' );
	radar_content_field( 'Group', 'radar_nav_group', get_post_meta( $post->ID, 'radar_nav_group', true ), 'text', 'primary or secondary.' );
	radar_content_field( 'Order', 'radar_nav_order', get_post_meta( $post->ID, 'radar_nav_order', true ), 'number' );
}

function radar_content_service_fields( $post ) {
	wp_nonce_field( 'radar_content_save_meta', 'radar_content_nonce' );
	radar_content_field( 'Category', 'radar_service_category', get_post_meta( $post->ID, 'radar_service_category', true ) );
	radar_content_field( 'Price in NGN', 'radar_service_price_ngn', get_post_meta( $post->ID, 'radar_service_price_ngn', true ), 'number' );
	$featured = get_post_meta( $post->ID, 'radar_service_featured', true );
	printf( '<p><label><input name="radar_service_featured" type="checkbox" value="1" %s> Featured service</label></p>', checked( $featured, '1', false ) );
}

function radar_content_save_meta( $post_id ) {
	if ( ! isset( $_POST['radar_content_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['radar_content_nonce'] ) ), 'radar_content_save_meta' ) ) return;
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
	if ( ! current_user_can( 'edit_post', $post_id ) ) return;

	$fields = array( 'radar_route_key', 'radar_eyebrow', 'radar_hero_title', 'radar_hero_intro', 'radar_archive_links', 'radar_nav_label', 'radar_nav_href', 'radar_nav_icon', 'radar_nav_group', 'radar_nav_order', 'radar_service_category', 'radar_service_price_ngn', 'radar_service_featured' );
	foreach ( $fields as $key ) {
		if ( ! array_key_exists( $key, $_POST ) ) {
			if ( $key === 'radar_service_featured' ) delete_post_meta( $post_id, $key );
			continue;
		}
		$value = wp_unslash( $_POST[ $key ] );
		$value = $key === 'radar_service_price_ngn' || $key === 'radar_nav_order' ? absint( $value ) : ( $key === 'radar_service_featured' ? '1' : sanitize_textarea_field( $value ) );
		update_post_meta( $post_id, $key, $value );
	}
}
add_action( 'save_post', 'radar_content_save_meta' );

function radar_content_parse_links( $raw ) {
	$links = array();
	foreach ( preg_split( '/\r\n|\r|\n/', (string) $raw ) as $line ) {
		$parts = array_map( 'trim', explode( '|', $line, 2 ) );
		if ( count( $parts ) === 2 && $parts[0] && $parts[1] ) $links[] = array( 'label' => sanitize_text_field( $parts[0] ), 'href' => esc_url_raw( $parts[1] ) );
	}
	return $links;
}

function radar_content_page_payload( $post ) {
	return array(
		'id' => $post->ID,
		'slug' => $post->post_name,
		'routeKey' => get_post_meta( $post->ID, 'radar_route_key', true ) ?: $post->post_name,
		'eyebrow' => get_post_meta( $post->ID, 'radar_eyebrow', true ),
		'title' => get_post_meta( $post->ID, 'radar_hero_title', true ) ?: get_the_title( $post ),
		'intro' => get_post_meta( $post->ID, 'radar_hero_intro', true ) ?: wp_strip_all_tags( $post->post_excerpt ),
		'archive' => radar_content_parse_links( get_post_meta( $post->ID, 'radar_archive_links', true ) ),
		'content' => apply_filters( 'the_content', $post->post_content ),
	);
}

function radar_content_service_payload( $post ) {
	return array(
		'id' => $post->ID,
		'slug' => $post->post_name,
		'name' => get_the_title( $post ),
		'category' => get_post_meta( $post->ID, 'radar_service_category', true ),
		'description' => wp_strip_all_tags( $post->post_content ),
		'priceNgn' => absint( get_post_meta( $post->ID, 'radar_service_price_ngn', true ) ),
		'featured' => get_post_meta( $post->ID, 'radar_service_featured', true ) === '1',
	);
}

function radar_content_nav_payload( $post ) {
	return array(
		'id' => $post->ID,
		'label' => get_post_meta( $post->ID, 'radar_nav_label', true ) ?: get_the_title( $post ),
		'href' => esc_url_raw( get_post_meta( $post->ID, 'radar_nav_href', true ) ),
		'icon' => sanitize_key( get_post_meta( $post->ID, 'radar_nav_icon', true ) ),
		'group' => sanitize_key( get_post_meta( $post->ID, 'radar_nav_group', true ) ?: 'primary' ),
		'order' => absint( get_post_meta( $post->ID, 'radar_nav_order', true ) ),
	);
}

function radar_content_get_published( $post_type ) {
	return get_posts( array( 'post_type' => $post_type, 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'menu_order title', 'order' => 'ASC' ) );
}

function radar_content_register_routes() {
	register_rest_route( 'radarcharts/v1', '/pages', array( 'methods' => WP_REST_Server::READABLE, 'callback' => function () { return array_map( 'radar_content_page_payload', radar_content_get_published( 'radar_page' ) ); }, 'permission_callback' => '__return_true' ) );
	register_rest_route( 'radarcharts/v1', '/services', array( 'methods' => WP_REST_Server::READABLE, 'callback' => function () { return array_map( 'radar_content_service_payload', radar_content_get_published( 'radar_service' ) ); }, 'permission_callback' => '__return_true' ) );
	register_rest_route( 'radarcharts/v1', '/navigation', array( 'methods' => WP_REST_Server::READABLE, 'callback' => function () { $items = array_map( 'radar_content_nav_payload', radar_content_get_published( 'radar_nav' ) ); usort( $items, function ( $a, $b ) { return $a['order'] <=> $b['order']; } ); return $items; }, 'permission_callback' => '__return_true' ) );
}
add_action( 'rest_api_init', 'radar_content_register_routes' );

function radar_content_activate() {
	radar_content_register_post_types();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'radar_content_activate' );

function radar_content_deactivate() { flush_rewrite_rules(); }
register_deactivation_hook( __FILE__, 'radar_content_deactivate' );


/**
 * Protected WordPress admin hub. Access is inherited from WordPress roles;
 * editors with edit_posts can use the content shortcuts without receiving
 * site-wide settings permissions.
 */
function radar_content_admin_menu() {
	add_menu_page(
		'RADAR CMS',
		'RADAR CMS',
		'edit_posts',
		'radarcharts-cms',
		'radar_content_admin_page',
		'dashicons-admin-site-alt3',
		3
	);
}
add_action( 'admin_menu', 'radar_content_admin_menu' );

function radar_content_admin_card( $title, $description, $list_url, $new_url, $new_label ) {
	printf(
		'<section class="radar-cms-card"><h2>%1$s</h2><p>%2$s</p><p><a class="button button-primary" href="%3$s">Manage</a> <a class="button" href="%4$s">%5$s</a></p></section>',
		esc_html( $title ),
		esc_html( $description ),
		esc_url( $list_url ),
		esc_url( $new_url ),
		esc_html( $new_label )
	);
}

function radar_content_admin_page() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( esc_html__( 'You do not have permission to access RADAR CMS.', 'radarcharts-content' ) );
	}

	$cards = array(
		array( 'RADAR Pages', 'Edit route keys, hero copy, page introductions, body content, and page archive links.', admin_url( 'edit.php?post_type=radar_page' ), admin_url( 'post-new.php?post_type=radar_page' ), 'Add page' ),
		array( 'RADAR Navigation', 'Manage labels, paths, icon keys, navigation groups, and ordering for the site shell.', admin_url( 'edit.php?post_type=radar_nav' ), admin_url( 'post-new.php?post_type=radar_nav' ), 'Add item' ),
		array( 'RadarStore Services', 'Edit service names, descriptions, categories, prices in NGN, and featured status.', admin_url( 'edit.php?post_type=radar_service' ), admin_url( 'post-new.php?post_type=radar_service' ), 'Add service' ),
		array( 'Articles', 'Open the existing WordPress Articles editor used by the Next.js RADARArticles feed.', admin_url( 'edit.php?post_type=post' ), admin_url( 'post-new.php' ), 'Add article' ),
	);
	?>
	<div class="wrap radar-cms-wrap">
		<h1>RADAR CMS</h1>
		<p class="radar-cms-lede">Manage the content that powers the RADARCharts Next.js site. Publish changes in WordPress, then refresh the frontend to see the updated content.</p>
		<div class="radar-cms-grid">
			<?php foreach ( $cards as $card ) { radar_content_admin_card( ...$card ); } ?>
		</div>
		<div class="radar-cms-note">
			<strong>Publishing workflow</strong>
			<p>Draft content remains private. Only published RADAR Pages, navigation items, and RadarStore Services are returned by the public read-only bridge.</p>
		</div>
	</div>
	<style>
		.radar-cms-wrap { max-width: 1180px; }
		.radar-cms-lede { max-width: 720px; font-size: 15px; }
		.radar-cms-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
		.radar-cms-card, .radar-cms-note { border: 1px solid #dcdcde; background: #fff; padding: 22px; box-shadow: 0 1px 2px rgba(0,0,0,.04); }
		.radar-cms-card h2 { margin-top: 0; }
		.radar-cms-card p { max-width: 52ch; }
		.radar-cms-note { margin-top: 18px; border-left: 4px solid #2271b1; }
		@media (max-width: 780px) { .radar-cms-grid { grid-template-columns: 1fr; } }
	</style>
	<?php
}

function radar_content_dashboard_widget() {
	if ( ! current_user_can( 'edit_posts' ) ) return;
	wp_add_dashboard_widget( 'radar-cms-dashboard-widget', 'RADAR CMS', 'radar_content_dashboard_widget_render' );
}
add_action( 'wp_dashboard_setup', 'radar_content_dashboard_widget' );

function radar_content_dashboard_widget_render() {
	if ( ! current_user_can( 'edit_posts' ) ) return;
	printf(
		'<p>Manage RADAR pages, navigation, RadarStore services, and Articles from the <a href="%s">RADAR CMS hub</a>.</p>',
		esc_url( admin_url( 'admin.php?page=radarcharts-cms' ) )
	);
}


function radar_content_homepage_defaults() {
	return array(
		'hero_eyebrow' => 'RADARCHARTS BY REM',
		'hero_title' => 'RADARCharts',
		'hero_intro' => '',
		'top25_image_url' => '',
		'article_label' => 'RADARARTICLES',
		'article_category' => '',
		'now_reading_label' => 'NOW READING...',
		'now_reading_links' => '',
		'welcome_video_url' => '',
	);
}

function radar_content_homepage_options() {
	return wp_parse_args( get_option( 'radar_homepage_options', array() ), radar_content_homepage_defaults() );
}

function radar_content_homepage_menu() {
	add_submenu_page( 'radarcharts-cms', 'Homepage Components', 'Homepage Components', 'edit_posts', 'radarcharts-homepage', 'radar_content_homepage_page' );
}
add_action( 'admin_menu', 'radar_content_homepage_menu', 20 );

function radar_content_homepage_page() {
	if ( ! current_user_can( 'edit_posts' ) ) wp_die( esc_html__( 'You do not have permission to access homepage settings.', 'radarcharts-content' ) );
	$options = radar_content_homepage_options();
	if ( isset( $_POST['radar_homepage_save'] ) ) {
		check_admin_referer( 'radar_homepage_save' );
		$options = array(
			'hero_eyebrow' => sanitize_text_field( wp_unslash( $_POST['hero_eyebrow'] ?? '' ) ),
			'hero_title' => sanitize_text_field( wp_unslash( $_POST['hero_title'] ?? '' ) ),
			'hero_intro' => sanitize_textarea_field( wp_unslash( $_POST['hero_intro'] ?? '' ) ),
			'top25_image_url' => esc_url_raw( wp_unslash( $_POST['top25_image_url'] ?? '' ) ),
			'article_label' => sanitize_text_field( wp_unslash( $_POST['article_label'] ?? '' ) ),
			'article_category' => sanitize_text_field( wp_unslash( $_POST['article_category'] ?? '' ) ),
			'now_reading_label' => sanitize_text_field( wp_unslash( $_POST['now_reading_label'] ?? '' ) ),
			'now_reading_links' => sanitize_textarea_field( wp_unslash( $_POST['now_reading_links'] ?? '' ) ),
			'welcome_video_url' => esc_url_raw( wp_unslash( $_POST['welcome_video_url'] ?? '' ) ),
		);
		update_option( 'radar_homepage_options', $options, false );
		echo '<div class="notice notice-success is-dismissible"><p>Homepage settings saved.</p></div>';
	}
	?>
	<div class="wrap radar-cms-wrap">
		<h1>Homepage Components</h1>
		<p class="radar-cms-lede">Edit the data layer around the authored Framer homepage. The Framer visual composition remains preserved; these fields control the Next.js-owned content bridge and future Framer text/media bindings.</p>
		<form method="post">
			<?php wp_nonce_field( 'radar_homepage_save' ); ?>
			<table class="form-table" role="presentation">
				<tr><th><label for="hero_eyebrow">Hero eyebrow</label></th><td><input class="regular-text" id="hero_eyebrow" name="hero_eyebrow" value="<?php echo esc_attr( $options['hero_eyebrow'] ); ?>"></td></tr>
				<tr><th><label for="hero_title">Hero title</label></th><td><input class="regular-text" id="hero_title" name="hero_title" value="<?php echo esc_attr( $options['hero_title'] ); ?>"></td></tr>
				<tr><th><label for="hero_intro">Hero intro</label></th><td><textarea class="large-text" rows="3" id="hero_intro" name="hero_intro"><?php echo esc_textarea( $options['hero_intro'] ); ?></textarea></td></tr>
				<tr><th><label for="top25_image_url">Top 25 image URL</label></th><td><input class="large-text" type="url" id="top25_image_url" name="top25_image_url" value="<?php echo esc_attr( $options['top25_image_url'] ); ?>"></td></tr>
				<tr><th><label for="article_label">Articles label</label></th><td><input class="regular-text" id="article_label" name="article_label" value="<?php echo esc_attr( $options['article_label'] ); ?>"></td></tr>
				<tr><th><label for="article_category">Articles category filter</label></th><td><input class="regular-text" id="article_category" name="article_category" value="<?php echo esc_attr( $options['article_category'] ); ?>"><p class="description">Optional category slug/name used by the merged publication feed.</p></td></tr>
				<tr><th><label for="now_reading_label">Now Reading label</label></th><td><input class="regular-text" id="now_reading_label" name="now_reading_label" value="<?php echo esc_attr( $options['now_reading_label'] ); ?>"></td></tr>
				<tr><th><label for="now_reading_links">Now Reading links</label></th><td><textarea class="large-text" rows="5" id="now_reading_links" name="now_reading_links"><?php echo esc_textarea( $options['now_reading_links'] ); ?></textarea><p class="description">One per line: Label|https://example.com/article</p></td></tr>
				<tr><th><label for="welcome_video_url">Welcome video URL</label></th><td><input class="large-text" type="url" id="welcome_video_url" name="welcome_video_url" value="<?php echo esc_attr( $options['welcome_video_url'] ); ?>"><p class="description">Use a trusted HTTPS media URL. The visual layer will respect reduced-motion settings.</p></td></tr>
			</table>
			<p><button class="button button-primary" type="submit" name="radar_homepage_save" value="1">Save homepage settings</button></p>
		</form>
	</div>
	<?php
}

function radar_content_homepage_payload() {
	$options = radar_content_homepage_options();
	$options['nowReadingLinks'] = radar_content_parse_links( $options['now_reading_links'] );
	unset( $options['now_reading_links'] );
	return array(
		'heroEyebrow' => $options['hero_eyebrow'],
		'heroTitle' => $options['hero_title'],
		'heroIntro' => $options['hero_intro'],
		'top25ImageUrl' => $options['top25_image_url'],
		'articleLabel' => $options['article_label'],
		'articleCategory' => $options['article_category'],
		'nowReadingLabel' => $options['now_reading_label'],
		'nowReadingLinks' => $options['nowReadingLinks'],
		'welcomeVideoUrl' => $options['welcome_video_url'],
	);
}

function radar_content_migration_lookup( WP_REST_Request $request ) {
	if ( ! current_user_can( 'edit_posts' ) ) return new WP_Error( 'radar_forbidden', 'Editor permission required.', array( 'status' => 403 ) );
	$source_url = esc_url_raw( $request->get_param( 'source_url' ) );
	if ( ! $source_url ) return new WP_Error( 'radar_invalid_source_url', 'A valid source_url is required.', array( 'status' => 400 ) );
	$posts = get_posts( array(
		'post_type' => 'post',
		'post_status' => 'any',
		'numberposts' => 10,
		'meta_key' => '_radar_source_url',
		'meta_value' => $source_url,
	) );
	return array_map( function ( $post ) { return array( 'id' => $post->ID, 'status' => $post->post_status, 'sourceUrl' => get_post_meta( $post->ID, '_radar_source_url', true ) ); }, $posts );
}

function radar_content_homepage_route() {
	register_rest_route( 'radarcharts/v1', '/migration-lookup', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'radar_content_migration_lookup', 'permission_callback' => function () { return current_user_can( 'edit_posts' ); }, 'args' => array( 'source_url' => array( 'required' => true, 'sanitize_callback' => 'esc_url_raw' ) ) ) );
	register_rest_route( 'radarcharts/v1', '/homepage', array( 'methods' => WP_REST_Server::READABLE, 'callback' => 'radar_content_homepage_payload', 'permission_callback' => '__return_true' ) );
}
add_action( 'rest_api_init', 'radar_content_homepage_route' );
