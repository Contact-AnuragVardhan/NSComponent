<!DOCTYPE html>
<html>
<head>
  <title>Docx Export Demo</title>
  <meta charset="utf-8">
  
<style>
		body,html
		{
			margin:15px;
			padding:0px;
			height:100%;
			background:#FFFFFF;
		}
		.container
		{
			width:100%;
			height:35%;
			flex: 1 1 auto;
    		padding-left: 25px;
    		padding-top: 50px;
    		overflow: auto;
		}
		
</style>
  
  <style>
.table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.table td, .table th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.highlight {
  background: yellow;
}
</style>


</head>
<body>
	<div class="container">
		<div id="divContent">
			<p>This is a <b>table</b> and <b>Image</b> example</p>
			<table class="table">
			  <tr>
			    <th><b>Company</b></th>
			    <th><b>Contact</b></th>
			    <th><b>Country</b></th>
			  </tr>
			  <tr>
			    <td>Alfreds Futterkiste</td>
			    <td>Maria Anders</td>
			    <td>Germany</td>
			  </tr>
			  <tr>
			    <td>Centro comercial Moctezuma</td>
			    <td>Francisco Chang</td>
			    <td>Mexico</td>
			  </tr>
			  <tr class="highlight">
			    <td>Ernst Handel</td>
			    <td>Roland Mendel</td>
			    <td>Austria</td>
			  </tr>
			  <tr>
			    <td>Island Trading</td>
			    <td>Helen Bennett</td>
			    <td>UK</td>
			  </tr>
			  <tr>
			    <td>Laughing Bacchus Winecellars</td>
			    <td>Yoshi Tannamuri</td>
			    <td>Canada</td>
			  </tr>
			  <tr>
			    <td>Magazzini Alimentari Riuniti</td>
			    <td>Giovanni Rovelli</td>
			    <td>Italy</td>
			  </tr>
			</table>
			<br/>
			<div>
		      <img src="http://localhost:8080/JSLib/prototypeDemo/images/cat.png" width="600px" crossorigin="anonymous"></img>
		    </div>
		    <br/>
			<div>
		      <img src="http://localhost:8080/JSLib/prototypeDemo/images/dog.jpg" width="600px" crossorigin="anonymous"></img>
		    </div>
		</div>
		<br/>
		<div class="orientation">
		    <span>Orientation:</span>
		    <label><input type="radio" name="orientation" value="portrait" checked>Portrait</label>
		    <label><input type="radio" name="orientation" value="landscape">Landscape</label>
		</div>
		<br/>
		<div class="pageNumber">
		    <span>Page Number:</span>
		    <label><input type="radio" name="pageNumber" value="true" checked>Yes</label>
		    <label><input type="radio" name="pageNumber" value="false">No</label>
		</div>
		<br/>
		<button onclick="download()">Click me!</button>
	</div>
	<div class="container">
		<p>This is <b>dynamic Text</b> and <b>Image</b> example with no paragraph spacing.</p>
		<div id="divTextArea" contenteditable="true">
			<p>This is a Test Docx. </p>
			<p>This is a Test Docx. </p>
			<p>This is a Test Docx. </p>
			<p>This is a Test Docx. </p>
			<div>
		      <img src="http://localhost:8080/JSLib/prototypeDemo/images/cat.png" width="600px" crossorigin="anonymous"></img>
		    </div>
		</div>
		<br/>
		<button onclick="downloadTextArea()">Click me!</button>
	</div>

<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/util/nsPromise.js"></script>
<script src="/JSLib/lib/com/org/util/nsZip.js"></script>
 <script src="/JSLib/lib/com/org/util/nsDocxExport.js"></script>
<script>

function download() 
{
	var divContent = document.getElementById("divContent");
	var style = "p {\r\n" +
	"  display:inline; \r\n" +
	"  margin: 0px; \r\n" +
	"  }\r\n" +
	"  .table {\r\n" + 
	"  font-family: arial, sans-serif;\r\n" + 
	"  border-collapse: collapse;\r\n" + 
	"  width: 100%;\r\n" + 
	"}\r\n" + 
	"\r\n" + 
	".table td,.table th {\r\n" + 
	"  border: 1px solid #dddddd;\r\n" + 
	"  text-align: left;\r\n" + 
	"  padding: 8px;\r\n" + 
	"}\r\n" + 
	"\r\n" + 
	".highlight {\r\n" + 
	"  background: yellow;\r\n" + 
	"}";
	var orientation = document.querySelector('.orientation input:checked').value;
	var pageNumber = document.querySelector('.pageNumber input:checked').value;
	var setting = {fileName:"temp",htmlSetting:{element: divContent,htmlStyle:style,enablePageNumber:pageNumber},printSetting:{orientation: orientation}};
	var docxExport = new NSDocxExport(setting);
	docxExport.process();
};

function downloadTextArea() 
{
	var divTextArea = document.getElementById("divTextArea");
	var style = "p {\r\n" +
	"  display:inline; \r\n" +
	"  margin: 0px; \r\n" +
	"  }";
	var setting = {fileName:"tempTextArea",htmlSetting:{element: divTextArea,htmlStyle:style,loopNodesCallback:loopElements}};
	var docxExport = new NSDocxExport(setting);
	docxExport.process();
};

function loopElements(element)
{
	console.log(element);
}

</script>

</body>
</html>