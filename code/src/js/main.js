
var canvas;
var context;
//var svg;

//var programArray;


var programs, years, concerts= [];	//stored 
var tempProgs = {};
var tempConcerts = {};

//var concerts = {};
var works = [];	//use array instead of keys because works can be duplicated with different fields 
var principalConductors = [];

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
conductorPath = "../data/conductors.json"
//filePath = "data/1842-43_TO_1910-11.json";
//filePath = "data/test.json";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

var tooltip;
//interpolate between the min and max
// const colorsYears = ['#ffffff','#ffffe0', '#c5eddf', '#a5d5d8', '#8abccf', '#73a2c6', '#5d8abd', '#4771b2', '#2e59a8', '#00429d'];
const colorsYears = ['#ffffe0', '#caefdf', '#abdad9', '#93c4d2', '#7daeca', '#6997c2', '#5681b9', '#426cb0', '#2b57a7', '#00429d'];

//const colorsYears = ['#ffffe0', '#ffffd9','#edf8b1','#c7e9b4','#7fcdbb','#41b6c4','#1d91c0','#225ea8','#253494','#081d58']

$(window).on('load', function(){
	
	
	tippy.setDefaults({
        animation: 'fade',
        arrow: true,
        content: 'test',
        theme: 'light',
        dynamicTitle: true,
        interactive: false,
        hideOnClick: false
    });
	initialize();
});
/*
$.getScript("myplugin.js", function() {
     $.holdReady(false);
});
*/
function initialize(){
	
	

	fetchData();
	//$.holdReady(true);
	/*let script = $('#tippylib').addEventListener('load', function(){
		;
	})*/
}

function fetchData(){
	
	Promise.all([
		d3.json(filePath),
		d3.json(conductorPath)
		]).then(function(data){
	/*d3.json(filePath, function(error, f){
		if (error) throw error;*/
	
		let row, progID;
		let w;
		let concert, work, soloist, season, comp, cond;
		

		//var s = Object.entries(programs).map(([key, value]) => ({key,value}));
		//sees the number of
		for (i in data[0].programs){
			row = data[0].programs[i];
			progID = row.programID;
			
			delete row.id;
			delete row.progamID;

			//discard after the dash as the dataset already assumes a season is 1 year long and transform to int
			row.season = +row.season.split("-")[0];
			//instead of storing as one object, restructure it to store as a key value array

			
			//get a total count of all concerts played
			
			tempProgs[row.programID] = row;

			
			if (seasons[row.season] == undefined){
				seasons[row.season] = {
					"total": 1,
					"indexOfPrograms": [i],
					"totalConcerts": row.concerts.length
				}
			}

			else{
				seasons[row.season].total +=1;
				seasons[row.season].indexOfPrograms.push(i);
				seasons[row.season].totalConcerts += row.concerts.length;
			}

			w = row.works;
			//multiple conductors, including guest conductors, can count as having conducted the concert
			//we are primarily interested in seeing how many concerts have been conducted by this person, so the first time that a work is encountered, if the conductor has not been added, then add them
			//works
			//need to count by the number of concerts played
			//match the concert ID to the 
			var condflag = false, compflag = false, workflag = false;
			for (j in w){
				work = w[j];

				//ignore intermissions
				if (work.ID !== "0*"){
					//console.log(work);
					work.programIndex = i;
					works.push(work);	//point back to program array

					//if first instances of this work id showing up
					if (worksMetadata[work.ID] == undefined){
						worksMetadata[work.ID] = {"totalPerformance": 1, "indexOfWorks": [works.length-1], "yearsPerformed": []};
					}
					else{
						worksMetadata[work.ID].totalPerformance += 1;
						worksMetadata[work.ID].indexOfWorks.push(works.length-1);
					}

					//actually check if in there
					if (!worksMetadata[work.ID].yearsPerformed.includes(row.season)){
						worksMetadata[work.ID].yearsPerformed.push(row.season);
					}				

					//should get an array filled with indices to all unique works in that work, grouped by ID

					//COMPOSER
					if (work.composerName != undefined){
						comp = work.composerName.split(";");

						for (var x = 0; x < comp.length; x++){
							if (composerMetadata[comp[x]] == undefined){
									composerMetadata[comp[x]] = {"totalPerformance": 1, "indexOfWorks": [works.length-1], "yearsPerformed": []};
							}
							else{
								composerMetadata[comp[x]].totalPerformance += 1;
								composerMetadata[comp[x]].indexOfWorks.push(works.length-1);
								
							}
							
							if (!composerMetadata[comp[x]].yearsPerformed.includes(row.season)){
								composerMetadata[comp[x]].yearsPerformed.push(row.season);
							}
						}


					}
					
					

					//CONDUCTOR
					if (work.conductorName != undefined){
						cond = work.conductorName.split("; ");
						if (cond.length > 1){
							console.log(cond);
						}//warning

						for (var x = 0; x < cond.length; x++){

							if (conductorMetadata[String(cond[x])] == undefined){
									conductorMetadata[String(cond[x])] = {"totalConcerts": 1, "indexOfWorks": [works.length-1], "totalWorks": 1, "yearsPerformed": []};
							}
							else{
								
								conductorMetadata[String(cond[x])].indexOfWorks.push(works.length-1);
								conductorMetadata[String(cond[x])].totalWorks += 1;
							}



							if (!conductorMetadata[cond[x]].yearsPerformed.includes(row.season)){
								conductorMetadata[cond[x]].yearsPerformed.push(row.season);
							}
							//has not been encountered in this program round
							//add the number of concerts to their total count 
							//note that totalConcerts will increase if that conductor has appeared in that concert, even if they didn't conduct all the works
							if (!condflag){
								conductorMetadata[String(cond[x])].totalConcerts += row.concerts.length;//worksMetadata[work.ID].total+1;
								condflag = true;	//until the next program we encounter
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

		//arrays for now
		programs = Object.entries(tempProgs).map(([key, value]) => ({key,value}));

		///concerts;
		years = Object.entries(seasons).map(([key, value]) => ({key,value}));


		//loading in arrays for conductors
		
		let foundingYear = years[0].key;
		for (i in data[1]){
			//within those years, get the number of works conducted played by each person
			row = data[1][i];
			let cond = data[1][i].conductor;
			delete row.conductor

			//below is not necessary
			
			/*row.totalConducted = 0;
			
			
			//total years, inclusive till end year
			//very unoptimized but whatever
			for (j in row.yearEnd - row.yearStart + 1){
				let progs = years[j + (row.yearStart - foundingYear)];
				for (k in progs){
					progs.indexOfPrograms;

				}
			}*/

			principalConductors[cond] = row;

		}


		
		
	}).then(()=>graphYears())/*.then((d) => graphTopWorks());*/


}

function tooltip(selector, text){
	tippy(selector, {
		content: text
		/*trigger: 'mouseenter',
		onShow(tip){
			tip.set({trigger:'click', content: bars d.value.total})
		},
		onHide(tip) {
		    tip.set({ trigger: 'mouseenter' })
		}*/
	})
}
/////////////////////GRAPHS
//this graph visualizes in groupings of decades on the number of 
function graphYears(){
	
	let id = "div-concertyears"

	let chart = d3.select("body").append("div")
		.append("div")
	  	.attr("class", "svg-container")
	  	.attr("id", id);

	let svg = chart.append("svg")
		//.attr("width", window.innerWidth * .9)
		//.attr("height", window.innerHeight)
		.attr("class", "svg")
		.attr("display", "block")
		//.attr("viewBox", "0 0 " + width*3/4 + " " + height )
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "svg-content-responsive--a")
        .attr('id', 'svg-concertyears')

	let toolbar = chart.append("div")
			.attr("class", "toolbar--b")
			.attr("display", "none")

	//redefine this to be the size of the svg instead
	let border = 2;
	var gridSize = border + Math.floor(window.innerHeight/10)/3,
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
	//.domain(Object.values(years).map(v => v.value.total).sort((a,b) => a-b)) //domain with programs
	.domain(Object.values(years).map(v => v.value.totalConcerts).sort((a,b) => a-b))
	.range(colorsYears);

	const totalYearsInQuantiles =  
	sumToQuantileRanges(years,colorScaleYears.quantiles(), "totalConcerts");

	
	var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "charts")
			.attr("id", "chart-concertyears")
			/*.attr("width")*/

	var axisLabels = g.selectAll(".legend").append("text")
		.text("Year")
		.attr("x", 0)
		.attr("y", 10)
		.attr("class", "axis")
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + g.node().getBBox().width/2 + ", -15 )");
	//maps out years
	//Object.values(years).map(v => +v.key)
	var yearLabel = g.append("g").attr("class", "axis").selectAll(".yearLabel")
		.data(Array.from(Array(10).keys()))
		.enter().append("text")
		.text(function(d) {return "_" + d;})
		.attr("class", "yearLabel axis")
		.attr("x", (d, i) =>
			 (margin.left + (i+1)*gridSize + gridSize*3/4))
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
			return ((i+1)*gridSize);
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
      	.attr("id", (d)=>"year-" + d.key)
        .attr("x", function(d, i){
        	return margin.left + gridSize + (+d.key % buckets) * gridSize})
        .attr("y", function(d, i){
        	return((Math.floor(+d.key/10) - min) * gridSize)})
        /*.attr("rx", 4)
        .attr("ry", 4)*/
        .attr("border-radius", 4)
        .attr("width", gridSize-border)
        .attr("height", gridSize-border)
        .style("fill", function(d,i){
        	return '#fffeee'//colorScaleYears(d.value.total)
        })
        .attr('data-tippy-content', function(d){return "<br/>Total concerts performed: " + d.value.totalConcerts+"<br/>"})

        bars.transition().duration(1500).style("fill", function(d,i){
        	return colorScaleYears(d.value.totalConcerts)
        })

        bars.on("click", function(d) {
			$("#slider").slideToggle();
			$("#slider").attr('display', 'visible');
			d3.select('#slider').style('height', d3.select('#svg-concertyears').node().getBoundingClientRect().height);
			$("#slider").html("<br/> <h5>About </h5> " + "<br/>"  + parseSlider(d.key));
		})



		tippy(bars.nodes());
		
		var legend = g.append("g")
		.attr("class", "legend")
		.attr("id", "legend-year")
		.attr("transform", "translate(20,50)")// + 0 + ")")
		.selectAll(".legend")
      	.data(colorScaleYears.quantiles())
      	.enter();

      	console.log(colorScaleYears.quantiles())

      	legend.append("rect")
      	.attr("class", "legend box border")
      	.attr("width", gridSize-border)//*10/(colorsYears.length-1))
      	.attr("height", gridSize-border)
      	.attr("x", (d,i)=> (margin.left + gridSize+(i*gridSize*10/(colorsYears.length-1))))
      	.attr("y", d3.select(".bars").node().getBBox().height)
      	.style("fill", function(d,i){
      		return i >= 9 ? "00429d" : colorsYears[i];
      	})	//do this because quantiles return n-1, so we have an extra as placeholder
      	.attr('data-tippy-content', (d, i) => "Total number of years: " + totalYearsInQuantiles[i])	//upper bound  with " + "≤" + Math.ceil(colorScaleYears.quantiles()[i]-1))

      	tippy('svg .legend .box')
       // tippy(legend.nodes());

      	legend.append("text").attr("class", "legend")
      	      	.text((d,i)=>  "≤" + Math.ceil(colorScaleYears.quantiles()[i]-1))
      			.attr("x", function(d, i){
      				return margin.left + gridSize*1.1+(i*gridSize*10/(colorsYears.length-1))})
      			.attr("y", d3.select(".legend").node().getBBox().height + 10)
      			.style("text-anchor", "middle")

      	let size = d3.select('.legend').node().getBBox();

      	d3.select(".legend").append("text").attr("class", "legend")
      	      	.text("Concerts played per year")
      			.attr("x", (d, i) => size.width/4 + size.x) //function(d, i){return gridSize*1.5+(gridSize*10/(colorsYears.length-1))})
      			.attr("y", size.height + size.y + 15)
      			.style("text-align", "middle")


  		d3.select(".legend").append("text").attr("class", "legend")
  	      	.text((d) => ("Total concerts played to date: " + years.flatMap(v => v.value.totalConcerts).reduce((a, b) => a + b, 0)))
  			.attr("x", size.width/2 + size.x)/*function(d, i){
  				return gridSize*1.5+(gridSize*10/(colorsYears.length-1))})*/
  			.attr("y", d3.select(".legend").node().getBBox().height + 10)
  			.style("font-size", "1em")
  			.style("text-anchor", "middle")


      	//let w =  svg.node().getBBox().width/2;// + g.node().getBBox().width/2;

      	//g.attr("transform", "translate(" + w + "," + margin.top + ")")
		
		
		svg.attr("viewBox", "0 0 " + g.node().getBBox().width  + " " + (g.node().getBBox().y + +g.node().getBBox().height + 30))
      	svg.attr("preserveAspectRatio", "xMinYMin meet")
      	.attr("width", d3.select("g#chart-concertyears").node().getBBox().width + 30)
      	.attr("height", d3.select("g.charts").node().getBBox().height + 30)

/////////////////////////////////////////////////////////////////////////// IS FOR THE BUTTONS  ///////////////////////////////////////////////////////////////////////

    
   let principalNames = Object.keys(principalConductors);
    let p = [];
    let p_concerts = [];
   
    //years = Object.entries(seasons).map(([key, value]) => ({key,value}));

    for (i in principalNames){
    	p[i] = {key: principalNames[i], value: conductorMetadata[principalNames[i]]} 
    	p_concerts[i] = conductorMetadata[principalNames[i]].totalConcerts;
    }

    console.log(p_concerts.sort((a,b) => a-b));

    
    
    let svg_x = 30;
    let svg_y =  d3.select('g.bars').node().getBBox().y + 50;

   

    var c_svg = chart.append("svg")//.append("div")
			/*.attr("transform", "translate(" + svg_x + "," + svg_y + ")")*/
		.attr("class", "svg")
		.attr("display", "inline-block")
		.attr("preserveAspectRatio", "xMinYMin meet")
    	.attr("class", "svg-content-responsive--b")
		.attr("id", "svg-principal-conductors")
		.attr("height", svg.node().getBBox().height)
        

	let align = c_svg.node().getBBox();

	c_svg.append("text")
	.attr("transform", "translate(" + align.x + "," + align.y + ")")
	.text("Principal Conductors x Concerts Conducted")
	.attr("x", align.x + 30)
	.attr("y", align.y + 25)
	.style("font-size", "1.15em")
	.style("text-anchor", "left")

	//ratchet way of making some bars
	let maxWidthOfBars = c_svg.node().getBoundingClientRect().width - 30;
	let maxHeightOfBars = d3.select("g.bars").node().getBoundingClientRect().height ;
	let divMax = p_concerts.reduce(function(a, b){
		return a > b ? a : b
	});
	let divMin = p_concerts.reduce(function(a, b){
		return a < b ? a : b
	});
	let divRatio = maxWidthOfBars/divMax;
	console.log(maxWidthOfBars);

	let x = d3.scaleLinear().domain([divMin, divMax]).range([80, maxWidthOfBars]);

	let y = d3.scaleBand().range([40, maxHeightOfBars+30]).domain(Object.values(p).map(v=>v.key)).padding(.05);


	let c_g = c_svg
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + 0 + ")")
			.attr("class", "charts")
			.attr("id", "chart-conductors")
			//.attr("class", "conductors")
			//.data(p).enter();


    	
	let c_bars = c_g.append("g")
		.attr("class", "bars")
		//.attr("transform", "translate(20, 0)")
		.selectAll(".conductors")
		.data(p).enter()
  		.append("rect")
  		.attr("class", "bars pressable")
  		.attr("id", (d)=>d.key)
  		.attr("height", y.bandwidth())
  		.attr("width", (d)=>x(0))//d.value.totalConcerts))
  		.attr("x", (d)=> x(0) + 30)
  		.attr("y", 40)
  		.attr("y", (d, i)=> y(d.key))
  		//.style("fill", "#cececec7")


  		.on("focus", (d) =>{
  			//highlight all years that d is active in
  			let s = principalConductors[d.key].yearStart;
  			let e = principalConductors[d.key].yearEnd;
  			
  			d3.selectAll(".year").classed("highlight highlight--p highlight--s", false);

  			console.log(d.value.yearsPerformed);
  			console.log(s + "-" + e)

  			for (k in d.value.yearsPerformed){
  				d3.select("#year-" + d.value.yearsPerformed[k]).classed("highlight--s", true);
  			}

  			for (var j = s; j <= e; j++){
  				d3.select("#year-" + j).classed("highlight--p", true);
  			}

  			//then show years active 


  		})
  		.attr('data-tippy-content', (d)=>{
  			return ("<br/>Total concerts conducted: " + d.value.totalConcerts +"<br/>" + "Total works conducted: " + d.value.totalWorks)})

  		//tippy('svg .legend .box')
  		tippy(c_bars.nodes());

  		c_g.selectAll("rect")
  		  .transition()
  		  .duration(800)
		  .attr("width", (d)=>x(d.value.totalConcerts))
		   
  		  .delay()

  		
    	/*var legend = g.append("g")
		.attr("class", "legend")
		.attr("transform", "translate(20,50)")// + 0 + ")")
		.selectAll(".legend")*/

      
      	var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(5);
      	var yAxis = d3.axisLeft(y);

      	c_g.append("g").attr("class", "y axis")
      		.attr("transform", "translate(100,0)")
          	.call(d3.axisLeft(y))
          	.selectAll("text")
          	//.attr("transform", "translate(-10,10)rotate(-45)")
      	    .style("text-anchor", "end")
      	    .style("font-size", ".65em")
      	    .style("fill", "#69a3b2")


      	
      	var c_legend = c_g.append("g")
			.attr("class", "legend")
			.attr("id", "legend-conductor")
			.attr("transform", "translate(20,50)")
		//.selectAll(".legend")

      	let leg = c_legend.append("g");

      	leg.append("rect")
      	.attr("class", "legend box border highlight--p")
      	.attr("width", gridSize-border)//*10/(colorsYears.length-1))
      	.attr("height", gridSize-border)
      	.attr("x", (d)=> x(0))
      	.attr("y", d3.select("#legend-year").node().getBBox().y + (gridSize)*3/4)
      	.style("fill", "#ff4d5082")

      	leg.append("text")
      	.text("Principal")
      	.attr("class", "legend")
		.attr("x", g.select("g.bars").node().getBBox().width/3)
		.attr("y",  d3.select("#legend-year").node().getBBox().y + gridSize + 35)
		.style("text-anchor", "middle")
      	

      	leg.append("rect")
      	.attr("class", "legend box border highlight--s")
      	.attr("width", gridSize-border)//*10/(colorsYears.length-1))
      	.attr("height", gridSize-border)
      	.attr("x", (d)=> g.select("g.bars").node().getBBox().width*2/3 - gridSize/2)
      	.attr("y", d3.select("#legend-year").node().getBBox().y + (gridSize)*3/4)
      	.style("fill", "#ffdf0085")

      	leg.append("text")
      	.text("Guest/other")
      	.attr("class", "legend")
		.attr("x", g.select("g.bars").node().getBBox().width*2/3)
		.attr("y",  d3.select("#legend-year").node().getBBox().y + gridSize + 35)
		.style("text-anchor", "middle")

		l_size = leg.node().getBBox();

		leg.append("text").attr("class", "legend")
      	      	.text("Conducted as")
      			.attr("x", (d, i) => l_size.width/4 + l_size.x) 
      			.attr("y", l_size.height + size.y + 40)
      			.style("text-align", "middle")
		
		leg.append("text").attr("class", "legend")

  		c_svg.attr("width", d3.select("g#chart-concertyears").node().getBoundingClientRect().width + 30)
      	//.attr("height", d3.select("g.conductors").node().getBBox().height + 30)
  		
  		/*.attr("x", 15)
  		.attr("y", (d, i) => i*20)*/

    SVGS[id] = svg;
/*    d3.select("body").on("click", ()=>{
		var outside = d3.selectAll(".year").filter(d3.event.target).empty();//#tooltip, #tooltip *").filter(equalToEventTarget).empty();
		    if (outside) {
		        d3.selectAll(".year").classed("highlight", false);
		    }
	})*/
}


//
function parseSlider(data){
	;
}



function redraw(){
	$("body").attr("width", window.innerWidth);
	$("body").attr("height", window.innerHeight);

	/*width = window.innerWidth - margin.left - margin.right;
	height = window.innerHeight - margin.top - margin.bottom;

	d3.select('.svg-content-responsive--a').attr("height", d3.select("g.charts").node().getBBox().height + 30)
	d3.select('.svg-content-responsive--b').attr("width", d3.select("g#chart-concertyears").node().getBoundingClientRect().width + 30)*/

}
window.addEventListener("resize", redraw);