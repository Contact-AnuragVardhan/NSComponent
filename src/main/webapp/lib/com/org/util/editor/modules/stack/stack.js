 var NSStack = (function()
{
	var NSStack = function(nsEditor)
	{
		this.__nsEditor = nsEditor;
		this.util = nsEditor.util;
		this.editorUtil = nsEditor.editorUtil;
		
		this.arrCommands = [];
        this.index = -1;
		
		this.__initialize = function()
		{
			
		};
		
		this.clearRedo = function() 
		{
	        this.arrCommands.length = this.index + 1;
	    };
	    
	    this.clear = function() 
	    {
	        this.arrCommands.length = 0;
	        this.index = -1;
	    };
	    
	    this.push = function(command) 
	    {
	        this.clearRedo();
	        this.arrCommands.push(command);
	        this.index += 1;
	    };
	    
	    this.undo = function() 
	    {
	        if(this.canUndo()) 
	        {
	            if (this.arrCommands[this.index]) 
	            {
	                this.arrCommands[this.index].undo();
	            }
	            this.index -= 1;
	            return true;
	        }
	        return false;
	    };
	    
	    this.redo = function() 
	    {
	        if (this.canRedo()) 
	        {
	            this.index += 1;
	            if (this.arrCommands[this.index]) 
	            {
	                this.arrCommands[this.index].redo();
	            }
	            return true;
	        }
	        return false;
	    };
	    
	    this.canUndo = function () 
	    {
	        return this.index >= 0;
	    };
	    
	    this.canRedo = function () 
	    {
	        return this.index < this.arrCommands.length - 1;
	    };
		
		this.__initialize();
	};
		
	return NSStack;
})();
nsModuleExport(__nsGlobal,"NSStack",NSStack);