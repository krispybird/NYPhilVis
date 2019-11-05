programs
	> id: 				(str) //GUID //can ignore
	> programID: 		(str) int plus * //local NYP ID
	> orchestra:		(str) //orchestra name
	> season: 			(str) //1812-13
	> concerts: []
		> eventType:	(str) //location "Subscription Season", etc...
		> Location:		(str) //"Church of ..."
		> Venue:		(str) //"Church of..."
		> Date:			(str) //"ISO date minus time"
		> Time:			(str) //"8:00PM"

	> works: []
		> ID: 			(str) int plus * //0* denotes intermission
		> composerName:	(str) //lastname, first name
		> workTitle:	(str) //title of the work
		> movement: 	(str) //title of the movement in the work

		> soloists:[]
			> soloistName:	(str) //last name, first name
			> soloistInstrument:	(str) // "violin"
			> soloistRoles: (char) //s = soloist, a = assisting artist