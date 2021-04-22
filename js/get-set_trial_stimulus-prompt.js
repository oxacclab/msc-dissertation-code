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

function set_initial_information_sampling_stimulus(high_variance_lottery, high_variance_lottery_EV, low_variance_lottery_EV, 
													current_dealer_id,
													max_width = 800, height = 500) {
	// high_variance_lottery - "left" or "right"
	// delta_EV - one of {−90, −70,−20, −5, 0, 5, 20, 70, 90}
	// random number - range between 111 and 389
	// current_dealer_id - see DEALER_ID_NAME_DICT's keys for dealer ids


	//------------------------------------1. set big container elements and winnings text
	stimulus_html = '<div style=width: 800px; height: auto>'+

						'<div style="width: '+max_width+'px; height: 50px">'+
							'<p style="padding-top: 5px">Time to chat to the dealer while waiting for the next round!</p>'+
						'</div>'+
						'<div style="width: '+max_width+'px; height: '+height+'px">'+ // container for stimulus
						'<div id="winnings-text" style="display: none"></div>'

	//------------------------------------2. set HTML for the payout sources bars
	//-1 at the end in order for the next pixel to begin the content
	var high_variance_padding_top =  (HIGH_VARIANCE_VALUE/2) - 1 
	var low_variance_padding_top = (LOW_VARIANCE_VALUE/2) - 1
	var high_variance_padding_bottom = high_variance_lottery_EV - high_variance_padding_top - 1
	var low_variance_padding_bottom = low_variance_lottery_EV - low_variance_padding_top - 1

	if (high_variance_lottery == 'left') {
		stimulus_html +='<div class="information-individual-container">'+
							'<div class="payout-source-outside-bar">'+
								'<div class="payout-source-limits-text" style="bottom: 0px; right: -15px">0</div>'+
								'<div class="payout-source-limits-text" style="top: 0px; right: -25px">500</div>'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="payout-source-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: -30px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+ 
							'</div>'+
						'</div>'+
						'<div class="information-individual-container">'+
							'<div class="payout-source-outside-bar">'+
								'<div class="payout-source-limits-text" style="bottom: 0px; left: -15px">0</div>'+
								'<div class="payout-source-limits-text" style="top: 0px; left: -25px">500</div>'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="payout-source-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: 55px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	} else {
		stimulus_html +='<div class="information-individual-container">'+
							'<div class="payout-source-outside-bar">'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="payout-source-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: -30px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
						'<div class="information-individual-container">'+
							'<div class="payout-source-outside-bar">'+
								'<div class="winnings-line" style="display: none"></div>'+
								'<div class="payout-source-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
										'<div class="blue-line-text" style="left: 55px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'
	}

	//------------------------------------3. set HTML for the images
	// stimulus_html += 	'<div class="information-individual-container">'+
	// 						'<div class="information-img-container">'+
	// 							'<p class="dealer-text" style="margin-right: 7.5px">'+DEALER_ID_NAME_DICT[current_dealer_id]+'</p>'+
	// 							'<img class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
	// 							'<img class="information-arrow-img" src="images/arrow.png">'+
	// 							'<p id="friends-name" class="dealer-text" style="margin-right: 7.5px">???</p>'+
	// 							'<img id="friends-img" class="information-dealers-img" src="images/question-mark.png">'+
	// 						'</div>'+
	// 					'</div>'+
	// 					'<div class="information-individual-container">'+
	// 						'<div class="information-img-container">'+
	// 							'<p class="dealer-text">'+DEALER_ID_NAME_DICT[current_dealer_id]+'</p>'+
	// 							'<img class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
	// 							'<img class="information-arrow-img" src="images/arrow.png">'+
	// 							'<p id="work-name" class="dealer-text">???</p>'+
	// 							'<img id="work-img" class="information-dealers-img" src="images/question-mark.png">'+
	// 						'</div>'+
	// 					'</div>'

// one too many magic numbers in the below; very crude execution but suffices for now;
// really exploits the fact that the whole container is 800px (max width) and that half is 400
	let dealer_name = PT_TRIALS_DEALERS.includes(current_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[current_dealer_id] : DEALER_ID_NAME_DICT[current_dealer_id]
	stimulus_html += 	'<div class="information-individual-container">'+
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
								// '<p class="dealer-text"></p>'+
								// '<img class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
								'<img style="top:180px; position: relative" class="information-arrow-img information-arrow-img-right" src="images/arrow.png">'+
								'<p style="top:180px; position: relative" id="work-name" class="dealer-text">???</p>'+
								'<img style="top:180px; position: relative" id="work-img" class="information-dealers-img" src="images/question-mark.png">'+
							'</div>'+
						'</div>'


	stimulus_html += '</div></div>' // close the div for the big container element and the stimulus container
	return stimulus_html	
}

function set_initial_information_sampling_prompt(max_width = 800) {
	// not a necessary func but good for consistency sake
	return '<div style="width: '+max_width+'px; margin-top: 15px">'+
				'<div id="ps_1" class="information_sampling_text" style="margin-left: 1.25%">Tell me potential winnings from lottery 1'+'<br>'+'[Press 1]</div>'+
				'<div id="ps_2" class="information_sampling_text" style="margin-left: 2.5%; margin-right: 2.5%">Tell me potential winnings from lottery 2'+'<br>'+'[Press 2]</div>'+
				'<div id="friends" class="information_sampling_text">Who are you friends with?'+'<br>'+'[Press 3]</div>'+
				'<div id="work" class="information_sampling_text" style="margin-left: 2.5%">Who works the same time as you?'+'<br>'+'[Press 4]</div>'+
			'</div>'
}

function update_information_sampling_stimulus(previous_stimulus, previous_key_press, 
												left_lottery_winnings = undefined,
												right_lottery_winnings = undefined,
												friends_dealer_id = undefined, work_dealer_id = undefined) {	
	var parser = new DOMParser();
	var newHTML = parser.parseFromString(previous_stimulus, 'text/html')

	if (previous_key_press == 49 || previous_key_press == 50) {
		current_winnings_text = newHTML.getElementById('winnings-text').innerHTML
		if (current_winnings_text.length < 1) {
			new_winnings_text = previous_key_press == 49 ? left_lottery_winnings+' + ?' : '? + '+right_lottery_winnings
			winnings_text_margin_left = 170
		} else {
			new_winnings_text = previous_key_press == 49 ? current_winnings_text.replace('?', left_lottery_winnings) : current_winnings_text.replace('?', right_lottery_winnings)
			winnings_text_margin_left = 155
		}
		newHTML.getElementById('winnings-text').innerHTML = new_winnings_text
		newHTML.getElementById('winnings-text').style.cssText = 'display: block; margin-left: '+winnings_text_margin_left+'px'
		// 0 for the left line and 1 for the right line
		if (previous_key_press == 49) {
			newHTML.getElementsByClassName('winnings-line')[0].style.cssText = 'display: block; padding-bottom: '+(left_lottery_winnings-1)+'px'
		} else {
			newHTML.getElementsByClassName('winnings-line')[1].style.cssText = 'display: block; padding-bottom: '+(right_lottery_winnings-1)+'px'
		}
			
	} else if (previous_key_press == 51) {
		let friends_name = PT_TRIALS_DEALERS.includes(friends_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[friends_dealer_id] : DEALER_ID_NAME_DICT[friends_dealer_id]
		newHTML.getElementById('friends-name').innerHTML = friends_name
		newHTML.getElementById('friends-img').src = 'images/'+friends_dealer_id+'.png'
	} else if (previous_key_press == 52) {
		let work_name = PT_TRIALS_DEALERS.includes(work_dealer_id) ? PT_TRIALS_DEALER_ID_NAME_DICT[work_dealer_id] : DEALER_ID_NAME_DICT[work_dealer_id]
		newHTML.getElementById('work-name').innerHTML = work_name
		newHTML.getElementById('work-img').src = 'images/'+work_dealer_id+'.png'
	}

	return newHTML.getElementsByTagName('body')[0].innerHTML
}

function update_information_sampling_prompt(previous_prompt, previous_key_press) {
	var parser = new DOMParser();
	var newHTML = parser.parseFromString(previous_prompt, 'text/html')

	// setting the clicked button to grey
	button_pressed_id = ''
	switch(previous_key_press) {
		case 49:
			button_pressed_id = 'ps_1';
			break;
		case 50:
			button_pressed_id = 'ps_2';
			break;
		case 51:
			button_pressed_id = 'friends';
			break
		case 52:
			button_pressed_id = 'work';
			break;
	}
	newHTML.getElementById(button_pressed_id).style['background-color'] = 'grey'

	return newHTML.getElementsByTagName('body')[0].innerHTML
}


// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------UPDATED DESIGN---------------------------------------------


// function set_initial_information_sampling_stimulus(high_variance_lottery, high_variance_lottery_EV, low_variance_lottery_EV, 
// 													current_dealer_id,
// 													max_width = 800, height = 600) {
// 	// high_variance_lottery - "left" or "right"
// 	// delta_EV - one of {−90, −70,−20, −5, 0, 5, 20, 70, 90}
// 	// random number - range between 111 and 389
// 	// current_dealer_id - see DEALER_ID_NAME_DICT's keys for dealer ids


// 	stimulus_html = '<div id="biggestcontainer">' +
// 						'<div id="dealer-intro-container">'+
// 							'<p>Time to chat with the dealer - ask them stuff</p>'+
// 						'</div>'+
// 						'<div id="buttons-container" style="width: '+max_width+'px; height: 100px">'+
// 							'<div id="ps_1" class="information_sampling_text" style="margin-left: 1.25%">Reveal lottery 1 amount [Press 1]</div>'+
// 							'<div id="ps_2" class="information_sampling_text" style="margin-left: 2.5%; margin-right: 2.5%">Reveal lottery 2 amount [Press 2]</div>'+
// 							'<div id="friends" class="information_sampling_text">Reveal who is the dealer friends with [Press 3]</div>'+
// 							'<div id="work" class="information_sampling_text" style="margin-left: 2.5%">Reveal who works the same time as the dealer [Press 4]</div>'+
// 						'</div>'


// 	//------------------------------------1. set big container element and winnings text
// 	// 																					100 for buttons-container
// 	stimulus_html += '<div id="stimuluscontainer" style="width: '+max_width+'px; height: '+(height-100)+'px">'+
// 					'<div id="winnings-text" style="display: none"></div>'

// 	//------------------------------------2. set HTML for the payout sources bars
// 	//-1 at the end in order for the next pixel to begin the content
// 	var high_variance_padding_top =  (HIGH_VARIANCE_VALUE/2) - 1 
// 	var low_variance_padding_top = (LOW_VARIANCE_VALUE/2) - 1
// 	var high_variance_padding_bottom = high_variance_lottery_EV - high_variance_padding_top - 1
// 	var low_variance_padding_bottom = low_variance_lottery_EV - low_variance_padding_top - 1



// 	if (high_variance_lottery == 'left') {
// 		stimulus_html +='<div class="information-individual-container">'+
// 							'<div class="payout-source-outside-bar">'+
// 								'<div class="payout-source-limits-text" style="bottom: 0px; right: -15px">0</div>'+
// 								'<div class="payout-source-limits-text" style="top: 0px; right: -25px">500</div>'+
// 								'<div class="winnings-line" style="display: none"></div>'+
// 								'<div class="payout-source-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
// 									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
// 										'<div class="blue-line-text" style="left: -30px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
// 									'</div>'+
// 								'</div>'+ 
// 							'</div>'+
// 						'</div>'+
// 						'<div class="information-individual-container">'+
// 							'<div class="payout-source-outside-bar">'+
// 								'<div class="payout-source-limits-text" style="bottom: 0px; left: -15px">0</div>'+
// 								'<div class="payout-source-limits-text" style="top: 0px; left: -25px">500</div>'+
// 								'<div class="winnings-line" style="display: none"></div>'+
// 								'<div class="payout-source-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
// 									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
// 										'<div class="blue-line-text" style="left: 55px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
// 									'</div>'+
// 								'</div>'+
// 							'</div>'+
// 						'</div>'
// 	} else {
// 		stimulus_html +='<div class="information-individual-container">'+
// 							'<div class="payout-source-outside-bar">'+
// 								'<div class="winnings-line" style="display: none"></div>'+
// 								'<div class="payout-source-inside-bar" style="height: '+LOW_VARIANCE_VALUE+'px; padding-bottom: '+low_variance_padding_bottom+'px">'+
// 									'<div class="blue-line" style="padding-top: '+low_variance_padding_top+'px">'+
// 										'<div class="blue-line-text" style="left: -30px; top: '+(low_variance_padding_top-15)+'px;">'+low_variance_lottery_EV+'</div>'+
// 									'</div>'+
// 								'</div>'+
// 							'</div>'+
// 						'</div>'+
// 						'<div class="information-individual-container">'+
// 							'<div class="payout-source-outside-bar">'+
// 								'<div class="winnings-line" style="display: none"></div>'+
// 								'<div class="payout-source-inside-bar" style="height: '+HIGH_VARIANCE_VALUE+'px; padding-bottom: '+high_variance_padding_bottom+'px">'+
// 									'<div class="blue-line" style="padding-top: '+high_variance_padding_top+'px">'+
// 										'<div class="blue-line-text" style="left: 55px; top: '+(high_variance_padding_top-15)+'px;">'+high_variance_lottery_EV+'</div>'+
// 									'</div>'+
// 								'</div>'+
// 							'</div>'+
// 						'</div>'
// 	}

// 	//------------------------------------3. set HTML for the images
// 	stimulus_html += 	'<div class="information-individual-container">'+
// 							'<div class="information-img-container">'+
// 								'<p class="dealer-text" style="margin-right: 7.5px">'+DEALER_ID_NAME_DICT[current_dealer_id]+'</p>'+
// 								'<img class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
// 								'<img class="information-arrow-img" src="images/arrow.png">'+
// 								'<p id="friends-name" class="dealer-text" style="margin-right: 7.5px">???</p>'+
// 								'<img id="friends-img" class="information-dealers-img" src="images/question-mark.png">'+
// 							'</div>'+
// 						'</div>'+
// 						'<div class="information-individual-container">'+
// 							'<div class="information-img-container">'+
// 								'<p class="dealer-text">'+DEALER_ID_NAME_DICT[current_dealer_id]+'</p>'+
// 								'<img class="information-dealers-img" src="images/'+current_dealer_id+'.png">'+
// 								'<img class="information-arrow-img" src="images/arrow.png">'+
// 								'<p id="work-name" class="dealer-text">???</p>'+
// 								'<img id="work-img" class="information-dealers-img" src="images/question-mark.png">'+
// 							'</div>'+
// 						'</div>'

// 	stimulus_html += '</div></div>' // close the div for the big container element
// 	return stimulus_html	
// }

// // function set_initial_information_sampling_prompt(max_width = 800) {
// // 	// not a necessary func but good for consistency sake
// // 	return ''
// // }

// function update_information_sampling_stimulus(previous_stimulus, previous_key_press, 
// 												left_lottery_winnings = undefined,
// 												right_lottery_winnings = undefined,
// 												friends_dealer_id = undefined, work_dealer_id = undefined) {	
// 	var parser = new DOMParser();
// 	var newHTML = parser.parseFromString(previous_stimulus, 'text/html')

// 	if (previous_key_press == 49 || previous_key_press == 50) {
// 		current_winnings_text = newHTML.getElementById('winnings-text').innerHTML
// 		if (current_winnings_text.length < 1) {
// 			new_winnings_text = previous_key_press == 49 ? left_lottery_winnings+' + ?' : '? + '+right_lottery_winnings
// 			winnings_text_margin_left = 170
// 		} else {
// 			new_winnings_text = previous_key_press == 49 ? current_winnings_text.replace('?', left_lottery_winnings) : current_winnings_text.replace('?', right_lottery_winnings)
// 			winnings_text_margin_left = 155
// 		}
// 		newHTML.getElementById('winnings-text').innerHTML = new_winnings_text
// 		newHTML.getElementById('winnings-text').style.cssText = 'display: block; margin-left: '+winnings_text_margin_left+'px'
// 		// 0 for the left line and 1 for the right line
// 		if (previous_key_press == 49) {
// 			newHTML.getElementsByClassName('winnings-line')[0].style.cssText = 'display: block; padding-bottom: '+(left_lottery_winnings-1)+'px'
// 		} else {
// 			newHTML.getElementsByClassName('winnings-line')[1].style.cssText = 'display: block; padding-bottom: '+(right_lottery_winnings-1)+'px'
// 		}
			
// 	} else if (previous_key_press == 51) {
// 		newHTML.getElementById('friends-name').innerHTML = DEALER_ID_NAME_DICT[friends_dealer_id]
// 		newHTML.getElementById('friends-img').src = 'images/'+friends_dealer_id+'.png'
// 	} else if (previous_key_press == 52) {
// 		newHTML.getElementById('work-name').innerHTML = DEALER_ID_NAME_DICT[work_dealer_id]
// 		newHTML.getElementById('work-img').src = 'images/'+work_dealer_id+'.png'
// 	}

// 	return newHTML.getElementsByTagName('body')[0].innerHTML
// }

// function update_information_sampling_prompt(previous_prompt, previous_key_press) {
// 	var parser = new DOMParser();
// 	var newHTML = parser.parseFromString(previous_prompt, 'text/html')

// 	// setting the clicked button to grey
// 	button_pressed_id = ''
// 	switch(previous_key_press) {
// 		case 49:
// 			button_pressed_id = 'ps_1';
// 			break;
// 		case 50:
// 			button_pressed_id = 'ps_2';
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