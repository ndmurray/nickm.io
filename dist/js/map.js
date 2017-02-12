"use strict";
var margin = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 80
},
    w = parseInt(d3.select('#map-div').style('width'), 10),
    w = w - margin.left - margin.right,
    h = parseInt(d3.select('#map-div').style('height'), 10),
    h = h - margin.top - margin.bottom;
var parseDate = d3.timeParse("%Y");
var formatTime = d3.timeFormat("%Y");
var mapPath = d3.geoPath();
var unemployment = d3.map();
var svg = d3.select("#map-div").append("svg").attr("width", w + margin.left + margin.right).attr("height", h + margin.left + margin.right).attr("id", "map-canvas").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.queue().defer(d3.json, "https://d3js.org/us-10m.v1.json").defer(d3.csv, "/8step.io/production_data/employment_data/county_8.16.csv", function(d) {
  unemployment.set(d.id, +d.rate);
}).await(ready);
function ready(error, usa) {
  if (error) {
    console.log(error);
  } else {
    console.log(usa);
  }
  var mapData = function(d) {
    return d.rate;
  };
  var cScale = d3.scaleQuantile().domain(unemployment.values()).range(d3.schemeBlues[9]);
  svg.append("g").attr("class", "counties").selectAll("path").data(topojson.feature(usa, usa.objects.counties).features).enter().append("path").attr("d", mapPath).attr("fill", function(d) {
    return cScale(mapData = unemployment.get(d.id));
  });
}
;
