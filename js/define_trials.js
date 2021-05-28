// ------------------------------------------helper functions when defining trials
function save_all_trial_data(data) {
	// attmpt to save data on each trial in case the time remaining expires
	// this ensures that all the relevant data is on one row when processing later
	data.pt_trial = jsPsych.timelineVariable('pt_trial', true)
	data.block = jsPsych.timelineVariable('block', true)
	data.trial = jsPsych.timelineVariable('trial', true)
	data.dealer_id = jsPsych.timelineVariable('dealer_id', true)
	data.card_self = jsPsych.timelineVariable('card_self', true)
	data.card_hidden = jsPsych.timelineVariable('card_hidden', true)
	data.card_correct = jsPsych.timelineVariable('card_correct', true)
	data.high_variance_lottery_left_or_right = jsPsych.timelineVariable('high_variance_lottery_left_or_right', true)
	data.high_variance_lottery_EV = jsPsych.timelineVariable('high_variance_lottery_EV', true)
	data.low_variance_lottery_EV = jsPsych.timelineVariable('low_variance_lottery_EV', true)
	data.left_lottery_winnings = jsPsych.timelineVariable('left_lottery_winnings', true)
	data.right_lottery_winnings = jsPsych.timelineVariable('right_lottery_winnings', true)
	data.total_lottery_winnings = jsPsych.timelineVariable('total_lottery_winnings', true)
	data.friends_dealer_id = jsPsych.timelineVariable('friends_dealer_id', true)
	data.work_dealer_id = jsPsych.timelineVariable('work_dealer_id', true)
	data.modular_connections_source = jsPsych.timelineVariable('modular_connections_source', true)
}

function translate_button_press(button_press) {
	switch(button_press) {
		case '0':
			info_sampled = 'lottery_1';
			break;
		case '1':
			info_sampled = 'lottery_2';
			break;
		case '2':
			info_sampled = 'friends';
			break
		case '3':
			info_sampled = 'work';
			break;
		default:
			info_sampled = 'missing';
			break;
	}
	return info_sampled
}

function disable_selected_btns(trial_name) {
	let selected_btns = []
	if (trial_name == 'all') {
		selected_btns = ['0', '1', '2', '3'] 
	} else {
		// sometimes the below switch mapping overshoots depending on whether it's called from main trial object or delay trial object
		// but it's okay
		switch(trial_name) {
			case 'information_sampling_1':
				last_trial_index_for_button_disabling = 1;
				break;
			case 'information_sampling_2':
				last_trial_index_for_button_disabling = 2;
				break;
			case 'information_sampling_3':
				last_trial_index_for_button_disabling = 4;
				break
			case 'information_sampling_4':
				last_trial_index_for_button_disabling = 6;
				break;
		}

		selected_btns = jsPsych.data.get().last(last_trial_index_for_button_disabling).values().map(x => x['button_pressed'])
	}

	for (var i=0; i<selected_btns.length; i++){
		document.getElementById(translate_button_press(selected_btns[i])).setAttribute('disabled', 'disabled')
	}
}

function get_trial_object(trial_name) {
	return {
		type: 'html-button-response',
		stimulus: function() {
			if (trial_name == 'information_sampling_1') {
				return set_initial_information_sampling_stimulus(jsPsych.timelineVariable('high_variance_lottery_left_or_right', true), 
															jsPsych.timelineVariable('high_variance_lottery_EV', true), 
															jsPsych.timelineVariable('low_variance_lottery_EV', true), 
															jsPsych.timelineVariable('dealer_id', true))
			} else {
				return jsPsych.data.get().last(1).values()[0]['stimulus']
			}
		},
		choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
					'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
		button_html: function() {
			return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
		},
		margin_vertical: '',
		margin_horizontal: '',
		trial_duration: function() {
			if (trial_name == 'information_sampling_1') {
				return INFORMATION_SAMPLING_DURATION
			} else {
				return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
			}
		},
		response_ends_trial: true,
		on_load: function() {
			if (trial_name == 'information_sampling_1') {
				document.getElementById('information-timer-container').style.display = 'block'
				timer_interval_id = setInterval(function () {
					document.getElementById('information-timer').value += 25//SCALED_TIMER_SPEED
					if (show_timer_ms) {
						document.getElementById('timer-text-test').innerHTML = parseInt(document.getElementById('information-timer').value)
					}
				}, 25)
			} else {
				document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - this.trial_duration
				
				disable_selected_btns(trial_name)
			}
		},
		on_finish: function(data) {
			data.trial_name = trial_name

			data.information_sampling_time_remaining = data.rt === null ? null : this.trial_duration - data.rt
			
			if (trial_name == 'information_sampling_1') {
				if (data.information_sampling_time_remaining === null) {
					data.info_sampled_1 = jsPsych.data.get().last(1).values()[0]['button_pressed']
					data.info_sampled_1_rt = jsPsych.data.get().last(1).values()[0]['rt']
				}
			} else if (trial_name == 'information_sampling_2') {
				if (data.information_sampling_time_remaining === null) {
					data.info_sampled_1 = jsPsych.data.get().last(3).values()[0]['button_pressed']
					data.info_sampled_1_rt = jsPsych.data.get().last(3).values()[0]['rt']
					data.info_sampled_2 = jsPsych.data.get().last(1).values()[0]['button_pressed']
					data.info_sampled_2_rt = jsPsych.data.get().last(1).values()[0]['rt']
				}
			} else if (trial_name == 'information_sampling_3') {
				if (data.information_sampling_time_remaining === null) {
					data.info_sampled_1 = jsPsych.data.get().last(5).values()[0]['button_pressed']
					data.info_sampled_1_rt = jsPsych.data.get().last(5).values()[0]['rt']
					data.info_sampled_2 = jsPsych.data.get().last(3).values()[0]['button_pressed']
					data.info_sampled_2_rt = jsPsych.data.get().last(3).values()[0]['rt']
					data.info_sampled_3 = jsPsych.data.get().last(1).values()[0]['button_pressed']
					data.info_sampled_3_rt = jsPsych.data.get().last(1).values()[0]['rt']
				}
			} else if (trial_name == 'information_sampling_4') {
				if (data.information_sampling_time_remaining === null) {
					data.info_sampled_1 = jsPsych.data.get().last(7).values()[0]['button_pressed']
					data.info_sampled_1_rt = jsPsych.data.get().last(7).values()[0]['rt']
					data.info_sampled_2 = jsPsych.data.get().last(5).values()[0]['button_pressed']
					data.info_sampled_2_rt = jsPsych.data.get().last(5).values()[0]['rt']
					data.info_sampled_3 = jsPsych.data.get().last(3).values()[0]['button_pressed']
					data.info_sampled_3_rt = jsPsych.data.get().last(3).values()[0]['rt']
					data.info_sampled_4 = jsPsych.data.get().last(1).values()[0]['button_pressed']
					data.info_sampled_4_rt = jsPsych.data.get().last(1).values()[0]['rt']
				}
			}
			save_all_trial_data(data)
		}
	}
}

function get_delay_trial_object(information_sampling_index_string) {
	// the delay object repeats 3 times so this is abstracted in a func - onl the index of the delay trial changes
	return {
		type: 'html-button-response',
		stimulus: function() {
			return update_information_sampling_stimulus(previous_stimulus = jsPsych.data.get().last(1).values()[0]['stimulus'],
														previous_info_sampled = translate_button_press(jsPsych.data.get().last(1).values()[0]['button_pressed']),
														jsPsych.timelineVariable('left_lottery_winnings', true),
														jsPsych.timelineVariable('right_lottery_winnings', true),
														jsPsych.timelineVariable('friends_dealer_id', true), 
														jsPsych.timelineVariable('work_dealer_id', true))
		},
		choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
					'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
		button_html: function() {
			return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
			'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
		},
		margin_vertical: '',
		margin_horizontal: '',
		trial_duration: function () {
			// return INFORMATION_SAMPLING_INTERCHOICE_DELAY
			return INFORMATION_SAMPLING_INTERCHOICE_DELAY
		},
		response_ends_trial: false,
		on_load: function() {
			document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
			disable_selected_btns('all')
		},
		on_finish: function(data) {
			data.trial_name = 'information_sampling_'+information_sampling_index_string+'_delay'

			// on_finish means that if I try to get jsPsych data's last trial value, then it will be this trial, hence last(2) below
			// data['information_sampling_'+information_sampling_index_string+'_prompt'] = this.prompt
			data.information_sampling_time_remaining = jsPsych.data.get().last(2).values()[0]['information_sampling_time_remaining'] - this.trial_duration
			data.button_pressed = jsPsych.data.get().last(2).values()[0]['button_pressed']
		}
		
	}
}

// -------------------------------------------defining trials
var card_presentation_trial = {
	type: 'html-keyboard-response',
	stimulus: function() {
		// url property is sent to the css.css stylesheet and hence css.css' directory is the reference one which is why we start with ..
		document.getElementById('jspsych-target').style.setProperty('--background', 'url(../images/card-presentation-background.jpg)')
		
		return get_card_presentation_trial_stimulus(jsPsych.timelineVariable('card_self', true), 
													jsPsych.timelineVariable('dealer_id', true))
	},
	trial_duration: function() {
		return CARD_PRESENTATION_TRIAL_DURATION
	},
	prompt: '<div style="width: 500px; visibility: hidden">'+
				'<div class="decision-question-text">Is the hidden card lower or higher than yours?</div>'+
				'<div class="card_decision_prompt" style="margin-right: 2.5%">Lower [Press 1]</div>'+
				'<div class="card_decision_prompt" style="margin-left: 2.5%">Higher [Press 2]</div>'+
			'</div>',
	choices: jsPsych.NO_KEYS,
	on_finish: function(data) {
		data.trial_name = 'card_presentation_trial'

		data.card_decision_prompt = this.prompt	
	}
}

var card_decision = {
	type: 'html-keyboard-response',
	stimulus: function() {
		return jsPsych.data.get().last(1).values()[0]['stimulus']
	},
	choices: [49, 50], //['1', '2']
	prompt: function() {
		last_prompt = jsPsych.data.get().last(1).values()[0]['card_decision_prompt']
		curr_prompt = last_prompt.replace("visibility: hidden", "visibility: visible")
		return curr_prompt
	},
	on_finish: function(data) {
		data.trial_name = 'card_decision'

		data.block = jsPsych.timelineVariable('block', true)
		data.trial = jsPsych.timelineVariable('trial', true)
		data.pp_card_guess = data.key_press == 49 ? 'lower' : 'higher'
		if (jsPsych.timelineVariable('pt_trial', true)) {
			data.pt_pp_card_correct = (data.pp_card_guess == 'lower' & jsPsych.timelineVariable('card_correct', true) == 'lower') || 
								(data.pp_card_guess == 'higher' & jsPsych.timelineVariable('card_correct', true) == 'higher')
			data.pt_curr_trial_winnings = data.pt_pp_card_correct ? jsPsych.timelineVariable('total_lottery_winnings', true) : 0
		} else {
			data.pp_card_correct = (data.pp_card_guess == 'lower' & jsPsych.timelineVariable('card_correct', true) == 'lower') || 
								(data.pp_card_guess == 'higher' & jsPsych.timelineVariable('card_correct', true) == 'higher')
			data.curr_trial_winnings = data.pp_card_correct ? jsPsych.timelineVariable('total_lottery_winnings', true) : 0	
							
		}
	} 
}

var fixation_cross = {
	type: 'html-keyboard-response',
	stimulus: '<div class="fixation-cross">+</div>',
	trial_duration: 300,
	choices: jsPsych.NO_KEYS,
	on_start: function(trial) {
		document.getElementById('jspsych-target').style.setProperty('--background', 'none')

		if (typeof timer_interval_id !== 'undefined') {
			clearInterval(timer_interval_id)
			document.getElementById('information-timer').value = 0
			document.getElementById('information-timer-container').style.display = 'none'
		}

		// if (jsPsych.timelineVariable('display_feedback', true) === false) {
		// 	jsPsych.endCurrentTimeline()
		// }

		if (DATA_SAVING_ITERATOR % 5 === 0) {
			// save request every 5 trials
			saveData(subject_id.toString()+'_'+DATA_SAVING_ITERATOR.toString()+'.csv', jsPsych.data.get().csv())
		}
		DATA_SAVING_ITERATOR += 1
	},
	on_finish: function(data) {
		data.trial_name = 'fixation_cross'
	}
}

var information_sampling_1 = get_trial_object('information_sampling_1')

var information_sampling_1_delay = get_delay_trial_object(information_sampling_index_string = '1')

var information_sampling_2 = get_trial_object('information_sampling_2')

var information_sampling_2_delay = get_delay_trial_object(information_sampling_index_string = '2')

var information_sampling_3 = get_trial_object('information_sampling_3')

var information_sampling_3_delay = get_delay_trial_object(information_sampling_index_string = '3')

var information_sampling_4 = get_trial_object('information_sampling_4')

var information_sampling_final_noChoice = {
	type: 'html-button-response',
	stimulus: function() {
		return jsPsych.data.get().last(1).values()[0]['stimulus']
	},
	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
	button_html: function() {
		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
	},
	margin_vertical: '',
	margin_horizontal: '',
	trial_duration: function() {
		// return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
		// ------------------- to consider if this is correct
		return INFORMATION_SAMPLING_INTERCHOICE_DELAY
	},
	response_ends_trial: false,
	on_load: function() {
		document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']

		disable_selected_btns('all')

	},
	on_finish: function(data) {
		data.trial_name = 'information_sampling_final_noChoice'

		last_trial_name = jsPsych.data.get().last(2).values()[0]['trial_name']
		// crucially, here, the last seen prompt will be missign as the button is clicked within the last second and hence nothing is sampled/displayed
		if (last_trial_name === 'information_sampling_1') {
			data.info_sampled_1 = 'missing'
			data.info_sampled_1_rt = null
		} else if (last_trial_name === 'information_sampling_2') {
			data.info_sampled_1 = jsPsych.data.get().last(4).values()[0]['button_pressed']
			data.info_sampled_1_rt = jsPsych.data.get().last(4).values()[0]['rt']
			data.info_sampled_2 = 'missing'
			data.info_sampled_2_rt = null
		} else if (last_trial_name === 'information_sampling_3') {
			data.info_sampled_1 = jsPsych.data.get().last(6).values()[0]['button_pressed']
			data.info_sampled_1_rt = jsPsych.data.get().last(6).values()[0]['rt']
			data.info_sampled_2 = jsPsych.data.get().last(4).values()[0]['button_pressed']
			data.info_sampled_2_rt = jsPsych.data.get().last(4).values()[0]['rt']
			data.info_sampled_3 = 'missing'
			data.info_sampled_3_rt = null
		} else if (last_trial_name === 'information_sampling_4') {
			data.info_sampled_1 = jsPsych.data.get().last(8).values()[0]['button_pressed']
			data.info_sampled_1_rt = jsPsych.data.get().last(8).values()[0]['rt']
			data.info_sampled_2 = jsPsych.data.get().last(6).values()[0]['button_pressed']
			data.info_sampled_2_rt = jsPsych.data.get().last(6).values()[0]['rt']
			data.info_sampled_3 = jsPsych.data.get().last(4).values()[0]['button_pressed']
			data.info_sampled_3_rt = jsPsych.data.get().last(4).values()[0]['rt']
			data.info_sampled_4 = 'missing'
			data.info_sampled_4_rt = null
		} else {
			alert("Problem saving data in noChoice trial.")
		}

		save_all_trial_data(data)
	}
}

var information_sampling_final = {
	type: 'html-button-response',
	stimulus: function() {
		return jsPsych.data.get().last(1).values()[0]['stimulus']
	},
	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
	button_html: function() {
		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
	},
	margin_vertical: '',
	margin_horizontal: '',
	trial_duration: function() {
		return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
	},
	response_ends_trial: false,
	on_load: function() {
		document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - this.trial_duration

		disable_selected_btns('all')

	},
	on_finish: function(data) {
		data.trial_name = 'information_sampling_final'
		
		data.info_sampled_1 = jsPsych.data.get().last(8).values()[0]['button_pressed']
		data.info_sampled_1_rt = jsPsych.data.get().last(8).values()[0]['rt']
		data.info_sampled_2 = jsPsych.data.get().last(6).values()[0]['button_pressed']
		data.info_sampled_2_rt = jsPsych.data.get().last(6).values()[0]['rt']
		data.info_sampled_3 = jsPsych.data.get().last(4).values()[0]['button_pressed']
		data.info_sampled_3_rt = jsPsych.data.get().last(4).values()[0]['rt']
		data.info_sampled_4 = jsPsych.data.get().last(2).values()[0]['button_pressed']
		data.info_sampled_4_rt = jsPsych.data.get().last(2).values()[0]['rt']

		save_all_trial_data(data)
	}
}








// var information_sampling_1 = {
// 	type: 'html-button-response',
// 	stimulus: function() {
// 		return set_initial_information_sampling_stimulus(jsPsych.timelineVariable('high_variance_lottery_left_or_right', true), 
// 														jsPsych.timelineVariable('high_variance_lottery_EV', true), 
// 														jsPsych.timelineVariable('low_variance_lottery_EV', true), 
// 														jsPsych.timelineVariable('dealer_id', true))
// 	},
// 	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
// 				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
// 	button_html: function() {
// 		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
// 	},
// 	margin_vertical: '',
// 	margin_horizontal: '',
// 	trial_duration: function() {
// 		return INFORMATION_SAMPLING_DURATION
// 	},
// 	response_ends_trial: true,
// 	on_load: function() {
// 		document.getElementById('information-timer-container').style.display = 'block'
// 		timer_interval_id = setInterval(function () {
// 			document.getElementById('information-timer').value += 25//SCALED_TIMER_SPEED
// 			if (show_timer_ms) {
// 				document.getElementById('timer-text-test').innerHTML = parseInt(document.getElementById('information-timer').value)
// 			}
// 		}, 25)
// 	},
// 	on_finish: function(data) {
// 		data.trial_name = 'information_sampling_1'

// 		data.information_sampling_time_remaining = data.rt === null ? null : this.trial_duration - data.rt
		
// 		if (data.information_sampling_time_remaining === null) {
// 			data.info_sampled_1 = jsPsych.data.get().last(1).values()[0]['button_pressed']
// 			data.info_sampled_1_rt = jsPsych.data.get().last(1).values()[0]['rt']
// 			save_all_trial_data(data)
// 		}
// 	}
// }

// var information_sampling_2 = {
// 	type: 'html-button-response',
// 	stimulus: function() {
// 		return jsPsych.data.get().last(1).values()[0]['stimulus']
// 	},
// 	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
// 				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
// 	button_html: function() {
// 		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
// 	},
// 	margin_vertical: '',
// 	margin_horizontal: '',
// 	trial_duration: function() {
// 		return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
// 	},
// 	response_ends_trial: true,
// 	on_load: function() {
// 		document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - this.trial_duration

// 		disable_selected_btns('2')

// 	},
// 	on_finish: function(data) {
// 		data.trial_name = 'information_sampling_2'

// 		data.information_sampling_time_remaining = data.rt === null ? null : this.trial_duration - data.rt
		
// 		if (data.information_sampling_time_remaining === null) {
// 			data.info_sampled_1 = jsPsych.data.get().last(3).values()[0]['button_pressed']
// 			data.info_sampled_1_rt = jsPsych.data.get().last(3).values()[0]['rt']
// 			data.info_sampled_2 = jsPsych.data.get().last(1).values()[0]['button_pressed']
// 			data.info_sampled_2_rt = jsPsych.data.get().last(1).values()[0]['rt']
// 			save_all_trial_data(data)
// 		}
// 	}
// }

// var information_sampling_3 = {
// 	type: 'html-button-response',
// 	stimulus: function() {
// 		return jsPsych.data.get().last(1).values()[0]['stimulus']
// 	},
// 	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
// 				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
// 	button_html: function() {
// 		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
// 	},
// 	margin_vertical: '',
// 	margin_horizontal: '',
// 	trial_duration: function() {
// 		return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
// 	},
// 	response_ends_trial: true,
// 	on_load: function() {
// 		document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - this.trial_duration

// 		disable_selected_btns('3')

// 	},
// 	on_finish: function(data) {
// 		data.trial_name = 'information_sampling_3'

// 		data.information_sampling_time_remaining = data.rt === null ? null : this.trial_duration - data.rt
		
// 		if (data.information_sampling_time_remaining === null) {
// 			data.info_sampled_1 = jsPsych.data.get().last(5).values()[0]['button_pressed']
// 			data.info_sampled_1_rt = jsPsych.data.get().last(5).values()[0]['rt']
// 			data.info_sampled_2 = jsPsych.data.get().last(3).values()[0]['button_pressed']
// 			data.info_sampled_2_rt = jsPsych.data.get().last(3).values()[0]['rt']
// 			data.info_sampled_3 = jsPsych.data.get().last(1).values()[0]['button_pressed']
// 			data.info_sampled_3_rt = jsPsych.data.get().last(1).values()[0]['rt']
// 			save_all_trial_data(data)
// 		}
// 	}
// }

// var information_sampling_4 = {
// 	type: 'html-button-response',
// 	stimulus: function() {
// 		return jsPsych.data.get().last(1).values()[0]['stimulus']
// 	},
// 	choices: ['Tell me potential<br>winnings from lottery 1', 'Tell me potential<br>winnings from lottery 2', 
// 				'Who are you<br>friends with?', 'Who works the<br>same time as you?'],
// 	button_html: function() {
// 		return ['<button id="lottery_1" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="lottery_2" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
// 		'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>']
// 	},
// 	margin_vertical: '',
// 	margin_horizontal: '',
// 	trial_duration: function() {
// 		return jsPsych.data.get().last(1).values()[0]['information_sampling_time_remaining']
// 	},
// 	response_ends_trial: true,
// 	on_load: function() {
// 		document.getElementById('information-timer').value = INFORMATION_SAMPLING_DURATION - this.trial_duration

// 		disable_selected_btns('4')

// 	},
// 	on_finish: function(data) {
// 		data.trial_name = 'information_sampling_4'

// 		data.information_sampling_time_remaining = data.rt === null ? null : this.trial_duration - data.rt
		
// 		if (data.information_sampling_time_remaining === null) {
// 			data.info_sampled_1 = jsPsych.data.get().last(7).values()[0]['button_pressed']
// 			data.info_sampled_1_rt = jsPsych.data.get().last(7).values()[0]['rt']
// 			data.info_sampled_2 = jsPsych.data.get().last(5).values()[0]['button_pressed']
// 			data.info_sampled_2_rt = jsPsych.data.get().last(5).values()[0]['rt']
// 			data.info_sampled_3 = jsPsych.data.get().last(3).values()[0]['button_pressed']
// 			data.info_sampled_3_rt = jsPsych.data.get().last(3).values()[0]['rt']
// 			data.info_sampled_4 = jsPsych.data.get().last(1).values()[0]['button_pressed']
// 			data.info_sampled_4_rt = jsPsych.data.get().last(1).values()[0]['rt']
// 			save_all_trial_data(data)
// 		}
// 	}
// }