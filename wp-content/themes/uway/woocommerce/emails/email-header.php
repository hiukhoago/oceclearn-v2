<?php $dir = get_template_directory_uri(); ?>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <!--[if gte mso 9]>
    <xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG/>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!--[if !mso]><!-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<![endif]-->
    <!-- Title-->
    <title>Email Confirmation | Flourish</title>
    <!--[if !mso]><!-- -->
    <!--<![endif]-->
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }

        table,
        tr,
        td {
            vertical-align: top;
            border-collapse: collapse;
        }

        a:not(.no-hover):hover {
            opacity: 0.7;
        }

        @font-face {
            font-family: 'AvenirNext';
            src: url('<?php echo $dir ?>/html/src/fonts/AvenirNext-Regular.woff2') format('woff2'), url('<?php echo $dir ?>/html/src/fonts/AvenirNext-Regular.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'CircularStd';
            src: url('<?php echo $dir ?>/html/src/fonts/CircularStd-Bold.woff2') format('woff2'), url('<?php echo $dir ?>/html/src/fonts/CircularStd-Bold.woff') format('woff');
            font-weight: 700;
            font-style: normal;
        }
        @font-face {
            font-family: 'CircularStd';
            src: url('<?php echo $dir ?>/html/src/fonts/CircularStd-Book.woff2') format('woff2'), url('<?php echo $dir ?>/html/src/fonts/CircularStd-Book.woff') format('woff');
            font-weight: 500;
            font-style: normal;
        }

        .ie-browser table,
        .mso-container table {
            table-layout: fixed;
        }

        * {
            line-height: inherit;
        }

        a[x-apple-data-detectors=true] {
            color: inherit !important;
            text-decoration: none !important;
        }

        [owa] .img-container div,
        [owa] .img-container button {
            display: block !important;
        }

        [owa] .fullwidth button {
            width: 100% !important;
        }

        [owa] .block-grid .col {
            display: table-cell;
            float: none !important;
            vertical-align: top;
        }

        .ie-browser .num12,
        .ie-browser .block-grid,
        [owa] .num12,
        [owa] .block-grid {
            width: 700px !important;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        .ie-browser .mixed-two-up .num4,
        [owa] .mixed-two-up .num4 {
            width: 232px !important;
        }

        .ie-browser .mixed-two-up .num8,
        [owa] .mixed-two-up .num8 {
            width: 464px !important;
        }

        .ie-browser .block-grid.two-up .col,
        [owa] .block-grid.two-up .col {
            width: 350px !important;
        }

        .ie-browser .block-grid.three-up .col,
        [owa] .block-grid.three-up .col {
            width: 233px !important;
        }

        .ie-browser .block-grid.four-up .col,
        [owa] .block-grid.four-up .col {
            width: 175px !important;
        }

        .ie-browser .block-grid.five-up .col,
        [owa] .block-grid.five-up .col {
            width: 140px !important;
        }

        .ie-browser .block-grid.six-up .col,
        [owa] .block-grid.six-up .col {
            width: 116px !important;
        }

        .ie-browser .block-grid.seven-up .col,
        [owa] .block-grid.seven-up .col {
            width: 100px !important;
        }

        .ie-browser .block-grid.eight-up .col,
        [owa] .block-grid.eight-up .col {
            width: 87px !important;
        }

        .ie-browser .block-grid.nine-up .col,
        [owa] .block-grid.nine-up .col {
            width: 77px !important;
        }

        .ie-browser .block-grid.ten-up .col,
        [owa] .block-grid.ten-up .col {
            width: 15px !important;
        }

        .ie-browser .block-grid.eleven-up .col,
        [owa] .block-grid.eleven-up .col {
            width: 63px !important;
        }

        .ie-browser .block-grid.twelve-up .col,
        [owa] .block-grid.twelve-up .col {
            width: 58px !important;
        }

        @media only screen and (min-width: 720px) {
            .block-grid {
                width: 700px !important;
            }

            .block-grid .col {
                vertical-align: top;
            }

            .block-grid .col.num12 {
                width: 700px !important;
            }

            .block-grid.mixed-two-up .col.num4 {
                width: 232px !important;
            }

            .block-grid.mixed-two-up .col.num8 {
                width: 464px !important;
            }

            .block-grid.two-up .col {
                width: 350px !important;
            }

            .block-grid.three-up .col {
                width: 233px !important;
            }

            .block-grid.four-up .col {
                width: 175px !important;
            }

            .block-grid.five-up .col {
                width: 140px !important;
            }

            .block-grid.six-up .col {
                width: 116px !important;
            }

            .block-grid.seven-up .col {
                width: 100px !important;
            }

            .block-grid.eight-up .col {
                width: 87px !important;
            }

            .block-grid.nine-up .col {
                width: 77px !important;
            }

            .block-grid.ten-up .col {
                width: 15px !important;
            }

            .block-grid.eleven-up .col {
                width: 63px !important;
            }

            .block-grid.twelve-up .col {
                width: 58px !important;
            }
        }

        @media (max-width: 720px) {

            .block-grid,
            .col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
            }

            .block-grid {
                width: calc(100% - 40px) !important;
            }

            .col {
                width: 100% !important;
            }

            .col>div {
                margin: 0 auto;
            }

            img.fullwidth,
            img.fullwidthOnMobile {
                max-width: 100% !important;
            }

            .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
            }

            .no-stack.two-up .col {
                width: 50% !important;
            }

            .no-stack.mixed-two-up .col.num4 {
                width: 33% !important;
            }

            .no-stack.mixed-two-up .col.num8 {
                width: 66% !important;
            }

            .no-stack.three-up .col.num4 {
                width: 33% !important;
            }

            .no-stack.four-up .col.num3 {
                width: 25% !important;
            }

            .mobile_hide {
                min-height: 0px;
                max-height: 0px;
                max-width: 0px;
                display: none;
                overflow: hidden;
                font-size: 0px;
            }
        }

        @media only screen and (max-width: 640px) {
            .custom-pc {
                font-size: 12px !important;
                letter-spacing: 1px !important;
            }

            .custom-pc2 {
                font-size: 15px !important;
            }

            .small-title {
                font-size: 30px !important;
            }

            .medium-title {
                font-size: 24px !important;
            }
        }
    </style>
</head>

<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #eaeaea">
    <style type="text/css" id="media-query-bodytag">
        @media (max-width: 520px) {
            .block-grid {
                min-width: 320px !important;
                max-width: 100% !important;
                width: 100% !important;
                display: block !important;
            }

            .col {
                min-width: 320px !important;
                max-width: 100% !important;
                width: 100% !important;
                display: block !important;
            }

            .col>div {
                margin: 0 auto;
            }

            img.fullwidth {
                max-width: 100% !important;
            }

            img.fullwidthOnMobile {
                max-width: 100% !important;
            }

            .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
            }

            .no-stack.two-up .col {
                width: 50% !important;
            }

            .no-stack.mixed-two-up .col.num4 {
                width: 33% !important;
            }

            .no-stack.mixed-two-up .col.num8 {
                width: 66% !important;
            }

            .no-stack.three-up .col.num4 {
                width: 33% !important;
            }

            .no-stack.four-up .col.num3 {
                width: 25% !important;
            }

            .mobile_hide {
                min-height: 0px !important;
                max-height: 0px !important;
                max-width: 0px !important;
                display: none !important;
                overflow: hidden !important;
                font-size: 0px !important;
            }


        }
    </style>

    <?php $dir = get_template_directory_uri() . '/html/email-template/'; ?>

    <!--[if IE]><div class="ie-browser"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #eaeaea;width: 100%"
        cellpadding="0" cellspacing="0">
        <tbody>
            <tr style="vertical-align: top">
                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                    <td align="center" style="background-color: #eaeaea;">
                    <![endif]-->
                    <div style="background-color:transparent;">
                        <div class="block-grid" style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #000000;">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#ffffff;">
                                <!--[if (mso)|(IE)]>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                <td style="background-color:transparent;" align="center">
                                <table cellpadding="0" cellspacing="0" border="0" style="width: 700px;">
                                <tr class="layout-full-width" style="background-color:#ffffff;">
                                <![endif]-->
                                <!--[if (mso)|(IE)]><td align="center" width="700" style=" width:700px; padding-right: 0px; padding-left: 0px; padding-top:10px; padding-bottom:10px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 700px;display: table-cell;vertical-align: top;">
                                    <div style="background-color: transparent; width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:10px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
                                            <!--<![endif]-->
                                            <div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
                                                <div style="color:#FFFFFF;line-height:120%;font-family:'CircularStd', Helvetica, Arial, sans-serif; padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;">
                                                    <div style="text-align:center">
                                                        <img style="width: 190px;" src="<?php echo $dir; ?>logo.png" alt="/">
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                            </div>
                            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #EBEBEB;"
                            class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#62BD89;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 700px;"><tr class="layout-full-width" style="background-color:#F8F6F4;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="700" style=" width:700px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="display: table-cell;vertical-align: top;">
                                    <div style="background-color: transparent; width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:7px; padding-right: 7px; padding-left: 7px;">
                                            <!--<![endif]-->

                                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 450px; margin: 0 auto; ">
                                                <tr class="col2">
                                                    <td width="20%" align="center" valign="top" style="padding-right: 0px;padding-left:0px;">
                                                        <a href="<?php echo esc_url( get_permalink( woocommerce_get_page_id( 'shop' ) ) ); ?>" class="text-menu no-hover" style="text-decoration: none;color:#000;">
                                                            <img src="<?php echo $dir; ?>menu-shop.png" width="100%" alt="">
                                                        </a>
                                                    </td>
                                                    <td width="20%" align="center" valign="top" style="padding-right: 0px;padding-left:0px;">
                                                        <a href="<?php echo esc_url( site_url('education') ); ?>" class="text-menu no-hover" style="text-decoration: none;color:#000; ">
                                                            <img src="<?php echo $dir; ?>menu-education.png" width="100%" alt="">
                                                        </a>
                                                    </td>

                                                    <td width="20%" align="center" valign="top" style="padding-right: 0px;padding-left:0px;">
                                                        <a href="<?php echo esc_url( site_url('about-us') ); ?>" class="text-menu no-hover" style="text-decoration: none;color:#000; ">
                                                            <img src="<?php echo $dir; ?>menu-about.png" width="100%" alt="">
                                                        </a>
                                                    </td>
                                                    <td width="20%" align="center" valign="top" style="padding-right: 0px;padding-left:0px;">
                                                        <a href="<?php echo esc_url( site_url('recipes') ); ?>" class="text-menu no-hover" style="text-decoration: none;color:#000; ">
                                                            <img src="<?php echo $dir; ?>menu-recipes.png" width="100%" alt="">
                                                        </a>
                                                    </td>
                                                    <td width="20%" align="center" valign="top" style="padding-right: 0px;padding-left:0px;">
                                                        <a href="<?php echo esc_url( site_url('blog') ); ?>" class="text-menu no-hover" style="text-decoration: none;color:#000; ">
                                                            <img src="<?php echo $dir; ?>menu-blog.png" width="100%" alt="">
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                    </div>
                                </div>
                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                            </div>
                        </div>
                    </div>
                    <div style="background-color:transparent;">
                        <div style="margin: 0 auto;min-width: 320px;max-width: 700px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #FFFFFF;"
                            class="block-grid ">
                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 700px;"><tr class="layout-full-width" style="background-color:#FFFFFF;"><![endif]-->

                                <!--[if (mso)|(IE)]><td align="center" width="700" style=" width:700px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
                                <div class="col num12" style="min-width: 320px;max-width: 700px;display: table-cell;vertical-align: top;">
                                    <div style="background-color: transparent; width: 100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
