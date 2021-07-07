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
	let cards_trials_cardSelf_masterlist = []
	let cards_trials_cardHidden_masterlist = []

	let cards_no_middle_card = CARDS.filter(e => e !== 'seven')

	// 6 possible probabilities of winning depending on visible card
	each_card_occurance = Math.ceil(TRIALS_NUM / 6)
	cards_trials_cardSelf_masterlist = shuffle(expandArray(cards_no_middle_card, each_card_occurance))
	for (cardSelf of cards_trials_cardSelf_masterlist) {
		cardHidden = getRandom(cards_no_middle_card.filter(e  => e !== cardSelf), 1)[0]
		cards_trials_cardHidden_masterlist.push(cardHidden)
	}

	return [cards_trials_cardSelf_masterlist, cards_trials_cardHidden_masterlist]
}

function get_experiment_data_object() {
	// function instead of hard-coded in order to allow the opportunity to dynamically set parameters before start of test trials
	const experiment_data_object = {'pt_trials': {}, 'test_trials': {}}

	for (let pt_trial_ind = 0; pt_trial_ind < PT_TRIALS_NUM; pt_trial_ind++) {
		// getting cards
		let card_self = getRandom(CARDS, 1)[0]
		let card_hidden = getRandom(CARDS.filter(e => e !== card_self), 1)[0]
		let card_correct = CARDS.indexOf(card_hidden) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		// dealer-ids generation
		const dealer_id = getRandom(PT_TRIALS_DEALERS, 1)[0]
		const friends_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id), 1)[0]
		const work_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e!==friends_id), 1)[0]

		const pt_trials_trial = 'trial_0' + pt_trial_ind
		experiment_data_object['pt_trials'][pt_trials_trial] = {
			'pt_trial': true,
			'block': 'pt',
			'dealer_id': dealer_id, 
			'card_self': card_self,
			'card_hidden': card_hidden,
			'card_correct': card_correct,
			'friends_id': friends_id, 
			'work_id': work_id
		}
	}

	// ------------------------------------------------------------------------general participant-level randomisation
	// controlling card pairs
	const cards_trials_masterlist = get_cards_trials_masterlist()
	const cards_trials_cardSelf_masterlist = cards_trials_masterlist[0]
	const cards_trials_cardHidden_masterlist = cards_trials_masterlist[1]
	if (TRIALS_NUM > cards_trials_cardSelf_masterlist.length) {
		// modify the above cards_trials_masterlist to contain more card pairs in order to have more trials
		alert('More than 132 trials selected and not enough card pairs.')
	}
	
	// controlling friends and colleagues connections
	// JS does not support funcs with multiple return values, hence the 3 masterlists are stored in an array temporarily
	const dealers_friends_work_id_masterlists = get_dealers_friends_work_id_masterlists()
	const dealers_id_masterlist = dealers_friends_work_id_masterlists[0]
	const friends_id_masterlist = dealers_friends_work_id_masterlists[1]
	const work_id_masterlist = dealers_friends_work_id_masterlists[2]

	for (let trial_ind = 0; trial_ind < TRIALS_NUM; trial_ind++) {	
		// getting cards
		let card_self = cards_trials_cardSelf_masterlist[trial_ind]
		let card_hidden = cards_trials_cardHidden_masterlist[trial_ind]
		let card_correct = CARDS.indexOf(card_hidden) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

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
			'friends_id': friends_id, 
			'work_id': work_id
		}
		// console.log(experiment_data_object)
	}
	// console.log(experiment_data_object)
	return experiment_data_object
}

function get_experiment_data_object_for_memory_test() {
	MEMORY_TEST_TRIALS = 10
	STIMULUS_QUESTION_HTML_OPTS = ['<p>Who is the dealer <b>friends with</b>?</p>', '<p>Who <b>works the same time</b> as the dealer?</p>']
	TARGET_DEALER_ID_LIST = getRandom(DEALERS, 10)
	DEALER_CHOICE_1_ID_LIST = getRandom(DEALERS, 10)
	DEALER_CHOICE_2_ID_LIST = getRandom(DEALERS, 10)

	// function instead of hard-coded in order to allow the opportunity to dynamically set parameters before start of test trials
	const experiment_data_object = {'test_trials': {}}

	for (let trial_ind = 0; trial_ind < MEMORY_TEST_TRIALS; trial_ind++) {	

		const trial_key = format_ind_to_key(trial_ind, 'trial')

		experiment_data_object['test_trials'][trial_key] = {
			'trial': trial_ind,
			'stimulus_question_html': getRandom(STIMULUS_QUESTION_HTML_OPTS, 1)[0],
			'target_dealer_id': TARGET_DEALER_ID_LIST[trial_ind],
			'dealer_choice_1_id': DEALER_CHOICE_1_ID_LIST[trial_ind],
			'dealer_choice_2_id': DEALER_CHOICE_2_ID_LIST[trial_ind],
			'correct_choice': getRandom([DEALER_CHOICE_1_ID_LIST[trial_ind], DEALER_CHOICE_2_ID_LIST[trial_ind]], 1)[0],
		}
		// console.log(experiment_data_object)
	}
	// console.log(experiment_data_object)
	return experiment_data_object
}

// helper func to translate a zero-based index to a key in the format 001
function format_ind_to_key(ind, type) {
	let key
	if (ind < 10) {
		key = `${type}_00${ind}`
	} else if (ind >= 10 && ind < 100) {
		key = `${type}_0${ind}`
	} else {
		key = `${type}_${ind}`
	}
	return key
}