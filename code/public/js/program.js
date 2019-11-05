
//
function Program(){
	this.id = null;
	this.programID = null;
	this.orchestra = null;
	this.season = null;
	this.seasonStart = null;
	this.seasonEnd = null;
}

//repeated for each individual performance within a program
function Concert(){
	this.eventType = null;
	this.location = null; //str
	this.venue = null;	//str
	this.date = null;	//iso date
	this.time = null;

}

//repeated for each work performed on a program. By matching the index number of each field, you can tell which soloist(s) and conductor(s) performed a specific work on each of the concerts listed above.

function Work(){
	this.conductorLastName = null;
	this.conductorFirstName = null;
	this.movement = null;
	this.soloistName = [];	//ln fn
	this.soloistInstrument = [];
	this.soloistRole = null;	//s = soloist, a = assist artist

	
}