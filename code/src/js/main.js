

var canvas;
var context;
var svg;

//var programArray;


var programs, years = [];	//stored 
var tempProgs = {};

//var concerts = {};
var works = [];	//use array instead of keys because works can be duplicated with different fields 

//var soloists = [];	//uses array but not used atm

var seasons = {};
var worksMetadata = {};	//inside total works should also be an array pointing to all indices where the works are
var soloistMetadata = {};
var composerMetadata = {};
var conductorMetadata = {};
//var totalSeasons = {};

var SVGS = {};	//keep track of all charts

var filePath;
filePath = "../data/complete.json";
//filePath = "data/1842-43_TO_1910-11.json";
//filePath = "data/test.json";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = screen.width - margin.left - margin.right,
    height = screen.height - margin.top - margin.bottom;

var tooltip;
//interpolate between the min and max
// const colorsYears = ['#ffffff','#ffffe0', '#c5eddf', '#a5d5d8', '#8abccf', '#73a2c6', '#5d8abd', '#4771b2', '#2e59a8', '#00429d'];
const colorsYears = ['#ffffe0', '#caefdf', '#abdad9', '#93c4d2', '#7daeca', '#6997c2', '#5681b9', '#426cb0', '#2b57a7', '#00429d']
function initialize(){
	
	

	fetchData();
}

function fetchData(){
	

	d3.json(filePath).then(function(data){
	/*d3.json(filePath, function(error, f){
		if (error) throw error;*/
	
		let row, progID;
		let w;
		let concert, work, soloist, season, comp, cond;
		

		//var s = Object.entries(programs).map(([key, value]) => ({key,value}));
		for (i in data.programs){
			row = data.programs[i];
			progID = row.programID;
			
			delete row.id;
			delete row.progamID;

			//discard after the dash as the dataset already assumes a season is 1 year long and transform to int
			row.season = +row.season.split("-")[0];
			//instead of storing as one object, restructure it to store as a key value array
			tempProgs[row.programID] = row;

			
			if (seasons[row.season] == undefined){
				seasons[row.season] = {
					"total": 1,
					"indexOfPrograms": [i]
				}
			}

			else{
				seasons[row.season].total +=1;
				seasons[row.season].indexOfPrograms.push(i);
			}


			w = row.works;
			//works
			for (j in w){
				work = w[j];

				//ignore intermissions
				if (work.ID !== "0*"){
					//console.log(work);
					work.programIndex = i;
					works.push(work);	//point back to program array

					//if first instances of this work id showing up
					if (worksMetadata[work.ID] == undefined){
						worksMetadata[work.ID] = {"totalPerformance": 1, "indexOfWorks": [works.length-1]};
					}
					else{
						worksMetadata[work.ID].totalPerformance += 1;
						worksMetadata[work.ID].indexOfWorks.push(works.length-1);
					}

					//should get an array filled with indices to all unique works in that work, grouped by ID

					//COMPOSER
					if (work.composerName != undefined){
						comp = work.composerName.split(";");

						for (var x = 0; x < comp.length; x++){
							if (composerMetadata[comp[x]] == undefined){
									composerMetadata[comp[x]] = {"totalPerformance": 1, "indexOfWorks": [works.length-1]};
							}
							else{
								composerMetadata[comp[x]].totalPerformance += 1;
								composerMetadata[comp[x]].indexOfWorks.push(works.length-1);
								
							}
						}
					}
					

					//CONDUCTOR
					if (work.conductorName != undefined){
						cond = work.conductorName.split(";");

						for (var x = 0; x < cond.length; x++){

							if (conductorMetadata[cond[x]] == undefined){
									conductorMetadata[cond[x]] = {"totalPerformance": 1, "indexOfWorks": [works.length-1]};
							}
							else{
								conductorMetadata[cond[x]].totalPerformance += 1;//worksMetadata[work.ID].total+1;
								conductorMetadata[cond[x]].indexOfWorks.push(works.length-1);
								//console.log(j + " " + works.length-1);
							}
						}
					}
					


				}	//aggregate works to a counter keeping track of the total amount of times that work has been performed


				for (k in w[j].soloists){
					//soloists are not also always unique so use the total and point to works instead
					soloist = w[j].soloists[k];
					
					// soloist = temp[j].soloists[k];
					// soloist.workIndex = j;
					// soloists.push(soloist);	//point back to the work it is associated with
					// //also aggregate for soloists?

					if (soloistMetadata[soloist.soloistName] == undefined){
						soloistMetadata[soloist.soloistName] = 
						{	"totalPerformance": 1, 
							"totalSolo": soloist.soloistRoles === ("S") ? 1 : 0,
							"totalAssist": soloist.soloistRoles === ("A") ? 1 : 0,
							"indexOfWorks": [works.length-1]
						};

					}
					else{
						soloistMetadata[soloist.soloistName].totalPerformance += 1;
						soloistMetadata[soloist.soloistName].indexOfWorks.push(works.length-1);

						if (soloist.soloistRoles == ("S")){
							soloistMetadata[soloist.soloistName].totalSolo +=1;
						}
						else if (soloist.soloistRoles == ("A")){
							soloistMetadata[soloist.soloistName].totalAssist +=1;
						}
					}
				}
			}
		
		}
		graphYears();
	});


}

/////////////////////GRAPHS
//this graph visualizes in groupings of decades on the number of 
function graphYears(){

	//arrays for now
	programs = Object.entries(tempProgs).map(([key, value]) => ({key,value}));
	years = Object.entries(seasons).map(([key, value]) => ({key,value}));
	
	svg = d3.select("body").append("div").append("div")
   .attr("class", "svg-container")


	.append("svg")
		//.attr("width", window.innerWidth * .9)
		//.attr("height", window.innerHeight)
		.attr("class", "svg")
		.attr("display", "block")
		.attr("viewBox", "0 0 " + width + " " + height )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "svg-content-responsive")
		//.attr("overflow", "auto");



	SVGS["yearChart"] = svg;

	tooltip = d3.select("body").append("div")   
    .attr("class", "tooltip top")               
    .style("opacity", 0);

	//redefine this to be the size of the svg instead
	var gridSize = Math.floor(width/10)/3,
		buckets = 10,
		legendBoxWidth = gridSize*2,
		minScale = returnMinValueObject(years, "total")["total"],
		maxScale = returnMaxValueObject(years, "total")["total"];
	
	var startYear =  Object.values(years).map(v => v.key).reduce(function(a, b){
		return a < b ? a : b}),
	endYear = Object.values(years).map(v => v.key).reduce(function(a, b){
		return a > b ? a : b});

	var min = Math.floor(startYear/10);
	var max = Math.floor(endYear/10);



	const yAxisOffset = 20;

	//Object.values(years).map(v => v.value.total)
	//returns total programs played
	const colorScaleYears = d3.scaleQuantile()
	.domain(Object.values(years).map(v => v.value.total).sort((a,b) => a-b))
	.range(colorsYears);

	const totalYearsInQuantiles =  
	sumToQuantileRanges(years,colorScaleYears.quantiles());

	

	var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "charts")
			/*.attr("width")*/

	
	//maps out years
	//Object.values(years).map(v => +v.key)
	var yearLabel = g.append("g").attr("class", "axis").selectAll(".yearLabel")
		.data(Array.from(Array(10).keys()))
		.enter().append("text")
		.text(function(d) {return "_" + d;})
		.attr("class", "yearLabel axis")
		.attr("x", function(d, i){
			return (i+1)*gridSize + gridSize/2;
		})
		.attr("y", 10)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize/2 + ", -6 )");

	var decadeLabel = g.append("g").attr("class", "axis").selectAll(".decadeLabel")
		.data(Array.from({length:(max+1-min)}, (_, i) => min + (i)))
		.enter().append("text")
		.text(function(d) {return d + "0s";})
		.attr("class", "yearLabel axis")
		.attr("x", 0)
		.attr("y", function(d, i){
			return ((i+1)*gridSize) - gridSize/2;
		})
		.style("text-anchor", "start")
		.attr("transform", "translate(0," + gridSize/2 +" )");
	

	var bars = g.append("g")
		.attr("class", "bars")
		.attr("transform", "translate(20," + 20 + ")")
		.selectAll(".year")
      	.data(years)
      	.enter()
      	.append('rect')
      	.attr("class", "year border")
        .attr("x", function(d, i){
        	return gridSize + (+d.key % buckets) * gridSize})
        .attr("y", function(d, i){
        	return((Math.floor(+d.key/10) - min) * gridSize)})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d,i){
        	/*console.log(colorScaleYears(d.value.total));*/
        	return colorScaleYears(d.value.total)
        })
        .on("mouseover", function(d) {
		    /*tippy(tooltip.html("Total: " + d.value.total)  
		        .style("left", (d3.event.pageX) + "px")     
		        .style("top", (d3.event.pageY - 28) + "px"))*/
		    tooltip.transition()        
		        .duration(200)      
		        .style("opacity", .9);      
		    tooltip.html("Total: " + d.value.total)  
		        .style("left", (d3.event.pageX) + "px")     
		        .style("top", (d3.event.pageY - 28) + "px");    
		    })
			/*.on("click", function(d) {
				$("#slide").slideToggle();
				slide.style('display', 'visible');
				slide.html("Countries: " + "<br/>"  + parseCountries(d));
		    })*/
		.on("mouseout", function(d) {
		    tooltip.transition()        
		        .duration(500)      
		        .style("opacity", 0);   
		});
		
		var legend = g.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(20,50)")// + 0 + ")")
		.selectAll(".legend")
      	.data(colorScaleYears.quantiles())
      	.enter();

      	console.log(colorScaleYears.quantiles())

      	legend.append("rect")
      	.attr("class", "box")
      	.attr("width", gridSize)//*10/(colorsYears.length-1))
      	.attr("height", gridSize)
      	.attr("x", (d,i)=> (gridSize+(i*gridSize*10/(colorsYears.length-1))))
      	.attr("y", d3.select(".bars").node().getBBox().height)
      	.style("fill", function(d,i){
      		return i >= 9 ? "00429d" : colorsYears[i];
      	})	//do this because quantiles return n-1, so we have an extra as placeholder
      	.on("mouseover", function(d,i) {
		    tooltip.transition()        
		        .duration(200)      
		        .style("opacity", .9);      
		    tooltip.html("Total number of years: " + totalYearsInQuantiles[i])	//upper bound  with " + "≤" + Math.ceil(colorScaleYears.quantiles()[i]-1) + " concerts: " +
		        .style("left", (d3.event.pageX) + "px")     
		        .style("top", (d3.event.pageY - 28) + "px")
		})
		.on("mouseout", function(d) {
		    tooltip.transition()        
		        .duration(500)      
		        .style("opacity", 0);   
		});

      	legend.append("text").attr("class", "legend")
      	      	.text((d,i)=>  "≤" + Math.ceil(colorScaleYears.quantiles()[i]-1))
      			.attr("x", function(d, i){
      				return gridSize*1.1+(i*gridSize*10/(colorsYears.length-1))})
      			.attr("y", d3.select(".legend").node().getBBox().height + 20)
      			.style("text-anchor", "center")

      		legend.append("text").attr("class", "h6 legend")
      	      	.text("Total concerts played in year")
      			.attr("x", function(d, i){
      				return gridSize*1.1+(2*gridSize*10/(colorsYears.length-1))})
      			.attr("y", d3.select(".legend").node().getBBox().height + 20)
      			.style("text-anchor", "center")

      	svg.attr("viewBox", "0 0 " + width + " " + (d3.select(".legend").node().getBBox().y + +d3.select(".legend").node().getBBox().height + 100))
      	.attr("preserveAspectRatio", "xMinYMin meet");
      	//console.log(colorScaleYears.quantile())
		/*g.append("rect")
		.attr("class", "fake border")
        .attr("x", function(){
        	return gridSize })
        .attr("y", function(d, i){
        	return( gridSize)})
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d,i){
        	return 'gray';});*/

		

		
        //.style("fill", colorsYears[0])
        /*.merge(bars)
        .transition().duration(1000)
        .style("fill", function(d,i){
        	return colorScale(d[i].value.total)
        })*/

		 
        

        /*bar.append("text")
			.attr("dy", ".22em")//.18
			.attr("x", function(d) { return d.children || d._children ? -13 : 13;})
			.attr("text-anchor", function(d) {
			  return d.children || d._children ? "end" : "start";
			})
			.on("mouseover", function(d) {
			    div.transition()        
			        .duration(200)      
			        .style("opacity", .9);      
			    div.html("Orchestra: " + d.orchestra)  
			        .style("left", (d3.event.pageX) + "px")     
			        .style("top", (d3.event.pageY - 28) + "px");    
			    })
				.on("click", function(d) {
					$("#slide").slideToggle();
					slide.style('display', 'visible');
					slide.html("Countries: " + "<br/>"  + parseCountries(d));
			    })
			.on("mouseout", function(d) {
			    div.transition()        
			        .duration(500)      
			        .style("opacity", 0);   
			})
        	.text( function(d){return d.season})*/


	
}

function redraw(){
	$("body").attr("width", window.innerWidth);
	$("body").attr("height", window.innerHeight);

}
window.addEventListener("resize", redraw);