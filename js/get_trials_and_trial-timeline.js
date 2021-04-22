function get_single_trial_order() {
	let single_trial_order = []
	if (INFORMATION_MULTIPLE_CHOICE) {
		single_trial_order = [trial_pre_conditional_timeline, 
						trial_information_sampling_noChoice_final_conditional_timeline, trial_information_sampling_2_conditional_timeline,
						trial_information_sampling_noChoice_final_conditional_timeline, trial_information_sampling_3_conditional_timeline, 
						trial_information_sampling_noChoice_final_conditional_timeline, trial_information_sampling_4_conditional_timeline,
						trial_information_sampling_noChoice_final_conditional_timeline, trial_information_sampling_final_conditional_timeline]
	} else {
		single_trial_order = [trial_pre_conditional_timeline, trial_information_sampling_2_conditional_timeline]
	}
	return single_trial_order
}

function get_trials_timeline(single_trial_order, experiment_data_object) {
	const trials_timeline = []
	let test_trials = Object.values(experiment_data_object['test_trials'])
	for (let block_ind=0; block_ind<BLOCKS; block_ind++) {
		const curr_block_timeline = {
			timeline: single_trial_order,
			timeline_variables: Object.values(experiment_data_object['test_trials']['block_0' + block_ind])// test_trials['block_0' + block_ind]
		}
		trials_timeline.push(curr_block_timeline)
		if (block_ind+1 !== BLOCKS) {
			trials_timeline.push({timeline: [fixation_cross, inter_block_text]})
		}
	}
	// NB: trials_timeline is an array of timelines; to export and then add it successfully, it needs to be a
	// timeline object
	const trials_timeline_obj = {timeline: trials_timeline}
	return trials_timeline_obj
}