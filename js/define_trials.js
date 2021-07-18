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
	data.friends_id = jsPsych.timelineVariable('friends_id', true)
	data.work_id = jsPsych.timelineVariable('work_id', true)
}

function get_card_presentation_trial_stimulus(card_self, dealer_id) {
	let dealer_name = PT_TRIALS_DEALERS.includes(dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[dealer_id] : DEALER_ID_NAME_DICT[dealer_id]
	return 	'<div class="card-presentation-stimulus-container">'+
				'<div class="card-presentation-card-container">'+
					'<div class="dealer-text">Your card</div>'+
					'<div><img src="images/'+card_self+'.png" class="card-presentation-image" style="background-color: #FFFFEB; margin-bottom: 15px; margin-top: 15px;"></div>'+
					'<div><img src="images/face_down_card.png" class="card-presentation-image" style="margin-bottom: 15px;"></div>'+
					'<div class="dealer-text">Hidden card</div>'+
				'</div>'+
				'<div class="card-presentation-dealer-container">'+
					'<div class="dealer-text" style="margin-top:60px;">Dealer: <b>'+dealer_name+'</b></div>'+
					'<div class="card-presentation-image"><img src="images/'+dealer_id+'.png" style="margin-top: 15px; width: 150px; height: auto"></div>'+
				'</div>'+
			'</div>'+
			'<div style="width: 500px; visibility: hidden">'+
				'<div class="decision-question-text">Is the hidden card lower or higher than yours?</div>'+
			'</div>'
}

function set_initial_information_sampling_stimulus(current_dealer_id, max_width = 800, height = 500) {
	let dealer_name = PT_TRIALS_DEALERS.includes(current_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[current_dealer_id] : DEALER_ID_NAME_DICT[current_dealer_id]
	stimulus_html = '<div style=width: 800px; height: auto>'+
						'<div style="width: '+max_width+'px; height: 50px">'+
							'<p style="padding-top: 5px">Time to chat to the dealer while waiting for the next round!</p>'+
						'</div>'+
						'<div style="width: '+max_width+'px; height: '+height+'px">'+ // container for the information sampling stimulus

							'<div class="information-individual-container"></div>'+ // just adding an empty container to push the elements to the side as I am too lazy to rework it
							'<div class="information-individual-container">'+
								'<div class="information-img-container">'+
									'<p class="dealer-text" style="left: 110px; position: relative">'+dealer_name+'</p>'+
									'<img style="left: 110px; position: relative;" class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
									'<img class="information-arrow-img information-arrow-img-left" src="images/arrow.png">'+
									'<p id="friends-name" class="dealer-text">???</p>'+
									'<img id="friends-img" class="information-dealers-img" src="images/question-mark.png">'+
								'</div>'+
							'</div>'+
							'<div class="information-individual-container">'+
								'<div class="information-img-container">'+
									'<img style="top:180px; position: relative" class="information-arrow-img information-arrow-img-right" src="images/arrow.png">'+
									'<p style="top:180px; position: relative" id="work-name" class="dealer-text">???</p>'+
									'<img style="top:180px; position: relative" id="work-img" class="information-dealers-img" src="images/question-mark.png">'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'
	return stimulus_html	
}

function update_information_sampling_stimulus(previous_stimulus, previous_info_sampled, friends_id = undefined, work_id = undefined) {	
	var parser = new DOMParser();
	var newHTML = parser.parseFromString(previous_stimulus, 'text/html')

	if (previous_info_sampled == 'friends') {
		let friends_name = PT_TRIALS_DEALERS.includes(friends_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[friends_id] : DEALER_ID_NAME_DICT[friends_id]
		newHTML.getElementById('friends-name').innerHTML = friends_name
		newHTML.getElementById('friends-img').src = 'images/'+friends_id+'.png'
	} else if (previous_info_sampled == 'work') {
		let work_name = PT_TRIALS_DEALERS.includes(work_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[work_id] : DEALER_ID_NAME_DICT[work_id]
		newHTML.getElementById('work-name').innerHTML = work_name
		newHTML.getElementById('work-img').src = 'images/'+work_id+'.png'
	} else {
		alert('Problem occurred in update_information_sampling_stimulus')
	}

	return newHTML.getElementsByTagName('body')[0].innerHTML
}

function information_sampling_buttons_add_styling_class(buttons) {
	for (i of buttons) {
		if (i.getAttribute('data-choice') !== '2') {
			i.classList.add('information_smapling_button_styling')
		} else if (i.getAttribute('data-choice') !== '2') {
			i.classList.add('information_sampling_skip_button_styling')
		}
	}
}

function translate_button_press(button_pressed) {
	let info_sampled
	if (button_pressed == 0) {
		info_sampled = 'friends'
	} else if (button_pressed == 1) {
		info_sampled = 'work'
	} else if (button_pressed == 2) {
		info_sampled = 'skip'
	}
	return info_sampled
}
		


// -------------------------------------------defining trials

var card_presentation_trial = {
	type: 'html-button-response',
	stimulus: function() {
		// url property is sent to the css.css stylesheet and hence css.css' directory is the reference one which is why we start with ..
		document.getElementById('jspsych-target').style.setProperty('--background', 'url(../images/card-presentation-background.jpg)')
		
		return get_card_presentation_trial_stimulus(jsPsych.timelineVariable('card_self', true), 
													jsPsych.timelineVariable('dealer_id', true))
	},
	choices: ['Lower', 'Higher'],
	button_html: '<button class="card_decision_prompt jspsych-btn" style="visibility: hidden">%choice%</button>',
	trial_duration: function() {
		return CARD_PRESENTATION_TRIAL_DURATION
	},
	on_load: function() {
		document.getElementById('jspsych-html-button-response-btngroup').style.setProperty('height', '50px') // magic number -- must be equal to the height of the btngroup of the next trial
	},
	on_finish: function(data) {
		data.trial_name = 'card_presentation_trial'
	}
}

var card_decision = {
	type: 'html-button-response',
	stimulus: function() {
		last_stimulus = jsPsych.data.get().last(1).values()[0]['stimulus']
		curr_stimulus = last_stimulus.replace("visibility: hidden", "visibility: visible")
		return curr_stimulus
	},
	choices: ['Lower', 'Higher'], //['1', '2']
	button_html: '<button class="card_decision_prompt jspsych-btn">%choice%</button>',
	on_load: function() {
		document.getElementById('jspsych-html-button-response-btngroup').style.setProperty('height', '50px') // magic number -- must be equal to the height of the btngroup of the previous trial
	},
	on_finish: function(data) {
		data.trial_name = 'card_decision'

		data.block = jsPsych.timelineVariable('block', true)
		data.trial = jsPsych.timelineVariable('trial', true)
		data.pp_card_guess = data.button_pressed == '0' ? 'lower' : 'higher'
		data.pp_card_correct = (data.pp_card_guess == 'lower' & jsPsych.timelineVariable('card_correct', true) == 'lower') || 
								(data.pp_card_guess == 'higher' & jsPsych.timelineVariable('card_correct', true) == 'higher')
		data.curr_trial_winnings = data.pp_card_correct ? 10 : 0
	} 
}

var fixation_cross = {
	type: 'html-keyboard-response',
	stimulus: '<div class="fixation-cross">+</div>',
	trial_duration: 300,
	choices: jsPsych.NO_KEYS,
	on_start: function(trial) {
		document.getElementById('jspsych-target').style.setProperty('--background', 'none')

		if (DATA_SAVING_ITERATOR % 15 === 0) {
			// save request every 15 trials
			// console.log(subject_id.toString()+'_'+DATA_SAVING_ITERATOR.toString(), jsPsych.data.get().csv())
			saveData(subject_id.toString()+'_'+DATA_SAVING_ITERATOR.toString(), jsPsych.data.get().csv())
		}
		DATA_SAVING_ITERATOR += 1
	},
	on_finish: function(data) {
		data.trial_name = 'fixation_cross'
	}
}

var information_sampling = {
	type: 'html-button-response',
	stimulus: function() {
		return set_initial_information_sampling_stimulus(jsPsych.timelineVariable('dealer_id', true))
	},
	choices: ['Who are you<br>friends with?', 'Who works the<br>same time as you?'],
	button_html: [	'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
					'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>'],
	margin_vertical: '',
	margin_horizontal: '',
	response_ends_trial: true,
	on_load: function() {
		document.getElementById('jspsych-content').style['margin-top'] = '2%'

		buttons = document.getElementsByClassName('jspsych-html-button-response-button')
		for (i of buttons) {
			i.classList.add('information_smapling_button_styling')
		}
	},
	on_finish: function(data) {
		// data.information_sampling_stimulus = this.stimulus
		data.choices = this.choices
		data.button_html = this.button_html

		// save data from this trial
		data.trial_name = 'information_sampling'
		data.info_sampled = jsPsych.data.get().last(1).values()[0]['button_pressed']
		data.info_sampled_rt = jsPsych.data.get().last(1).values()[0]['rt']	
	}
}

var information_sampling_delay = {
	type: 'html-button-response',
	stimulus: function() {
		let previous_info_sampled = jsPsych.data.get().last(1).values()[0]['button_pressed'] == '0' ? 'friends' : 'work'
		let first_or_second_choice_string = jsPsych.data.get().last(1).values()[0]['trial_name'] == 'information_sampling' ? 'first_choice_' : 'second_choice_'
		return update_information_sampling_stimulus(jsPsych.data.get().last(1).values()[0]['stimulus'],
													previous_info_sampled,
													jsPsych.timelineVariable(first_or_second_choice_string+'friends_id', true), 
													jsPsych.timelineVariable(first_or_second_choice_string+'work_id', true))
	},
	choices: function() {
		return jsPsych.data.get().last(1).values()[0]['choices']
	},
	button_html: function() {
		return jsPsych.data.get().last(1).values()[0]['button_html']
	},
	margin_vertical: '',
	margin_horizontal: '',
	trial_duration: function() {return INFORMATION_SAMPLING_DELAY},
	on_load: function() {
		document.getElementById('jspsych-content').style['margin-top'] = '2%'

		document.getElementById('friends').setAttribute('disabled', 'disabled')
		document.getElementById('work').setAttribute('disabled', 'disabled')
		if (document.getElementById('skip') != null) {
			document.getElementById('skip').setAttribute('disabled', 'disabled')
		}

		buttons = document.getElementsByClassName('jspsych-html-button-response-button')
		information_sampling_buttons_add_styling_class(buttons)

		if (jsPsych.data.get().last(1).values()[0]['trial_name'] == 'information_sampling_2_optional') {
			skip_button = document.querySelector("div[data-choice='2']")
			skip_button.style.display = 'block' // this must defined here due to specificity
			skip_button.className = 'skip_button_styling'
		}

	},
	on_finish: function(data) {
		document.getElementById('jspsych-content').style['margin-top'] = 'auto'
	}
}

var information_sampling_2_optional = {
	type: 'html-button-response',
	stimulus: function() {
		return set_initial_information_sampling_stimulus(jsPsych.timelineVariable('dealer_id', true))
	},
	choices: ['Who are you<br>friends with?', 'Who works the<br>same time as you?', 'Skip information and proceed to next trial'],
	button_html: [	'<button id="friends" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
					'<button id="work" class="information_sampling_text jspsych-btn" style="width: 100%">%choice%</button>',
					'<button id="skip" class="information_sampling_skip_button_text jspsych-btn" style="width: 100%">%choice%</button>'],
	margin_vertical: '',
	margin_horizontal: '',
	response_ends_trial: true,
	on_load: function() {
		document.getElementById('jspsych-content').style['margin-top'] = '2%'

		buttons = document.getElementsByClassName('jspsych-html-button-response-button')
		information_sampling_buttons_add_styling_class(buttons)

		skip_button = document.querySelector("div[data-choice='2']")
		skip_button.style.display = 'block' // this must defined here due to specificity
		skip_button.className = 'skip_button_styling'
	},
	on_finish: function(data) {
		document.getElementById('jspsych-content').style['margin-top'] = 'auto'

		data.choices = this.choices
		data.button_html = this.button_html
		data.trial_name = 'information_sampling_2_optional'

		// save data from card decision trial
		last_card_decision_trial_data = jsPsych.data.get().filter({trial_name: 'card_decision'}).last(1).values()

		data.pp_card_guess = last_card_decision_trial_data['pp_card_guess']
		data.pp_card_correct = last_card_decision_trial_data['pp_card_correct']
		data.curr_trial_winnings = last_card_decision_trial_data['curr_trial_winnings']
		data.card_decision_rt = last_card_decision_trial_data['rt']

		// save data from information sampling trials
		data.first_choice_info_sampled = translate_button_press(jsPsych.data.get().last(3).values()[0]['button_pressed'])
		data.first_choice_info_sampled_rt = jsPsych.data.get().last(3).values()[0]['rt']
		data.second_choice_info_sampled = translate_button_press(jsPsych.data.get().last(1).values()[0]['button_pressed'])
		data.second_choice_info_sampled_rt = jsPsych.data.get().last(1).values()[0]['rt']

		// save meta trial data
		data.pt_trial = jsPsych.timelineVariable('pt_trial', true)
		data.block = jsPsych.timelineVariable('block', true)
		data.trial = jsPsych.timelineVariable('trial', true)
		data.card_self = jsPsych.timelineVariable('card_self', true)
		data.card_hidden = jsPsych.timelineVariable('card_hidden', true)
		data.card_correct = jsPsych.timelineVariable('card_correct', true)
		data.dealer_id = jsPsych.timelineVariable('dealer_id', true)
		data.first_choice_friends_id = jsPsych.timelineVariable('first_choice_friends_id', true)
		data.first_choice_work_id = jsPsych.timelineVariable('first_choice_work_id', true)	
		data.second_choice_friends_id = jsPsych.timelineVariable('second_choice_friends_id', true)
		data.second_choice_work_id = jsPsych.timelineVariable('second_choice_work_id', true)
		data.structure = jsPsych.timelineVariable('structure', true)
	}
}

var memory_test_trial = {
	type: 'html-button-response',
	stimulus: function() {
		return 	jsPsych.timelineVariable('stimulus_question_html', true)+
				'<p style="font-size: 0.8em">(click on a person from the lineup below)</p>'+
				'<div>'+
					'<p class="dealer-text" style="width: 70%; margin: auto">'+DEALER_ID_NAME_DICT[jsPsych.timelineVariable('target_dealer_id', true)]+'</p>'+
					'<img style="width: 300px; margin-bottom: 30px" src="images/'+jsPsych.timelineVariable('target_dealer_id', true)+'.png">'+
				'</div>'
	},
	choices: function () {return [	jsPsych.timelineVariable('dealer_choice_1_id', true), 
									jsPsych.timelineVariable('dealer_choice_2_id', true),
									jsPsych.timelineVariable('dealer_choice_3_id', true)]
	},
	button_html: function () {
		return [	'<button style="float: left" class="jspsych-btn">'+
						'<p class="dealer-text">'+DEALER_ID_NAME_DICT[jsPsych.timelineVariable('dealer_choice_1_id', true)]+'</p>'+
						'<img src="images/%choice%.png" style="width: 150px">'+
					'</button>', 
					'<button style="float: left" class="jspsych-btn">'+
						'<p class="dealer-text">'+DEALER_ID_NAME_DICT[jsPsych.timelineVariable('dealer_choice_2_id', true)]+'</p>'+
						'<img src="images/%choice%.png" style="width: 150px">'+
					'</button>',
					'<button style="float: left" class="jspsych-btn">'+
						'<p class="dealer-text">'+DEALER_ID_NAME_DICT[jsPsych.timelineVariable('dealer_choice_3_id', true)]+'</p>'+
						'<img src="images/%choice%.png" style="width: 150px">'+
					'</button>']
	},
	response_ends_trial: true,
	post_trial_gap: 250,
	on_finish: function(data) {
		data.trial_name = 'memory_test_trial'

		data.correct = data.button_pressed == String(jsPsych.timelineVariable('correct_choice_button_press', true)) ? 1 : 0

		// trial meta-data
		data.trial = jsPsych.timelineVariable('trial', true)
		data.stimulus_question_friends_or_work = jsPsych.timelineVariable('stimulus_question_friends_or_work', true)
		data.target_dealer_id = jsPsych.timelineVariable('target_dealer_id', true)
		data.dealer_choice_1_source = jsPsych.timelineVariable('dealer_choice_1_source', true)
		data.dealer_choice_2_source = jsPsych.timelineVariable('dealer_choice_2_source', true)
		data.dealer_choice_3_source = jsPsych.timelineVariable('dealer_choice_3_source', true)
		data.dealer_choice_1_id = jsPsych.timelineVariable('dealer_choice_1_id', true)
		data.dealer_choice_2_id = jsPsych.timelineVariable('dealer_choice_2_id', true)
		data.dealer_choice_3_id = jsPsych.timelineVariable('dealer_choice_3_id', true)
		data.correct_choice_id = jsPsych.timelineVariable('correct_choice_id', true)
		data.correct_choice_button_press = jsPsych.timelineVariable('correct_choice_button_press', true)
	}
}

