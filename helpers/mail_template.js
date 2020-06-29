class mail_template{
    verify_mail(token, name){
        var template=`
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                      Welcome to Gosiso
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                      Thank you for signing up with Gosiso ${name}! We hope you enjoy your time with us. Reach your customers wherever they are and whenever they demand, send goods quickly to any location in Nigeria. Verified courier agents on our platform will pickup, warehouse and deliver directly to your customers in no time.
                    </td>
                  </tr>
                  <tr>
                    <td class="button">
                      <div><a class="button-mobile" href="https://gosiso.herokuapp.com/user/verifyemail?token=${token}"
                      style="background-color:#ff6f6f;border-radius:5px;color:#ffffff;display:inline-block;font-family:'Cabin', Helvetica, Arial, sans-serif;font-size:14px;font-weight:regular;line-height:45px;text-align:center;text-decoration:none;width:155px;-webkit-text-size-adjust:none;mso-hide:all;">Verify account</a></div>
                      <small>verification link expires in 3 days</small>
                      </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>
        `
        return template
    }

    onboard_mail(name){
        var template=`

        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                      Onboarding!
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                     Thank you for joining Gosiso ${name}. Here are a few tips to start earning<br/>
			<p>
			* Users can apply as couriers to start earning on the platform
			</p>
			
			<p>
			* To make payment on gosiso is as easy as it gets. Upload your card details, top up your balance and 			get debited whenever a transaction is successful. Incompelete transactions would be reverted to your balance.
			</p>
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>`
        return template
    }

    approveCourier(name){
        var template=`
        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                     Congratulations ${name} You are now a courier on Gosiso
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                     Thank you for joining Gosiso courier team ${name}. Here are a few guidelines<br/>
			<p>
			* To request for withdrawal, you have to earn at least 2000 naira in total on the platform
			</p>
			
			<p>
			* Update your bank details on your profile 
			</p>
			
			<p>
			* Unaccepted waybill can be canceled by users and the transaction would be terminated 
			</p>

			<p>
			* Once a waybill has been accepted, cancelation from user can either be diputed by you or be approved 
			</p>

			<p>
			* disputed waybill would be finalized by the admin. Possible reason for dispute include: wrong fee agreed on, insufficient item, etc 
			</p>

			<p>
			* You are to mark waybill as arrived when it successfully gets to it's destination 
			</p>
			
			<p>
			* Users are to mark waybill as complete. Upon which you get 80% of the total agreed fee 
			</p>

			<p>
			* The admin has the right to approve, decline or cancel any waybill. He also owns the right to suspend your services 
			</p>
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>`
        return template
    }

    forgotEmail(password){
        var template=`
        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                     Pasword reset
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                    Your password has been reset. Your new password is <b>${password}</b>
			
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>
        `
        return template
    }

    successWithdrawal(){
        var template=`
        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                     Withdrawal request
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                    Your request for withdrawal has been approved by the admin. You should get a bank deposit soon
			
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>`
        return template
    }

    arrivedWayBill(waybill){
        var template=`
        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                     Waybill Arrieved
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                   Your waybill with id <b>${waybill._id}</b> has successfully arrieved at ${waybill.delivery}
			
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>
    `
        return template
    }

    waybillDetails(waybill){
        var template=`
        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oxygen Welcome</title>
        
          <style type="text/css">
            /* Take care of image borders and formatting, client hacks */
            img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
            a img { border: none; }
            table { border-collapse: collapse !important;}
            #outlook a { padding:0; }
            .ReadMsgBody { width: 100%; }
            .ExternalClass { width: 100%; }
            .backgroundTable { margin: 0 auto; padding: 0; width: 100% !important; }
            table td { border-collapse: collapse; }
            .ExternalClass * { line-height: 115%; }
            .container-for-gmail-android { min-width: 600px; }
        
        
            /* General styling */
            * {
              font-family: Helvetica, Arial, sans-serif;
            }
        
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100% !important;
              margin: 0 !important;
              height: 100%;
              color: #676767;
            }
        
            td {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              color: #777777;
              text-align: center;
              line-height: 21px;
            }
        
            a {
              color: #676767;
              text-decoration: none !important;
            }
        
            .pull-left {
              text-align: left;
            }
        
            .pull-right {
              text-align: right;
            }
        
            .header-lg,
            .header-md,
            .header-sm {
              font-size: 32px;
              font-weight: 700;
              line-height: normal;
              padding: 35px 0 0;
              color: #4d4d4d;
            }
        
            .header-md {
              font-size: 24px;
            }
        
            .header-sm {
              padding: 5px 0;
              font-size: 18px;
              line-height: 1.3;
            }
        
            .content-padding {
              padding: 20px 0 30px;
            }
        
            .mobile-header-padding-right {
              width: 290px;
              text-align: right;
              padding-left: 10px;
            }
        
            .mobile-header-padding-left {
              width: 290px;
              text-align: left;
              padding-left: 10px;
            }
        
            .free-text {
              width: 100% !important;
              padding: 10px 60px 0px;
            }
        
            .block-rounded {
              border-radius: 5px;
              border: 1px solid #e5e5e5;
              vertical-align: top;
            }
        
            .button {
              padding: 30px 0;
            }
        
            .info-block {
              padding: 0 20px;
              width: 260px;
            }
        
            .block-rounded {
              width: 260px;
            }
        
            .info-img {
              width: 258px;
              border-radius: 5px 5px 0 0;
            }
        
            .force-width-gmail {
              min-width:600px;
              height: 0px !important;
              line-height: 1px !important;
              font-size: 1px !important;
            }
        
            .button-width {
              width: 228px;
            }
        
          </style>
        
          <style type="text/css" media="screen">
            @import url(http://fonts.googleapis.com/css?family=Oxygen:400,700);
          </style>
        
          <style type="text/css" media="screen">
            @media screen {
              /* Thanks Outlook 2013! */
              * {
                font-family: 'Oxygen', 'Helvetica Neue', 'Arial', 'sans-serif' !important;
              }
            }
          </style>
        
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
        
              table[class*="container-for-gmail-android"] {
                min-width: 290px !important;
                width: 100% !important;
              }
        
              table[class="w320"] {
                width: 320px !important;
              }
        
              img[class="force-width-gmail"] {
                display: none !important;
                width: 0 !important;
                height: 0 !important;
              }
        
              a[class="button-width"],
              a[class="button-mobile"] {
                width: 248px !important;
              }
        
              td[class*="mobile-header-padding-left"] {
                width: 160px !important;
                padding-left: 0 !important;
              }
        
              td[class*="mobile-header-padding-right"] {
                width: 160px !important;
                padding-right: 0 !important;
              }
        
              td[class="header-lg"] {
                font-size: 24px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="header-md"] {
                font-size: 18px !important;
                padding-bottom: 5px !important;
              }
        
              td[class="content-padding"] {
                padding: 5px 0 30px !important;
              }
        
               td[class="button"] {
                padding: 5px !important;
              }
        
              td[class*="free-text"] {
                padding: 10px 18px 30px !important;
              }
        
              td[class="info-block"] {
                display: block !important;
                width: 280px !important;
                padding-bottom: 40px !important;
              }
        
              td[class="info-img"],
              img[class="info-img"] {
                width: 278px !important;
              }
            }
          </style>
        </head>
        
        <body bgcolor="#f7f7f7">
        <table align="center" cellpadding="0" cellspacing="0" class="container-for-gmail-android" width="100%">
          <tr>
            <td align="left" valign="top" width="100%" style="background:repeat-x url() #ffffff;">
              <center>
              <img src="http://s3.amazonaws.com/swu-filepicker/SBb2fQPrQ5ezxmqUTgCr_transparent.png" class="force-width-gmail">
                <table cellspacing="0" cellpadding="0" width="100%" bgcolor="#ffffff" background="" style="background-color:transparent">
                  <tr>
                    <td width="100%" height="80" valign="top" style="text-align: center; vertical-align:middle;">
                    
                      <center>
                        <table cellpadding="0" cellspacing="0" width="600" class="w320">
                          <tr>
                            <td class="pull-left mobile-header-padding-left" style="vertical-align: middle;">
                              <a href=""><img width="100" height="100" src="https://res.cloudinary.com/rchain/image/upload/v1592587102/L6.png" alt="logo"></a>
                            </td>
                            <td class="pull-right mobile-header-padding-right" style="color: #4d4d4d;">
                              <a href=""><img width="44" height="47" src="http://s3.amazonaws.com/swu-filepicker/k8D8A7SLRuetZspHxsJk_social_08.gif" alt="twitter" /></a>
                              <a href=""><img width="38" height="47" src="http://s3.amazonaws.com/swu-filepicker/LMPMj7JSRoCWypAvzaN3_social_09.gif" alt="facebook" /></a>
                              <a href=""><img width="40" height="47" src="http://s3.amazonaws.com/swu-filepicker/hR33ye5FQXuDDarXCGIW_social_10.gif" alt="rss" /></a>
                            </td>
                          </tr>
                        </table>
                      </center>
                      
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7;" class="content-padding">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td class="header-lg">
                     Waybill Accepted
                    </td>
                  </tr>
                  <tr>
                    <td class="free-text">
                   You have accepted waybill with id ${waybill._id} with the following details
			<br/>
        Pickup location:<b>${waybill.pick_up}</b><br/>
        Service:<b>${waybill.service}</b></br/>
        Drop location:<b>${waybill.delivery}</b></br/>
        Description:<b>${waybill.description}</b><br/>
        Recipient name:<b>${waybill.recipient_name}</b><br/>
        Recipient number:<b>${waybill.recipient_number}</b><br/>
        Fee:<b>${waybill.agreed_fee}</b><br/>
        Image sample<br/>
        <img src=${waybill.images[0]} width=150 height=150>
                    </td>
                  </tr>
                 
                </table>
              </center>
            </td>
          </tr>
        
        
        
          <tr>
            <td align="center" valign="top" width="100%" style="background-color: #f7f7f7; height: 100px;">
              <center>
                <table cellspacing="0" cellpadding="0" width="600" class="w320">
                  <tr>
                    <td style="padding: 25px 0 25px">
                      <strong>Gosiso.com</strong><br />
                      Email:contact@gosiso.com <br />
                     
                    </td>
                  </tr>
                </table>
              </center>
            </td>
          </tr>
        </table>
        </body>
        </html>
`
        return template
    }
    
}
module.exports=new mail_template()