function get_experiment_data_object() {
	// function instead of hard-coded in order to allow the opportunity to dynamically set parameters before start of test trials
	const experiment_data_object = {'pt_trials_feedback': {}, 'pt_trials': {}, 'test_trials': {}}

	for (let pt_trial_ind = 0; pt_trial_ind < PT_TRIALS_NUM; pt_trial_ind++) {
		// getting cards
		let card_self = getRandom(CARDS, 1)[0]
		let card_hidden = getRandom(CARDS.filter(e => e !== card_self), 1)[0]
		let card_correct = CARDS.indexOf(card_hidden) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		// lottery-related calculations
		let random_number = getRandomInt(111, 389)
		let delta_EV = getRandom(DELTA_EV_CATEGORIES, 1)[0]
		// lottery-related vars to save (except possible_winnings_arrays)
		let high_variance_lottery_left_or_right = getRandom(['left', 'right'], 1)[0] // 'left' // getRandom(['left', 'right'], 1)[0]
		let high_variance_lottery_EV = random_number // 150 // random_number
		let low_variance_lottery_EV = random_number - delta_EV // 170 // random_number - delta_EV
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
		let left_lottery_winnings = high_variance_lottery_left_or_right === 'left' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
		let right_lottery_winnings = high_variance_lottery_left_or_right === 'right' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
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
			'card_hidden': card_hidden,
			'card_correct': card_correct,
			'high_variance_lottery_left_or_right': high_variance_lottery_left_or_right, 
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
	// controlling card pairs
	cards_no_middle_card = CARDS.filter(e => e !== 'seven')
	cards_trials_masterlist = []
	for (let cardSelf=0; cardSelf<cards_no_middle_card.length; cardSelf++) {
		for (let cardHidden=0; cardHidden<cards_no_middle_card.length; cardHidden++) {
			if (cards_no_middle_card[cardSelf] !== cards_no_middle_card[cardHidden]) {
				cards_trials_masterlist.push([cards_no_middle_card[cardSelf], cards_no_middle_card[cardHidden]])
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

	// first, setting up some functions and variables --- very, very ugly and nasty recursions but they work
	modular_edges_masterlist = expandArray(MODULAR_NET_EDGES, 2)
	random_edges_masterlist = expandArray(RANDOM_NET_EDGES, 2)
	for (let s=0; s<5; s++) {
			modular_edges_masterlist = shuffle(modular_edges_masterlist)
			random_edges_masterlist = shuffle(random_edges_masterlist)
		}

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

	// now, running function to get info for current pp
	recursion_res = get_curr_pp_dealers_and_edges()
	dealers_id_masterlist = recursion_res[0]
	if (MODULAR_CONNECTIONS_SOURCE == 'friends') {
		friends_edges_masterlist = recursion_res[1]
		work_edges_masterlist = recursion_res[2]
	} else {
		work_edges_masterlist = recursion_res[1]
		friends_edges_masterlist = recursion_res[2]
	}


	for (let trial_ind = 0; trial_ind < TRIALS_NUM; trial_ind++) {	
		// getting cards
		let card_self = cards_trials_masterlist[trial_ind][0]
		let card_hidden = cards_trials_masterlist[trial_ind][1]
		let card_correct = CARDS.indexOf(card_hidden) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		// lottery-related calculations
		let random_number = getRandomInt(131, 369)
		let delta_EV = getRandom(DELTA_EV_CATEGORIES, 1)[0]
		// lottery-related vars to save (except possible_winnings_arrays)
		let high_variance_lottery_left_or_right = high_variance_lottery_across_trials[trial_ind]
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
		let left_lottery_winnings = high_variance_lottery_left_or_right === 'left' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
		let right_lottery_winnings = high_variance_lottery_left_or_right === 'right' ? getRandom(high_variance_lottery_possible_winnings, 1)[0] : getRandom(low_variance_lottery_possible_winnings, 1)[0]
		let total_lottery_winnings = left_lottery_winnings + right_lottery_winnings

		// replacing applied on a case-by-case basis; alternatively could be done on the whole list above
		const dealer_id = dealers_id_masterlist[trial_ind]
		const friends_dealer_id = friends_edges_masterlist[trial_ind].replace(dealer_id, '').replace('--', '')
		const work_dealer_id = work_edges_masterlist[trial_ind].replace(dealer_id, '').replace('--', '')

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
			'card_hidden': card_hidden,
			'card_correct': card_correct,
			'high_variance_lottery_left_or_right': high_variance_lottery_left_or_right, 
			'high_variance_lottery_EV': high_variance_lottery_EV,
			'low_variance_lottery_EV': low_variance_lottery_EV,
			'left_lottery_winnings': left_lottery_winnings,
			'right_lottery_winnings': right_lottery_winnings,
			'total_lottery_winnings': total_lottery_winnings,
			'friends_dealer_id': friends_dealer_id, 
			'work_dealer_id': work_dealer_id
		}
		// console.log(experiment_data_object)
	}
	// console.log(experiment_data_object)
	return experiment_data_object
}