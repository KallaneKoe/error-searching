<template>
	<div v-if="isLoading">
		<div class="loader"></div>
	</div>
	<div class="mainscreen" v-else>
		<div class="chatscreen">
			<div className="min-h-[90vh]  p-[30px]">
				<div class="chatbubbles">
					<div class="chat-bubble">
						<pre class="bot">
Xin chào, hôm nay tôi có thể giúp gì cho bạn?
						</pre>
					</div>
					<div class="options" v-for="(option, index) in platformChoiceOption" :key="index">
						<button class="chat-bubble option-button" @click="filterByPlatform(option)">
							<pre class="bot">{{ option }}</pre>
						</button>
					</div>
				</div>
				<div v-for="(message, index) in messages" :key="index" class="chatbubbles">
					<div class="chat-bubble user">
						<pre class="content user">{{ message.userMessage }}</pre>
					</div>
					<swiper v-if="Array.isArray(message.botMessage)" class="chat-bubble" :slides-per-view="1"
						space-between="20" :navigation="true" :modules="[Navigation, Pagination]" :pagination="true"
						id="messages">
						<swiper-slide v-for="(mess, index) in message.botMessage" :key="index">
							<pre class="content bot">{{ mess }}</pre>
						</swiper-slide>
					</swiper>
					<div class="chat-bubble" v-else>
						<pre class="content bot">{{ message.botMessage }}</pre>
					</div>
					<div class="options" v-for="(option, index) in playerChoiceOption" :key="index" v-if="
						message.botMessage ===
						'Bạn đang tìm thông tin trên Player nào vậy?'
					">
						<button class="chat-bubble option-button" @click="filterByPlayer(option)">
							<pre class="bot">{{ option }}</pre>
						</button>
					</div>
					<div class="options" v-for="(option, index) in platformChoiceOption" :key="index" v-if="
						message.botMessage ===
						'Xin chào, hôm nay tôi có thể giúp gì cho bạn?'
					">
						<button class="chat-bubble option-button" @click="filterByPlatform(option)">
							<pre class="bot">{{ option }}</pre>
						</button>
					</div>
					<div class="options" v-for="(option, index) in searchChoiceOption" :key="index" v-if="
						message.botMessage ===
						'Bạn muốn tìm kiếm thông theo gì?'
					">
						<button class="chat-bubble option-button" @click="filteredByProperties(option)">
							<pre class="bot">{{ option }}</pre>
						</button>
					</div>
				</div>
			</div>

			<div class="input">
				<div class="input-zone">
					<!-- <ul v-if="filteredSuggestions.length > 0 && showSuggestions" class="list">
						<li v-for="(suggestion, index) in filteredSuggestions" :key="index"
							@click="selectSuggestion(suggestion)" class="list-detail">
							{{ suggestion }}
						</li>
					</ul> -->
					<input type="text" rows="90" class="input_textbox" placeholder="Input your question here"
						v-model="newMessage" @keyup.enter="search(newMessage)" @input="onInput"
						@focus="showSuggestions = true" @blur="hideSuggestions" />
				</div>
				<button class="input_button" @click="search(newMessage)">
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"
						class="text-4xl text-black">
						<path fill="currentColor"
							d="m29.919 6.163l-4.225 19.925c-.319 1.406-1.15 1.756-2.331 1.094l-6.438-4.744l-3.106 2.988c-.344.344-.631.631-1.294.631l.463-6.556L24.919 8.72c.519-.462-.113-.719-.806-.256l-14.75 9.288l-6.35-1.988c-1.381-.431-1.406-1.381.288-2.044l24.837-9.569c1.15-.431 2.156.256 1.781 2.013z" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="js" setup>
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/vue';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';


defineComponent({
	name: 'CibTelegramPlane',
})
const newMessage = ref('')
const messages = ref([])


const platformChoiceOption = ref([])
const playerChoiceOption = ref([])
const searchChoiceOption = ref(['ErrCode', 'ErrMessage', 'Cause'])

// const suggestData = ref(['Mã lỗi: ;', 'Thông báo lỗi: ;', 'Trình phát: ;', 'Thiết bị: ;', 'Nguyên nhân: ;'])
const filteredSuggestions = ref([])
const showSuggestions = ref(false)
let data
let responseList = []
let FilteredData
let searchProperties



const config = useRuntimeConfig()
// const link1 = "https://script.google.com/macros/s/AKfycbwo7u98iVTLvfljMAOx-VlYwuKWBIkPsojjm4HlHmvFj_4CnX0N4PnfzGLN0jSd8jVZXA/exec"
// const link2 = config.public.apiBase
// console.log(link1, link2)

const isLoading = ref(true)

onMounted(async () => {
	try {
		data = await axios.get(config.public.apiBase);
		const platform = data.data.map(errorCode => errorCode.Platform);

		platformChoiceOption.value = [...new Set(platform)];

		console.log(data)

	} catch (error) {
		console.error('Lỗi khi tải dữ liệu:', error)
	} finally {
		isLoading.value = false
	}
})

const filterByPlatform = (platForm) => {
	FilteredData = data.data
	FilteredData = FilteredData.filter(item => {
		if (item.Platform !== undefined) {

			return item.Platform.toLowerCase().includes(platForm.toLowerCase());
		}
		return false;
	});
	const player = FilteredData.map(errorCode => errorCode.Player.toLowerCase());
	playerChoiceOption.value = [...new Set(player)]

	playerChoiceOption.value = playerChoiceOption.value.map(player =>
		player.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))


	sendMessage(platForm, "Bạn đang tìm thông tin trên Player nào vậy?")


	console.log(FilteredData)
}

const filterByPlayer = (player) => {
	FilteredData = FilteredData.filter(item => {
		if (item.Player !== undefined) {

			return item.Player.toLowerCase().includes(player.toLowerCase());
		}
		return false;
	});
	sendMessage(player, "Bạn muốn tìm kiếm thông theo gì?")
}
const filteredByProperties = (searchBy) => {
	sendMessage(searchBy, "Bạn có thể bắt đầu tìm kiếm theo " + searchBy + " rồi")
	searchProperties = searchBy
}

const search = (searchString) => {
	console.log(searchProperties)
	if (searchProperties === 'ErrCode') {
		FilteredData = FilteredData.filter(item => {
			if (item.ErrCode !== undefined) {

				return item.ErrCode.toLowerCase() === searchString.toLowerCase();
			}
			return false;
		});
	} else if (searchProperties === 'ErrMessage') {
		FilteredData = FilteredData.filter(item => {
			if (item.ErrMessage !== undefined) {

				return item.ErrMessage.toLowerCase().includes(searchString.toLowerCase());
			}
			return false;
		});
	} else if (searchProperties === 'Cause') {
		FilteredData = FilteredData.filter(item => {
			if (item.Cause !== undefined) {

				return item.Cause.toLowerCase().includes(searchString.toLowerCase());
			}
			return false;
		});
	}

	const defaultValues = {
		Player: 'Không có',
		ErrCode: 'Không có',
		ErrMessage: 'Không có',
		Cause: 'Không có',
		CustomerSolution: 'Không có',
		DeveloperSolution: 'Không có',
		Note: 'Không có'
	};


	if (FilteredData.length > 0) {
		const item = FilteredData[0];

		Object.keys(defaultValues).forEach(key => {
			if (item[key] === undefined) {
				item[key] = defaultValues[key];
			}
		});
		for (let i = 0; i < FilteredData.length; i++) {

			let resString = `Player: ${FilteredData[i].Player}\nMã lỗi: ${FilteredData[i].ErrCode}\nThông báo lỗi: ${FilteredData[i].ErrMessage}\nNguyên nhân:\n${FilteredData[i].Cause}\nHướng giải quyểt cho khách hàng:\n${FilteredData[i].CustomerSolution}\nĐội xử lý:\n${FilteredData[i].DeveloperSolution}\nGhi chú thêm:\n${FilteredData[i].Note}`
			console.log(FilteredData.length)
			console.log("Item no.", i, ": ", resString)
			responseList.push(resString)


		}
		console.log(responseList)

		sendMessage(
			newMessage.value, responseList
		)

		responseList = []



	} else {
		sendMessage(newMessage, "Sorry, I don't understand the question.")


	}

}

// const onInput = () => {
// 	const words = newMessage.value.split(' ')
// 	const lastWord = words[words.length - 1]

// 	if (lastWord.length > 0) {
// 		filteredSuggestions.value = suggestData.value.filter(suggestion =>
// 			suggestion.toLowerCase().startsWith(lastWord.toLowerCase())
// 		)
// 	} else {
// 		filteredSuggestions.value = []
// 	}
// }

// const hideSuggestions = () => {
// 	setTimeout(() => {
// 		showSuggestions.value = false
// 	}, 200)
// }

// const selectSuggestion = (suggestion) => {
// 	const words = newMessage.value.split(' ')
// 	words[words.length - 1] = suggestion
// 	newMessage.value = words.join(' ') + ' '
// 	showSuggestions.value = false
// }

const sendMessage = (userMessage, botMessage) => {

	messages.value.push({ userMessage: userMessage, botMessage: botMessage })
	console.log(messages)
	newMessage.value = ''


}


// const checkResponse = () => {

// 	const errCodeRegex = /Mã lỗi:\s*([^;]+)/i;
// 	const errMessageRegex = /Thông báo lỗi:\s*([^;]+)/i;
// 	const playerRegex = /Trình phát:\s*([^;]+)/i;
// 	const platformRegex = /Thiết bị:\s*([^;]+)/i;
// 	const causeRegex = /Nguyên nhân:\s*([^;]+)/i;

// 	// const excludedFields = ['DevSol', 'Note', 'CustomerSolution', '_id', 'ErrCode', 'ErrMessage', 'Player', 'worksheetName'];

// 	const errCodeMatch = newMessage.value.match(errCodeRegex);
// 	const errMessageMatch = newMessage.value.match(errMessageRegex);
// 	const playerMatch = newMessage.value.match(playerRegex);
// 	const platformMatch = newMessage.value.match(platformRegex);
// 	const causeMatch = newMessage.value.match(causeRegex);



// 	let errCodeSearch = errCodeMatch ? errCodeMatch[1].trim() : null;
// 	let errMessageSearch = errMessageMatch ? errMessageMatch[1].trim() : null;
// 	let playerSearch = playerMatch ? playerMatch[1].trim() : null;
// 	let platformSearch = platformMatch ? platformMatch[1].trim() : null;
// 	let causeSearch = causeMatch ? causeMatch[1].trim() : null

// 	console.log(errCodeSearch, errMessageSearch, playerSearch, platformSearch)
// 	let cleanedMessage = newMessage.value.replace(errCodeRegex, '').replace(errMessageRegex, '').replace(playerRegex, '').replace(platformRegex, '').replace(causeRegex, '').trim();
// 	cleanedMessage = cleanedMessage.replace(/[;.;]/g, '').trim();
// 	console.log("Cleaned Message:", cleanedMessage, "Type of: ", typeof cleanedMessage)



// 	const keywords = cleanedMessage.toLowerCase().split(' ');


// 	let filteredItems = data.data;
// 	console.log("Data: ", data.data)

// 	if (errCodeSearch) {
// 		filteredItems = filteredItems.filter(item => item.ErrCode === errCodeSearch);
// 	}
// 	if (errMessageSearch) {
// 		filteredItems = filteredItems.filter(item => {

// 			if (item.ErrMessage !== undefined) {


// 				return item.ErrMessage.toLowerCase().includes(errMessageSearch.toLowerCase());
// 			}
// 			return false;
// 		});
// 	}
// 	if (playerSearch) {
// 		filteredItems = filteredItems.filter(item => {
// 			if (item.Player !== undefined) {


// 				return item.Player.toLowerCase().includes(playerSearch.toLowerCase());
// 			}
// 			return false;
// 		});
// 	}
// 	if (platformSearch) {
// 		filteredItems = filteredItems.filter(item => {
// 			if (item.Platform !== undefined) {


// 				return item.Platform.toLowerCase().includes(platformSearch.toLowerCase());
// 			}
// 			return false;
// 		});
// 	}
// 	if (causeSearch) {
// 		filteredItems = filteredItems.filter(item => {
// 			if (item.Cause !== undefined) {


// 				return item.Cause.toLowerCase().includes(causeSearch.toLowerCase());
// 			}
// 			return false;
// 		});
// 	}




// 	if (keywords[0] !== '') {
// 		keywords.forEach(keyword => {
// 			console.log(keyword)
// 			let previousFilteredItems = filteredItems;
// 			const regex = new RegExp(`\\b${keyword}\\b`, 'i');

// 			//ErrCode
// 			if (filteredItems.length > 0) {
// 				filteredItems = filteredItems.filter(item => {
// 					if (item.ErrCode !== undefined) {
// 						return item.ErrCode === keyword
// 					} else return false

// 				}
// 				);
// 			}

// 			if (filteredItems.length === 0) {
// 				filteredItems = previousFilteredItems;
// 			} else if (filteredItems.length === 1) {
// 				return filteredItems;
// 			} else {
// 				previousFilteredItems = filteredItems
// 			}
// 			console.log("ErrCode", filteredItems)

// 			//ErrMessage
// 			if (filteredItems.length > 0) {
// 				filteredItems = filteredItems.filter(item => {

// 					if (item.ErrMessage !== undefined) {
// 						return item.ErrMessage.toLowerCase().includes(keyword);
// 					} else return false

// 				}
// 				);
// 			}


// 			if (filteredItems.length === 0) {
// 				filteredItems = previousFilteredItems;
// 			} else if (filteredItems.length === 1) {
// 				return filteredItems;
// 			} else {
// 				previousFilteredItems = filteredItems
// 			}

// 			console.log("ErrMessage", filteredItems)

// 			//Cause
// 			if (filteredItems.length > 0) {
// 				filteredItems = filteredItems.filter(item => {
// 					if (item.Cause !== undefined) {


// 						return item.Cause.toLowerCase().includes(keyword);
// 					} else return false

// 				}
// 				);
// 			}

// 			if (filteredItems.length === 0) {
// 				filteredItems = previousFilteredItems;
// 			} else if (filteredItems.length === 1) {
// 				return filteredItems;
// 			} else {
// 				previousFilteredItems = filteredItems
// 			}

// 			console.log("Cause", filteredItems)

// 			//Player
// 			if (filteredItems.length > 0) {
// 				filteredItems = filteredItems.filter(item => {
// 					if (item.Player !== undefined) {


// 						return item.Player.toLowerCase().includes(keyword);
// 					} else return false

// 				}
// 				);
// 			}

// 			if (filteredItems.length === 0) {
// 				filteredItems = previousFilteredItems;
// 			} else if (filteredItems.length === 1) {
// 				return filteredItems;
// 			} else {
// 				previousFilteredItems = filteredItems
// 			}
// 			console.log("Player", filteredItems)
// 			//Platform

// 			if (filteredItems.length > 0) {
// 				filteredItems = filteredItems.filter(item => {
// 					if (item.Platform !== undefined) {

// 						return item.Platform.toLowerCase().includes(keyword);
// 					} else return false

// 				}
// 				);
// 			}

// 			if (filteredItems.length === 0) {
// 				filteredItems = previousFilteredItems;
// 			} else if (filteredItems.length === 1) {
// 				return filteredItems;
// 			} else {
// 				previousFilteredItems = filteredItems
// 			}


// 			console.log(filteredItems)
// 		});
// 	}





// 	const defaultValues = {
// 		Player: 'Không có',
// 		ErrCode: 'Không có',
// 		ErrMessage: 'Không có',
// 		Cause: 'Không có',
// 		CustomerSolution: 'Không có',
// 		DeveloperSolution: 'Không có',
// 		Note: 'Không có'
// 	};

// 	if (filteredItems === data.data) {
// 		filteredItems = []
// 	}

// 	if (filteredItems.length > 0) {
// 		const item = filteredItems[0];

// 		Object.keys(defaultValues).forEach(key => {
// 			if (item[key] === undefined) {
// 				item[key] = defaultValues[key];
// 			}
// 		});
// 		for (let i = 0; i < filteredItems.length; i++) {

// 			let resString = `Player: ${filteredItems[i].Player}\nMã lỗi: ${filteredItems[i].ErrCode}\nThông báo lỗi: ${filteredItems[i].ErrMessage}\nNguyên nhân:\n${filteredItems[i].Cause}\nHướng giải quyểt cho khách hàng:\n${filteredItems[i].CustomerSolution}\nĐội xử lý:\n${filteredItems[i].DeveloperSolution}\nGhi chú thêm:\n${filteredItems[i].Note}`
// 			console.log(filteredItems.length)
// 			console.log("Item no.", i, ": ", resString)
// 			responseList.push(resString)


// 		}
// 		console.log(responseList)

// 		sendMessage(
// 			newMessage.value, responseList
// 		)

// 		responseList = []



// 	} else {
// 		sendMessage(newMessage, "Sorry, I don't understand the question.")


// 	}


// }
</script>

<style>
.mainscreen {
	height: 100vh;
	background-color: #bec7a5;
	overflow-x: hidden;
}

.input {
	padding: 20px;
	display: flex;
	flex-direction: row;
	bottom: 0;
	right: 0;
	left: 0;
	flex: 1;
	width: 100%;
	position: sticky;
	z-index: 10;
}

.input_textbox {
	flex: auto;
	width: 100%;
	background-color: whitesmoke;
	border-radius: 900px;
	color: black;
	padding: 0px 16px 0px 16px;
	font-size: large;
	border: 2px solid black;
	font-weight: 600;
	min-height: 66px;
}

.input_button {
	border-radius: 100%;
	background-color: #d0f860;
	padding: 0px 0px 0px 2px;
	margin: 8px;
	border: 2px solid black;
	width: 50px;
	height: 50px;
	position: sticky;
	align-self: self-end;
}

.chatscreen {
	display: flex;
	flex-direction: column;
	background-color: #bec7a5;
}

.list {
	flex: 1;
	display: absolute;

	width: 100%;
	margin-top: 1px;
	min-width: 66px;

	border-radius: 16px;
	margin-bottom: 2px;
}

.list-detail {
	cursor: pointer;
	color: black;
	padding: 0px 16px 0px 16px;
	border: 2px black solid;
	margin-bottom: 3px;
	font-size: large;
	align-content: center;
	font-weight: 600;
	min-height: 66px;
	background: white;
	border-radius: 16px;
}

.list-detail:hover {
	background-color: rgb(223, 220, 220);
	border-radius: 16px;
}

.input-zone {
	flex: auto;
	width: 100vw;
	display: flex;
	flex-direction: column;
}

.chatbubbles {
	display: flex;
	flex-direction: column;
}

.loader {
	width: 50px;
	padding: 8px;
	aspect-ratio: 1;
	border-radius: 50%;
	background: #25b09b;
	--_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
	-webkit-mask: var(--_m);
	mask: var(--_m);
	-webkit-mask-composite: source-out;
	mask-composite: subtract;
	animation: l3 1s infinite linear;
	position: fixed;
	top: 50%;
	left: 50%;
}

@keyframes l3 {
	to {
		transform: rotate(1turn);
	}
}

.chat-bubble {
	width: fit-content;
	height: fit-content;
	max-width: 70%;
	min-width: 30%;
	padding: 15px 15px 15px;

	margin: 10px;
	position: relative;

	overflow-y: auto;
	color: black;
}

.chat-bubble.user {
	margin-left: auto;
}

pre.user {
	background-color: #dcf8c6;
	color: black;
}

pre.bot {
	background-color: whitesmoke;
	margin-left: 45px;
	margin-right: 45px;
}

pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	overflow-wrap: break-word;

	border: 2px black solid;
	border-radius: 8px;
	padding: 14px;
}

.swiper-button-prev,
.swiper-button-next {
	color: black;
	background-color: whitesmoke;
	border-radius: 100%;
	border: 2px solid black;
	width: 45px;
	height: 45px;
}

.swiper-pagination-bullet-active {
	background: #000;
}

.options {
	display: flex;
	flex-direction: column;
}

.chat-bubble.option-button {
	padding-top: unset;
	padding-bottom: unset;
	margin-top: unset
}
</style>
