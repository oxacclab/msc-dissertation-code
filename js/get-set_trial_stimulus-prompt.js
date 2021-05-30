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
			'</div>'
}

function get_lotteries_html(high_variance_lottery_left_or_right, high_variance_lottery_EV, low_variance_lottery_EV) {
	// padding defines where precisely the lines are located
	// -1 at the end in order for the next pixel to begin the content
	let high_variance_padding_top =  (HIGH_VARIANCE_VALUE/2) - 1 
	let low_variance_padding_top = (LOW_VARIANCE_VALUE/2) - 1
	let high_variance_padding_bottom = high_variance_lottery_EV - high_variance_padding_top - 1
	let low_variance_padding_bottom = low_variance_lottery_EV - low_variance_padding_top - 1

	if (high_variance_lottery_left_or_right == 'left') {
		lotteries_html ='<div class="information-individual-container">'+
							'<div class="lottery-outside-bar">'+
								'<div class="lottery-limits-text" style="bottom: 0px; right: -15px">0</div>'+
								'<div class="lottery-limits-text" style="top: 0px; right: -25px">500</div>'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="lottery-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: -30px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+ 
							'</div>'+
						'</div>'+
						'<div class="information-individual-container">'+
							'<div class="lottery-outside-bar">'+
								'<div class="lottery-limits-text" style="bottom: 0px; left: -15px">0</div>'+
								'<div class="lottery-limits-text" style="top: 0px; left: -25px">500</div>'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="lottery-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: 55px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	} else {
		lotteries_html ='<div class="information-individual-container">'+
							'<div class="lottery-outside-bar">'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="lottery-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: -30px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="information-individual-container">'+
							'<div class="lottery-outside-bar">'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="lottery-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: 55px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	}

	return lotteries_html
}

function get_nonrewardinfo_html(dealer_name, current_dealer_id) {
	// the below setup uses a lot of magic numbers but it works
	// really exploits the fact that the whole container is 800px (max width) and that half is 400 - justifiable assumption as standardisation is preferred
	nonrewardinfo_html = '<div class="information-individual-container">'+
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
						'</div>'

	return nonrewardinfo_html
}

function set_initial_information_sampling_stimulus(high_variance_lottery_left_or_right, high_variance_lottery_EV, low_variance_lottery_EV, 
													current_dealer_id,
													max_width = 800, height = 500) {

	stimulus_html = '<div style=width: 800px; height: auto>'+

						'<div style="width: '+max_width+'px; height: 50px">'+
							'<p style="padding-top: 5px">Time to chat to the dealer while waiting for the next round!</p>'+
						'</div>'+
						'<div style="width: '+max_width+'px; height: '+height+'px">'+ // container for the information sampling stimulus
						'<div id="winnings-text" style="display: none"></div>'

	let dealer_name = PT_TRIALS_DEALERS.includes(current_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[current_dealer_id] : DEALER_ID_NAME_DICT[current_dealer_id]
	if (REWARDINFO_POSITION == 'left') {
		stimulus_html += get_lotteries_html(high_variance_lottery_left_or_right, high_variance_lottery_EV, low_variance_lottery_EV)
		stimulus_html += get_nonrewardinfo_html(dealer_name, current_dealer_id)
	} else if (REWARDINFO_POSITION == 'right') {
		stimulus_html += get_nonrewardinfo_html(dealer_name, current_dealer_id)
		stimulus_html += get_lotteries_html(high_variance_lottery_left_or_right, high_variance_lottery_EV, low_variance_lottery_EV)
	} else {
		alert("Problem occurred.")
	}
	
	stimulus_html += '</div></div>' // close container elements
	return stimulus_html	
}

function update_information_sampling_stimulus(previous_stimulus, previous_info_sampled, 
												left_lottery_winnings = undefined,
												right_lottery_winnings = undefined,
												friends_dealer_id = undefined, work_dealer_id = undefined) {	
	var parser = new DOMParser();
	var newHTML = parser.parseFromString(previous_stimulus, 'text/html')

	if (previous_info_sampled == 'lottery_1' || previous_info_sampled == 'lottery_2') {
		
		// one of the lotteries is chosen - update the line and the text accordingly
		// most likely not the best solution but there you go
		current_winnings_text = newHTML.getElementById('winnings-text').innerHTML

		if (current_winnings_text.length < 1) {
			new_winnings_text = previous_info_sampled == 'lottery_1' ? left_lottery_winnings+' + ?' : '? + '+right_lottery_winnings
			winnings_text_margin_left = 170
		} else if (previous_info_sampled == 'lottery_1' && current_winnings_text != left_lottery_winnings+' + ?') {
			new_winnings_text = current_winnings_text.replace('?', left_lottery_winnings)
			winnings_text_margin_left = 155
		} else if (previous_info_sampled == 'lottery_2' && current_winnings_text != '? + '+right_lottery_winnings) {
			new_winnings_text = current_winnings_text.replace('?', right_lottery_winnings)
			winnings_text_margin_left = 155
		}

		if (REWARDINFO_POSITION == 'right') {
			// this seems to get the job done
			winnings_text_margin_left += 400
		}

		newHTML.getElementById('winnings-text').innerHTML = new_winnings_text
		newHTML.getElementById('winnings-text').style.cssText = 'display: block; margin-left: '+winnings_text_margin_left+'px'
		// indices for the newHTML call are 0 for the left line and 1 for the right line
		if (previous_info_sampled == 'lottery_1') {
			newHTML.getElementsByClassName('winnings-line')[0].style.cssText = 'display: block; padding-bottom: '+(left_lottery_winnings-1)+'px'
		} else {
			newHTML.getElementsByClassName('winnings-line')[1].style.cssText = 'display: block; padding-bottom: '+(right_lottery_winnings-1)+'px'
		}	
	} else if (previous_info_sampled == 'friends') {
		let friends_name = PT_TRIALS_DEALERS.includes(friends_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[friends_dealer_id] : DEALER_ID_NAME_DICT[friends_dealer_id]
		newHTML.getElementById('friends-name').innerHTML = friends_name
		newHTML.getElementById('friends-img').src = 'images/'+friends_dealer_id+'.png'
	} else if (previous_info_sampled == 'work') {
		let work_name = PT_TRIALS_DEALERS.includes(work_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[work_dealer_id] : DEALER_ID_NAME_DICT[work_dealer_id]
		newHTML.getElementById('work-name').innerHTML = work_name
		newHTML.getElementById('work-img').src = 'images/'+work_dealer_id+'.png'
	}

	return newHTML.getElementsByTagName('body')[0].innerHTML
}

















// function set_initial_information_sampling_prompt(max_width = 800) {
// 	// not a necessary func but good for consistency sake
// 	return '<div style="width: '+max_width+'px; margin-top: 15px">'+
// 				'<div id="lottery_1" class="information_sampling_text" style="margin-left: 1.25%">Tell me potential winnings from lottery 1'+'<br>'+'[Press 1]</div>'+
// 				'<div id="lottery_2" class="information_sampling_text" style="margin-left: 2.5%; margin-right: 2.5%">Tell me potential winnings from lottery 2'+'<br>'+'[Press 2]</div>'+
// 				'<div id="friends" class="information_sampling_text">Who are you friends with?'+'<br>'+'[Press 3]</div>'+
// 				'<div id="work" class="information_sampling_text" style="margin-left: 2.5%">Who works the same time as you?'+'<br>'+'[Press 4]</div>'+
// 			'</div>'
// }


// function update_information_sampling_prompt(previous_prompt, previous_key_press) {
// 	var parser = new DOMParser();
// 	var newHTML = parser.parseFromString(previous_prompt, 'text/html')

// 	// setting the clicked button to grey
// 	button_pressed_id = ''
// 	switch(previous_key_press) {
// 		case 49:
// 			button_pressed_id = 'lottery_1';
// 			break;
// 		case 50:
// 			button_pressed_id = 'lottery_2';
// 			break;
// 		case 51:
// 			button_pressed_id = 'friends';
// 			break
// 		case 52:
// 			button_pressed_id = 'work';
// 			break;
// 	}
// 	newHTML.getElementById(button_pressed_id).style['background-color'] = 'grey'

// 	return newHTML.getElementsByTagName('body')[0].innerHTML
// }