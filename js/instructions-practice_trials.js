var fullscreen_message = {
	type: 'fullscreen',
	full_screen_mode: true,
	message: ['<p class="instructions-text">Please enter full screen mode by clicking the button below to ensure best experience.</p>'+
				'<p class="instructions-text">It\'s important to stay in full screen mode once you\'ve entered it - this allows us to best examine your performance.</p>'+
				'<p class="instructions-text">Please click the button below to enter full screen and continue with the experiment.</p>'],
	button_label: 'Enter full screen and continue with the experiment.'
}

var check_consent = function(elem) {
	if (document.getElementById('consent_checkbox').checked && document.getElementById('consent_checkbox2').checked) {
		return true;
	}
 	else {
		alert("If you wish to participate, you must check both boxes at the bottom of the page.");
		return false;
	}
	return false;
};
var pis = {
	type:"external-html",
	url: "pis.html",
	cont_btn: "start",
	check_fn: check_consent
};

var instructions = {
	type: 'instructions',
	pages: function() {
		html = [	
					// Page 1
					'<p class="instructions-text">You will earn a base amount of £5.00 for completing this experiment.</p>'+
					'<p class="instructions-text">In addition, you can earn a bonus of up to £2, depending on your decisions and luck.</p>',
					
					// Page 2
					'<p class="instructions-text">In this experiment, we will try to simulate a casino environment. Much like in a casino, you will be playing a card game in which a dealer will be dealing the cards and you will make decisions. Your final winnings will be calculated based on your performance and luck.</p>'+
					'<p class="instructions-text">In between each round of the card game you can talk to the dealer for a short period of time and get some information. As in casinos, dealers are not allowed to help you so what the dealer tells you will have no bearing on your card game – this part is designed to simulate some small-talk you would have with the dealer in a real casino.</p>',
					
					// Page 3
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div><div style="float: left; width: 70%">'+
					'<p class="instructions-text"><b>Stage 1: </b>You will be presented with a screen, where you will be dealt a playing card. The dealer will also deal a hidden card. You will also see who is the person who dealt the cards.'+
					'</div>'+
					'<div style="float: left; width: 29%; margin-left: 1%"><img style="margin: 15 0 15 0; width: 100%; float: left" src="images/instructions-multi-html/image1.png"></div>'+
					'</div>',
					
					// Page 4
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div><div style="float: right; width: 80%">'+
					'<p class="instructions-text"><b>Stage 1: </b>After a half-second delay, a question will appear on the bottom of the screen asking you to make a decision whether the hidden card is lower or higher than yours. Press on the corresponding blue button to make your decision.</p>'+
					'<p class="instructions-text">Remember that this is the order of the cards from <b>lowest to highest: <br> Ace > Two > Three > Four > Five > Six > Seven > Eight > Nine > Ten > Jack > Queen > King</b></p>'+
					'<p class="instructions-text"><b>IMPORTANT:</b> Note that the hidden card <b>CANNOT</b> be the same as yours. The hidden card will <b>ALWAYS</b> be either lower or higher.</p>'+
					'</div>'+
					'<div style="float: right; width: 19%; margin-right: 1%"><img style="margin: 15 0 15 0; width: 100%; float: right" src="images/instructions-multi-html/image2.png"></div>'+
					'</div>',
					
					// Page 5
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<p class="instructions-text"><b>Stage 2: </b>You will now be able to chat to the dealer and ask them questions. You can ask them who the dealer is friends with or who works the same time as the dealer - to do so press on the respective blue button. Note that you can only reveal one piece of information at a time. After you have made your decision, you will have 2 seconds to look at the information from your choice.</p>'+
					'<div><img style="width: 350px" src="images/instructions-multi-html/image3_v2.png"></div>',

					// Page 6
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<p class="instructions-text"><b>Stage 2: </b>After you have asked the dealer your first question, you can ask them another either of the two questions - who they are friends with or who works the same time as them - again. You will be given different information compared to your first ask. This time, however, you are allowed to skip asking them anything by using the yellow-colored button at the bottom of the screen in order to immediately proceed to the next card game round. If you do decide to ask them a question again, similar to before, you will have 2 seconds to look at the information from your choice.</p>'+
					'<div><img style="width: 350px" src="images/instructions-multi-html/image3_v3.png"></div>',

					// Page 7
					'<p class="instructions-text">Your total winnings will be shown to you at the end of the experiment and your bonus (up to £2) will be based on your points. For each correct card decision you will gain 10 points. The more points you win, the higher the bonus.</p>',

					// Page 8
					'<p class="instructions-text">You will now complete '+PT_TRIALS_NUM+' practice trials.</p>'+
					'<p class="instructions-text">Click the "Next" button to start.</p>'
				]
		return html
	},
	show_clickable_nav: true,
	post_trial_gap: 1000,
	show_page_number: true
};

var pt_block_feedback = {
	type: 'instructions',
	pages: function() {
		return ['<p>During the practice trials you made the correct decision '+jsPsych.data.get().filter({'pp_card_correct': true, 'trial_name': 'card_decision'}).count()+' times.</p>'+
				'<p>This brought you a total of '+jsPsych.data.get().filter({'trial_name': 'card_decision'}).select('curr_trial_winnings').sum()+' points from both lotteries.']
	},
	show_clickable_nav: true
}

var test_intro = {
	type: 'instructions',
	pages: ['<p class="instructions-text">You will now begin the test trials. There will be '+TRIALS_NUM+' trials in total.</p>'+
			'<p class="instructions-text">This should take approximately 30 minutes.You will be allowed to take breaks during this time.</p>'+
			'<p class="instructions-text">Press Next when you are ready to begin.</p>'
	],
	show_clickable_nav: true
}

var inter_block_text = {
	type: 'instructions',
	pages: function() {
		// order is final trial-fixation cross-this trial, hence we use last(2) below
		last_block_id = jsPsych.data.get().last(2).values()[0]['block']
		last_block_winnings = jsPsych.data.get().filter([{'pp_card_guess': 'lower', 'block': last_block_id, 'pt_trial': false, 'trial_name': 'card_decision'},
											{'pp_card_guess': 'higher', 'block': last_block_id, 'pt_trial': false, 'trial_name': 'card_decision'}])
											.select('curr_trial_winnings').sum()
		return ['<p>This is the end of block '+(last_block_id+1)+'. In this block you won '+last_block_winnings+' points.</p>'+
				'<p>There is/are '+(BLOCKS - (last_block_id+1))+' block(s) remaining.</p>'+
				'<p>You can take a break now if you wish and continue when you feel ready.</p>']
	},
	show_clickable_nav: true
}

var memory_test_intro = {
	type: 'instructions',
	pages: ['<p class="instructions-text">Thank you for completing the main part of the experiment and getting to this stage.</p>'+
			'<p class="instructions-text">Your bonus has already been calculated and will be shown to you shortly.</p>'+
			'<p class="instructions-text">Before that, we would now like you ask you to complete a short quiz to see how many dealers\' friends and colleagues you remember.</p>'+
			'<p class="instructions-text">Please <b>NOTE</b> that this is <b>NOT</b> going to have any effect on your bonus and is not designed to trick you in any way. Just please try to do your best and do not worry if you cannot remember everything - just make a best guess.</p>'+
			'<p class="instructions-text">This quiz will have 24 questions, asking you who dealers are friends with and who works the same time as them. Simply click on one of the people in the lineup on the bottom of your screen to make your choice. This should take approximately 3 minutes.</p>'+
			'<p class="instructions-text">Press Next when you are ready to begin.</p>'
	],
	show_clickable_nav: true
}

var memory_test_stimulus_question_type_intro = {
	type: 'instructions',
	pages: function() {
		let question_type_text
		if (jsPsych.timelineVariable('question_type', true) == 'friends') {
			question_type_text = 'who each dealer is <b>FRIENDS</b> with'
		} else if (jsPsych.timelineVariable('question_type', true) == 'work') {
			question_type_text = 'who <b>works the same time</b> as the dealer'
		}
		return ['<p class="instructions-text">You will now be asked about '+question_type_text+'. Click Next when you are ready to continue.</p>']
	},
	show_clickable_nav: true
}

var debrief = {
	type: 'instructions',
	pages: function() {
		let acquiredPoints = jsPsych.data.get().filter({'pt_trial': false, 'trial_name': 'card_decision'}).select('curr_trial_winnings').sum()
		let currentBonus = 0
		if (acquiredPoints >= 1000) {
			currentBonus = 2
		} else if (acquiredPoints > 600) {
			// each 2 points above 600 grant £0.01
			// rounding algorithm credits with number.epsilon https://stackoverflow.com/a/11832950
			currentBonus = Math.round((((acquiredPoints - 600) / 2) * 0.01 + Number.EPSILON) * 100) / 100
		}
		return ['<p>During the test trials you made the correct decision '+jsPsych.data.get().filter({'pp_card_correct': true, 'pt_trial': false, 'trial_name': 'card_decision'}).count()+' times.</p>'+
				'<p>This brought you a total of '+acquiredPoints+' points.</p>'+
				'<p>The bonus is calculated such that each 2 points above 600 grant £0.01 with the maximum £2.00 reached at 1,000 points.</p>'+
				'<p>This means that your current bonus is equal to £'+currentBonus+'.</p>'+
				'<p>Thank you for completing this experiment.</p>'+
				'<b>NB: When you click Next you will see a white screen and might need to wait for a short period of time (up to 1 minute, depending on your internet connection). This will ensure that your data are saved correctly and your bonus is recorded. Please wait patiently. After your data are saved, you will be AUTOMATICALLY redirected back to Prolific.</b></p>'
	]},
	show_clickable_nav: true
}
