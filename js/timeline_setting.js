var timeline = []

var participant_intro_timeline = {
	timeline: [fullscreen_message, pis, instructions],
	conditional_function: function() {
		return EXP_MODE == 'PARTICIPANT'
	}
}

var participant_debrief_timeline = {
	timeline: [debrief],
	conditional_function: function() {
		return EXP_MODE == 'PARTICIPANT'
	}
}

var trial_pre_conditional_timeline = {
	timeline: [fixation_cross, card_presentation_trial, card_decision, fixation_cross, information_sampling_1]
}

var trial_information_sampling_2_conditional_timeline = {
	timeline: [information_sampling_1_delay, information_sampling_2],
	conditional_function: function() {
		time_rmn = jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		return (time_rmn !== null) && (time_rmn > INFORMATION_SAMPLING_INTERCHOICE_DELAY)
	}
};

var trial_information_sampling_3_conditional_timeline = {
	timeline: [information_sampling_2_delay, information_sampling_3],
	conditional_function: function() {
		time_rmn = jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		return (time_rmn !== null) && (time_rmn > INFORMATION_SAMPLING_INTERCHOICE_DELAY)
	}
};

var trial_information_sampling_4_conditional_timeline = {
	timeline: [information_sampling_3_delay, information_sampling_4],
	conditional_function: function() {
		time_rmn = jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		return (time_rmn !== null) && (time_rmn > INFORMATION_SAMPLING_INTERCHOICE_DELAY)
	}
};

var trial_information_sampling_noChoice_final_conditional_timeline = {
	timeline: [information_sampling_final_noChoice],
	conditional_function: function() {
		time_rmn = jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		return (time_rmn !== null) && (time_rmn < INFORMATION_SAMPLING_INTERCHOICE_DELAY)
	}
};

var trial_information_sampling_final_conditional_timeline = {
	timeline: [information_sampling_final],
	conditional_function: function() {
		time_rmn = jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		return (time_rmn !== null) && (time_rmn > INFORMATION_SAMPLING_INTERCHOICE_DELAY)
	}
};


var exp_mode = {
	type: 'html-keyboard-response',
	stimulus: '<p>FOR DEMO PURPOSE ONLY</p>'+
	'<p>Select which mode to trial the experiment.</p>'+
	'<p>Press 1 for DEMO mode - you will not see instructions, practice trials or debrief.</p>'+
	'<p>Press 2 for PARTICIPANT mode - you will see everything.</p>',
	choices: ['1', '2'],
	on_finish: function(data) {
		data.key_press === 49 ? EXP_MODE = 'DEMO' : EXP_MODE = 'PARTICIPANT'
	}
}

var exp_parameters = {
	type: 'survey-html-form',
	preamble: '<p>VIEW/SET EXPERIMENT PARAMETERS</p>'+
				'<p>[Note: please do not set pt/test trial numbers to 0s - bad things happen for some reason]</p>'+
				'<p>[Note: blocks do not work yet - yet to be implemented]</p>',
	html: function() {
		temp_multiple_choice = INFORMATION_MULTIPLE_CHOICE ? 'yes' : 'no'
		return 		'<label>Sample multiple pieces of information? (yes/no): </label><input name="information_multiple_choice" type="text" value="'+temp_multiple_choice+'"/>'+
					'<label>Card presentation trial duration: </label><input name="card_presentation_trial_duration" type="text" value="'+CARD_PRESENTATION_TRIAL_DURATION+'"/>'+
					'<label>High variance value: </label><input name="high_variance_value" type="text" value="'+HIGH_VARIANCE_VALUE+'"/>'+
					'<label>Low variance value: </label><input name="low_variance_value" type="text" value="'+LOW_VARIANCE_VALUE+'"/></p>'+
					'<label>Information sampling duration: </label><input name="information_sampling_duration" type="text" value="'+INFORMATION_SAMPLING_DURATION+'"/>'+
					'<label>Information sampling INTER-CHOICE delay: </label><input name="information_sampling_interchoice_delay" type="text" value="'+INFORMATION_SAMPLING_INTERCHOICE_DELAY+'"/>'+
					'<label>How many practice trials? </label><input name="pt_trials_num" type="text" value="'+PT_TRIALS_NUM+'"/>'+
					'<label>Out of the practice trials, how many  with feedback? </label><input name="feedback_trials" type="text" value="'+FEEDBACK_TRIALS+'"/>'+
					'<label>How many test trials? </label><input name="trials_num" type="text" value="'+TRIALS_NUM+'"/>'+
					'<label>How many trials per block? </label><input name="trials_per_block" type="text" value="'+TRIALS_PER_BLOCK+'"/>'
		},
	on_finish: function(data) {
		responses = JSON.parse(data.responses)
		INFORMATION_MULTIPLE_CHOICE = responses['information_multiple_choice'] === 'yes'
		CARD_PRESENTATION_TRIAL_DURATION = parseInt(responses['card_presentation_trial_duration'])
		HIGH_VARIANCE_VALUE = parseInt(responses['high_variance_value'])
		LOW_VARIANCE_VALUE = parseInt(responses['low_variance_value'])
		INFORMATION_SAMPLING_DURATION = parseInt(responses['information_sampling_duration'])
		INFORMATION_SAMPLING_INTERCHOICE_DELAY = parseInt(responses['information_sampling_interchoice_delay'])
		PT_TRIALS_NUM = parseInt(responses['pt_trials_num'])
		FEEDBACK_TRIALS = parseInt(responses['feedback_trials'])
		TRIALS_NUM = parseInt(responses['trials_num'])
		TRIALS_PER_BLOCK = parseInt(responses['trials_per_block'])
		BLOCKS = TRIALS_NUM >= TRIALS_PER_BLOCK ? TRIALS_NUM/TRIALS_PER_BLOCK : 1
		document.getElementById('information-timer').max = INFORMATION_SAMPLING_DURATION

		experiment_data_object = get_experiment_data_object()
		single_trial_order = get_single_trial_order()
		trials_timeline = get_trials_timeline(single_trial_order, experiment_data_object)

		var pt_trials_feedback_timeline = {
			timeline: single_trial_order.concat([fixation_cross, pt_feedback]),
			timeline_variables: Object.values(experiment_data_object['pt_trials_feedback'])
		}
		var pt_trials_NOfeedback_timeline = {
			timeline: single_trial_order,
			timeline_variables: Object.values(experiment_data_object['pt_trials'])
		}

		// not sure but this only works if I constantly pause
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(participant_intro_timeline, jsPsych.resumeExperiment) // conditional
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(pt_trials_feedback_timeline, jsPsych.resumeExperiment)
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(pt_trials_NOfeedback_timeline, jsPsych.resumeExperiment)
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline({timeline: [fixation_cross, pt_block_feedback, test_intro]}, jsPsych.resumeExperiment)
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(trials_timeline, jsPsych.resumeExperiment)
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(fixation_cross, jsPsych.resumeExperiment)
		jsPsych.pauseExperiment();
		jsPsych.addNodeToEndOfTimeline(participant_debrief_timeline, jsPsych.resumeExperiment)
	}
}
timeline.push(exp_parameters)