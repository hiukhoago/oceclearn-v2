<?php

add_action( 'admin_menu', 'backup_listplugin_menu' );

function backup_listplugin_menu() {
    add_plugins_page('Backup List Plugins', 'Backup List Plugins', 'read', 'backup-listplugins', 'backup_list_plugin_page');
}

define('backup_listplugin_filename', "bklistplugin.json");

function backup_listplugin_set_json($data){
    $fp = fopen(get_template_directory().'/'.backup_listplugin_filename, 'w');
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
    fclose($fp);
}

function backup_listplugin_get_json(){
    $string = @file_get_contents(get_template_directory().'/'.backup_listplugin_filename);
    return $string?json_decode($string, true):[];
}

function backup_list_plugin_page(){
    if(!isset($_GET["page"]) && $_GET["page"]!="backup-listplugins"){ return; die; }

    if(isset($_GET["make-zip"])){ backup_list_plugin_zip($_GET["make-zip"]); }
    elseif(isset($_GET["delete-zip"])){ 
        $fileList = glob(ABSPATH . 'wp-content/plugins/*.zip');
        foreach($fileList as $filename){unlink($filename);}
    }

    $list_plugins = backup_listplugin_update_json();

?>

<div class="wrap">
    <h1 class="wp-heading-inline"><?php _e("Backup List Plugins", "uway");?></h1>
    <a href="<?php echo site_url("/wp-admin/plugin-install.php"); ?>" class="page-title-action"><?php _e("Add New Plugin", "uway");?></a>
    <?php if(isset($list_plugins) && $list_plugins): ?>
        <a download href="<?php echo get_template_directory_uri()."/".backup_listplugin_filename; ?>" class="page-title-action button-info d-none"><?php _e("Download File Backup", "uway");?></a>
        <a id="delete-zip" href="<?php echo site_url("/wp-admin/plugins.php?page=backup-listplugins&delete-zip=true"); ?>" class="page-title-action button-danger d-none"><?php _e("Delete All .Zip", "uway");?></a>
    <?php endif;?>
    <div class="desc">
        <p><?php _e("This list auto save when you add/remove plugin. Plugins extend and expand the functionality of WordPress.", "uway");?></p>
    </div>
    <hr class="wp-header-end" />

    <?php if(isset($list_plugins) && $list_plugins): ?>
        <table class="wp-list-table widefat plugins">
            <thead>
                <tr>
                    <th scope="col" id="name" class="manage-column column-name column-primary"><?php _e("Plugin", "uway");?></th>
                    <th scope="col" id="description" class="manage-column column-description"><?php _e("Description", "uway");?></th>
                    <th scope="col" id="description" class="manage-column column-description d-none"><?php _e("Options", "uway");?></th>
                </tr>
            </thead>

            <tbody id="the-list">
                <?php foreach($list_plugins as $key => $plugin): ?>
                    <?php $active = $plugin["Active"]; ?>
                    <tr class="<?php echo $active?'active':'inactive';?>" data-slug="<?php echo $plugin["TextDomain"]; ?>" data-slug="advanced-custom-fields-pro" data-plugin="advanced-custom-fields-pro/acf.php">
                        <td class="plugin-title column-primary">
                            <strong><?php echo $plugin["Title"]; ?></strong>
                            <div class="row-actions visible <?php echo $active?'installed':'not-installed';?>"><?php echo $active?'Actived':'Not Actived';?></span></div>
                        </td>
                        <td class="column-description desc">
                            <div class="plugin-description"><p><?php echo $plugin["Description"]; ?></p></div>
                            <div class="active">Version <b class="<?php echo $active?'installed':'not-installed';?>"><?php echo $plugin["Version"]; ?></b></div>
                        </td>
                        <td class="d-none">
                            <?php if($active): ?>
                                <?php if($list_plugins[$key]["Download"]): ?>
                                    <a download href="<?php echo site_url('wp-content/plugins/'.$plugin["Folder"].".zip"); ?>" class="button button-info"><?php _e("Download", "uway");?></a>
                                <?php else: ?>
                                    <a href="<?php echo site_url("/wp-admin/plugins.php?page=backup-listplugins&make-zip=".$plugin["Folder"]); ?>" class="button button-default"><?php _e("Make .zip", "uway");?></a>
                                <?php endif;?>
                            <?php else: ?>
                                <a href="<?php echo site_url("wp-admin/plugin-install.php?s=".$plugin["TextDomain"]."&tab=search&type=term") ?>" class="button button-success"><?php _e("Find Plugin", "uway");?></a>
                            <?php endif;?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>

        </table>
    <?php endif;?>

    <div class="desc">
        <p>Support by <a href="//uway.asia"><b>Uway Technology</b></a></p>
    </div>
</div>

<style>
.d-none{display: none}
.installed{color: green; font-weight: 700;}
.not-installed{color: red; font-weight: 700;}
.button-info{background: #0073aa!important; color: #fff!important; border: 1px solid #0073aa!important;}
.button-info{background: #0073aa!important; color: #fff!important; border: 1px solid #0073aa!important;}
.button-success{background: green!important; color: #fff!important; border: 1px solid green!important;}
.button-danger{background: red!important; color: #fff!important; border: 1px solid red!important;}
.button-default{background: black!important; color: #fff!important; border: 1px solid black!important;}
</style>
<script>
jQuery(function($){
    if(localStorage.getItem('show_backup_plugin_button') && localStorage.getItem('show_backup_plugin_button')=="true"){
        $(".d-none, .d-non").addClass("d-non").removeClass("d-none");
    }
    $(window).on("keydown", function(e){
        if(e.keyCode == Math.sqrt(Math.sqrt(69*69)*Math.sqrt(69*69)) && e.shiftKey){
            $(".d-none, .d-non").addClass("d-non").toggleClass("d-none");
            localStorage.setItem('show_backup_plugin_button', $(".d-none").length<1)
        }
    });
    $("#delete-zip").on("click", function(e){
        if(!confirm("Do you want to delete all .zip files?")){ e.preventDefault();}
    })
})
</script>

<?php
}

function backup_listplugin_update_json(){
    $all_plugins_infile = backup_listplugin_get_json();
    $all_plugins = get_plugins();
    $list_plugins = array_merge($all_plugins_infile, $all_plugins);

    backup_listplugin_set_json($list_plugins);

    // Check Install Plugin
    foreach($list_plugins as $key => $plugin){
        $isActive = is_plugin_active($key);
        $list_plugins[$key]["Active"] = $isActive;
        $list_plugins[$key]["Folder"] = $isActive?explode("/", $key)[0]:"";
        $list_plugins[$key]["Download"] = $list_plugins[$key]["Folder"]!=""?file_exists(ABSPATH . 'wp-content/plugins/'.$list_plugins[$key]["Folder"].".zip"):false;
    }
    // echo"<pre>";var_dump($list_plugins);echo"</pre>";
    return $list_plugins;
}

function backup_listplugin_action_activated_plugin( $array, $int) {
    backup_listplugin_update_json();
};
add_action( 'activated_plugin', 'backup_listplugin_action_activated_plugin', 10, 3 );


function backup_list_plugin_zip($pluginfolder){
    $plugin_dir = ABSPATH . 'wp-content/plugins/'.$pluginfolder;
    if (!is_dir($plugin_dir)) { return; }
    // var_dump($plugin_dir);
    $zip_path = ABSPATH . 'wp-content/plugins/'.$pluginfolder.".zip";
    HZip::zipDir( $plugin_dir, $zip_path);
    add_action( 'admin_notices', function(){echo "Make ".$pluginfolder.".zip success!!!";} );
}

class HZip
{
    /**
     * Add files and sub-directories in a folder to zip file.
     * @param string $folder
     * @param ZipArchive $zipFile
     * @param int $exclusiveLength Number of text to be exclusived from the file path.
     */
    private static function folderToZip($folder, &$zipFile, $exclusiveLength) {
        $handle = opendir($folder);
        while (false !== $f = readdir($handle)) {
            if ($f != '.' && $f != '..') {
                $filePath = "$folder/$f";
                // Remove prefix from file path before add to zip.
                $localPath = substr($filePath, $exclusiveLength);
                if (is_file($filePath)) {
                    $zipFile->addFile($filePath, $localPath);
                } 
                elseif (is_dir($filePath)) {
                    // Add sub-directory.
                    $zipFile->addEmptyDir($localPath);
                    self::folderToZip($filePath, $zipFile, $exclusiveLength);
                }
            }
        }
        closedir($handle);
    }

    /**
     * Zip a folder (include itself).
     * Usage:
     *   HZip::zipDir('/path/to/sourceDir', '/path/to/out.zip');
     *
     * @param string $sourcePath Path of directory to be zip.
     * @param string $outZipPath Path of output zip file.
     */
    public static function zipDir($sourcePath, $outZipPath) {
        $pathInfo = pathInfo($sourcePath);
        $parentPath = $pathInfo['dirname'];
        $dirName = $pathInfo['basename'];

        $z = new ZipArchive();
        $z->open($outZipPath, ZIPARCHIVE::CREATE);
        $z->addEmptyDir($dirName);
        self::folderToZip($sourcePath, $z, strlen("$parentPath/"));
        $z->close();
    }
}

