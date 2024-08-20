<template>

	<div class="chat-bubble user">
		<pre class="content">{{ userMessage }}</pre>
	</div>
	<swiper v-if="Array.isArray(botMessage)" class="chat-bubble bot" :slides-per-view="1" space-between="20"
		ref="messageRefs">

		<swiper-slide v-for="(message, index) in botMessage" :key="index">

			<pre class=" content">{{ message }}</pre>

		</swiper-slide>
	</swiper>
</template>

<script>
import { SwiperSlide } from 'swiper/vue';
import Swiper from 'swiper';
export default {
	components: {
		Swiper,
		SwiperSlide,
	},
	props: {
		userMessage: {
			type: String,
			required: true,
		},
		botMessage: {
			type: [String, Array],
			required: true,
		},
	},
}

const scrollToLatestMessage = () => {
	if (messageRefs.value.length > 0) {
		const lastMessage = messageRefs.value[messageRefs.value.length - 1];
		lastMessage.scrollIntoView({ behavior: 'smooth' });
	}
};
</script>

<style scoped>
.chat-bubble {
	width: fit-content;

	max-width: 50%;
	min-width: 30%;
	padding: 15px 15px 30px;
	border-radius: 8px;
	margin: 10px;
	position: relative;
	border: 2px black solid;
	overflow-y: auto;
	color: black;
}

.chat-bubble.user {
	margin-left: auto;
	background-color: #dcf8c6;
	color: black;
}

.chat-bubble.bot {
	background-color: whitesmoke;
}

pre {
	white-space: pre-wrap;
	word-wrap: break-word;
	overflow-wrap: break-word;
}
</style>
