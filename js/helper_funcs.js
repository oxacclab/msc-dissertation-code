function getRandom(arr, n) {
	var result = new Array(n),
		len = arr.length,
		taken = new Array(len);
	if (n > len)
		throw new RangeError("getRandom: more elements taken than available");
	while (n--) {
		var x = Math.floor(Math.random() * len);
		result[n] = arr[x in taken ? taken[x] : x];
		taken[x] = --len in taken ? taken[len] : len;
	}
	return result;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //to consider whether necessary
}

// in-house flat function to handle browser compatibility
// credits: https://stackoverflow.com/a/50993569/13078832
Object.defineProperty(Array.prototype, 'flat', {
	value: function(depth = 1) {
	  return this.reduce(function (flat, toFlatten) {
		return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
	  }, []);
	}
});
//e.g. ([1, 2, 3], 2) becomes [1, 1, 2, 2, 3, 3]
const expandArray = (arr, times) => arr.map(x => Array(times).fill(x)).flat()

function shuffle(array) {
	var new_array = [...array];
	var currentIndex = new_array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = new_array[currentIndex];
		new_array[currentIndex] = new_array[randomIndex];
		new_array[randomIndex] = temporaryValue;
	}
	return new_array;
}

function get_dealer_id_name_dict_randomised() {
	let dealer_id_name_dict = {}
	let male_names = ['John', 'Marc', 'Oscar', 'Charlie', 'Luis', 'Nick']
	let female_names = ['Sarah', 'Katherine', 'Francesca', 'Rebekah', 'Victoria', 'Elizabeth']
	let male_faces = ['d01', 'd02', 'd04', 'd05', 'd07', 'd10']
	let female_faces = ['d03', 'd06', 'd08', 'd09', 'd11', 'd12']

	for (s=0; s<=5; s++) {
		male_names = shuffle(male_names)
		female_names = shuffle(female_names)
		male_faces = shuffle(male_faces)
		female_faces = shuffle(female_faces)
	}
	
	for (i=0; i<male_names.length; i++) {
		dealer_id_name_dict[male_faces[i]] = male_names[i]
		dealer_id_name_dict[female_faces[i]] = female_names[i]
	}
	return dealer_id_name_dict
}