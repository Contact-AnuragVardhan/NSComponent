 var NSEditorUIFunc = (function()
{
	var NSEditorUIFunc = function(nsEditor,nsParentPluggin,setting)
	{
		this.__nsEditor = nsEditor;
		this.__nsParentPluggin = nsParentPluggin;
		this.__setting = setting;
		
		this.horizontalAlign = {left:"left",right:"right",center:"center",justify:"justify"};
		this.verticalAlign = {top:"top",middle:"middle",bottom:"bottom",normal:"delete"};
		
		this.__initialize = function()
		{
		};
		
		//horizontal Align section start
		this.setHorizontalAlignForNodes = function(alignment,arrNodes)
		{
			this.setAlignmentForNodes(alignment,arrNodes,this.horizontalAlign,"textAlign");
		};
		
		this.setHorizontalAlignForNode = function(alignment,node)
		{
			this.setAlignmentForNode(this.horizontalAlign,alignment,node,"textAlign");
		};
		
		this.clearHorizontalAlign = function(node)
		{
			this.clearAlign(node,"textAlign");
		};
		//horizontal Align section ends
		
		//vertical Align section starts
		this.setVerticalAlignForNodes = function(alignment,arrNodes)
		{
			var callback = null;
			if(alignment == "normal")
			{
				var self = this;
				callback = function(node)
				{
					if(node) 
					{
						self.clearVerticalAlign(node);
		            }
				};
			}
			this.setAlignmentForNodes(alignment,arrNodes,this.verticalAlign,"verticalAlign",callback)
		};
		
		this.setVerticalAlignForNode = function(alignment,node)
		{
			this.setAlignmentForNode(this.verticalAlign,alignment,node,"verticalAlign");
		};
		
		this.clearVerticalAlign = function(node)
		{
			this.clearAlign(node,"verticalAlign");
		};
		//vertical Align section ends
		
		this.setAlignmentForNodes = function(alignment,arrNodes,objAlign,styleProp,callback)
		{
			var self = this;
			var doc = this.__nsEditor.__getDocument();
			var win = this.__nsEditor.__getWindow();
    		var textArea = this.__nsEditor.__getTextArea();
    		callback = callback || function(node)
			{
				if(node) 
				{
					var parent = self.util.findParentByCallback(node,function(paramNode) 
					{ 
						return self.editorUtil.isBlock(paramNode,win); 
					},textArea);
		            if (!parent) 
		            {
		            	parent = self.editorUtil.wrapAllInlineSiblings(node,self.__nsEditor.__config.enterElement);
		            }
		            self.setAlignmentForNode(objAlign,alignment,parent,styleProp);
	            }
			};
			if(arrNodes && arrNodes.length)
			{
				for(var count = 0;count < arrNodes.length;count++)
				{
					callback(arrNodes[count]);
				}
			}
			else
			{
				this.selection.loopSelectedNodes(callback);
			}
		};
		
		this.setAlignmentForNode = function(objAlign,alignment,node,styleProp)
		{
			var doc = this.__nsEditor.__getDocument();
			var win = this.__nsEditor.__getWindow();
    		var textArea = this.__nsEditor.__getTextArea();
			if(alignment && this.util.isElement(node) && this.editorUtil.isNode(node,win))
			{
				this.clearAlign(node,styleProp);
				var align = objAlign[alignment.toLowerCase()];
				if(align)
				{
					node.style[styleProp] = align;
				}
			}
		};
		
		this.clearAlign = function(node,styleProp)
		{
			var self = this;
			var clearAlign = function(paramNode)
			{
				if (self.util.isElement(paramNode)) 
				{
					if (paramNode.style[styleProp]) 
					{
						paramNode.style[styleProp] = "";
						if (!paramNode.style.cssText.trim().length) 
						{
							paramNode.removeAttribute("style");
						}
					}
				}
			};
			if(node)
			{
				var arrChild = node.childNodes;
				for(var count = 0;count < arrChild.length;count++)
				{
					clearAlign(arrChild[count]);
				}
				clearAlign(node);
			}
		};
		
		this.__initialize();
	};
	
	NSEditor.prototype.registerUtil("uiFunc",NSEditorUIFunc);
	
	return NSEditorUIFunc;
})();
nsModuleExport(__nsGlobal,"NSEditorUIFunc",NSEditorUIFunc);