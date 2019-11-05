
var canvas;
var context;
var programs = [];
var concerts = [];



//var filePath = "../data/complete.json";
//var filePath = "data/1842-43_TO_1910-11.json";
var filePath = "data/test.json";
console.log('hi');
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
	d3.json(filePath, function(error, f){
		if (error) throw error;

		var row;

		/*for (var i = 0; i < f.length; i++){
			row = f[i];
			if (row['AdvisoryCat'] !== ''){
				advisories.advisoryType[row['AdvisoryCat']] = [];
				global_advisory_categories.push(row['AdvisoryCat']);
			}
			if (row['VisaCat'] !== ''){
				visas.visaType[row['VisaCat']] = [];
				global_visa_categories.push(row['VisaCat']);
			}
		}*/

		for (i in f.programs){
			console.log(f.programs[i].concerts);
			console.log(f.programs[i].works);
		}

		/*for (var i = 0; i < 4; i++){
			row = f[i];
			JSON.parse(f);
			console.log(f);
		}
		console.log(f);*/
		//read_data();
	});
}