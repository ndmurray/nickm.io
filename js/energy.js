//General Use Variables

//Canvas Margin and dimensions 
var margin = {top: 20, right: 20, bottom: 20, left: 20}, 
	w = parseInt(d3.select('#wrapper').style('width'), 10), //get dimensions of container
	w = w - margin.left - margin.right,
	h = parseInt(d3.select('#wrapper').style('height')),
	h = h - margin.top - margin.bottom; 

//Line chart margin and dimensinos
var lineMargin = {top: 20, right: 20, bottom: 20, left: 80},
	lineW = parseInt(d3.select('#line-div').style('width'),10),
	lineW = lineW - lineMargin.left - lineMargin.right,
	lineH = parseInt(d3.select('#line-div').style('height'),10),
	lineH = lineH - lineMargin.top - lineMargin.bottom;

//Parse dates
var parseDate = d3.timeParse("%b-%y"),
    formatMonth = d3.timeFormat("%b-%y");

//Range X
var xScale = d3.scaleTime().range([0,lineW]);

//Range Y 
var yScale = d3.scaleLinear().range([lineH,0]);

//Dot Size
var dotRadius = "0.25em";

//Begin data function

d3.queue()
	.defer(d3.csv,"/8step.io/production_data/energy_data/energy_xstate.csv",
		function(d) {
		d.date = parseDate(d.date);
		d.mwh = +d.mwh;
		return d;
	})
	.await(ready);

function ready(error, data) {
	if (error) { console.log(error); } 
		else { console.log(data); }
	
//Data functions

	var timeData = data;
	//data variable that aggregates up mwh (with sum) across energy sources, it's for fun
	//Source - http://www.d3noob.org/2014/02/grouping-and-summing-data-using-d3nest.html
	var rollupData = d3.nest()
		.key(function(d) { return d.date; }) //Our new level of aggregation
		.rollup(function(d) { return d3.sum(d, function(g) { return g.mwh; }); }) //Sum mwh 
		.entries(timeData); //specify timeData as the source data

	console.log(rollupData); //You'll see in console that rollupData is an array of objects, each with two properties
	//"key" which will be date, and "value" which will be our summed mwh

	//add copes of key and value to the rollupData array for easy reference later
	rollupData.forEach(function(d) {
		d.dateAgg = d.key;
		d.dateAggParse = parseDate(d.dateAgg);
		d.mwhAgg = d.value;
	});

	console.log(rollupData); //You'll see timeAgg and mwhAgg properties have been added to each Object in rollupData

//Add domains to scales

	xScale.domain(d3.extent(rollupData, function(d) { return d.dateAgg; }));
	yScale.domain(d3.extent(rollupData, function(d) { return d.mwhAgg; })).nice();

//Define Axes
	var xAxis = d3.axisBottom().scale(xScale).tickFormat(formatMonth),
		yAxis = d3.axisLeft().scale(yScale);

//Define the line function
	var line = d3.line()
		.curve(d3.curveLinear)
		.x(function(d) { return xScale(d.dateAgg); })
		.y(function(d) { return yScale(d.mwhAgg); });

//Set up the line canvas

	var svg = d3.select("#line-div").append("svg")
		.attr("width", lineW + lineMargin.left + lineMargin.right)
		.attr("height", lineH + lineMargin.top + lineMargin.bottom)
		.attr("id", "line-canvas")
		.append("g")
			.attr("transform","translate(" + lineMargin.left + "," + lineMargin.top + ")");

//Default Chart elements

	//Line path
	var pathAll = svg.append("path")
		.datum(rollupData)
		.attr("d", line)
		.attr("fill","white")
		.attr("stroke","white");

//Call axes

	//Xaxis
	svg.append("g")
		.attr("class","axis x-axis")
		.attr("transform","translate(0," + lineH + ")")
		.call(xAxis);

	//Yaxis
	svg.append("g")
		.attr("class","axis y-axis")
		.call(yAxis);

}







