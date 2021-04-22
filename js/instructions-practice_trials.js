var fullscreen_message = {
	type: 'fullscreen',
	full_screen_mode: true,
	message: ["<p>Please enter full screen mode by clicking the button below to ensure best experience.</p>"+
				"<p>It's important to stay in full screen mode once you've entered it - this allows us to best examine your performance.</p>"+
				"<p>Please click the button below to enter full screen and continue with the experiment.</p>"],
	button_label: 'Enter full screen and continue with the experiment.'
}

var pis = {
	type: 'survey-multi-select',
	questions: [
		{
			prompt: '<div style="text-align: center"><iframe style="width: 700; height: 500" src="images/pis-temp/Nikolay Petrov_Online_PIS_draft2.htm"</iframe></div>',
			options: ['I consent to take part in this research'],
			horizontal: true,
			required: true,
			name: 'Consent'
		}
	],
	preamble: '<p>What follows is the Info sheet but currently a demo look&feel until Ethics approval. Will get translated to proper html afterwards. Ditto for instructions.</p>'
	
}

var instructions = {
	type: 'instructions',
	pages: function() {
		images_html_arr = []
		for (slide=1; slide<=11; slide++) {
			if (INFORMATION_MULTIPLE_CHOICE) {
				images_html_arr.push('<img style="width: 900px" src="images/instructions-multi/Slide'+slide+'.jpg"/>')
			} else {
				images_html_arr.push('<img style="width: 900px" src="images/instructions-single/Slide'+slide+'.jpg"/>')
			}
			
		}
		additional_html = ['<p class="instructions-text">You will now complete '+PT_TRIALS_NUM+' practice trials. The first '+FEEDBACK_TRIALS+' trials will provide short feedback '+
							'to remind you of the rules. The following '+(PT_TRIALS_NUM-FEEDBACK_TRIALS)+' practice trials will NOT provide feedback.</p>'+
							'<p class="instructions-text">Click the "Next" button to start.</p>']
		return images_html_arr.concat(additional_html)
	},
	show_clickable_nav: true,
	post_trial_gap: 1000
};

var pt_block_feedback = {
	type: 'instructions',
	pages: function() {
		return ['<p>During the practice trials you made the correct decision '+jsPsych.data.get().filter({'pt_pp_card_correct': true}).count()+' times.</p>'+
				'<p>This brought you a total of '+jsPsych.data.get().select('pt_curr_trial_winnings').sum()+' points from both lotteries.']
	},
	show_clickable_nav: true
}

var pt_feedback = {
	type: 'html-keyboard-response',
	stimulus: function() {
		card_decision_all_data = jsPsych.data.get().filter([{pt_pp_card_correct: 1}, {pt_pp_card_correct: 0}]).values()
		card_decision_last_trial_data = card_decision_all_data[card_decision_all_data.length - 1]
		html = '<p>In this trial your card was '+jsPsych.timelineVariable('card_self', true)+' and the dealer\'s card was a '+
					jsPsych.timelineVariable('card_comp', true)+'</p>'+
				'<p>You guessed that the dealer\'s card was '+card_decision_last_trial_data['pp_card_guess']+'.</p>'
		if (card_decision_last_trial_data['pt_pp_card_correct']) {
			html += '<p>Hence you win the combined sum of both lotteries\' random draw, which amounts to '+
						jsPsych.timelineVariable('total_lottery_winnings', true)+' points.</p>'
		} else {
			html += '<p>Hence you do not win any points this round. Had you guessed correctly, you would have won the points '+
					'awarded by both lotteries - '+jsPsych.timelineVariable('total_lottery_winnings', true)+' for this trial.</p>'
		}
		html += '<p>Remember that you will not receive feedback during the test trials.</p>'+
				'<p>Press SPACE to continue</p>'
		return html
	},
	choices: [32] // space
}

var test_intro = {
	type: 'instructions',
	pages: ['<p class="instructions-text">You will now begin the test trials. There will be '+TRIALS_NUM+' trials in total.</p>'],
	show_clickable_nav: true
}

var inter_block_text = {
	type: 'instructions',
	pages: function() {
		// order is final trial-fixation cross-this trial, hence we use last 2 below
		last_block_id = jsPsych.data.get().last(2).values()[0]['block']
		last_block_winnings = jsPsych.data.get().filter([{'pp_card_guess': 'lower', 'block': last_block_id},
											{'pp_card_guess': 'higher', 'block': last_block_id}])
											.select('curr_trial_winnings').sum()
		return ['<p>This is the end of block '+(last_block_id+1)+'. In this block you won '+last_block_winnings+' points.</p>'+
				'<p>There are '+(BLOCKS - (last_block_id+1))+' blocks remaining.</p>'+
				'<p>You can take a break now if you wish and continue when you feel ready.</p>']
	},
	show_clickable_nav: true
}

var debrief = {
	type: 'instructions',
	pages: function() {
		// nearest 500
		acquiredPoints = jsPsych.data.get().select('curr_trial_winnings').sum()
		requiredPoints = Math.floor(acquiredPoints/500) * 500
		if (requiredPoints == 0 || typeof requiredPoints != 'number') {
			console.log("Problem")
		}
		return ['<p>During the test trials you made the correct decision '+jsPsych.data.get().filter({'pp_card_correct': true}).count()+' times.</p>'+
				'<p>This brought you a total of '+acquiredPoints+' points from both lotteries. To win the £2.00 bonus, you had to achieve '+requiredPoints+' points.\nHence, you win an additional £2.00.',
				'<p>Thank you for completing this experiment. Please click next to save your data and then you can close the browser.</p>'
	]},
	show_clickable_nav: true
}