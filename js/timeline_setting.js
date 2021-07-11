// helper function
function get_trials_timeline(single_trial_order, experiment_data_object) {
	const trials_timeline = []
	let test_trials = Object.values(experiment_data_object['test_trials'])
	for (let block_ind=0; block_ind<BLOCKS; block_ind++) {
		const curr_block_timeline = {
			timeline: single_trial_order,
			timeline_variables: Object.values(experiment_data_object['test_trials'][format_ind_to_key(block_ind, 'block')])// test_trials['block_0' + block_ind]
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

timeline_information_sampling_2_delay_conditional = {
	timeline: [information_sampling_delay],
	conditional_function: function() {
		return jsPsych.data.get().last(1).values()[0]['button_pressed'] !== '2'
	}
}

const experiment_data_object = get_experiment_data_object()
const single_trial_order = [fixation_cross, card_presentation_trial, card_decision, 
							fixation_cross, information_sampling, information_sampling_delay, information_sampling_2_optional, timeline_information_sampling_2_delay_conditional]
// single_trial_order = [fixation_cross, information_sampling, information_sampling_delay, information_sampling_2_optional, timeline_information_sampling_2_delay_conditional]

pt_trials_timeline = {
	timeline: single_trial_order,
	timeline_variables: Object.values(experiment_data_object['pt_trials'])
}
const trials_timeline = get_trials_timeline(single_trial_order, experiment_data_object)

const experiment_data_object_for_memory_test = get_experiment_data_object_for_memory_test()



var timeline = []

var skip_to_memory_test = jsPsych.data.getURLVariable('skip_to_memory_test');
if (skip_to_memory_test !== 'true') {
	timeline.push({timeline: [fullscreen_message, pis, instructions]})
	// timeline.push({timeline: [instructions]})
	timeline.push(pt_trials_timeline)
	timeline.push({timeline: [fixation_cross, pt_block_feedback, test_intro]})
	timeline.push(trials_timeline)
}
timeline.push(memory_test_intro)
timeline.push({timeline: [memory_test_trial], timeline_variables: Object.values(experiment_data_object_for_memory_test['test_trials'])})
timeline.push(debrief)