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

function sumToQuantileRanges(sumArr, quantArr){
	////d.value.total

	//var lowerBound = (upperBound == 0) ? 0 : quantArr[upperBound-1];
	var totalArr = new Array(quantArr.length).fill(0);

	var j = 0;
	console.log(totalArr)
	acc = false;

	//not the most efficient loop since it will go through sumArr.len * quantArr.len regardless, but check what was wrong with the code below
	for (i in sumArr){
		for (j in quantArr){

			if (j == 0){
				if (sumArr[i].value.total < quantArr[j])
					totalArr[j]++;//= sumArr[i].value.total;
					console.log(sumArr[i].key)
			}
			else if (j == quantArr.length-1){
				if (sumArr[i].value.total < quantArr[j])
					totalArr[j]++;
					console.log(sumArr[i].key)
			}
			else{
				if (sumArr[i].value.total < quantArr[j]){
					totalArr[j-1]++;
					console.log(sumArr[i].key)
				}
			}
		}

		/*j = 0;

		while (sumArr[i].value.total < quantArr[j] && j < quantArr.length){			
			console.log(sumArr[i].value.total + " " + quantArr[j])
			j++;
		}

		console.log("Total values of i, j : " + i + " " + j + " " + sumArr[i].value.total)

		if (j == 0){
			totalArr[j] += sumArr[i].value.total;
		}
		else{
			totalArr[j+1] += sumArr[i].value.total;
		}

		j = 0*/
	}

	return totalArr;
}