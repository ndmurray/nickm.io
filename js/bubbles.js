d3.csv("datadev/crime.csv",function(error,data) {

			
			if(error) {
				console.log(error)
			} else {
				console.log(data)
			};

			//General use variables

			var crimeData = data;
			//Margin, height, and width by Bostock's margin convention http://bl.ocks.org/mbostock/3019563
			var margin = {top: 40, right: 40, bottom: 60, left: 60};
			var w = 740 - margin.left - margin.right;
			var h = 740 - margin.left - margin.right;
			var aToR = function(a) {
				return Math.sqrt(a/3.14)
			}; //converts value we want to use as area to radius. It was defined by hubris, and by mistake, notice it's never used.
			var xAxisPadding = 30;
			var yAxisPadding = -30;
			//Object constancy
			var key = function(d) {
				return d.key;
			};

			//Canvas

			var svg = d3.select("body").append("svg")
				.attr({
					height: h + margin.top + margin.bottom,
					width: w + margin.left + margin.right
				})
			.append("g") //see http://bl.ocks.org/mbostock/3019563
				.attr({
					"transform": "translate(" + margin.left + "," + margin.top + ")"
				});

			//Clipping path

			var clippingPath = svg.append("clipPath")
				.attr({
					id: "chart-area"
				})
				.append("rect")
					.attr({
						x: 1 - xAxisPadding,
						y: 1 - yAxisPadding, //1 - axis padding to cut of elements not at axis, but 1px before
						width: w,
						height: h
					});
			
			//Scales

			var xScale = d3.scale.linear()
				.domain([0,d3.max(crimeData,function(d) {
					return +d.rape100k;
				})])
				.range([0, w]);
				//min of 20 to stick with our 20px left margin, same goes for right margin (w - 20)

			var yScale = d3.scale.linear()
				.domain([0,d3.max(crimeData,function(d) {
					return +d.murder100k;
				})])
				.range([h, 0])
				//Padding applied similar to xScale

			var rScale = d3.scale.linear()
				.domain([d3.min(crimeData,function(d) {
							return +d.Pop;
					  }),d3.max(crimeData,function(d) {
					  		return +d.Pop;
					  })])
				.range([5,50]);//arbitrary output range		

			//Define Axes

			var xAxis = d3.svg.axis()	
				.scale(xScale)
				.orient("bottom")
				.ticks(5);

			var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient("left")
				.ticks(5);	

			//Bubbles

			var bubbles = svg.append("g")
				.attr({
					id: "bubbles-group",
					"clip-path": "url(#chart-area)"
				})
					.selectAll("circle")
					.data(crimeData,key)
					.enter()
					.append("circle")
					.attr({
						cx: function(d) {
							return xScale(+d.rape100k);
						},
						cy: function(d) {
							return yScale(+d.murder100k);
						},
						r: function(d) {
							return rScale(+d.Pop);
						},
						class: "bubbles",
						"fill": "rgb(179,120,211)"

					});

			//Call x Axis

			svg.append("g")
				.attr({
					class: "xaxis",
					transform: "translate(0," + (h + xAxisPadding) + ")" //offset padding from the minimum y posiiton of bubble
				})
				.call(xAxis);

			//Call y Axis

			svg.append("g")
				.attr({
					class: "yaxis",
					transform: "translate(" + yAxisPadding + ",0)" //offset 26 px from minimum x position of bubble
				})
				.call(yAxis);





		});