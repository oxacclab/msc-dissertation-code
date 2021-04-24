var INFORMATION_MULTIPLE_CHOICE = true
var EXP_MODE = 'PARTICIPANT'

var PT_TRIALS_NUM = 4
var FEEDBACK_TRIALS = 2
var TRIALS_NUM = 126
var TRIALS_PER_BLOCK = 126/3
var BLOCKS

var INFORMATION_SAMPLING_DURATION = 5000//10000
var CARD_PRESENTATION_TRIAL_DURATION = 2000
var INFORMATION_SAMPLING_INTERCHOICE_DELAY = 1000
var HIGH_VARIANCE_VALUE = 160
var LOW_VARIANCE_VALUE = 80
let DEALER_ID_NAME_DICT = get_dealer_id_name_dict_randomised()
// looks like this (but in random order):
// let DEALER_ID_NAME_DICT = {'d01': 'John', 'd02': 'Jack', 'd03': 'Sarah', 'd04': 'Jake', 'd05': 'Charlie', 'd06': 'Katherine', 'd07': 'Luis',
// 							'd08': 'Francesca', 'd09': 'Rebekah', 'd10': 'Nick', 'd11': 'Victoria', 'd12': 'Elizabeth'}
let DEALERS = Object.keys(DEALER_ID_NAME_DICT)
let PT_TRIALS_DEALER_ID_NAME_DICT = {'d13': 'Joanne', 'd14': 'Margaret', 'd15': 'Alan',
										'd16': 'Ted', 'd17': 'Mike', 'd18': 'Alysson'}
let PT_TRIALS_DEALERS = Object.keys(PT_TRIALS_DEALER_ID_NAME_DICT)
// let CARDS = ['Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace']
let CARDS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace']
let DELTA_EV_CATEGORIES = [-90, -70, -20, -5, 0, 5, 20, 70, 90]


// from 12-3 config
let MODULAR_NET_EDGES = ['d01--d02', 'd01--d03', 'd01--d04', 'd02--d03', 'd02--d04', 'd03--d12', 
							'd04--d05', 'd05--d06', 'd05--d07', 'd06--d07', 'd06--d08', 'd07--d08', 
							'd08--d09', 'd09--d10', 'd09--d11', 'd10--d11', 'd10--d12', 'd11--d12']
let RANDOM_NET_EDGES = 	['d01--d05', 'd01--d08', 'd01--d12', 'd02--d06', 'd02--d07', 'd02--d11', 
							'd03--d05', 'd03--d10', 'd03--d11', 'd04--d08', 'd04--d09', 'd04--d11',
							'd05--d09', 'd06--d09', 'd06--d12', 'd07--d10', 'd07--d12', 'd08--d10']


// from 15-4 config
// let DEALER_ID_NAME_DICT = {'d01': 'John', 'd02': 'Jack', 'd03': 'Sarah', 'd04': 'Jake', 'd05': 'Charlie', 'd06': 'Katherine', 'd07': 'Luis',
// 							'd08': 'Francesca', 'd09': 'Rebekah', 'd10': 'Nick', 'd11': 'Victoria', 'd12': 'Elizabeth', 'd13': 'Mel', 
// 							'd14': 'Tiffany', 'd15': 'Will'}
// let MODULAR_NET_EDGES = ['d01--d02', 'd01--d03', 'd01--d04', 'd01--d15', 'd02--d03', 'd02--d04', 
// 								'd02--d05', 'd03--d04', 'd03--d05', 'd04--d05', 'd05--d06', 'd06--d07', 
// 								'd06--d08', 'd06--d09', 'd07--d08', 'd07--d09', 'd07--d10', 'd08--d09', 
// 								'd08--d10', 'd09--d10', 'd10--d11', 'd11--d12', 'd11--d13', 'd11--d14', 
// 								'd12--d13', 'd12--d14', 'd12--d15', 'd13--d14', 'd13--d15', 'd14--d15']
// let RANDOM_NET_EDGES = 	['d01--d02', 'd01--d04', 'd01--d11', 'd01--d12', 'd02--d11', 'd02--d13',
// 						'd02--d14', 'd03--d04', 'd03--d05', 'd03--d10', 'd03--d15', 'd04--d07', 
// 						'd04--d13', 'd05--d06', 'd05--d07', 'd05--d14', 'd06--d07', 'd06--d08', 
// 						'd06--d09', 'd07--d10', 'd08--d10', 'd08--d13', 'd08--d15', 'd09--d11', 
// 						'd09--d12', 'd09--d15', 'd10--d15', 'd11--d12', 'd12--d14', 'd13--d14']