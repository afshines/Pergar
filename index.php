<?php

if(isset($_GET["u"])){

  $url = utf8_decode ( base64_decode( $_GET["u"]) ) ;

}else{
    $url ="https://www.khabaronline.ir/news/822037";
}



?>



<html style='margin:0;padding:0'>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body style='margin:0;padding:0'>

<div style=" height: 100% ;position:relative; display:block; width: 100%">
  <iframe width="100%" height="100%"
    src="<?php echo $url;?>"
    frameborder="0" allowfullscreen="" style="position:absolute; top:0; left: 0">
  </iframe>
</div>

</body></html>
