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


// ---------------------------------------------SETTING UP PARAMETERS
let DELTA_EV_CATEGORIES = [-90, -70, -20, -5, 0, 5, 20, 70, 90]
var HIGH_VARIANCE_VALUE = 160
var LOW_VARIANCE_VALUE = 80
let TRIALS_NUM = 126

// --------------------------------------------Setting up PPs
// array with 50% trues and 50% falses
let random_pp_responses_arr = expandArray([true], TRIALS_NUM/2).concat(expandArray([false], TRIALS_NUM/2))
// array with 60% trues and 40% falses
let temp_below_avg_pp_n_correct_trials = parseInt(TRIALS_NUM*0.6)
let below_avg_pp_responses_arr = expandArray([true], temp_below_avg_pp_n_correct_trials).concat(expandArray([false], TRIALS_NUM-temp_below_avg_pp_n_correct_trials))
// array with 70% true and 30% false
let temp_avg_pp_n_correct_trials = parseInt(TRIALS_NUM*0.7)
let avg_pp_responses_arr = expandArray([true], temp_avg_pp_n_correct_trials).concat(expandArray([false], TRIALS_NUM-temp_avg_pp_n_correct_trials))
// array with 60% trues and 40% falses
let temp_above_avg_pp_n_correct_trials = parseInt(TRIALS_NUM*0.8)
let above_avg_pp_responses_arr = expandArray([true], temp_above_avg_pp_n_correct_trials).concat(expandArray([false], TRIALS_NUM-temp_above_avg_pp_n_correct_trials))
// shuffling the arrays
for (let s=0; s<15; s++) {
	random_pp_responses_arr = shuffle(random_pp_responses_arr)
	below_avg_pp_responses_arr = shuffle(below_avg_pp_responses_arr)
	avg_pp_responses_arr = shuffle(avg_pp_responses_arr)
	above_avg_pp_responses_arr = shuffle(above_avg_pp_responses_arr)
}

// ----------------------------------------------SIMULATIONS
let SIMULATIONS = 40

let random_pp_per_pp_winnings = []
let below_avg_pp_per_pp_winnings = []
let avg_pp_per_pp_winnings = []
let above_avg_pp_per_pp_winnings = []
let per_pp_total_possible_winnings = []
for (let simulation_ind = 0; simulation_ind < SIMULATIONS; simulation_ind++) {

	// ---------------------------------------------Per-pp trials loop
	let random_pp_n_correct_trials = 0
	let random_pp_winnings = 0
	let below_avg_pp_n_correct_trials = 0
	let below_avg_pp_winnings = 0
	let avg_pp_n_correct_trials = 0
	let avg_pp_winnings = 0
	let above_avg_pp_n_correct_trials = 0
	let above_avg_pp_winnings = 0
	let total_possible_winnings = 0

	for (let trial_ind = 0; trial_ind < TRIALS_NUM; trial_ind++) {
		let random_number = getRandomInt(111, 389)
		let delta_EV = getRandom(DELTA_EV_CATEGORIES, 1)[0]

		let high_variance_lottery = getRandom(['left', 'right'], 1)[0] //high_variance_lottery_across_trials[trial_ind]
		let high_variance_lottery_EV = random_number // 150
		let low_variance_lottery_EV = random_number - delta_EV // 170
		let high_variance_lottery_possible_winnings = [high_variance_lottery_EV - ((HIGH_VARIANCE_VALUE/4)*2),
													high_variance_lottery_EV - ((HIGH_VARIANCE_VALUE/4)*1),
													high_variance_lottery_EV - ((HIGH_VARIANCE_VALUE/4)*0),
													high_variance_lottery_EV - ((HIGH_VARIANCE_VALUE/4)*(-1)),
													high_variance_lottery_EV - ((HIGH_VARIANCE_VALUE/4)*(-2))]
		let low_variance_lottery_possible_winnings = [low_variance_lottery_EV - ((LOW_VARIANCE_VALUE/4)*2),
													low_variance_lottery_EV - ((LOW_VARIANCE_VALUE/4)*1),
													low_variance_lottery_EV - ((LOW_VARIANCE_VALUE/4)*0),
													low_variance_lottery_EV - ((LOW_VARIANCE_VALUE/4)*(-1)),
													low_variance_lottery_EV - ((LOW_VARIANCE_VALUE/4)*(-2))]
		let left_lottery_winnings = high_variance_lottery === 'left' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
		let right_lottery_winnings = high_variance_lottery === 'right' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
		let total_lottery_winnings = left_lottery_winnings + right_lottery_winnings



		let random_pp_card_correct = random_pp_responses_arr[trial_ind]
		let random_pp_curr_trial_winnings = random_pp_card_correct ? total_lottery_winnings : 0

		let below_avg_pp_card_correct = below_avg_pp_responses_arr[trial_ind]
		let below_avg_pp_curr_trial_winnings = below_avg_pp_card_correct ? total_lottery_winnings : 0

		let avg_pp_card_correct = avg_pp_responses_arr[trial_ind]
		let avg_pp_curr_trial_winnings = avg_pp_card_correct ? total_lottery_winnings : 0

		let above_avg_pp_card_correct = above_avg_pp_responses_arr[trial_ind]
		let above_avg_pp_curr_trial_winnings = above_avg_pp_card_correct ? total_lottery_winnings : 0
		
		random_pp_n_correct_trials = random_pp_card_correct ? random_pp_n_correct_trials += 1 : random_pp_n_correct_trials
		random_pp_winnings += random_pp_curr_trial_winnings

		below_avg_pp_n_correct_trials = below_avg_pp_card_correct ? below_avg_pp_n_correct_trials += 1 : below_avg_pp_n_correct_trials
		below_avg_pp_winnings += below_avg_pp_curr_trial_winnings

		avg_pp_n_correct_trials = avg_pp_card_correct ? avg_pp_n_correct_trials += 1 : avg_pp_n_correct_trials
		avg_pp_winnings += avg_pp_curr_trial_winnings

		above_avg_pp_n_correct_trials = above_avg_pp_card_correct ? above_avg_pp_n_correct_trials += 1 : above_avg_pp_n_correct_trials
		above_avg_pp_winnings += above_avg_pp_curr_trial_winnings

		total_possible_winnings += total_lottery_winnings
	}
	random_pp_per_pp_winnings.push(random_pp_winnings)
	below_avg_pp_per_pp_winnings.push(below_avg_pp_winnings)
	avg_pp_per_pp_winnings.push(avg_pp_winnings)
	above_avg_pp_per_pp_winnings.push(above_avg_pp_winnings)
	per_pp_total_possible_winnings.push(total_possible_winnings)
}

const average = arr => arr.reduce((accum, currV) => accum + currV) / arr.length;
console.log(`Results over ${SIMULATIONS} participants, each with ${TRIALS_NUM} trials per pp:`)
console.log('Average total possible winnings per pp = ', average(per_pp_total_possible_winnings))
console.log('Winnings of a pp with random responses, e.g. 50% correct and 50% incorrect = ', average(random_pp_per_pp_winnings))
console.log('Winnings of a pp with below average responses, e.g. 60% correct and 40% incorrect = ', average(below_avg_pp_per_pp_winnings))
console.log('Winnings of a pp with average responses, e.g. 70% correct and 30% incorrect = ', average(avg_pp_per_pp_winnings))
console.log('Winnings of a pp with above average responses, e.g. 80% correct and 20% incorrect = ', average(above_avg_pp_per_pp_winnings))
