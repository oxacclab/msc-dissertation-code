var PT_TRIALS_NUM = 3
var TRIALS_NUM = 12//108
var TRIALS_PER_BLOCK = 12//108/3
var BLOCKS = TRIALS_NUM/TRIALS_PER_BLOCK 

var CARD_PRESENTATION_TRIAL_DURATION = 500
var INFORMATION_SAMPLING_DELAY = 2000

let DEALER_ID_NAME_DICT = get_dealer_id_name_dict_randomised()
// DEALER_ID_NAME_DICT looks like this (but in random order):
// {'d01': 'John', 'd02': 'Jack', 'd03': 'Sarah', 'd04': 'Jake', 'd05': 'Charlie', 'd06': 'Katherine', 'd07': 'Luis',
//    'd08': 'Francesca', 'd09': 'Rebekah', 'd10': 'Nick', 'd11': 'Victoria', 'd12': 'Elizabeth'}
let DEALERS = Object.keys(DEALER_ID_NAME_DICT)
let PT_TRIALS_DEALER_ID_NAME_DICT = {'d13': 'Joanne', 'd14': 'Margaret', 'd15': 'Alan',
										'd16': 'Ted', 'd17': 'Mike', 'd18': 'Alysson'}
let PT_TRIALS_DEALERS = Object.keys(PT_TRIALS_DEALER_ID_NAME_DICT)
let CARDS = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king']

let MODULAR_NET_EDGES = ['d01--d02', 'd01--d03', 'd01--d04', 'd02--d03', 'd02--d04', 'd03--d04', 
							'd05--d06', 'd05--d07', 'd05--d08', 'd06--d07', 'd06--d08','d07--d08', 
							'd09--d10', 'd09--d11', 'd09--d12', 'd10--d11', 'd10--d12', 'd11--d12']
let MODULAR_NET_DEALER_GROUPS = [['d01', 'd02', 'd03', 'd04'], ['d05', 'd06', 'd07', 'd08'], ['d09', 'd10', 'd11', 'd12']]
let RANDOM_NET_EDGES = 	['d01--d05', 'd01--d08', 'd01--d12', 'd02--d06', 'd02--d07', 'd02--d11', 
							'd03--d05', 'd03--d10', 'd03--d11', 'd04--d08', 'd04--d09', 'd04--d11',
							'd05--d09', 'd06--d09', 'd06--d12', 'd07--d10', 'd07--d12', 'd08--d10']

let MODULAR_CONNECTIONS_SOURCE = getRandom(['friends', 'work'], 1)[0]

jsPsych.data.addProperties({
	PT_TRIALS_NUM: PT_TRIALS_NUM,
	TRIALS_NUM: TRIALS_NUM,
	TRIALS_PER_BLOCK: TRIALS_PER_BLOCK,
	BLOCKS: BLOCKS,
	CARD_PRESENTATION_TRIAL_DURATION: CARD_PRESENTATION_TRIAL_DURATION,
	INFORMATION_SAMPLING_DELAY: INFORMATION_SAMPLING_DELAY,
	DEALER_ID_NAME_DICT: JSON.stringify(DEALER_ID_NAME_DICT),
	PT_TRIALS_DEALER_ID_NAME_DICT: JSON.stringify(PT_TRIALS_DEALER_ID_NAME_DICT),
	PT_TRIALS_DEALERS: PT_TRIALS_DEALERS,
	CARDS: CARDS,
	MODULAR_NET_EDGES: MODULAR_NET_EDGES,
	MODULAR_NET_DEALER_GROUPS: MODULAR_NET_DEALER_GROUPS,
	RANDOM_NET_EDGES: RANDOM_NET_EDGES,
	MODULAR_CONNECTIONS_SOURCE: MODULAR_CONNECTIONS_SOURCE,
});

function get_dealer_id_name_dict_randomised() {
	let dealer_id_name_dict = {}
	let male_names = ['John', 'Marc', 'Oscar', 'Charlie', 'Luis', 'Nick']
	let female_names = ['Sarah', 'Katherine', 'Francesca', 'Rebekah', 'Victoria', 'Elizabeth']
	let male_faces = ['d01', 'd02', 'd04', 'd05', 'd07', 'd10']
	let female_faces = ['d03', 'd06', 'd08', 'd09', 'd11', 'd12']

	for (s=0; s<=5; s++) {
		male_names = shuffle(male_names)
		female_names = shuffle(female_names)
		male_faces = shuffle(male_faces)
		female_faces = shuffle(female_faces)
	}
	
	for (i=0; i<male_names.length; i++) {
		dealer_id_name_dict[male_faces[i]] = male_names[i]
		dealer_id_name_dict[female_faces[i]] = female_names[i]
	}
	return dealer_id_name_dict
}