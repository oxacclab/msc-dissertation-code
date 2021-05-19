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
					'<p class="instructions-text">In this experiment, we will try to simulate a casino environment. Much like in a casino, you will be playing a card game in which a dealer will be dealing the cards and you will make decisions. Your final winnings will be calculated based on your performance and the random award you are allocated on each card game round.</p>'+
					'<p class="instructions-text">In between each round of the card game you can talk to the dealer for a short period of time and ask him/her questions. As in casinos, dealers are not allowed to help you so what the dealer tells you will have no bearing on your card game – this part is designed to simulate some small-talk you would have with the dealer in a real casino.</p>',
					
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
					'<p class="instructions-text"><b>Stage 1: </b>After a half-second delay, a question will appear on the bottom of the screen asking you to make a decision whether the hidden card is lower or higher than yours. Press the corresponding keyboard key (1 for lower, 2 for higher) to make your decision.</p>'+
					'<p class="instructions-text">Remember that this is the order of the cards from <b>lowest to highest: <br> Ace > Two > Three > Four > Five > Six > Seven > Eight > Nine > Ten > Jack > Queen > King</b></p>'+
					'<p class="instructions-text"><b>IMPORTANT:</b> Note that the hidden card <b>CANNOT</b> be the same as yours. The hidden card will <b>ALWAYS</b> be either lower or higher.</p>'+
					'</div>'+
					'<div style="float: right; width: 19%; margin-right: 1%"><img style="margin: 15 0 15 0; width: 100%; float: right" src="images/instructions-multi-html/image2.png"></div>'+
					'</div>',
					
					// Page 5
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div style="height: 210px">'+ // container for the text ; 210 is a bit of a magic number but seems to work
					'<p class="instructions-text" style="width: 50%; float: left"><b>Stage 2: </b>You will now be able to chat to the dealer and and ask about your current trial’s potential earnings or something about the dealer. The earnings from the current trial will be calculated as the sum of the two lotteries on the left-hand side of the screen. These lotteries differ in their range (shown in darkgrey) and average values (shown in blue). For each trial, the computer will randomly draw one of five values from each lottery. These values are equally likely (20% each) and equally spaced.</p>'+
					'<div style="width: 50%; float: right; margin-block-start: 1em">'+ // container for the 2 boxes
 					'<div style="margin: auto auto 15 auto; width: 95%" class="instructions-text instructions-box">In the below example, Lottery 1 will draw 150 points on average. The actual draw could be 70, 110, 150, 190, or 230.</div>'+
					'<div style="margin: auto auto 15 auto; width: 95%" class="instructions-text instructions-box">In the below example, Lottery 2 will draw 170 points on average. The actual draw could be 130, 150, 170, 190, or 210.</div>'+
					'</div></div>'+
					'<div><img src="images/instructions-multi-html/image3.png"></div>',

					// Page 6
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div style="height: 210px">'+ // container for the text ; 210 is a bit of a magic number but seems to work
					'<p class="instructions-text" style="width: 50%; float: right"><b>Stage 2: </b>If you guessed correctly in Stage 1 whether the hidden card was higher or lower, you will win the points value of BOTH lotteries.  If you guessed incorrectly, you won\'t win the points of either lotter.<br>However, whether you were correct OR what the draws of the lotteries were will not be revealed to you immediately.</p>'+
					'<div style="width: 50%; float: left; margin-block-start: 1em">'+ // container for the 2 boxes
					'<div style="margin: auto auto 15 auto; width: 95%" class="instructions-text instructions-box">In the below example, Lottery 1 will draw 150 points on average. The actual draw could be 70, 110, 150, 190, or 230.</div>'+
					'<div style="margin: auto auto 15 auto; width: 95%" class="instructions-text instructions-box">In the below example, Lottery 2 will draw 170 points on average. The actual draw could be 130, 150, 170, 190, or 210.</div>'+
					'</div></div>'+
					'<div><img src="images/instructions-multi-html/image3.png"></div>',

					// Page 7
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<p class="instructions-text"><b>Stage 2: </b>You CAN choose whether you want to receive additional information about the trial – you can choose to reveal exactly how much you would win from each lottery and/or you can choose to reveal information about the dealer – who they are friends with or who works the same time as them – to do so press the keyboard key corresponding to the information you want.</p>'+
					'<p class="instructions-text"><b>NOTE</b> that this information will NOT in any way affect your trial’s winnings or your probability of winning in future rounds.</p>'+
					'<div style="float:left" class="instructions-text instructions-box">In the below example, Lottery 1 will draw 150 points on average. The actual draw could be 70, 110, 150, 190, or 230.</div>'+
					'<div style="float:right" class="instructions-text instructions-box">In the below example, Lottery 2 will draw 170 points on average. The actual draw could be 130, 150, 170, 190, or 210.</div>'+
					'<div><img style="margin-top: 15px;" src="images/instructions-multi-html/image3.png"></div>',

					// Page 8
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<p class="instructions-text"><b>Stage 2: </b>If you select to reveal one of the lotteries, a red line will appear and display the lottery’s draw. A question mark will display for the other lottery, unless you decide to reveal it as well when it will show its draw as well. Remember that regardless of whether you reveal the lotteries, they will be added to your points at the end (if you were correct in Stage 1 that is).</p>'+
					'<div><span style="padding: 3px" class="instructions-text instructions-box">In the below example, the draw from lottery 1 is 70.</span></div>'+
					'<div><img style="margin-top: 15px;" src="images/instructions-multi-html/image4.png"></div>',

					// Page 9
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div><div style="float: left; width: 60%">'+
					'<p class="instructions-text"><b>Stage 2: </b>You can also choose to reveal either who the dealer is friends with or who works the same time as the dealer. In this example both are revealed and you can see that Alan is friends with Mike and works the same time as Ted. You can choose to reveal only one of these, both, or none. Note that there is a 1-second delay between choices if you want to reveal more than one.</p>'+
					'</div>'+
					'<div style="float: left; width: 39%; margin-left: 1%"><img style="margin: 15 0 15 0; width: 100%; float: left" src="images/instructions-multi-html/image5.png"></div>'+
					'</div>',

					// Page 10
					'<p class="instructions-text">Each card game round will consist of 2 stages:</p>'+
					'<div><div style="float: right; width: 70%">'+
					'<p class="instructions-text"><b>Stage 2: </b>If you do not wish to reveal any additional information, you can just wait for the next card game round to begin. This will happen in 10 seconds and the loading bar at the top will give you an indication of this. <b>Regardless of whether you reveal information or not, the next round will start within the 10 seconds</b> - signified by the blue progress bar at the top.</p>'+
					'</div>'+
					'<div style="float: right; width: 29%; margin-right: 1%"><img style="margin: 15 0 15 0; width: 100%; float: right" src="images/instructions-multi-html/image5.png"></div>'+
					'</div>',

					// Page 11
					'<p class="instructions-text">Your total winnings will be shown to you at the end of the experiment and your bonus (up to £2) will be based on your points. The more points you win, the higher the bonus.</p>',

					// Page 12
					'<p class="instructions-text">You will now complete '+PT_TRIALS_NUM+' practice trials. The first '+FEEDBACK_TRIALS+' trials will provide short feedback '+
					'to remind you of the rules. The subsequent '+(PT_TRIALS_NUM-FEEDBACK_TRIALS)+' practice trials will NOT provide feedback.</p>'+
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

		hidden_card_string = jsPsych.timelineVariable('card_hidden', true)
		hidden_card_string_capitalized = hidden_card_string.charAt(0).toUpperCase() + hidden_card_string.slice(1)
		html = '<p>In this trial your card was '+jsPsych.timelineVariable('card_self', true)+' and the hidden card was a '+
					hidden_card_string_capitalized+'</p>'+
				'<p>You guessed that the hidden card was '+card_decision_last_trial_data['pp_card_guess']+'.</p>'
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
		// order is final trial-fixation cross-this trial, hence we use last(2) below
		last_block_id = jsPsych.data.get().last(2).values()[0]['block']
		last_block_winnings = jsPsych.data.get().filter([{'pp_card_guess': 'lower', 'block': last_block_id},
											{'pp_card_guess': 'higher', 'block': last_block_id}])
											.select('curr_trial_winnings').sum()
		return ['<p>This is the end of block '+(last_block_id+1)+'. In this block you won '+last_block_winnings+' points.</p>'+
				'<p>There is/are '+(BLOCKS - (last_block_id+1))+' block(s) remaining.</p>'+
				'<p>You can take a break now if you wish and continue when you feel ready.</p>']
	},
	show_clickable_nav: true
}

var debrief = {
	type: 'instructions',
	pages: function() {
		let acquiredPoints = jsPsych.data.get().select('curr_trial_winnings').sum()
		let currentBonus = 0
		if (acquiredPoints >= 50000) {
			currentBonus = 2
		} else if (acquiredPoints > 35000) {
			// each 300 points above 35000 grant £0.04
			// rounding algorithm credits with number.epsilon https://stackoverflow.com/a/11832950
			currentBonus = Math.round((((acquiredPoints - 35000) / 300) * 0.04 + Number.EPSILON) * 100) / 100
		}
		return ['<p>During the test trials you made the correct decision '+jsPsych.data.get().filter({'pp_card_correct': true}).count()+' times.</p>'+
				'<p>This brought you a total of '+acquiredPoints+' points from both lotteries.</p>'+
				'<p>The bonus is calculated such that each 300 points above 35,000 grant £0.04 with the maximum £2.00 reached at 50,000 points.</p>'+
				'<p>This means that your current bonus is equal to £'+currentBonus+'.</p>'+
				'<p>Thank you for completing this experiment. <b>NB: Please click Continue to save your data and be redirected back to Prolific.</b></p>'
	]},
	show_clickable_nav: true
}
