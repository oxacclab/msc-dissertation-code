function get_dealers_friends_work_id_masterlists() {
		let dealers_id_masterlist = []
		let friends_id_masterlist = []
		let work_id_masterlist = []

		// each modular edge is bi-directional, hence multiply by 2
		// for 18 edges, one iteration of the outmost loop produces 36 entries
		for (block_level_iteration_ind=0; block_level_iteration_ind<TRIALS_NUM/(MODULAR_NET_EDGES.length*2); block_level_iteration_ind++) {
			// randomize order of each group for each iteration of all edges
			modular_net_dealer_groups_curr = shuffle(MODULAR_NET_DEALER_GROUPS)

			for (modular_net_dealer_group of modular_net_dealer_groups_curr) {
				// randomize dealers within each group
				modular_net_dealer_group = shuffle(modular_net_dealer_group)
				for (curr_dealer_id of modular_net_dealer_group) {
					if (MODULAR_CONNECTIONS_SOURCE == 'friends') {
						dealer_friends_edges = shuffle(MODULAR_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
						dealer_work_edges = shuffle(RANDOM_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
					} else if (MODULAR_CONNECTIONS_SOURCE == 'work') {
						dealer_friends_edges = shuffle(RANDOM_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
						dealer_work_edges = shuffle(MODULAR_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
					}
					for (i=0; i<dealer_friends_edges.length; i++) {
						friends_id = dealer_friends_edges[i].replace(curr_dealer_id, '').replace('--', '')
						work_id = dealer_work_edges[i].replace(curr_dealer_id, '').replace('--', '')

						dealers_id_masterlist.push(curr_dealer_id)
						friends_id_masterlist.push(friends_id)
						work_id_masterlist.push(work_id)
					}
				}
			}
		}

		return [dealers_id_masterlist, friends_id_masterlist, work_id_masterlist]
	}

function get_cards_trials_masterlist() {
	let cards_trials_masterlist = []

	let cards_no_middle_card = CARDS.filter(e => e !== 'seven')
	for (let cardSelf=0; cardSelf<cards_no_middle_card.length; cardSelf++) {
		for (let cardHidden=0; cardHidden<cards_no_middle_card.length; cardHidden++) {
			if (cards_no_middle_card[cardSelf] !== cards_no_middle_card[cardHidden]) {
				cards_trials_masterlist.push([cards_no_middle_card[cardSelf], cards_no_middle_card[cardHidden]])
			}
		}
	}
	// shuffling a few times just for a nicely randomised set
	for (let s=0; s<=5; s++) {
		cards_trials_masterlist = shuffle(cards_trials_masterlist)
	}

	return cards_trials_masterlist
}

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
		const friends_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id), 1)[0]
		const work_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e!==friends_id), 1)[0]

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
			'friends_id': friends_id, 
			'work_id': work_id
		}
	}

	// ------------------------------------------------------------------------general participant-level randomisation
	// controlling card pairs
	cards_trials_masterlist = get_cards_trials_masterlist()
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
	// JS does not support funcs with multiple return values, hence the 3 masterlists are stored in an array temporarily
	const dealers_friends_work_id_masterlists = get_dealers_friends_work_id_masterlists()
	const dealers_id_masterlist = dealers_friends_work_id_masterlists[0]
	const friends_id_masterlist = dealers_friends_work_id_masterlists[1]
	const work_id_masterlist = dealers_friends_work_id_masterlists[2]

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

		const dealer_id = dealers_id_masterlist[trial_ind]
		const friends_id = friends_id_masterlist[trial_ind]
		const work_id = work_id_masterlist[trial_ind]

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
			'friends_id': friends_id, 
			'work_id': work_id
		}
		// console.log(experiment_data_object)
	}
	// console.log(experiment_data_object)
	return experiment_data_object
}