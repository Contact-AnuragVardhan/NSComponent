
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8">
 
 <link href="../lib/css/com/org/nsComponent.css" rel="stylesheet" media="all" />
  <script src="../lib/com/org/util/nsUtil.js"></script>
  <script src="../lib/com/org/util/nsScroller3.js"></script>
    
  

  <style type="text/css">
    #scrollbox4 {
    overflow: auto;
    width: 400px;
    height: 360px;
    padding: 0 5px;
    border: 1px solid #b7b7b7;
}

#scrollbox4 p {
    width: 600px;
}

.track4 {
     width: 16px;
    background-color: #f7f7f3;
    border-left: 1px solid #f2f0ea;
}


.handle4 {
     width: 17px;
    margin-left: -1px;
    background: url(http://enscrollplugin.com/images/xp-vert-handle.png) no-repeat 0 center;
}

.handle4:hover {
    background-position: -17px center;
}

.handle4 .top,
.handle4 .bottom {
    position: absolute;
    left: 0;
    width: 17px;
    height: 10px;
    background: url(http://enscrollplugin.com/images/xp-vert-handle.png) no-repeat;
}

.handle4 .top {
    top: 0;
}
.handle4:hover .top {
    background-position: -17px 0;
}

.handle4 .bottom {
    bottom: 0;
    width: 17px;
    height: 10px;
    background-position: 0 bottom;
}
.handle4:hover .bottom {
    background-position: -17px bottom;
}

.horizontal-track2 {
    width: 100%;
    height: 17px;
    background: #e4e6e3;
    border: 1px solid #dfdfdd;
}

.horizontal-handle2 {
    height: 17px;
}

.horizontal-handle2 .left {
    width: 17px;
    height: 17px;
    background: url(http://enscrollplugin.com/images/green-horiz-scrollbar.png) no-repeat;
}

.horizontal-handle2 .right {
    width: 100%;
    height: 17px;
    position: absolute;
    right: 0;
    top: 0;
    clip: rect(0 9999px 17px 17px);
    background: url(http://enscrollplugin.com/images/green-horiz-scrollbar.png) no-repeat right 0;
}

.corner2 {
    width: 17px;
    height: 17px;
    background: #e4e6e3;
    border: 1px solid #dfdfdd; 
}

.scroll-up1,
.scroll-down1 {
    width: 17px;
    height: 17px;
}

.scroll-up1 {
    background: url(http://enscrollplugin.com/images/xp-vert-btns.png) no-repeat;
}
.scroll-up1:hover {
    background-position: -17px 0;
}

.scroll-down1 {
    background: url(http://enscrollplugin.com/images/xp-vert-btns.png) no-repeat 0 -17px;
}
.scroll-down1:hover {
    background-position: -17px -17px;
}

.scroll-left1 {
    background: url(http://enscrollplugin.com/images/xp-vert-btns.png) no-repeat;
    transform: rotate(270deg);
}

.scroll-right1 {
    background: url(http://enscrollplugin.com/images/xp-vert-btns.png) no-repeat;
    transform: rotate(90deg);
}


  </style>

  
</head>

<body>
  <div id="scrollbox4">
     <h1>New Scrolling Window</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a justo erat, volutpat hendrerit dolor. Sed urna nibh, dapibus at egestas non, vulputate ut quam. Morbi a erat tristique tellus varius venenatis. Aenean lacinia sem eget turpis fringilla commodo. Sed lorem nisi, viverra a interdum nec, varius eu enim. Donec ornare, nunc quis eleifend iaculis, nulla eros mollis tellus, quis faucibus risus odio non lectus. Maecenas ac velit non metus rhoncus commodo. Nunc ligula est, ultricies sed mattis sed, dapibus at arcu. Maecenas lacinia nisl ut sem bibendum ac condimentum purus facilisis. Curabitur ut nibh lobortis libero interdum vehicula vel quis nulla.</p>
    
    <p>Suspendisse et massa urna. Donec eu lorem nec felis dapibus aliquam viverra in quam. Suspendisse ultrices, nisi ac venenatis porttitor, erat turpis dapibus augue, sed rutrum nunc ante sed enim. Aliquam et tempus mi. Nullam malesuada, nunc a eleifend pretium, justo lorem tempus justo, id adipiscing dolor ipsum sed velit. Maecenas odio massa, feugiat vel sodales ut, placerat at quam. Cras viverra diam vitae diam elementum vitae aliquet erat tincidunt. Quisque fringilla neque in lacus tempor cursus. Curabitur eget nulla et nisi dignissim tempor vel non risus. Mauris ac ipsum metus, a auctor massa. Nunc eros ante, ullamcorper a mollis nec, aliquam sed est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
</div>

<button onclick="test()">Click</button>

<script>
	
	
</script>


  
</body>

</html>