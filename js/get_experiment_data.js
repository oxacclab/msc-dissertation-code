/*
const data = {"x": 2, "y": 3}

const master_obj = {"useless": {}, "important": {}}

var block_ind = 0
let trials = 12
let trials_per_block = 4
const important = master_obj.important; // *** No need to repeat this
for (let trial_ind=0; trial_ind<trials; trial_ind++) {
//   ^^^−−−− *** Declare your variables
    // every 4 trials are in a new block
    block_ind = trial_ind % trials_per_block == 0 ? trial_ind/trials_per_block : block_ind

    // *** Only create this if it doesn't exist
    if (!master_obj["important"]["block_0"+block_ind]) {
        master_obj["important"]["block_0"+block_ind] = {}
    }
    master_obj["important"]["block_0"+block_ind]["trial_0"+trial_ind] = {...data} // ***
}
console.log(master_obj)
*/
function get_experiment_data_object() {
	// function instead of hard-coded in order to allow the opportunity to dynamically set parameters before start of test trials
	const experiment_data_object = {'pt_trials_feedback': {}, 'pt_trials': {}, 'test_trials': {}}

	// general participant-level randomisation
	// counterbalancing ACROSS PPs, not trials [just randomly allocating to either friends or work]
	let modular_connections_source = getRandom(['friends', 'work'], 1)[0]

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

	// cards_no_eight = CARDS.filter(e => e !== 'Eight')
	// if (TRIALS_NUM <= cards_no_eight.length) {
	// 	curr_pp_allcards = cards_no_eight
	// } else if (TRIALS_NUM > cards_no_eight.length && TRIALS_NUM % cards_no_eight.length === 0) {
	// 	curr_pp_allcards = expandArray(cards_no_eight, TRIALS_NUM/cards_no_eight.length)
	// } else {
	// 	alert('The selected trial numbers are greater than the available cards for the test trials and are not divisible by the number of available cards - this may cause issues and the experiment might not work properly. Please decide on a way to select cards or change trial numbers.')
	// }
	// for (i=0; i<5; i++) { // 5 shuffles just in case
	// 	curr_pp_allcards = shuffle(curr_pp_allcards)
	// }

	cards_no_eight = CARDS.filter(e => e !== 'Eight')
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


	high_variance_lottery_across_trials = expandArray(['left', 'right'], TRIALS_NUM/2)
	for (let s=0; s<=high_variance_lottery_across_trials.length; s++) {
		high_variance_lottery_across_trials = shuffle(high_variance_lottery_across_trials)
	}
	// var block_ind
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

		// dealer-ids generation
		let dealer_id = getRandom(DEALERS, 1)[0]
		const modular_connection = getRandom(MODULAR_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]
		const random_connection = getRandom(RANDOM_NET_EDGES.filter(edge => edge.includes(dealer_id)), 1)[0]

		if (modular_connections_source == 'friends') {
			var friends_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
			var work_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
		} else {
			var friends_dealer_id = random_connection.replace(dealer_id, '').replace('--', '')
			var work_dealer_id = modular_connection.replace(dealer_id, '').replace('--', '')
		}

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