function get_information_sampling_trials_obj() {
	// very hard to read func but there you go
	let information_sampling_trials_obj = {}
	const blocks = 3

	let trial_ind = 0;
	for (let block_ind = 0; block_ind < blocks; block_ind++) {
		let block_key = format_ind_to_key(block_ind, 'block')
		// randomize order of each group for each iteration of all edges
		modular_net_dealer_groups_curr = shuffle(MODULAR_NET_DEALER_GROUPS)


		for (modular_net_dealer_group of modular_net_dealer_groups_curr) {
			// randomize dealers within each group
			modular_net_dealer_group = shuffle(modular_net_dealer_group)
			// advance info means that the structure is as follows (order Dealer/first choice id/second choice id): D1/D2/D3, D1/D3/D4, D1/D4/D2 (or as arr ind that would be: 0-1, 1-2, 2-0)
			// same as before means that the structure is as follows: D1/D2/D3, D1/D4/D2, D1/D3/D4 (or as arr ind that would be: 0-1, 2-0, 1-2),
			// where D1-D4 vary for the current group
			let per_dealer_mandatory_optional_informational_structure = shuffle(expandArray(['advance_info', 'same_as_before'], 2))
			let per_dealer_mandatory_optional_informational_structure_index = 0;
			for (curr_dealer_id of modular_net_dealer_group) {
				if (MODULAR_CONNECTIONS_SOURCE == 'friends') {
					dealer_friends_edges = shuffle(MODULAR_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
					dealer_work_edges = shuffle(RANDOM_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
				} else if (MODULAR_CONNECTIONS_SOURCE == 'work') {
					dealer_friends_edges = shuffle(RANDOM_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
					dealer_work_edges = shuffle(MODULAR_NET_EDGES.filter(edge => edge.includes(curr_dealer_id)))
				}

				let first_and_second_choices_indices_arr = []
				if (per_dealer_mandatory_optional_informational_structure[per_dealer_mandatory_optional_informational_structure_index] == 'advance_info') {
					first_and_second_choices_indices_arr = [[0, 1], [1, 2], [2, 0]]
				} else {
					first_and_second_choices_indices_arr = [[0, 1], [2, 0], [1, 2]]
				}

				for (i=0; i<first_and_second_choices_indices_arr.length; i++) {
					// basically first time its 0-1, then 1-2, then 2-0 as indices
					first_choice_friends_id = dealer_friends_edges[first_and_second_choices_indices_arr[i][0]].replace(curr_dealer_id, '').replace('--', '')
					first_choice_work_id = dealer_work_edges[first_and_second_choices_indices_arr[i][0]].replace(curr_dealer_id, '').replace('--', '')
					second_choice_friends_id = dealer_friends_edges[first_and_second_choices_indices_arr[i][1]].replace(curr_dealer_id, '').replace('--', '')
					second_choice_work_id = dealer_work_edges[first_and_second_choices_indices_arr[i][1]].replace(curr_dealer_id, '').replace('--', '')

					let trial_key = format_ind_to_key(trial_ind, 'trial')
					if (!information_sampling_trials_obj[block_key]) {
						information_sampling_trials_obj[block_key] = {}
					}
					information_sampling_trials_obj[block_key][trial_key] = {
						'dealer_id': curr_dealer_id,
						'structure': per_dealer_mandatory_optional_informational_structure[per_dealer_mandatory_optional_informational_structure_index],
						'first_choice_friends_id': first_choice_friends_id,
						'first_choice_work_id': first_choice_work_id,
						'second_choice_friends_id': second_choice_friends_id,
						'second_choice_work_id': second_choice_work_id
					}
					trial_ind++;
				}
				per_dealer_mandatory_optional_informational_structure_index++;
			}
		}
	}
	return information_sampling_trials_obj
}

function get_cards_trials_masterlist() {
	let cards_trials_cardSelf_masterlist = []
	let cards_trials_cardHidden_masterlist = []

	let cards_no_middle_card = CARDS.filter(e => e !== 'seven')

	// 6 possible probabilities of winning depending on visible card
	each_card_occurance = Math.ceil(TRIALS_NUM / 6) / 2 // dividing by two here as each card must appear 9 times in order for each probability to appear 18 times
	cards_trials_cardSelf_masterlist = shuffle(expandArray(cards_no_middle_card, each_card_occurance))
	for (cardSelf of cards_trials_cardSelf_masterlist) {
		// get a random hidden card for each self card
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
		const first_choice_friends_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id), 1)[0]
		const first_choice_work_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e!==first_choice_friends_id), 1)[0]
		const second_choice_friends_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e !== first_choice_friends_id & e !== first_choice_work_id), 1)[0]
		const second_choice_work_id = getRandom(PT_TRIALS_DEALERS.filter(e => e !== dealer_id & e !== first_choice_friends_id & 
																				e !== first_choice_work_id & e !== second_choice_friends_id), 1)[0]
		const pt_trials_trial = format_ind_to_key(pt_trial_ind, 'trial')
		experiment_data_object['pt_trials'][pt_trials_trial] = {
			'pt_trial': true,
			'block': 'pt',
			'card_self': card_self,
			'card_hidden': card_hidden,
			'card_correct': card_correct,
			'dealer_id': dealer_id,
			'first_choice_friends_id': first_choice_friends_id, 
			'first_choice_work_id': first_choice_work_id, 
			'second_choice_friends_id': second_choice_friends_id, 
			'second_choice_work_id': second_choice_work_id
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
	const information_sampling_trials_obj = get_information_sampling_trials_obj()
	console.log(information_sampling_trials_obj)

	for (let trial_ind = 0; trial_ind < TRIALS_NUM; trial_ind++) {	
		// getting cards
		let card_self = cards_trials_cardSelf_masterlist[trial_ind]
		let card_hidden = cards_trials_cardHidden_masterlist[trial_ind]
		let card_correct = CARDS.indexOf(card_hidden) > CARDS.indexOf(card_self) ? 'higher' : 'lower'

		const block_ind = Math.floor(trial_ind / TRIALS_PER_BLOCK)
		const block_key = format_ind_to_key(block_ind, 'block')
		const trial_key = format_ind_to_key(trial_ind, 'trial')

		// only create block if it does not exist; see https://stackoverflow.com/q/66564488/13078832
		if (!experiment_data_object['test_trials'][block_key]) {
			experiment_data_object['test_trials'][block_key] = {}
		}
		experiment_data_object['test_trials'][block_key][trial_key] = {
			'pt_trial': false,
			'block': block_ind, 
			'trial': trial_ind, 
			'card_self': card_self,
			'card_hidden': card_hidden,
			'card_correct': card_correct,
			'dealer_id': information_sampling_trials_obj[block_key][trial_key]['dealer_id'],
			'first_choice_friends_id': information_sampling_trials_obj[block_key][trial_key]['first_choice_friends_id'], 
			'first_choice_work_id': information_sampling_trials_obj[block_key][trial_key]['first_choice_work_id'],
			'second_choice_friends_id': information_sampling_trials_obj[block_key][trial_key]['second_choice_friends_id'], 
			'second_choice_work_id': information_sampling_trials_obj[block_key][trial_key]['second_choice_work_id'],
			'structure': information_sampling_trials_obj[block_key][trial_key]['structure']
		}
		// console.log(experiment_data_object)
	}
	console.log(experiment_data_object)
	return experiment_data_object
}

function get_experiment_data_object_for_memory_test(dealer_id, curr_trial_choices_sources) {
	memory_test_trials_per_opt = 12
	stimulus_question_html_opts = expandArray(['<p>Who is the dealer <b>friends with</b>?</p>', '<p>Who <b>works the same time</b> as the dealer?</p>'], memory_test_trials_per_opt)
	target_dealer_id_list = shuffle(DEALERS).concat(shuffle(DEALERS))

	function get_curr_trial_choices_sources_and_ids_nested_list(dealer_id) {
		let dealer_friends_edges
		let dealer_work_edges
		if (MODULAR_CONNECTIONS_SOURCE == 'friends') {
			dealer_friends_edges = MODULAR_NET_EDGES.filter(edge => edge.includes(dealer_id))
			dealer_work_edges = RANDOM_NET_EDGES.filter(edge => edge.includes(dealer_id))
		} else if (MODULAR_CONNECTIONS_SOURCE == 'work') {
			dealer_friends_edges = RANDOM_NET_EDGES.filter(edge => edge.includes(dealer_id))
			dealer_work_edges = MODULAR_NET_EDGES.filter(edge => edge.includes(dealer_id))
		}
		
		let dealer_friends_id = getRandom(dealer_friends_edges, 1)[0].replace(dealer_id, '').replace('--', '')
		let dealer_work_id = getRandom(dealer_work_edges, 1)[0].replace(dealer_id, '').replace('--', '')
		let dealer_nonconnection_edges = MODULAR_NET_EDGES.filter(edge => !edge.includes(dealer_id)).concat(RANDOM_NET_EDGES.filter(edge => !edge.includes(dealer_id)))
											.filter(edge => !edge.includes(dealer_friends_id) & !edge.includes(dealer_work_id))
		let dealer_random_id = getRandom(dealer_nonconnection_edges, 1)[0].slice(0, 3)

		return shuffle([['friends', dealer_friends_id], ['work', dealer_work_id], ['random', dealer_random_id]])
	}

	let experiment_data_object = {'test_trials': {}}

	for (let trial_ind = 0; trial_ind < 24; trial_ind++) {	
		let curr_trial_choices_sources_and_ids_nested_list = get_curr_trial_choices_sources_and_ids_nested_list(target_dealer_id_list[trial_ind])

		const trial_key = format_ind_to_key(trial_ind, 'trial')
		experiment_data_object['test_trials'][trial_key] = {
			'trial': trial_ind,
			'stimulus_question_html': stimulus_question_html_opts[trial_ind],
			'target_dealer_id': target_dealer_id_list[trial_ind],
			'dealer_choice_1_source': curr_trial_choices_sources_and_ids_nested_list[0][0],
			'dealer_choice_2_source': curr_trial_choices_sources_and_ids_nested_list[1][0],
			'dealer_choice_3_source': curr_trial_choices_sources_and_ids_nested_list[2][0],
			'dealer_choice_1_id': curr_trial_choices_sources_and_ids_nested_list[0][1],
			'dealer_choice_2_id': curr_trial_choices_sources_and_ids_nested_list[1][1],
			'dealer_choice_3_id': curr_trial_choices_sources_and_ids_nested_list[2][1],
			'correct_choice_id': trial_ind < 12 ? curr_trial_choices_sources_and_ids_nested_list.find(e => e.indexOf('friends') != -1)[1]:
												curr_trial_choices_sources_and_ids_nested_list.find(e => e.indexOf('work') != -1)[1],
			'correct_choice_button_press': trial_ind < 12 ? curr_trial_choices_sources_and_ids_nested_list.findIndex(e => e.indexOf('friends') != -1):
												curr_trial_choices_sources_and_ids_nested_list.findIndex(e => e.indexOf('work') != -1)
		}
		// console.log(experiment_data_object)
	}
	console.log(experiment_data_object)
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