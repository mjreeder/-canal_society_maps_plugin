<?php
/*
Plugin Name: mapsPlugin
Plugin URI: bsu.edu
Description: google maps plugin
Version: 5.4.7
Author: Matt Reeder
Author URI:
Copyright: ball state
*/

error_reporting(E_ALL);
ini_set('display_errors', 1);
// include 'wp-admin/includes/file.php';

if (!defined('ABSPATH')) {
    exit;
} // Exit if accessed directly

function corps_maps($atts)
{
    return "<div>
              <p class='directions'>Click on a Point of Interest to see details and available photos</p>
            <div>
            <div class='map_and_info_container'><div class='map_and_info_screen'>
              <div id='map'></div>
            </div>
            <div class='map_toggle_pois'>
              <div class='directions-box'>
                <p class='directions'>Select canals to turn on routes and points of interest</p>
              </div>
              <table>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewCentralCompletedCanal()'>Central Completed Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewCentralInCompleteCanal()'>Central Incomplete Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewCrossCutCanal()'>Cross Cut Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewErieMichiganCompleteCanal()'>Erie Michigan Completed Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewErieMichiganIncompleteCanal()'>Erie Michigan Incomplete Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewMiamiAndErieCanal()'>Miami and Erie Canal Complete</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewOhioFallsCanal()'>Ohio Falls Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewRichmondBrookvilleCanal()'>Richmond Brookville Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewWabashErieCanal()'>Wabash Erie Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewWhitewaterErieCanal()'>Whitewater Erie Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' onClick='viewHagerstownCanal()'>Hagerstown Canal</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' id='border-select' onClick='viewAll();'>View all</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' id='border-select' onClick='removeAll();'>Remove all</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' id='border-select' onClick='viewProposed();'>Proposed</th>
                </tr>
                <tr>
                  <th class='canal-poi-toggle' id='border-select' onClick='viewComplete();'>Completed</th>
                </tr>
              </table>
            </div>
        </div>";
}

function corps_map_buttons($atts)
{
    return "<div class='map_buttons'>
            <div class='point-content'>
              <h1 id='point-title'></h1>
              <div id='point-info'></div>
            </div>

            <div class='map_photos'>
                      <div class='slider'>
                      </div>
                      <div class='slide_info'>
                        <p id='info'></p>
                     </div>
            </div>


            </div>";
}

function corps_map_data()
{
    $args = array(
      'post_type' => 'canal_point',
      'posts_per_page' => -1);
    $query = new WP_Query($args);
    $canals = array();
    if ($query->have_posts()): while ($query->have_posts()):$query->the_post();
    $canalArray = array();
    $canalArray['title'] = (get_the_title());
    $canalArray['content'] = apply_filters( 'the_content', get_the_content() );
    $canalArray['latitude'] = (get_field('latitude'));
    $canalArray['longitude'] = (get_field('longitude'));
    $canalArray['images'] = (get_field('images'));
    $canalArray['name'] = get_field('name');
    $canalArray['allCanals'] = (get_terms());
    $canalArray['canalPoint'] = wp_get_object_terms(get_the_ID(), 'canal');
    array_push($canals, $canalArray);
    endwhile;
    endif;

    return $canals;
}

function corps_maps_init()
{
    wp_enqueue_script('slick', plugin_dir_url(__FILE__).'slick-1.6.0/slick/slick.js', array('jquery'), false, true);
    wp_enqueue_style('slick_style', plugin_dir_url(__FILE__).'slick-1.6.0/slick/slick.css');
    wp_enqueue_style('slick_theme', plugin_dir_url(__FILE__).'slick-1.6.0/slick/slick-theme.css');
    wp_enqueue_style('app', plugin_dir_url(__FILE__).'canalMapStyles.css');
    wp_register_script('app', plugin_dir_url(__FILE__).'canalMapPlugin.js');
    wp_localize_script( 'app', 'leftimage', plugin_dir_url(__FILE__).'LeftArrow.png' );
    wp_localize_script( 'app', 'rightimage', plugin_dir_url(__FILE__).'RightArrow.png' );
    wp_localize_script('app', 'centralCanalInCompleteKml', plugin_dir_url(__FILE__).'CentralCanalIncomplete.kml');
    wp_localize_script('app', 'centralCanalCompleteKml', plugin_dir_url(__FILE__).'CentralCanalComplete.kml');
    wp_localize_script('app', 'crossCutCanalKml', plugin_dir_url(__FILE__).'CrossCutCanalComplete.kml');
    wp_localize_script('app', 'erieMichiganCanalCompleteKml', plugin_dir_url(__FILE__).'ErieMichiganCanalComplete.kml');
    wp_localize_script('app', 'erieMichiganCanalInCompleteKml', plugin_dir_url(__FILE__).'ErieMichiganCanalIncomplete.kml');
    wp_localize_script('app', 'ohioFallsCanalKml', plugin_dir_url(__FILE__).'OhioFallsCanalIncomplete.kml');
    wp_localize_script('app', 'richmondBrookvilleCanalKml', plugin_dir_url(__FILE__).'RichmondBroovilleCanalIncomplete.kml');
    wp_localize_script('app', 'wabashErieCanalKml', plugin_dir_url(__FILE__).'WabashErieCanalComplete.kml');
    wp_localize_script('app', 'whitewaterErieCanalKml', plugin_dir_url(__FILE__).'WhitewaterCanal.kml');
    wp_localize_script('app', 'miamiAndErieCanalKml', plugin_dir_url(__FILE__).'MiamiAndErieCanalComplete.kml');
    wp_localize_script('app', 'hagerstownCanalKml', plugin_dir_url(__FILE__).'HagerstownComplete.kml');

    wp_localize_script('app', 'mapData', corps_map_data());
    wp_enqueue_script('app');
    wp_enqueue_script('mapp', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAb8Dtu-1EQ7K_qcJ1vdOuNRI4xMS_Z5ow&callback=initMap', null, null, true);
}

add_action('init', 'corps_maps_init');

add_shortcode('corps_maps', 'corps_maps');

add_shortcode('corps_map_buttons', 'corps_map_buttons');
