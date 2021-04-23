// // dealer-ids generation
// 		let dealer_id = getRandom(DEALERS, 1)[0]
// 		const modular_connection = getRandom(MODULAR_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]
// 		const random_connection = getRandom(RANDOM_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]

// 		if (modular_connections_source == 'friends') {
// 			var friends_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
// 			var work_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
// 		} else {
// 			var friends_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
// 			var work_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
// 		}

// function get_dealer_id_name_dict_randomised() {
// 	let dealer_id_name_dict = {}
// 	let male_names = ['John', 'Marc', 'Oscar', 'Charlie', 'Luis', 'Nick']
// 	let female_names = ['Sarah', 'Katherine', 'Francesca', 'Rebekah', 'Victoria', 'Elizabeth']
// 	let male_faces = ['d01', 'd02', 'd04', 'd05', 'd07', 'd10']
// 	let female_faces = ['d03', 'd06', 'd08', 'd09', 'd11', 'd12']

// 	for (s=0; s<=5; s++) {
// 		male_names = shuffle(male_names)
// 		female_names = shuffle(female_names)
// 		male_faces = shuffle(male_faces)
// 		female_faces = shuffle(female_faces)
// 	}
	
// 	for (i=0; i<male_names.length; i++) {
// 		dealer_id_name_dict[male_faces[i]] = male_names[i]
// 		dealer_id_name_dict[female_faces[i]] = female_names[i]
// 	}
// 	return dealer_id_name_dict
// }
// // let DEALER_ID_NAME_DICT = get_dealer_id_name_dict_randomised()
// // looks like this (but in random order):
// let DEALER_ID_NAME_DICT = {'d01': 'John', 'd02': 'Jack', 'd03': 'Sarah', 'd04': 'Jake', 'd05': 'Charlie', 'd06': 'Katherine', 'd07': 'Luis',
// 							'd08': 'Francesca', 'd09': 'Rebekah', 'd10': 'Nick', 'd11': 'Victoria', 'd12': 'Elizabeth'}
// let DEALERS = Object.keys(DEALER_ID_NAME_DICT)

// let MODULAR_NET_EDGES = ['d01--d02', 'd01--d03', 'd01--d04', 'd02--d03', 'd02--d04', 'd03--d12', 
// 							'd04--d05', 'd05--d06', 'd05--d07', 'd06--d07', 'd06--d08', 'd07--d08', 
// 							'd08--d09', 'd09--d10', 'd09--d11', 'd10--d11', 'd10--d12', 'd11--d12']
// let RANDOM_NET_EDGES = 	['d01--d05', 'd01--d08', 'd01--d12', 'd02--d06', 'd02--d07', 'd02--d11', 
// 							'd03--d05', 'd03--d10', 'd03--d11', 'd04--d08', 'd04--d09', 'd04--d11',
// 							'd05--d09', 'd06--d09', 'd06--d12', 'd07--d10', 'd07--d12', 'd08--d10']


// // in-house flat function to handle browser compatibility
// // credits: https://stackoverflow.com/a/50993569/13078832
// Object.defineProperty(Array.prototype, 'flat', {
// 	value: function(depth = 1) {
// 	  return this.reduce(function (flat, toFlatten) {
// 		return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
// 	  }, []);
// 	}
// });
// //e.g. ([1, 2, 3], 2) becomes [1, 1, 2, 2, 3, 3]
// const expandArray = (arr, times) => arr.map(x => Array(times).fill(x)).flat()
// function shuffle(array) {
// 	var new_array = [...array];
// 	var currentIndex = new_array.length, temporaryValue, randomIndex;

// 	  // While there remain elements to shuffle...
// 	while (0 !== currentIndex) {

// 		// Pick a remaining element...
// 		randomIndex = Math.floor(Math.random() * currentIndex);
// 		currentIndex -= 1;

// 		// And swap it with the current element.
// 		temporaryValue = new_array[currentIndex];
// 		new_array[currentIndex] = new_array[randomIndex];
// 		new_array[randomIndex] = temporaryValue;
// 	}
// 	return new_array;
// }
// function getRandom(arr, n) {
// 	var result = new Array(n),
// 		len = arr.length,
// 		taken = new Array(len);
// 	if (n > len)
// 		throw new RangeError("getRandom: more elements taken than available");
// 	while (n--) {
// 		var x = Math.floor(Math.random() * len);
// 		result[n] = arr[x in taken ? taken[x] : x];
// 		taken[x] = --len in taken ? taken[len] : len;
// 	}
// 	return result;
// }




modular_edges_masterlist = expandArray(MODULAR_NET_EDGES, 2)
random_edges_masterlist = expandArray(RANDOM_NET_EDGES, 2)
for (let s=0; s<5; s++) {
		modular_edges_masterlist = shuffle(modular_edges_masterlist)
		random_edges_masterlist = shuffle(random_edges_masterlist)
	}

// function getDealersCount(masterlist) {
// 	let res = ''
// 	for (i=0; i<DEALERS.length; i++) {
// 		res += `${DEALERS[i]} = ${masterlist.filter(edge => edge.includes(DEALERS[i])).length}; `
// 	}
// 	return res
// }

function get_curr_trial_edges_recursion() {
	dealer_id = getRandom(DEALERS, 1)[0]
	// console.log('selected dealer:', dealer_id)
	try {
		modular_edge = getRandom(modular_edges_masterlist.filter(edge => edge.includes(dealer_id)), 1)[0]
		random_edge = getRandom(random_edges_masterlist.filter(edge => edge.includes(dealer_id)), 1)[0]
		// console.log(`isnde get_curr_trial_edges_recursion, modular_edge = ${modular_edge}, and random_edge = ${random_edge}`)
		
	}
	catch(err) {
		// console.log(err)
		get_curr_trial_edges_recursion()
	}
	return [dealer_id, modular_edge, random_edge]
}

function get_curr_pp_dealers_and_edges() {
	try {
		curr_pp_dealers_order = []
		curr_pp_modular_edges_order = []
		curr_pp_random_edges_order = []
		modular_edges_masterlist_copy = [...modular_edges_masterlist]
		random_edges_masterlist_copy = [...random_edges_masterlist]
		for (trial_ind=0; trial_ind<TRIALS_NUM; trial_ind++) {
			recursion_res = get_curr_trial_edges_recursion()
			dealer_id = recursion_res[0]
			modular_edge = recursion_res[1]
			random_edge = recursion_res[2]
	
			modular_edges_masterlist_copy.splice(modular_edges_masterlist_copy.indexOf(modular_edge), 1)
			random_edges_masterlist_copy.splice(random_edges_masterlist_copy.indexOf(random_edge), 1)

			curr_pp_dealers_order.push(dealer_id)
			curr_pp_modular_edges_order.push(modular_edge)
			curr_pp_random_edges_order.push(random_edge)
		}
	}
	catch(err) {
		get_curr_pp_dealers_and_edges()
	}
	return [curr_pp_dealers_order, curr_pp_modular_edges_order, curr_pp_random_edges_order]
}

// console.log(get_curr_pp_dealers_and_edges())
// console.log('Success')





function get_experiment_data_object() {
	// function instead of hard-coded in order to allow the opportunity to dynamically set parameters before start of test trials
	const experiment_data_object = {'pt_trials_feedback': {}, 'pt_trials': {}, 'test_trials': {}}

	for (let pt_trial_ind = 0; pt_trial_ind < PT_TRIALS_NUM; pt_trial_ind++) {
		// getting cards
		let card_self = getRandom(CARDS, 1)[0]
		let card_comp = getRandom(CARDS.filter(e => e !== card_self), 1)[0]
		let card_correct = CARDS.indexOf(card_comp) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		// lottery-related calculations
		let random_number = getRandomInt(111, 389)
		let delta_EV = getRandom(DELTA_EV_CATEGORIES, 1)[0]
		// lottery-related vars to save (except possible_winnings_arrays)
		let high_variance_lottery = getRandom(['left', 'right'], 1)[0] // 'left'
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

		// dealer-ids generation
		const dealer_id = getRandom(PT_TRIALS_DEALERS, 1)[0]
		const friends_dealer_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id), 1)[0]
		const work_dealer_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e!==friends_dealer_id), 1)[0]

		const pt_trials_block = pt_trial_ind < FEEDBACK_TRIALS ? 'pt_trials_feedback' : 'pt_trials'
		const pt_trials_trial = 'trial_0' + pt_trial_ind
		experiment_data_object[pt_trials_block][pt_trials_trial] = {
			'pt_trial': true,
			'block': 'pt',
			'dealer_id': dealer_id, 
			'card_self': card_self,
			'card_comp': card_comp,
			'card_correct': card_correct,
			'high_variance_lottery': high_variance_lottery, 
			'high_variance_lottery_EV': high_variance_lottery_EV,
			'low_variance_lottery_EV': low_variance_lottery_EV,
			'left_lottery_winnings': left_lottery_winnings,
			'right_lottery_winnings': right_lottery_winnings,
			'total_lottery_winnings': total_lottery_winnings,
			'friends_dealer_id': friends_dealer_id, 
			'work_dealer_id': work_dealer_id
		}
	}

	// ------------------------------------------------------------------------general participant-level randomisation
	// counterbalancing ACROSS PPs, not trials [just randomly allocating to either friends or work]
	let modular_connections_source = getRandom(['friends', 'work'], 1)[0]

	// controlling card pairs
	cards_no_eight = CARDS.filter(e => e !== 'eight')
	cards_trials_masterlist = []
	for (let cardSelf=0; cardSelf<cards_no_eight.length; cardSelf++) {
		for (let cardHidden=0; cardHidden<cards_no_eight.length; cardHidden++) {
			if (cards_no_eight[cardSelf] !== cards_no_eight[cardHidden]) {
				cards_trials_masterlist.push([cards_no_eight[cardSelf], cards_no_eight[cardHidden]])
			}
		}
	}
	for (let s=0; s<=5; s++) {
		cards_trials_masterlist = shuffle(cards_trials_masterlist)
	}
	if (TRIALS_NUM > cards_trials_masterlist.length) {
		// modify the above cards_trials_masterlist to contain more card pairs in order to have more trials
		alert('More than 132 trials selected and not enough card pairs.')
	}

	// controlling position of left and right high variance lottery
	high_variance_lottery_across_trials = expandArray(['left', 'right'], TRIALS_NUM/2)
	for (let s=0; s<=high_variance_lottery_across_trials.length; s++) {
		high_variance_lottery_across_trials = shuffle(high_variance_lottery_across_trials)
	}
	
	// controlling friends and colleagues connections
	recursion_res = get_curr_pp_dealers_and_edges() // very, very ugly and nasty recursion
	dealers_id_masterlist = recursion_res[0]
	if (modular_connections_source == 'friends') {
		friends_edges_masterlist = recursion_res[1]
		work_edges_masterlist = recursion_res[2]
	} else {
		work_edges_masterlist = recursion_res[1]
		friends_edges_masterlist = recursion_res[2]
	}


	for (let trial_ind = 0; trial_ind < TRIALS_NUM; trial_ind++) {	
		// getting cards
		let card_self = cards_trials_masterlist[trial_ind][0]
		let card_comp = cards_trials_masterlist[trial_ind][1]
		let card_correct = CARDS.indexOf(card_comp) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		// lottery-related calculations
		let random_number = getRandomInt(131, 369)
		let delta_EV = getRandom(DELTA_EV_CATEGORIES, 1)[0]
		// lottery-related vars to save (except possible_winnings_arrays)
		let high_variance_lottery = high_variance_lottery_across_trials[trial_ind]
		let high_variance_lottery_EV = random_number
		let low_variance_lottery_EV = random_number - delta_EV
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

		// replacing applied on a case-by-case basis; alternatively could be done on the whole list above
		const dealer_id = dealers_id_masterlist[trial_ind]
		const friends_dealer_id = friends_edges_masterlist[trial_ind].replace(dealer_id, '').replace('--', '')
		const work_dealer_id = work_edges_masterlist[trial_ind].replace(dealer_id, '').replace('--', '')
		// const modular_connection = getRandom(MODULAR_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]
		// const random_connection = getRandom(RANDOM_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]

		// if (modular_connections_source == 'friends') {
		// 	var friends_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
		// 	var work_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
		// } else {
		// 	var friends_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
		// 	var work_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
		// }

		const block_ind = Math.floor(trial_ind / TRIALS_PER_BLOCK)
		const block_key = `block_0${block_ind}`
		const trial_key = `trial_0${trial_ind}`

		// only create block if it does not exist; see https://stackoverflow.com/q/66564488/13078832
		if (!experiment_data_object['test_trials'][block_key]) {
			experiment_data_object['test_trials'][block_key] = {}
		}
		experiment_data_object['test_trials'][block_key][trial_key] = {
			'pt_trial': false,
			'block': block_ind, 
			'trial': trial_ind,
			'dealer_id': dealer_id, 
			'card_self': card_self,
			'card_comp': card_comp,
			'card_correct': card_correct,
			'high_variance_lottery': high_variance_lottery, 
			'high_variance_lottery_EV': high_variance_lottery_EV,
			'low_variance_lottery_EV': low_variance_lottery_EV,
			'left_lottery_winnings': left_lottery_winnings,
			'right_lottery_winnings': right_lottery_winnings,
			'total_lottery_winnings': total_lottery_winnings,
			'friends_dealer_id': friends_dealer_id, 
			'work_dealer_id': work_dealer_id,
			'modular_connections_source': modular_connections_source 
		}
		// console.log(experiment_data_object)
	}
	console.log(experiment_data_object)
	return experiment_data_object
}