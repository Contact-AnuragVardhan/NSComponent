<div>
 	<input type="text" value="{{tempName.name}}"  data-nsbind-show="{{tempName.show}}">
	<span data-nsbind-style="color:{{tempColor}}">{{tempName.name}}</span>
	<input type="text" onchange="{{nameChange}}"></input>
	<button onclick="{{changeColor}}">Click</button>
	<button onclick="{{changeArray}}">Change</button>
	<ul>
          <li nsbind-repeater="{{country in countries}}">
            <strong>  Country Name : </strong> {{country..name}} -
            <strong>  Country Code : </strong> {{country..code}}
			<strong>  color : </strong> {{tempColor}}
            <input type="text" value="{{country..name}}">
            <input type="text" value="{{country..code}}">
          </li>
    </ul>
    <ns-include url="child/childLevel1.jsp" controller="childLevel1Controller">
	</ns-include>
	<ns-include url="child/childLevel2.jsp" controller="childLevel2Controller">
	</ns-include>
</div>