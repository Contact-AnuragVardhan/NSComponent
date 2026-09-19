<!DOCTYPE html>
<html lang="en">
<head>
  <title>Xlsx Demo</title>
  <meta http-equiv="Content-type" content="text/html;charset=UTF-8" />

 <script src="/JSLib/lib/com/org/util/nsUtil.js"></script>
 <script src="/JSLib/lib/com/org/util/nsXlsxExport.js"></script>
 <script src="/JSLib/lib/com/org/util/nsZip.js"></script>

</head>
<body>
<button onclick="download()">Click me!</button>
<script>

function download() 
{
	var headerStyle1 = {
						font: {bold: true, underline: true,  color: '#FFFFFF'},
						horizontal: 'center',
						border: {color: '#FF0000', style: 'thin'},
						pattern: {color: '#000000'}
					}; 
	
	var headerStyle2 = {
			font: {bold: true, color: '#000000'},
			horizontal: 'center',
			pattern: {color: '#C0F0C0'}
		}; 
	
	var style = {border: {color: '#FF0000', style: 'thin'},
			 	 pattern:{color: '#00FF00'}
			    };
	var rowStyle = {
					font: {
						italic: true,
						color: '#FF0000'
					},
					pattern: {color: '#00FF00'}
				};
	
	var arrColumns = [{headerText:"Id",dataField:"id",width:5,type:"number",style: style},
			          {headerText:"Id Int",dataField:"id",width:10,type:"integer"},
			          {headerText:"Id Double",dataField:"id",widthInPx:200,type:"double"},
			          {headerText:"Country",dataField:"country",width:10},
			          {headerText:"Date",dataField:"date",widthInChar:10,type:'date'},
			          {headerText:"Time",dataField:"date",width:30,type:'time'},
			          {headerText:"Date Time",dataField:"date",width:30,type:'date',style: {format: '[$-409]m/d/yy\ h:mm\ AM/PM;@'}}];

	var objRow = {2:{height:30,style: rowStyle}};
	var viewAttribute = {zoomScale: 200};
	var printSetUp = {orientation:'landscape',margin:{right: 1}};
	var arrSheet=[{name:"Sheet 1",title:"This is a demo sheet",dataSource:getSheetData(10,true),columns: arrColumns,rowProperties: objRow,headerStyle: headerStyle1},
				  {name:"Sheet 2",dataSource:getSheetData(10,false),columns: arrColumns,headerStyle: headerStyle2,freeze: {col: 1,row: 2},printSetUp: printSetUp,maxCharWidth:7},
				  {name:"Sheet 3",title:"This is a zoomed sheet",dataSource:getSheetData(10,true),columns: arrColumns,headerStyle: headerStyle1,viewAttribute: viewAttribute}];
	var setting = {fileName:"temp",sheets:arrSheet,maxCharWidth:5};
	var xlsxExport = new NSXlsxExport(setting);
	xlsxExport.process();
};

var getSheetData = function(length,isSpanReq)
{
	var cellStyle = {font: {color: '#E90AF5'}};
	var spanStyle = {horizontal: 'center',vertical: 'center'};
	var arrItems = [];
	for(var count = 0;count < length;count++)
	{
		item = {id: count,country: 'UK'};
		if((count % 2) === 0)
		{
			item["country"] = "US";
		}
		if(count == 0 && isSpanReq)
		{
			item["country"] = {value: "US",rowspan: 2,style: spanStyle};
		}
		if(count === 3)
	    {
	    	item["country"] = {value: "US",style: cellStyle};
	    }
		var date = new Date();
	    date.setFullYear(2015, Math.floor(Math.random() * 12), Math.floor(Math.random() * 27));
	    date.setHours(Math.floor(Math.random()*23), Math.floor(Math.random()*59), Math.floor(Math.random()*59), 0);
	    item["date"] = date;
	    if(count == 1 && isSpanReq)
		{
			item["date"] = {value: date,colspan: 3,style: spanStyle};
		}
		arrItems.push(item);
		
	}
	return arrItems;
}


</script>

</body>
</html>