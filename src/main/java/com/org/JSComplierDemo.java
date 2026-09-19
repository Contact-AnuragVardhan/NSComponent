package com.org;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.org.util.FileMerger;


public class JSComplierDemo 
{
	private final String basePath = "D:\\New Workspace\\JSLib\\src\\main\\webapp\\";
	private final String baseJSURL = basePath + "lib\\com\\org\\";
	private final String baseCSSURL = basePath + "lib\\css\\com\\org\\";
	private final String outputURL = basePath + "generated\\";
	private final String outputJSURL = outputURL + "js\\";
	//private final String outputURL = basePath + "package\\";
	//private final String outputJSURL = outputURL + "##moduleName##\\";
	private final String outputCSSURL = outputURL + "css\\";
	//private final String outputCSSURL = outputURL + "##moduleName##\\";
	
	private FileMerger fileMerger = null;
	
	private String utilRef = "var nsutilRef = require('./nsUtil.min.js');\r\n" + 
			//"var nsModuleExport = nsutilRef.nsModuleExport;\r\n" + 
			"var NSUtil = nsutilRef.NSUtil;\r\n";
	
	private String svgRef = "var svgRef = require('./nsSVG.min.js');\r\n" + 
			"var NSSvg = svgRef.NSSvg;\r\n" + 
			"var NSSvgShapes = svgRef.NSSvgShapes;\r\n";
	
	private String plugginsRef = "var plugginsRef = require('./nsPluggins.min.js');\r\n" + 
			"var nsTextEditor = plugginsRef.nsTextEditor;\r\n" + 
			"var nsTextAreaEditor = plugginsRef.nsTextAreaEditor;\r\n" + 
			"var NSCellSelection = plugginsRef.NSCellSelection;\r\n" + 
			"var NSTableCellNavigator = plugginsRef.NSTableCellNavigator;\r\n";
	
	private String pintipRef = "var pintipRef = require('./nsPinTip.min.js');\r\n" + 
			"var NSPinTip = pintipRef.NSPinTip;\r\n";
	
	private String containerBaseRef = "var nscontainerbaseRef = require('./nsContainerBase.min.js');\r\n" + 
			"var nsExtendPrototype = nscontainerbaseRef.nsExtendPrototype;\r\n" + 
			"var NSContainerBase = nscontainerbaseRef.NSContainerBase;\r\n";
	
	private String consoleRef = "var nsconsoleRef = require('./nsConsole.min.js');\r\n" + 
			"var NSConsole = nsconsoleRef.NSConsole;\r\n";
	
	private String dateutilRef = "var dateutilRef = require('./nsDateUtil.min.js');\r\n" + 
					"var NSDateUtil = dateutilRef.NSDateUtil;\r\n";
	
			
	
	private void loadBaseJSFile() throws Exception
	{
		Map<String,String> mapJSFiles = new HashMap<String,String>();
		mapJSFiles.put("nsUtil", baseJSURL + "util\\nsUtil.js");
		mapJSFiles.put("nsSVG", baseJSURL + "util\\nsSVG.js");
		mapJSFiles.put("nsPluggins", baseJSURL + "util\\nsPluggins.js");
		mapJSFiles.put("nsPinTip", baseJSURL + "util\\nsPinTip.js");
		mapJSFiles.put("nsContainerBase", baseJSURL + "prototype\\base\\nsContainerBase.js");
		mapJSFiles.put("nsConsole", baseJSURL + "util\\nsConsole.js");
		mapJSFiles.put("nsDateUtil", baseJSURL + "util\\nsDateUtil.js");
		mapJSFiles.put("nsTouchToMouse", baseJSURL + "util\\nsTouchToMouse.js");
		
		Map<String,String> mapJSStartText = new HashMap<String,String>();
		mapJSStartText.put("nsSVG", utilRef);
		mapJSStartText.put("nsPluggins", utilRef);
		mapJSStartText.put("nsPinTip", utilRef);
		mapJSStartText.put("nsContainerBase", utilRef);
		mapJSStartText.put("nsConsole", utilRef);
		mapJSStartText.put("nsDateUtil", utilRef);
		mapJSStartText.put("nsTouchToMouse", utilRef);
		
		for(String key:mapJSFiles.keySet())
		{
			String inputFile = mapJSFiles.get(key);
			String[] arrOutput = inputFile.split("\\\\");
			String outputFileName = arrOutput[arrOutput.length - 1].replace(".js",".min.js");
			loadFile(new String[]{inputFile},null,outputJSURL.replaceAll("##moduleName##", key) + outputFileName,mapJSStartText.get(key));
		}
	}
	
	private void loadJSFile(String component) throws Exception
	{
		Map<String,String> mapJSFiles = new HashMap<String,String>();
		mapJSFiles.put("nsDividerBox", baseJSURL + "prototype\\nsDividerBox.js");
		mapJSFiles.put("nsBanner", baseJSURL + "containers\\nsBanner.js");
		mapJSFiles.put("nsProgressBar", baseJSURL + "containers\\nsProgressBar.js");
		mapJSFiles.put("nsGrid", baseJSURL + "prototype\\nsGrid.js");
		mapJSFiles.put("nsList", baseJSURL + "prototype\\nsList.js");
		mapJSFiles.put("nsTextBox", baseJSURL + "prototype\\nsTextBox.js");
		mapJSFiles.put("nsMenu", baseJSURL + "util\\nsMenu.js");
		mapJSFiles.put("nsPagination", baseJSURL + "util\\nsPagination.js");
		mapJSFiles.put("nsPanel", baseJSURL + "prototype\\nsPanel.js");
		mapJSFiles.put("nsDragDrop", baseJSURL + "util\\nsDragDrop.js");
		mapJSFiles.put("nsChart", baseJSURL + "prototype\\nsChart.js");
		mapJSFiles.put("nsModal", baseJSURL + "containers\\nsModal.js");
		mapJSFiles.put("nsExport", baseJSURL + "util\\nsExport.js");
		mapJSFiles.put("nsFilter", baseJSURL + "util\\nsFilter.js");
		mapJSFiles.put("nsFlatGrid", baseJSURL + "util\\nsFlatGrid.js");
		mapJSFiles.put("nsHierarchicalGrid", baseJSURL + "util\\nsHierarchicalGrid.js");
		mapJSFiles.put("nsGroupingGrid", baseJSURL + "util\\nsGroupingGrid.js");
		mapJSFiles.put("nsMasterDetailGrid", baseJSURL + "util\\nsMasterDetailGrid.js");
		mapJSFiles.put("nsGridPluggins", baseJSURL + "util\\nsGridPluggins.js");
		mapJSFiles.put("nsBarChart", baseJSURL + "util\\nsBarChart.js");
		mapJSFiles.put("nsPieChart", baseJSURL + "util\\nsPieChart.js");
		mapJSFiles.put("nsLineChart", baseJSURL + "util\\nsLineChart.js");
		mapJSFiles.put("nsDonutChart", baseJSURL + "util\\nsDonutChart.js");
		mapJSFiles.put("nsNavigation", baseJSURL + "prototype\\nsNavigation.js");
		mapJSFiles.put("nsHorizontalNavigation", baseJSURL + "prototype\\nsHorizontalNavigation.js");
		mapJSFiles.put("nsRouter", baseJSURL + "util\\nsRouter.js");
		mapJSFiles.put("nsMessageBox", baseJSURL + "util\\nsMessageBox.js");
		mapJSFiles.put("nsCalendar", baseJSURL + "prototype\\nsCalendar.js");
		mapJSFiles.put("nsDatePicker", baseJSURL + "prototype\\nsDatePicker.js");
		mapJSFiles.put("nsZip", baseJSURL + "util\\nsZip.js");
		mapJSFiles.put("nsXlsxExport", baseJSURL + "util\\nsXlsxExport.js");
		mapJSFiles.put("nsModalManager", baseJSURL + "util\\nsModalManager.js");
		mapJSFiles.put("nsMultiSelectDropdown", baseJSURL + "prototype\\nsMultiSelectDropdown.js");
		mapJSFiles.put("nsTableRowMover", baseJSURL + "util\\nsTableRowMover.js");
		mapJSFiles.put("nsNumericTextBox", baseJSURL + "util\\nsNumericTextBox.js");
		mapJSFiles.put("nsCarousel", baseJSURL + "util\\nsCarousel.js");
		mapJSFiles.put("nsTabNavigator", baseJSURL + "prototype\\nsTabNavigator.js");
		mapJSFiles.put("nsScrollAnimator", baseJSURL + "util\\nsScrollAnimator.js");
		mapJSFiles.put("nsAjax", baseJSURL + "util\\nsAjax.js");
		mapJSFiles.put("nsEvent", baseJSURL + "util\\nsEvent.js");
		mapJSFiles.put("nsTouchToMouse", baseJSURL + "util\\nsTouchToMouse.js");
		mapJSFiles.put("nsScroller", baseJSURL + "util\\nsScroller.js");
		mapJSFiles.put("nsDocxExport", baseJSURL + "util\\nsDocxExport.js");
		mapJSFiles.put("nsVirtualScroll", baseJSURL + "util\\nsVirtualScroll.js");
		mapJSFiles.put("nsFloatingLabel", baseJSURL + "util\\nsFloatingLabel.js");
		mapJSFiles.put("nsPromise", baseJSURL + "util\\nsPromise.js");
		mapJSFiles.put("nsDashboard", baseJSURL + "util\\nsDashboard.js");
		mapJSFiles.put("nsExpressionEvaluator", baseJSURL + "util\\nsExpressionEvaluator.js");
		
		mapJSFiles.put("nsEditor", baseJSURL + "prototype\\nsEditor.js");
		mapJSFiles.put("nsResizableTable", baseJSURL + "util\\nsResizableTable.js");
		mapJSFiles.put("nsTablePicker", baseJSURL + "util\\nsTablePicker.js");
		mapJSFiles.put("nsTableUtil", baseJSURL + "util\\nsTableUtil.js");
		mapJSFiles.put("nsEditorEditorUtil", baseJSURL + "util\\editor\\modules\\editorUtil\\js\\editorUtil.js");
		mapJSFiles.put("nsEditorToolbar", baseJSURL + "util\\editor\\modules\\toolbar\\toolbar.js");
		mapJSFiles.put("nsEditorSelection", baseJSURL + "util\\editor\\modules\\selection\\selection.js");
		mapJSFiles.put("nsEditorExecCommand", baseJSURL + "util\\editor\\modules\\execCommand\\js\\execCommand1.js");
		mapJSFiles.put("nsEditorStack", baseJSURL + "util\\editor\\modules\\stack\\stack.js");
		mapJSFiles.put("nsEditorModal", baseJSURL + "util\\editor\\util\\modal\\js\\modal.js");
		mapJSFiles.put("nsEditorInlinePopup", baseJSURL + "util\\editor\\util\\inlinePopup\\js\\inlinePopup.js");
		mapJSFiles.put("nsEditorUIFunc", baseJSURL + "util\\editor\\util\\uiFunc\\js\\uiFunc.js");
		mapJSFiles.put("nsEditorPlugginFullScreen", baseJSURL + "util\\editor\\plugins\\fullScreen\\js\\fullScreen.js");
		//mapJSFiles.put("nsEditorPlugginPaste", baseJSURL + "util\\editor\\plugins\\paste\\js\\paste.js");
		mapJSFiles.put("nsEditorPlugginResize", baseJSURL + "util\\editor\\plugins\\resize\\js\\resize.js");
		mapJSFiles.put("nsEditorLink", baseJSURL + "util\\editor\\plugins\\link\\js\\link.js");
		mapJSFiles.put("nsEditorTable", baseJSURL + "util\\editor\\plugins\\table\\js\\table.js");
		mapJSFiles.put("nsEditorFooterComp", baseJSURL + "util\\editor\\plugins\\footerComp\\js\\footerComp.js");
		mapJSFiles.put("nsEditorElementResizer", baseJSURL + "util\\editor\\plugins\\elementResizer\\js\\elementResizer.js");
		mapJSFiles.put("nsEditorTablePluggins", baseJSURL + "util\\editor\\plugins\\tablePluggins\\js\\tablePluggins.js");
		mapJSFiles.put("nsEditorSearchReplace", baseJSURL + "util\\editor\\plugins\\searchReplace\\js\\searchReplace.js");
		
		
		
		
		Map<String,String[]> mapJSDependency = new HashMap<String,String[]>();
		mapJSDependency.put("nsProgressBar",new String[]{"nsModal"});
		mapJSDependency.put("nsGrid",new String[]{"nsMenu","nsPagination","nsExport","nsFilter","nsTouchToMouse","nsVirtualScroll","nsFlatGrid","nsHierarchicalGrid","nsGroupingGrid","nsMasterDetailGrid","nsGridPluggins","nsList"});
		mapJSDependency.put("nsList",new String[]{"nsDragDrop","nsFilter","nsMenu","nsVirtualScroll"});
		mapJSDependency.put("nsTextBox",new String[]{"nsList","nsFilter"});
		mapJSDependency.put("nsChart",new String[]{"nsBarChart","nsPieChart","nsLineChart","nsDonutChart"});
		mapJSDependency.put("nsMessageBox",new String[]{"nsPanel"});
		mapJSDependency.put("nsDatePicker",new String[]{"nsCalendar"});
		mapJSDependency.put("nsModalManager",new String[]{"nsMessageBox,nsPanel"});
		mapJSDependency.put("nsTabNavigator",new String[]{"nsCarousel","nsScrollAnimator"});
		mapJSDependency.put("nsScroller",new String[]{"nsScrollAnimator"});
		mapJSDependency.put("nsXlsxExport",new String[]{"nsZip"});
		mapJSDependency.put("nsDocxExport",new String[]{"nsZip"});
		mapJSDependency.put("nsNavigation",new String[]{"nsFilter","nsFloatingLabel"});
		mapJSDependency.put("nsDashboard",new String[]{"nsPanel"});
		mapJSDependency.put("nsMultiSelectDropdown",new String[]{"nsFilter"});
		//"nsEditorPlugginPaste"
		mapJSDependency.put("nsEditor",new String[]{"nsResizableTable","nsTablePicker","nsTableUtil","nsEditorEditorUtil","nsEditorToolbar","nsEditorSelection",
				"nsEditorExecCommand","nsEditorStack","nsEditorModal","nsEditorInlinePopup","nsEditorUIFunc","nsEditorPlugginFullScreen",
				"nsEditorPlugginResize","nsEditorLink","nsEditorTable","nsEditorFooterComp","nsEditorElementResizer","nsEditorTablePluggins","nsEditorSearchReplace"});
		
		String startText = utilRef + containerBaseRef;
		String dependenciesText = startText + svgRef + plugginsRef + dateutilRef;
		String gridRef = "var gridRef = require('./nsGrid.min.js');\r\n" + 
				"var NSGrid = gridRef.NSGrid;\r\n";
		Map<String,String> mapJSStartText = new HashMap<String,String>();
		mapJSStartText.put("nsDividerBox", startText);
		//mapJSStartText.put("nsBanner", baseJSURL + "containers\\nsBanner.js");
		//mapJSStartText.put("nsProgressBar", baseJSURL + "containers\\nsProgressBar.js");
		mapJSStartText.put("nsGrid", dependenciesText);
		mapJSStartText.put("nsList", dependenciesText);
		mapJSStartText.put("nsTextBox", dependenciesText + gridRef);
		mapJSStartText.put("nsMenu", dependenciesText);
		mapJSStartText.put("nsPagination", dependenciesText);
		mapJSStartText.put("nsPanel", dependenciesText);
		mapJSStartText.put("nsDragDrop", dependenciesText);
		//mapJSStartText.put("nsChart", baseJSURL + "prototype\\nsChart.js");
		mapJSStartText.put("nsModal", dependenciesText);
		mapJSStartText.put("nsExport", dependenciesText);
		mapJSStartText.put("nsFilter", utilRef);
		/*mapJSStartText.put("nsBarChart", baseJSURL + "util\\nsBarChart.js");
		mapJSStartText.put("nsPieChart", baseJSURL + "util\\nsPieChart.js");
		mapJSStartText.put("nsLineChart", baseJSURL + "util\\nsLineChart.js");
		mapJSStartText.put("nsDonutChart", baseJSURL + "util\\nsDonutChart.js");*/
		mapJSStartText.put("nsNavigation", dependenciesText);
		mapJSStartText.put("nsHorizontalNavigation", utilRef);
		mapJSStartText.put("nsRouter", startText);
		mapJSStartText.put("nsMessageBox", dependenciesText);
		mapJSStartText.put("nsCalendar", dependenciesText);
		mapJSStartText.put("nsDatePicker", dependenciesText);
		mapJSStartText.put("nsZip", dependenciesText);
		mapJSStartText.put("nsXlsxExport", utilRef);
		mapJSStartText.put("nsModalManager", dependenciesText);
		mapJSStartText.put("nsMultiSelectDropdown", dependenciesText);
		mapJSStartText.put("nsTableRowMover", dependenciesText);
		mapJSStartText.put("nsNumericTextBox", dependenciesText);
		mapJSStartText.put("nsTabNavigator", startText);
		mapJSStartText.put("nsAjax", utilRef);
		mapJSStartText.put("nsEvent", utilRef);
		mapJSStartText.put("nsEditor", startText);
		mapJSStartText.put("nsScroller", startText);
		mapJSStartText.put("nsDocxExport", utilRef);
		mapJSStartText.put("nsVirtualScroll", utilRef);
		mapJSStartText.put("nsPromise", utilRef);
		mapJSStartText.put("nsDashboard", dependenciesText);
		mapJSStartText.put("nsExpressionEvaluator", utilRef);
		
		
		String[] arrMainFileFirst = {"nsEditor"};
		
		boolean isMainFileFirst = false;
		for(String file: arrMainFileFirst)
		{
			if(file.equalsIgnoreCase(component))
			{
				isMainFileFirst = true;
				break;
			}
		}
		
		List<String> lstInput = new ArrayList<String>();
		if(isMainFileFirst)
		{
			lstInput.add(mapJSFiles.get(component));
		}
		if(mapJSDependency.containsKey(component))
		{
			String[] arrFile = mapJSDependency.get(component);
			if(arrFile != null && arrFile.length > 0)
			{
				for(String file:arrFile)
				{
					lstInput.add(mapJSFiles.get(file));
				}
			}
		}
		if(!isMainFileFirst)
		{
			lstInput.add(mapJSFiles.get(component));
		}
		loadFile(lstInput.toArray(new String[0]),null,outputJSURL.replaceAll("##moduleName##", component) + component + ".min.js",mapJSStartText.get(component));
	}
	
	private void loadBaseCSSFile() throws Exception
	{
		Map<String,String> mapCSSFiles = new HashMap<String,String>();
		mapCSSFiles.put("component", baseCSSURL + "nsComponent.css");
		mapCSSFiles.put("nsPinTip", baseCSSURL + "nsPinTip.css");
		
		for(String key:mapCSSFiles.keySet())
		{
			String inputFile = mapCSSFiles.get(key);
			String[] arrOutput = inputFile.split("\\\\");
			String outputFileName = arrOutput[arrOutput.length - 1].replace(".css",".min.css");
			loadFile(new String[]{inputFile},null,outputCSSURL.replaceAll("##moduleName##", key) + outputFileName,null);
		}
	}
	
	private void loadCSSFile(String component) throws Exception
	{
		Map<String,String> mapCSSFiles = new HashMap<String,String>();
		mapCSSFiles.put("nsMenu", baseCSSURL + "nsMenu.css");
		mapCSSFiles.put("nsPagination", baseCSSURL + "nsPagination.css");
		mapCSSFiles.put("nsModal", baseCSSURL + "nsModal.css");
		mapCSSFiles.put("nsProgressBar", baseCSSURL + "nsProgressBar.css");
		mapCSSFiles.put("nsProgressBar", baseCSSURL + "nsProgressBar.css");
		mapCSSFiles.put("nsGrid", baseCSSURL + "nsGrid.css");
		mapCSSFiles.put("nsList", baseCSSURL + "nsList.css");
		mapCSSFiles.put("nsTextBox", baseCSSURL + "nsTextBox.css");
		mapCSSFiles.put("nsPanel", baseCSSURL + "nsPanel.css");
		mapCSSFiles.put("nsNavigation", baseCSSURL + "nsNavigation.css");
		mapCSSFiles.put("nsHorizontalNavigation", baseCSSURL + "nsHorizontalNavigation.css");
		mapCSSFiles.put("nsMessageBox", baseCSSURL + "nsMessageBox.css");
		mapCSSFiles.put("nsCalendar", baseCSSURL + "nsCalendar.css");
		mapCSSFiles.put("nsDatePicker", baseCSSURL + "nsDatePicker.css");
		mapCSSFiles.put("nsMultiSelectDropdown", baseCSSURL + "nsMultiSelectDropdown.css");
		mapCSSFiles.put("nsNumericTextBox", baseCSSURL + "nsNumericTextBox.css");
		mapCSSFiles.put("nsCarousel", baseCSSURL + "nsCarousel.css");
		mapCSSFiles.put("nsTabNavigator", baseCSSURL + "nsTabNavigator.css");
		mapCSSFiles.put("nsScroller", baseCSSURL + "nsScroller.css");
		mapCSSFiles.put("nsVirtualScroll", baseCSSURL + "nsVirtualScroll.css");
		mapCSSFiles.put("nsFloatingLabel", baseCSSURL + "nsFloatingLabel.css");
		mapCSSFiles.put("nsDashboard", baseCSSURL + "nsDashboard.css");
		
		
		mapCSSFiles.put("nsEditor", baseCSSURL + "nsEditor.css");
		mapCSSFiles.put("nsTablePicker", baseCSSURL + "nsTablePicker.css");
		
		mapCSSFiles.put("nsEditorModal", baseJSURL + "util\\editor\\util\\modal\\css\\modal.css");
		mapCSSFiles.put("nsEditorInlinePopUp", baseJSURL + "util\\editor\\util\\inlinePopup\\css\\inlinePopup.css");
		mapCSSFiles.put("nsEditorPlugginFullScreen", baseJSURL + "util\\editor\\plugins\\fullScreen\\css\\fullScreen.css");
		mapCSSFiles.put("nsEditorPlugginResize", baseJSURL + "util\\editor\\plugins\\resize\\css\\resize.css");
		mapCSSFiles.put("nsEditorPlugginLink", baseJSURL + "util\\editor\\plugins\\link\\css\\link.css");
		mapCSSFiles.put("nsEditorPlugginTable", baseJSURL + "util\\editor\\plugins\\table\\css\\table.css");
		mapCSSFiles.put("nsEditorPlugginFooterComp", baseJSURL + "util\\editor\\plugins\\footerComp\\css\\footerComp.css");
		mapCSSFiles.put("nsEditorPlugginElementResizer", baseJSURL + "util\\editor\\plugins\\elementResizer\\css\\elementResizer.css");
		mapCSSFiles.put("nsEditorPlugginTablePluggins", baseJSURL + "util\\editor\\plugins\\tablePluggins\\css\\tablePluggins.css");
		mapCSSFiles.put("nsEditorPlugginSearchReplace", baseJSURL + "util\\editor\\plugins\\searchReplace\\css\\searchReplace.css");
		
		Map<String,String[]> mapDependency = new HashMap<String,String[]>();
		mapDependency.put("nsProgressBar",new String[]{"nsModal","nsProgressBar"});
		mapDependency.put("nsGrid",new String[]{"nsGrid","nsMenu","nsPagination","nsVirtualScroll","nsList"});
		mapDependency.put("nsList",new String[]{"nsList","nsMenu","nsVirtualScroll"});
		mapDependency.put("nsTextBox",new String[]{"nsList","nsTextBox"});
		mapDependency.put("nsMenu",new String[]{"nsMenu"});
		mapDependency.put("nsPanel",new String[]{"nsPanel"});
		mapDependency.put("nsNavigation",new String[]{"nsFloatingLabel","nsNavigation"});
		mapDependency.put("nsHorizontalNavigation",new String[]{"nsHorizontalNavigation"});
		mapDependency.put("nsPagination",new String[]{"nsPagination"});
		mapDependency.put("nsMessageBox",new String[]{"nsPanel","nsMessageBox"});
		mapDependency.put("nsCalendar",new String[]{"nsCalendar"});
		mapDependency.put("nsDatePicker",new String[]{"nsCalendar","nsDatePicker"});
		mapDependency.put("nsMultiSelectDropdown",new String[]{"nsMultiSelectDropdown"});
		mapDependency.put("nsNumericTextBox",new String[]{"nsNumericTextBox"});
		mapDependency.put("nsTabNavigator",new String[]{"nsCarousel","nsTabNavigator"});
		mapDependency.put("nsScroller",new String[]{"nsScroller"});
		mapDependency.put("nsVirtualScroll",new String[]{"nsVirtualScroll"});
		mapDependency.put("nsDashboard",new String[]{"nsPanel","nsDashboard"});
		mapDependency.put("nsEditor",new String[]{"nsEditor","nsTablePicker","nsEditorModal","nsEditorInlinePopUp","nsEditorPlugginFullScreen","nsEditorPlugginResize",
				"nsEditorPlugginLink","nsEditorPlugginTable","nsEditorPlugginFooterComp","nsEditorPlugginElementResizer","nsEditorPlugginTablePluggins",
				"nsEditorPlugginSearchReplace"});
		
		List<String> lstInput = new ArrayList<String>();
		if(mapDependency.containsKey(component))
		{
			String[] arrFile = mapDependency.get(component);
			if(arrFile != null && arrFile.length > 0)
			{
				for(String file:arrFile)
				{
					lstInput.add(mapCSSFiles.get(file));
				}
			}
		}
		loadFile(lstInput.toArray(new String[0]),null,outputCSSURL.replaceAll("##moduleName##", component) + component + ".min.css",null);
	}
	
	private void loadFile(String[] arrInputFile,String[] arrExternalFile,String outputFile,String startText) throws Exception
	{
		if(fileMerger == null)
		{
			fileMerger = new FileMerger();
		}
		fileMerger.compressFiles(arrInputFile, outputFile, startText);
	}
	
	public static void main(String[] args) throws Exception
	{
		JSComplierDemo objCompiler = new JSComplierDemo();
		String[] arrComponent = {"nsProgressBar","nsGrid","nsList","nsDividerBox","nsNavigation","nsHorizontalNavigation","nsPagination","nsExport","nsRouter","nsMessageBox","nsCalendar","nsDatePicker","nsTextBox",
				"nsXlsxExport","nsMultiSelectDropdown","nsTableRowMover","nsNumericTextBox","nsTabNavigator","nsAjax","nsEvent","nsEditor","nsScroller","nsDocxExport","nsVirtualScroll","nsPromise",
				"nsDashboard","nsPanel","nsExpressionEvaluator"};
		objCompiler.loadBaseJSFile();
		objCompiler.loadBaseCSSFile();
		for(String component:arrComponent)
		{
			objCompiler.loadJSFile(component);
			objCompiler.loadCSSFile(component);
		}
	}
}