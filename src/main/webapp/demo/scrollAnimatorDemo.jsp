<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<script src="../lib/com/org/util/nsUtil.js"></script>
<script src="../lib/com/org/util/nsScrollAnimator.js"></script>
<title>Scroller Animation Demo</title>
<style>
    body{
      font-family: arial;
      text-align: center;
    }
    .text-content{
      max-width: 800px;
      max-height: 800px;
      margin: 0 40px;
      display: inline-block;
     
    }
    .button-wrapper{
      display: block;
      paddimg-left:100px;
    }
    .button{
      padding: .93em 1.87em;
      background: #458cde;
      border-radius: 5px;
      display: inline-block;
      color: #fff;
      cursor: pointer;
      position:fixed;
    }
    .text-content{
      font-size: 20px;
      text-align: left;
      line-height: 28px;
    }
</style>
</head>
<body onload="initialize()">
  	<div class="button-wrapper">
  	  <button id="btnDiv" class="button">Convert To Div</button>
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  <button id="btnVertical" class="button">Scroll Vertical</button>
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	  <button id="btnHorizontal" class="button">Scroll Horizontal</button>
	</div>
	<div id="divContent" class="text-content">
	  <div style="width:100%;height:100%;">
		  <p>
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis arcu lectus, quis blandit diam consectetur ut. Aliquam sed ullamcorper turpis, in lobortis leo. Vestibulum mauris urna, consequat sit amet dapibus id, condimentum in diam. Morbi vestibulum efficitur magna, eu condimentum dui porttitor vel. Sed nec turpis suscipit, ornare turpis bibendum, convallis risus. Donec mattis ligula vel massa posuere, at convallis lectus sagittis. Donec posuere lacinia blandit. Cras vestibulum rhoncus felis vitae iaculis. Vestibulum lacinia mattis orci nec vulputate. Vivamus non nibh lectus. Pellentesque dapibus faucibus lectus, vel pharetra eros volutpat et. Aenean elit mauris, imperdiet congue tristique sodales, lacinia a ex. Aenean enim dui, condimentum vitae est id, suscipit tristique purus. Pellentesque sollicitudin congue efficitur. Etiam vel metus non justo vulputate ultrices vitae at nulla.
		  </p>
		  <p>
		  In feugiat convallis vulputate. Vestibulum at eros est. Mauris volutpat turpis viverra venenatis mattis. Morbi sit amet consequat ipsum, at porttitor leo. Quisque pretium rutrum finibus. Sed pharetra vehicula nibh sit amet dignissim. Vestibulum rhoncus sem vel lectus laoreet, in consequat tortor lobortis. Mauris in volutpat dui.
		  </p>
		  <p>
		  Nam sit amet tellus eu velit commodo pharetra. Nunc viverra, elit id mattis tempor, massa felis accumsan arcu, vel ultrices mauris ligula eu purus. Cras non venenatis mauris, ut gravida lectus. Vivamus ullamcorper a enim rhoncus porta. Proin dapibus orci a mauris maximus posuere. Vestibulum ultricies, est vitae pharetra interdum, eros risus viverra lacus, eget imperdiet arcu risus eget purus. Etiam lacinia faucibus purus, ac porttitor quam facilisis sit amet.
		  </p>
		  <p>
		  Aenean dictum nisl eros, sed maximus eros suscipit in. Vivamus pulvinar tempus nisi eget rutrum. Nulla suscipit elit iaculis erat laoreet molestie. Fusce dignissim ultricies ex, sed porttitor metus vehicula a. Maecenas volutpat commodo gravida. Nullam nec gravida magna. Vivamus commodo mi et nunc tempus, nec placerat est euismod. Integer ac tellus convallis, vestibulum nulla quis, vulputate lectus. Vivamus et dui in velit malesuada dapibus ut non orci. In imperdiet laoreet mauris, consequat posuere est placerat et. Suspendisse enim quam, tristique ut convallis sit amet, varius in libero. Praesent posuere urna et est placerat tempor. Sed eu ante elementum, malesuada nulla ac, malesuada urna. In tempor ultrices ante, sed lobortis felis laoreet scelerisque.
		  </p>
		  <p>
		  Phasellus interdum ac metus non rhoncus. Nam tristique justo arcu, condimentum luctus enim vestibulum sit amet. Duis ac placerat sapien, eu posuere mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean eget vulputate elit. Curabitur dignissim nulla vel nisi sollicitudin scelerisque. Aenean in tortor non tortor lobortis consectetur eu at nisl. Nunc venenatis vel ex non ultricies. Donec placerat hendrerit diam.
		  </p>
		  <p>
		  Cras varius ultrices porttitor. Etiam tincidunt enim in rhoncus sodales. Vivamus quis lorem placerat, fermentum arcu sed, maximus augue. Proin eget tellus eu leo tempus tempus vitae vitae urna. Vestibulum mollis eleifend ex, id elementum erat convallis eu. Nulla at laoreet felis. Fusce congue sapien sed sem tempor, id tincidunt metus auctor. Nullam sed imperdiet velit. Ut sit amet posuere massa. Cras ultrices diam in efficitur ullamcorper. Duis efficitur sem eu eleifend dictum. Vivamus sed turpis molestie, ornare massa sit amet, congue turpis. Pellentesque ut odio nec eros interdum aliquet sed et nisi. In non nisl id ante pretium scelerisque a ac sem.
		  </p>
		  <p>
		  Sed hendrerit velit vitae est ultrices volutpat. Integer at commodo sapien. Sed mattis eu lacus vel dictum. Duis pharetra sem quis metus imperdiet finibus. Etiam consequat eu lacus quis dignissim. Pellentesque a augue a nisl gravida mattis. Morbi ac sapien bibendum, viverra odio nec, rhoncus libero. Cras lobortis felis sit amet turpis bibendum congue. Fusce at facilisis sapien. Vivamus molestie quam non nunc dignissim, nec vestibulum orci pretium. Nulla sem magna, blandit quis faucibus at, dictum a lorem. Aliquam lacinia turpis sit amet orci porta convallis.
		  </p>
		  <p>
		  Nunc sit amet fringilla lacus. Vivamus vel sapien vel risus ultrices imperdiet. Suspendisse mauris sapien, egestas et eleifend eget, rutrum vitae dolor. Donec facilisis urna commodo semper rutrum. Integer ut scelerisque orci. Ut elementum turpis nec pretium accumsan. Vivamus placerat odio felis, et egestas ipsum maximus ac. Quisque finibus efficitur felis vitae venenatis. Nam sit amet rhoncus lorem. Vestibulum congue sapien at ipsum condimentum aliquet. Aliquam ac iaculis diam. In hac habitasse platea dictumst. Vestibulum a mollis tortor. In hac habitasse platea dictumst.
		  </p>
		  <p>
		  Aliquam efficitur mi ut consequat eleifend. Pellentesque sollicitudin justo vitae eros viverra, non pellentesque velit malesuada. Duis in erat vitae nisl pharetra vulputate vitae quis ligula. Curabitur ac odio libero. In ac felis a sapien efficitur dictum. Aenean non efficitur nibh. Sed non cursus nunc. Nulla a consectetur dui.
		  </p>
		  <p>
		  Curabitur ac erat velit. Suspendisse convallis, ex in viverra molestie, velit dui feugiat mauris, ac euismod turpis est non nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id dui fermentum, ultricies est nec, aliquam arcu. Phasellus bibendum augue turpis. Duis ornare id ante nec vestibulum. Nullam euismod lorem in nulla viverra, faucibus tempus mi placerat. Vivamus sodales tellus neque, id placerat lorem mattis eget. Suspendisse bibendum libero sed metus imperdiet, vitae volutpat mauris imperdiet. Donec eu molestie lacus, et iaculis odio.
		  </p>
		  <p>
		  Nam magna quam, consectetur a faucibus ornare, ultrices id tellus. Integer tempor molestie scelerisque. Nulla mattis in eros vel imperdiet. Quisque ut ligula nisi. In hac habitasse platea dictumst. Suspendisse rutrum purus ut leo lacinia, sed mollis ipsum euismod. Duis eu sapien metus. Vestibulum faucibus vitae nunc vel fringilla. Nulla consequat vel est at tempor. Phasellus at metus erat. Praesent venenatis augue cursus ornare pretium. Vestibulum suscipit sem vel elit consectetur, fermentum interdum urna ornare.
		  </p>
		  <p>
		  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi sodales quis erat sit amet gravida. Duis et nisl dui. Vivamus blandit, erat sit amet aliquam interdum, risus risus tristique turpis, eu aliquam urna metus in ex. Suspendisse gravida porttitor leo, convallis feugiat mi sollicitudin eget. Fusce porttitor nulla sapien, vel dictum nisl lobortis id. Maecenas viverra diam sed orci dictum venenatis. Suspendisse a nunc gravida, tincidunt turpis id, consequat dolor. Maecenas blandit auctor eros at pulvinar. Ut eget dictum nibh. Maecenas in mauris dictum, efficitur turpis in, commodo nunc. Cras urna nulla, elementum sed neque quis, iaculis porttitor metus. Donec vitae molestie augue. Vivamus at lorem eu lectus euismod facilisis vitae mattis lorem. Cras libero ex, ornare sit amet dictum in, lobortis vel lacus. Ut at ante odio.
		  </p>
		  <p>
		  Sed ultrices sed eros a maximus. Morbi eleifend sed nibh vitae ullamcorper. Maecenas fringilla orci et justo ornare, rhoncus lobortis augue interdum. Nullam fringilla sem eget fermentum tristique. Nulla quis fringilla nibh, in elementum neque. Fusce lacinia lorem nulla, ac dapibus erat sodales ut. Vestibulum dictum, sem eu scelerisque laoreet, enim ligula consectetur lectus, sed egestas urna neque id quam. Nullam euismod viverra molestie. Ut massa augue, congue sed pretium quis, vulputate nec nisl.
		  </p>
		  <p>
		  Sed venenatis massa in rhoncus porta. Praesent ornare dui ac justo consequat facilisis. Pellentesque vel gravida arcu, at pulvinar elit. Nulla facilisis vulputate elementum. Mauris finibus leo in ex maximus, at dignissim dui ornare. Proin vestibulum risus dolor, vitae luctus nisi ullamcorper at. Integer ut ornare libero. Nam tempus volutpat enim eget feugiat. Donec rutrum turpis vel venenatis pulvinar. Nunc venenatis nibh quis augue blandit, ac pharetra lectus faucibus.
		  </p>
		  <p>
		  Maecenas pellentesque nibh a tincidunt mattis. Etiam facilisis purus id neque ornare blandit vitae eu ligula. Nullam aliquet, dolor sit amet tempus molestie, ipsum purus ullamcorper dolor, vel porta magna elit vel justo. Vivamus id nisi vitae nisl pretium ullamcorper auctor vitae lorem. Suspendisse at libero sit amet libero tincidunt vestibulum ut mollis turpis. Phasellus porta metus fringilla eros vestibulum, ac vestibulum nunc mollis. In eget quam nunc. Aenean dapibus urna convallis eros laoreet, vel tempor purus rhoncus. Etiam faucibus leo arcu, a sagittis ex faucibus aliquam. Nullam ullamcorper nunc eget lacus dignissim gravida. Praesent id porttitor dolor. Curabitur aliquam enim ut tempor semper. Nam aliquam est quis lorem ultrices fringilla. Vivamus sit amet nunc orci. Sed aliquet eu metus eu blandit. Quisque tempus dignissim enim, quis suscipit libero lobortis a.
		  </p>
		  <p>
		    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis arcu lectus, quis blandit diam consectetur ut. Aliquam sed ullamcorper turpis, in lobortis leo. Vestibulum mauris urna, consequat sit amet dapibus id, condimentum in diam. Morbi vestibulum efficitur magna, eu condimentum dui porttitor vel. Sed nec turpis suscipit, ornare turpis bibendum, convallis risus. Donec mattis ligula vel massa posuere, at convallis lectus sagittis. Donec posuere lacinia blandit. Cras vestibulum rhoncus felis vitae iaculis. Vestibulum lacinia mattis orci nec vulputate. Vivamus non nibh lectus. Pellentesque dapibus faucibus lectus, vel pharetra eros volutpat et. Aenean elit mauris, imperdiet congue tristique sodales, lacinia a ex. Aenean enim dui, condimentum vitae est id, suscipit tristique purus. Pellentesque sollicitudin congue efficitur. Etiam vel metus non justo vulputate ultrices vitae at nulla.
		  </p>
		  <p>
		  In feugiat convallis vulputate. Vestibulum at eros est. Mauris volutpat turpis viverra venenatis mattis. Morbi sit amet consequat ipsum, at porttitor leo. Quisque pretium rutrum finibus. Sed pharetra vehicula nibh sit amet dignissim. Vestibulum rhoncus sem vel lectus laoreet, in consequat tortor lobortis. Mauris in volutpat dui.
		  </p>
		  <p>
		  Nam sit amet tellus eu velit commodo pharetra. Nunc viverra, elit id mattis tempor, massa felis accumsan arcu, vel ultrices mauris ligula eu purus. Cras non venenatis mauris, ut gravida lectus. Vivamus ullamcorper a enim rhoncus porta. Proin dapibus orci a mauris maximus posuere. Vestibulum ultricies, est vitae pharetra interdum, eros risus viverra lacus, eget imperdiet arcu risus eget purus. Etiam lacinia faucibus purus, ac porttitor quam facilisis sit amet.
		  </p>
		  <p>
		  Aenean dictum nisl eros, sed maximus eros suscipit in. Vivamus pulvinar tempus nisi eget rutrum. Nulla suscipit elit iaculis erat laoreet molestie. Fusce dignissim ultricies ex, sed porttitor metus vehicula a. Maecenas volutpat commodo gravida. Nullam nec gravida magna. Vivamus commodo mi et nunc tempus, nec placerat est euismod. Integer ac tellus convallis, vestibulum nulla quis, vulputate lectus. Vivamus et dui in velit malesuada dapibus ut non orci. In imperdiet laoreet mauris, consequat posuere est placerat et. Suspendisse enim quam, tristique ut convallis sit amet, varius in libero. Praesent posuere urna et est placerat tempor. Sed eu ante elementum, malesuada nulla ac, malesuada urna. In tempor ultrices ante, sed lobortis felis laoreet scelerisque.
		  </p>
		  <p>
		  Phasellus interdum ac metus non rhoncus. Nam tristique justo arcu, condimentum luctus enim vestibulum sit amet. Duis ac placerat sapien, eu posuere mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean eget vulputate elit. Curabitur dignissim nulla vel nisi sollicitudin scelerisque. Aenean in tortor non tortor lobortis consectetur eu at nisl. Nunc venenatis vel ex non ultricies. Donec placerat hendrerit diam.
		  </p>
		  <p>
		  Cras varius ultrices porttitor. Etiam tincidunt enim in rhoncus sodales. Vivamus quis lorem placerat, fermentum arcu sed, maximus augue. Proin eget tellus eu leo tempus tempus vitae vitae urna. Vestibulum mollis eleifend ex, id elementum erat convallis eu. Nulla at laoreet felis. Fusce congue sapien sed sem tempor, id tincidunt metus auctor. Nullam sed imperdiet velit. Ut sit amet posuere massa. Cras ultrices diam in efficitur ullamcorper. Duis efficitur sem eu eleifend dictum. Vivamus sed turpis molestie, ornare massa sit amet, congue turpis. Pellentesque ut odio nec eros interdum aliquet sed et nisi. In non nisl id ante pretium scelerisque a ac sem.
		  </p>
		  <p>
		  Sed hendrerit velit vitae est ultrices volutpat. Integer at commodo sapien. Sed mattis eu lacus vel dictum. Duis pharetra sem quis metus imperdiet finibus. Etiam consequat eu lacus quis dignissim. Pellentesque a augue a nisl gravida mattis. Morbi ac sapien bibendum, viverra odio nec, rhoncus libero. Cras lobortis felis sit amet turpis bibendum congue. Fusce at facilisis sapien. Vivamus molestie quam non nunc dignissim, nec vestibulum orci pretium. Nulla sem magna, blandit quis faucibus at, dictum a lorem. Aliquam lacinia turpis sit amet orci porta convallis.
		  </p>
		  <p>
		  Nunc sit amet fringilla lacus. Vivamus vel sapien vel risus ultrices imperdiet. Suspendisse mauris sapien, egestas et eleifend eget, rutrum vitae dolor. Donec facilisis urna commodo semper rutrum. Integer ut scelerisque orci. Ut elementum turpis nec pretium accumsan. Vivamus placerat odio felis, et egestas ipsum maximus ac. Quisque finibus efficitur felis vitae venenatis. Nam sit amet rhoncus lorem. Vestibulum congue sapien at ipsum condimentum aliquet. Aliquam ac iaculis diam. In hac habitasse platea dictumst. Vestibulum a mollis tortor. In hac habitasse platea dictumst.
		  </p>
		  <p>
		  Aliquam efficitur mi ut consequat eleifend. Pellentesque sollicitudin justo vitae eros viverra, non pellentesque velit malesuada. Duis in erat vitae nisl pharetra vulputate vitae quis ligula. Curabitur ac odio libero. In ac felis a sapien efficitur dictum. Aenean non efficitur nibh. Sed non cursus nunc. Nulla a consectetur dui.
		  </p>
		  <p>
		  Curabitur ac erat velit. Suspendisse convallis, ex in viverra molestie, velit dui feugiat mauris, ac euismod turpis est non nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id dui fermentum, ultricies est nec, aliquam arcu. Phasellus bibendum augue turpis. Duis ornare id ante nec vestibulum. Nullam euismod lorem in nulla viverra, faucibus tempus mi placerat. Vivamus sodales tellus neque, id placerat lorem mattis eget. Suspendisse bibendum libero sed metus imperdiet, vitae volutpat mauris imperdiet. Donec eu molestie lacus, et iaculis odio.
		  </p>
		  <p>
		  Nam magna quam, consectetur a faucibus ornare, ultrices id tellus. Integer tempor molestie scelerisque. Nulla mattis in eros vel imperdiet. Quisque ut ligula nisi. In hac habitasse platea dictumst. Suspendisse rutrum purus ut leo lacinia, sed mollis ipsum euismod. Duis eu sapien metus. Vestibulum faucibus vitae nunc vel fringilla. Nulla consequat vel est at tempor. Phasellus at metus erat. Praesent venenatis augue cursus ornare pretium. Vestibulum suscipit sem vel elit consectetur, fermentum interdum urna ornare.
		  </p>
		  <p>
		  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi sodales quis erat sit amet gravida. Duis et nisl dui. Vivamus blandit, erat sit amet aliquam interdum, risus risus tristique turpis, eu aliquam urna metus in ex. Suspendisse gravida porttitor leo, convallis feugiat mi sollicitudin eget. Fusce porttitor nulla sapien, vel dictum nisl lobortis id. Maecenas viverra diam sed orci dictum venenatis. Suspendisse a nunc gravida, tincidunt turpis id, consequat dolor. Maecenas blandit auctor eros at pulvinar. Ut eget dictum nibh. Maecenas in mauris dictum, efficitur turpis in, commodo nunc. Cras urna nulla, elementum sed neque quis, iaculis porttitor metus. Donec vitae molestie augue. Vivamus at lorem eu lectus euismod facilisis vitae mattis lorem. Cras libero ex, ornare sit amet dictum in, lobortis vel lacus. Ut at ante odio.
		  </p>
		  <p>
		  Sed ultrices sed eros a maximus. Morbi eleifend sed nibh vitae ullamcorper. Maecenas fringilla orci et justo ornare, rhoncus lobortis augue interdum. Nullam fringilla sem eget fermentum tristique. Nulla quis fringilla nibh, in elementum neque. Fusce lacinia lorem nulla, ac dapibus erat sodales ut. Vestibulum dictum, sem eu scelerisque laoreet, enim ligula consectetur lectus, sed egestas urna neque id quam. Nullam euismod viverra molestie. Ut massa augue, congue sed pretium quis, vulputate nec nisl.
		  </p>
		  <p>
		  Sed venenatis massa in rhoncus porta. Praesent ornare dui ac justo consequat facilisis. Pellentesque vel gravida arcu, at pulvinar elit. Nulla facilisis vulputate elementum. Mauris finibus leo in ex maximus, at dignissim dui ornare. Proin vestibulum risus dolor, vitae luctus nisi ullamcorper at. Integer ut ornare libero. Nam tempus volutpat enim eget feugiat. Donec rutrum turpis vel venenatis pulvinar. Nunc venenatis nibh quis augue blandit, ac pharetra lectus faucibus.
		  </p>
		  <p>
		  Maecenas pellentesque nibh a tincidunt mattis. Etiam facilisis purus id neque ornare blandit vitae eu ligula. Nullam aliquet, dolor sit amet tempus molestie, ipsum purus ullamcorper dolor, vel porta magna elit vel justo. Vivamus id nisi vitae nisl pretium ullamcorper auctor vitae lorem. Suspendisse at libero sit amet libero tincidunt vestibulum ut mollis turpis. Phasellus porta metus fringilla eros vestibulum, ac vestibulum nunc mollis. In eget quam nunc. Aenean dapibus urna convallis eros laoreet, vel tempor purus rhoncus. Etiam faucibus leo arcu, a sagittis ex faucibus aliquam. Nullam ullamcorper nunc eget lacus dignissim gravida. Praesent id porttitor dolor. Curabitur aliquam enim ut tempor semper. Nam aliquam est quis lorem ultrices fringilla. Vivamus sit amet nunc orci. Sed aliquet eu metus eu blandit. Quisque tempus dignissim enim, quis suscipit libero lobortis a.
		  </p>
		  <div style="width:5000px;">
		  	<h3>End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great</h3>
		  	<h3>End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great</h3>
		  	<h3>End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great</h3>
		  	<h3>End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great.End of Vertical and horizontal scrollbar and this demo is great</h3>
		  </div>
		</div>
	</div>
  <script>
  	var util = null;
  	var horScroller = null;
  	var verScroller = null;
  	function initialize()
  	{
  		document.querySelector("#btnDiv").addEventListener("click",addStyleDiv);
  		document.querySelector("#btnVertical").addEventListener("click",scrollVertical);
  		document.querySelector("#btnHorizontal").addEventListener("click",scrollHorizontal);
  		initScroller();
  	}
  	
  	function initScroller()
  	{
  		var divContent = getElement();
  		var horSetting = {element: divContent,direction:"horizontal",callback:function(){
  			console.log("Done Horizontal");
  			console.log("Max:" + horScroller.getMaxScrollPos() + " Current:" + horScroller.getScrollPos());
  		}};
  		horScroller = new NSScrollAnimator(horSetting);
  		var verSetting = {element: divContent,callback:function(){
  			console.log("Done Vertical");
  			console.log("Max:" + verScroller.getMaxScrollPos() + " Current:" + verScroller.getScrollPos());
  		}};
  		verScroller = new NSScrollAnimator(verSetting);
  	}
  	
  	function addStyleDiv()
  	{
  		var divContent = document.querySelector("#divContent");
  		divContent.style.overflow = "scroll"; 
  		initScroller();
  	}
  	
  	function scrollVertical()
  	{
  		verScroller.scrollTo(verScroller.getScrollPos() + 500);
  	}
  	
  	function scrollHorizontal()
  	{
  		horScroller.scrollTo(horScroller.getScrollPos() + 500);
  	}
  	
  	function getElement()
  	{
  		var divContent = document.querySelector("#divContent");
  		if(divContent.style.overflow == "scroll")
  		{
  			return divContent;
  		}
  		return window;
  	}
  </script>
</body>
</html>
