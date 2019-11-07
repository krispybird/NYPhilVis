$(document).ready(function(){

	/*d3.json(filePath, function(error, f){
		if (error) throw error;

		
		var row;
		var w;
		var concert, work, soloist, season, comp, cond;

		for (i in f.programs){
			row = f.programs[i];
			
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
					console.log(work.composerName);
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

		//formatJSON(filePath, readData);

	}).then(function(data){
		readData();
	});*/
})
function fetchData(){
	

	d3.json(filePath, function(error, f){
		if (error) throw error;

		
		var row;
		var w;
		var concert, work, soloist, season, comp, cond;

		for (i in f.programs){
			row = f.programs[i];
			
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
					console.log(work.composerName);
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

		//formatJSON(filePath, readData);

	}).then(function(data){
		readData();
	});
}