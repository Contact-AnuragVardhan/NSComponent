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
/* 			height:35%; */
			flex: 1 1 auto;
    		padding-left: 25px;
    		padding-top: 20px;
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
	<h1 style="margin: 0px;">DOCX browser Word document generation</h1>
	<div class="container">
		<h3>Paragraph generation</h3>
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
		<button onclick="generatePara()">Click to generate Paragraph</button>
	</div>
	<div class="container">
		<h3>Section generation</h3>
		<button onclick="generateSection()">Click to generate Section</button>
	</div>
	<div class="container">
		<h3>Table generation with Margins</h3>
		<button onclick="generateTable()">Click to generate Table with Margins</button>
	</div>
	
	<div class="container">
		<h3>Paragraph and Table generation</h3>
		<button onclick="generateParaTable()">Click to generate Paragraph and Table</button>
	</div>
	
	<div class="container">
		<h3>Page Number</h3>
		<button onclick="generatePageNumber()">Click to generate Page Number</button>
	</div>
	
	<div class="container">
		<h3>Style Example</h3>
		<button onclick="generateStyleDocx()">Click to generate Styled Docx</button>
	</div>
	
	<div class="container">
		<h3>Default Style Example</h3>
		<button onclick="generateDefaultStyleDocx()">Click to generate Default Styled Docx</button>
	</div>
	
<script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
<script src="/JSLib/lib/com/org/util/nsPromise.js"></script>
<script src="/JSLib/lib/com/org/util/nsZip.js"></script>
 <script src="/JSLib/lib/com/org/util/nsDocxExport.js"></script>
<script>

function generatePara() 
{
	var orientation = document.querySelector('.orientation input:checked').value;
	var pageNumber = document.querySelector('.pageNumber input:checked').value;
	var setting = {fileName:"para",printSetting:{orientation: orientation},enablePageNumber:pageNumber};
	var docxExport = new NSDocxExport(setting);
	var para = docxExport.addParagraph();
	var format = para.format();
	format.horizontalAlignment().value("center");
	var borders = format.borders();
	borders.top("single","24","1","FF0000");
	borders.bottom("single","24","1","FF0000");
	borders.left("single","24","1","0000FF");
	borders.right("single","24","1","0000FF");
	var run = para.addRun();
	run.addText("This is demo");
	run.addBreak();
	run.addText("This is demo 123");
	docxExport.process();
};

function generateSection() 
{
	var setting = {fileName:"section"};
	var docxExport = new NSDocxExport(setting);
	var section = docxExport.addSection();
	section.cols().num(2);
	section.pgNumType().start("1");
	section.addParagraph().addRun().addText("This is Column 1");
	section.addParagraph().addRun().addText("This is Column 2");
	docxExport.process();
};

function generateTable() 
{
	var margins = {top: 1440,right: 1440,bottom: 1440,left: 1440,header: 720,footer: 720,gutter: 0};
	var setting = {fileName:"table",printSetting: {margins: margins}};
	var docxExport = new NSDocxExport(setting);
	var tbl = docxExport.addTable();
	var border = tbl.format().borders();
	border.setAll("FF0000",null,0,12,"single");
	for (var rowCount = 0; rowCount < 5; rowCount++) 
	{
        var row = tbl.addRow();
        for (colCount = 0; colCount < 3; colCount++) 
        {
        	var text = "row" + (rowCount + 1) + " - " + "col" + (colCount + 1);
          	row.addCell().addParagraph().addRun().addText(text);
        }
    }
	docxExport.process();
};

function generateParaTable() 
{
	var setting = {fileName:"paraTable"};
	var docxExport = new NSDocxExport(setting);
	
	var para = docxExport.addParagraph();
	var format = para.format();
	format.horizontalAlignment().value("center");
	var run = para.addRun();
	run.addText("This is demo");
	run.addBreak();
	run.addText("This is table demo");
	
	var tbl = docxExport.addTable({styleID: "TableGrid"});
// 	var border = tbl.format().borders();
// 	border.setAll("FF0000",null,0,12,"single");
	for (var rowCount = 0; rowCount < 5; rowCount++) 
	{
        var row = tbl.addRow();
        for (colCount = 0; colCount < 3; colCount++) 
        {
        	var text = "row" + (rowCount + 1) + " - " + "col" + (colCount + 1);
          	row.addCell().addParagraph().addRun().addText(text);
        }
    }
	docxExport.process();
};

function generatePageNumber()
{
	var setting = {fileName:"paraTable"};
	var docxExport = new NSDocxExport(setting);
	var total = 5;
	for(var count = 0;count < total;count++)
	{
		var para = docxExport.addParagraph();
		var format = para.format();
		format.horizontalAlignment().value("center");
		para.addText("This is Page " + (count + 1));
		if((count + 1) < total)
		{
			//run.addBreak("page");
			para.addPageBreak();
		}
	}
	var footer = docxExport.addFooter();
	var para = footer.addParagraph();
	para.addText("Page ");
	para.addCurrentPageNumber();
	para.addText(" of ");
	para.addTotalPageNumber();
	docxExport.process();
};

function generateStyleDocx()
{
	var style1 = {
            id: "ParaHeading",
            type: "paragraph",
            name: "Para Heading",
            basedOn: "Normal",
            next: "Normal",
            run: {
                size: 24,
                bold: true,
                italic: true,
                color: "blue",
                underline: {
                    type: "double",
                    color: "black",
                },
            },
            paragraph: {
                spacing: {
                    after: 0,
                    before: 0,
                },
            },
        };
	
	var style2 = {
            id: "ParaNoSpace",
            type: "paragraph",
            name: "Para Nospaced",
            basedOn: "Normal",
            paragraph: {
                spacing: { before: 0, after: 0 },
            },
        };
	
	var style3 = {
            id: "ParaSpaced",
            type: "paragraph",
            name: "Para Spaced",
            basedOn: "Normal",
            quickFormat: true,
            paragraph: {
                spacing: { line: 276, before: 150, after: 100 },
            },
        };
	
	var setting = {fileName:"styleDoc",styles:{styles:[style1,style2,style3]}};
	var docxExport = new NSDocxExport(setting);
	var para1 = docxExport.addParagraph({text: "This is a Heading with double underline.",styleID: "ParaHeading"});
	var para2 = docxExport.addParagraph({text: "This is a Normal Para. with no space",styleID: "ParaNoSpace"});
	var para3 = docxExport.addParagraph({text: "This is a Spaced Para.",styleID: "ParaSpaced"});
	docxExport.process();	
}

function generateDefaultStyleDocx()
{
	var defaultStyle = {
            text: {
                italic: true,
                color: "blue",
            },
            paragraph: {
                spacing: {
                    after: 0,
                    before: 0,
                },
            },
        };
	var setting = {fileName:"styleDoc",styles:{"default":defaultStyle}};
	var docxExport = new NSDocxExport(setting);
	var para1 = docxExport.addParagraph({text: "This is a Para 1."});
	var para2 = docxExport.addParagraph({text: "This is a Para 2."});
	var para3 = docxExport.addParagraph({text: "This is a Para 3."});
	docxExport.process();	
}

</script>

</body>
</html>