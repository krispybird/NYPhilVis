/*function getConcertsOverYears(seasonArr, programArr){
	//returns the number of Concerts played over the years as an array
	//input: seasonArr = [key: 1842, value: {total: 3, indexOfPrograms: [1, 5, 1]}]

	//this makes an assumption that the first key value 
	var yr = Object.keys(seasonArr);
	var minYear = yr.forEach(function())

	var last, current;

	seasonArr.sort(function(a, b){

	})
}*/


/*let els = document.querySelectorAll('.node');
let tip = document.querySelector('nodeTip');*/


//Returns an int with the object result of the minimum in the key value array
//e.g. years[key: 1800, val: {total: 3, indexOfPerformances: [..]]}]
//will return an object of total
function returnMinValueObject(arr, k){
	//for key value pairs
	return Object.values(years).map(v => v.value).reduce(function(a, b){
		return a[k] < b[k] ? a : b
	});
}

//Returns an int with the object result of the max  in the key value array
//e.g. years[key: 1800, val: {total: 3, indexOfPerformances: [..]]}]
//will return the object of {total: 3, indexOfPerformances: []}
function returnMaxValueObject(arr, k){
	//for key value pairs
	return Object.values(years).map(v => v.value).reduce(function(a, b){
		return a[k] > b[k] ? a : b
	});
}


//iterate through sum array and add how many performances in each year fall into the quantile ranges
function sumToQuantileRanges(sumArr, quantArr, field){
	var totalArr = new Array(quantArr.length).fill(0);

	let j = 0;
	
	for (i in sumArr){
		j = 0;
		//if value is < Q1, fall into Q1. = Q1 falls into Q2
		while (sumArr[i].value[field] >= quantArr[j] && j < quantArr.length){			
			j++;
		}
		totalArr[j]++;	
	}
	return totalArr;
}


