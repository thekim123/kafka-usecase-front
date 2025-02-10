import './assets/main.css'

import { createApp } from 'vue';
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router';

// Font Awesome Imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserFriends, faCommentDots } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘만 가져오기
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


// 아이콘 추가
library.add(faUserFriends, faCommentDots);

const app = createApp(App);

// Font Awesome 컴포넌트 등록
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia())
app.use(router);
app.mount('#app');
