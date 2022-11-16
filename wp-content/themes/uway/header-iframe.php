<?php $dir = get_template_directory_uri() . '/html/'; ?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="<?php echo $dir; ?>src/scss/plugins.css">
        <link rel="stylesheet" href="<?php echo $dir; ?>src/scss/style.css">
        <script>window.jQuery || document.write('<script src="<?php echo $dir; ?>src/js/jquery.js"><\/script>')</script>
    </head>
    <body>
        <script>sessionStorage.getItem("isFirstRun") || document.write('<div id="preloader"><div class="loading"></div></div>')</script>
        <!-- WRAP PAGE-->
        <div id="wrap-page">
            <!-- RECIPE: CONTENT -->