<!doctype html>
<html>
<head>
  <title>NSExpression Evaluator Demo</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <style>
	.container {
		margin: 50px;
		margin-top: 20px;
	}
	.text {
		height:200px;
		margin:0 0 10px;
	}
	.textarea {
		display:block;
		width:100%;
	}
  </style>
  	<script src="../lib/com/org/util/nsUtil.js"></script>
	<script type="text/javascript" src="../lib/com/org/util/nsExpressionEvaluator.js"></script>
</head>
<body>
	<header>
		<h1 style="padding-left: 28vw;"> NS Expression Evaluator Demo </h1>
	</header>
	<div class="container">
		<h2>Expression:</h2>
		<textarea id="expression" class="textarea text">persons[0].person1.age > 20 && gender === 'M'</textarea>

		<h2>Model / Data:</h2>
		<textarea id="model" class="textarea text">{"age": 20,"gender": "M", "persons": [{"person1": {"age": 21},"gender": "M"}]}</textarea>

		<button id="btnResult" onclick="resultHandler()">Result</button>

		<h2>Output:</h2>
		<pre id="result" class="text"></pre>
	</div>

	<script>
		let evaluator = null;
		function resultHandler() {
			const expression = document.querySelector('#expression').value.trim();
			if(!expression) {
				alert('Please enter a expression');
				return;
			}
			let model = document.querySelector('#model').value.trim();
			if(!model) {
				alert('Please enter a Model/Data');
				return;
			}
			try {
				model = toValidJSON(model);
				model = JSON.parse(model);
				model.getData = (age,gender) => {
					console.log("In getData ",age,gender);
					return `Age is ${age} for Gender ${gender}`;
				};
			} catch(e) {
				console.error(e);
				alert('Please enter a valid JSON Model/Data');
				return;
			}
			const res = document.querySelector('#result');
			res.innerHTML = '';
			try {
				if(!evaluator) {
					evaluator = new NSExpressionEvaluator({throwErrorForUndefined: true});
				}
				const result = evaluator.evaluate(expression, model);
				console.log(result);
				res.innerHTML = result;
			} catch(e) {
				console.error(e);
				alert('The data cannot be evaluated with this expression.');
				return;
			}
			
		}
		function toValidJSON(str) {
    		str = str.replace(/(\w+)(?=:)/g, '"$1"');
			console.log(str);
    		return str;
		}
	</script>
</body>
</html>