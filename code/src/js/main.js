
var canvas;
var context;
var svg;


var programs = {};
//var concerts = {};
var works = [];	//use array instead of keys because works can be duplicated with different fields 

//var soloists = [];	//uses array but not used atm

var seasons = {};
var worksMetadata = {};	//inside total works should also be an array pointing to all indices where the works are
var soloistMetadata = {};
var composerMetadata = {};
var conductorMetadata = {};
//var totalSeasons = {};



var filePath = "../data/complete.json";
v//ar filePath = "data/1842-43_TO_1910-11.json";
var filePath = "data/test.json";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = screen.width - margin.left - margin.right,
    height = screen.height -80- margin.top - margin.bottom;

function initialize(){
	
	//defer until sankey is done loading
	/*$.getScript('js/sankey.js', function()
	{
		visas = new Visa();
		advisories = new Advisory();
		continents = new Continent();
		visa_lengths = new visaDuration();
		
		sankey = d3.sankey()
			.nodeWidth(5)
			.nodePadding(5)
			.size([width, height]);
		path = sankey.link();
		
		fetchData();
	});	*/

	fetchData();
}

function fetchData(){
	

	d3.json(filePath).then(function(data){
	/*d3.json(filePath, function(error, f){
		if (error) throw error;*/

		
		var row;
		var w;
		var concert, work, soloist, season, comp, cond;

		for (i in data.programs){
			row = data.programs[i];
			
			delete row.id;

			//discard after the dash as the dataset already assumes a season is 1 year long and transform to int
			row.season = +row.season.split("-")[0];
			programs[row.programID] = row;
			
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

		readData();

		//formatJSON(filePath, readData);
		//readData();
	})/*.then(readData());*/
	/*.then(function(data){
		readData();
	});*/

}

function readData(){
	//console.log(programs);
	svg = d3.select("body").append("svg").attr("width", $("body").innerWidth()).attr("height", $("body").innerHeight());

	var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "charts");


		var count = 0;
		var bar = g.selectAll(".bar")
	      .data(programs)
	      .enter().append("rect")
	        .attr("class", "bar")
	        .attr("x", function(d, i){return 50*(i+1)})
	        .attr("y", function(d, i){return 30*(i+1)})
	        .attr("width", 30)
	        .attr("height", 30);
	        

	        bar.append("text")
				.attr("dy", ".22em")//.18
				.attr("x", function(d) { return d.children || d._children ? -13 : 13;})
				.attr("text-anchor", function(d) {
				  return d.children || d._children ? "end" : "start";
				})
				//.attr("text-anchor", function(d) { return d.x > 130 ? "start" : "end"; })
				.on("mouseover", function(d) {
				    div.transition()        
				        .duration(200)      
				        .style("opacity", .9);      
				    div.html("Orchestra: " + d.orchestra)  
				        .style("left", (d3.event.pageX) + "px")     
				        .style("top", (d3.event.pageY - 28) + "px");    
				    })
					/*.on("click", function(d) {
						$("#slide").slideToggle();
						slide.style('display', 'visible');
						slide.html("Countries: " + "<br/>"  + parseCountries(d));
				    })*/
				.on("mouseout", function(d) {
				    div.transition()        
				        .duration(500)      
				        .style("opacity", 0);   
				})
	        	.text( function(d){return d.season})

	/*var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	    y = d3.scaleLinear().rangeRound([height, 0]);



	    
	var g = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv("data.tsv", function(d) {
	  d.frequency = +d.frequency;
	    return d;
	  }, function(data) {
	 
	    x.domain(data.map(function(d) { return d.letter; }));
	    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

	    g.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	    g.append("g")
	      .call(d3.axisLeft(y).ticks(10, "%"));

	    g.selectAll(".bar")
	      .data(data)
	      .enter().append("rect")
	        .attr("class", "bar")
	        .attr("x", function(d) { return x(d.letter); })
	        .attr("y", function(d) { return y(d.frequency); })
	        .attr("width", x.bandwidth())
	        .attr("height", function(d) { return height - y(d.frequency); });

	});*/

	
}

function redraw(){
	;
}
window.addEventListener("resize", redraw);