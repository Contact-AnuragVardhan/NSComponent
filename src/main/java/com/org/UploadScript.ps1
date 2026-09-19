$targDir = "F:\New Workspace\JSLib\src\main\webapp\package";
$subDir = $(Get-ChildItem "$targDir");
$arrComponent = @("nsUtil","nsContainerBase","nsSVG","nsPluggins","nsPinTip","nsConsole","nsDateUtil","nsGrid","nsList","nsDividerBox","nsNavigation","nsHorizontalNavigation","nsPagination","nsExport","nsRouter","nsMessageBox","nsDatePicker","nsTextBox","nsXlsxExport","nsMultiSelectDropdown","nsTableRowMover","nsNumericTextBox","nsTabNavigator","nsEvent","nsEditor","nsScroller","nsDocxExport","nsVirtualScroll","nsPromise","nsDashboard","nsPanel");

function isComponentExists
{
    $componentName = $args[0];
    foreach($comp in $arrComponent)
    {
        If ($componentName  -eq $comp)
        {
            return 1;
        }
    }
    return 0;
}

function uploadInNPM
{
    $componentName = $args[0];
    $path = -join($targDir,"\",$componentName);
    log $path;
    cd $path;
    npm publish;
}

function log
{
    $message = $args[0];
    $message | Add-Content F:\npmPowerShell.txt
}

cd $targDir;

foreach($sub in $subDir) 
{
	$compName = $sub.Name;
    If (isComponentExists $compName -eq 1)
    {
        uploadInNPM $compName;
    }
    cd $targDir;
}