"use strict";var margin={top:40,right:140,bottom:60,left:60},w=parseInt(d3.select("#scatter-div").style("width"),10),w=w-margin.left-margin.right,h=parseInt(d3.select("#scatter-div").style("height"),10),h=h-margin.top-margin.bottom,canvasPadding={top:10,right:10,bottom:10,left:60},textShift=0,dotsShiftX=0,dotsShiftY=0,xaxisShiftX=60,yaxisShiftX=50,xaxisShiftY=-50,yaxisShiftY=0,infoTop=115,infoLeft=w+margin.left,infoWidth="13em",infoHeight="26.65em";d3.csv("/8step.io/production_data/world_data/datadev/world.csv",function(error,data){error?console.log(error):console.log(data);var worldData=data,key=function(t,e){return t.country},dataX=function(t){return+t.polistab},dataY=function(t){return+t.press},dataR=function(t){return+t.gdphead};console.log(dataX.toString());var titleX="Political Stabtility",titleY="Press Freedom",titleR="GDP per Capita",citeX="An index from -2.5 to 2.5, 2.5 being the most stable, sourced from the Word Bank's <a href='http://databank.worldbank.org/data/reports.aspx?source=world-development-indicators' target='_blank'>World development indicators</a>.",citeY="An annual rating of press freedom at the country level, 1 being the most free, 100 being the least. Sourced from <a href='https://.org/en/ranking' target='_blank'>Reporters Without Borders</a>.",titleText=d3.select("h3#chart-subhead").append("text").attr("class","title-text").text(titleX+" vs. "+titleY+", dots sized by GDP per capita."),dotTips=d3.tip().attr("class","d3-tip").style({top:infoTop,left:infoLeft,width:infoWidth,"background-color":"transparent",opacity:0}).direction("e").html(function(t){return"<p id='tiphead'>"+t.country+"</p><p id='region'>"+t.region+"</span></p><p>"+titleX+"<p class='tip-value'>"+dataX(t)+"</p><p>"+titleY+"</p><p class='tip-value'>"+dataY(t)+"</p><div id='citation'><div class='citation-title'>"+titleX+"</div><br />"+citeX+"<br /><br /><div class='citation-title'>"+titleY+"</div><br />"+citeY+"</div>"}),svg=d3.select("#scatter-div").append("svg").attr({width:w+margin.left+margin.right,height:h+margin.top+margin.bottom,id:"canvas"}).append("g").attr({transform:"translate("+margin.left+","+margin.top+")"}),xScale=d3.scale.linear().domain([d3.min(worldData,function(t){return dataX(t)}),d3.max(worldData,function(t){return dataX(t)})]).range([xaxisShiftX,w]).nice(),yScale=d3.scale.linear().domain([d3.max(worldData,function(t){return dataY(t)}),d3.min(worldData,function(t){return dataY(t)})]).range([0,h+xaxisShiftY]).nice(),rScale=d3.scale.linear().domain([0,d3.max(worldData,function(t){return dataR(t)})]).range([4,40]).nice(),colorScale=d3.scale.ordinal().domain(["Low","Lower Middle","Upper Middle","High, Non-OECD","High, OECD"]).range(["#991766","#D90F5A","#F34739","#FF6E27","#FFB627"]),xAxis=d3.svg.axis().scale(xScale).orient("bottom"),yAxis=d3.svg.axis().scale(yScale).orient("left"),guideLines=function(t){svg.append("g").classed("guide",!0).append("line").attr("y1",d3.select(".a-dot").attr("cy")).attr("y2",d3.select(".a-dot").attr("cy")).attr("x1",yaxisShiftX).attr("x2",d3.select(".a-dot").attr("cx")).attr("stroke",d3.select(".a-dot").attr("fill")),svg.append("g").classed("guide",!0).append("line").attr("y1",h+xaxisShiftY).attr("y2",d3.select(".a-dot").attr("cy")).attr("x1",d3.select(".a-dot").attr("cx")).attr("x2",d3.select(".a-dot").attr("cx")).attr("stroke",d3.select(".a-dot").attr("fill"))},mouseOn=function(){d3.select(this).attr("opacity",1).classed("a-dot",!0).classed("dots",!1),guideLines(),d3.selectAll("circle.dots").attr("opacity",.15),d3.select(".d3-tip").style("background-color",d3.select(".a-dot").attr("fill")).style("color",d3.select(".a-dot").attr("stroke")).style("opacity",.5)},mouseOff=function(){d3.select(this).classed("a-dot",!1).classed("dots",!0),d3.selectAll(".guide").remove(),d3.selectAll("circle.dots").attr("opacity",.85)},dotsGroup=svg.append("g").attr({id:"dots-group"}),dotsFilter=dotsGroup.append("defs").append("filter").attr({id:"dots-filter",x:0,y:0,width:"200%",height:"200%"}),shadowOffset=dotsFilter.append("feOffset").attr({result:"offOut",in:"SourceGraphic",dx:20,dy:20}),shadowBlend=dotsFilter.append("feBlend").attr({in:"SourceGraphic",in2:"offOut",mode:"normal"}),dots=d3.select("#dots-group").selectAll("circle").data(worldData,key).enter().append("circle").filter(function(t){return dataX(t)}).filter(function(t){return dataY(t)}).filter(function(t){return dataR(t)}).attr({class:"dots",id:function(t){return t.country},cx:function(t){return xScale(dataX(t))},cy:function(t){return yScale(dataY(t))},r:function(t){return rScale(dataR(t))},"pointer-events":"all",fill:function(t){return"High income: nonOECD"==t.ig?"#FF6E27":"Low income"==t.ig?"#991766":"Upper middle income"==t.ig?"#F34739":"Lower middle income"==t.ig?"#D90F5A":"High income: OECD"==t.ig?"#FFB627":"black"},stroke:function(t){return"High income: nonOECD"==t.ig?"#1A1F1E":"Low income"==t.ig?"#1A1F1E":"Upper middle income"==t.ig?"#1A1F1E":"Lower middle income"==t.ig?"#1A1F1E":"High income: OECD"==t.ig?"#1A1F1E":"black"},"stroke-width":0,opacity:.85}).style({}).call(dotTips).on("mouseenter",dotTips.show).on("mouseover",mouseOn).on("mouseleave",dotTips.hide).on("mouseout",mouseOff);svg.append("g").attr({class:"xaxis",transform:"translate(0,"+(h+xaxisShiftY)+")"}).call(xAxis);var xLabel=svg.append("text").attr({class:"x-label","text-anchor":"middle",transform:function(t){return"translate("+w/2+","+h+")"}}).text(titleX);svg.append("g").attr({class:"yaxis",transform:"translate("+yaxisShiftX+",0)"}).call(yAxis);var yLabel=svg.append("text").attr({class:"y-label","text-anchor":"middle",transform:function(t){return"translate(10,"+(h+xaxisShiftY)/2+") rotate(-90)"}}).text(titleY);d3.selectAll(".x-choice").on("click",function(){var xValue=d3.select(this).attr("value");console.log(xValue);var dataX=function(d){return eval(xValue)};switch(xValue){case"+d.gini":titleX="Gini Index";break;case"+d.press":titleX="Press Freedom";break;case"+d.mfr":titleX="Population, % Female";break;case"+d.life_exp":titleX="Life Expectancy";break;case"+d.gre":titleX="Female enrollment ratio";break;case"+d.corruption":titleX="Control of Corruption";break;case"+d.polistab":titleX="Political Stability";break;case"+d.gdphead":titleX="GDP per Capita"}var xScale=d3.scale.linear().domain([d3.min(worldData,function(t){return dataX(t)}),d3.max(worldData,function(t){return dataX(t)})]).range([xaxisShiftX,w]).nice();d3.select("#dots-group").selectAll("circle").filter(function(t){return dataX(t)}).transition().duration(1e3).attr({cx:function(t){return xScale(dataX(t))}});var xAxis=d3.svg.axis().scale(xScale).orient("bottom");xLabel.text(titleX),titleText.text(titleX+" vs. "+titleY),d3.select(".xaxis").transition().duration(1e3).call(xAxis),dotTips.html(function(t){return"<p id='tiphead'>"+t.country+"</p><p id='region'>"+t.region+"</span></p><p>"+titleX+"<p class='tip-value'>"+dataX(t)+"</p><p>"+titleY+"</p><p class='tip-value'>"+dataY(t)+"</p><div id='citation'><div class='citation-title'>"+titleX+"</div><br />"+citeX+"<br /><br /><div class='citation-title'>"+titleY+"</div><br />"+citeY+"</div>"})}),d3.selectAll(".y-choice").on("click",function(){var yValue=d3.select(this).attr("value");console.log(yValue);var dataY=function(d){return eval(yValue)};switch(yValue){case"+d.gini":titleY="Gini Index";break;case"+d.press":titleY="Press Freedom";break;case"+d.mfr":titleY="Population, % Female";break;case"+d.life_exp":titleY="Life Expectancy";break;case"+d.gre":titleY="Female enrollment ratio";break;case"+d.corruption":titleY="Control of Corruption";break;case"+d.polistab":titleY="Political Stability";break;case"+d.gdphead":titleY="GDP per Capita"}var yScale=d3.scale.linear().domain([d3.max(worldData,function(t){return dataY(t)}),d3.min(worldData,function(t){return dataY(t)})]).range([0,h+xaxisShiftY]).nice();d3.select("#dots-group").selectAll("circle").filter(function(t){return dataY(t)}).transition().duration(1e3).attr({cy:function(t){return yScale(dataY(t))}});var yAxis=d3.svg.axis().scale(yScale).orient("left");yLabel.text(titleY),titleText.text(titleX+" vs. "+titleY),d3.select(".yaxis").transition().duration(1e3).call(yAxis),dotTips.html(function(t){return"<p id='tiphead'>"+t.country+"</p><p id='region'>"+t.region+"</span></p><p>"+titleX+"<p class='tip-value'>"+dataX(t)+"</p><p>"+titleY+"</p><p class='tip-value'>"+dataY(t)+"</p><div id='citation'><div class='citation-title'>"+titleX+"</div><br />"+citeX+"<br /><br /><div class='citation-title'>"+titleY+"</div><br />"+citeY+"</div>"})})});