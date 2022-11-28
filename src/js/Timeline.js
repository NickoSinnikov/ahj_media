import ModalWindow from './ModalWindow';
import getGeoposition from './Geoposition';

function getDate() {
    let date = new Date();
    date = date.toLocaleString('ru');
    return date;
}

export default class Timeline {
    constructor(elem) {
        if (typeof elem === 'string') {
            // eslint-disable-next-line no-param-reassign
            elem = document.querySelector(elem);
        }
        this.element = elem;
        this.modal = new ModalWindow();
        this.createTextPost = this.createTextPost.bind(this);
        this.onCreatePost = this.onCreatePost.bind(this);

        this.feed = this.element.querySelector('.timeline__feed');
        this.audioBtn = this.element.querySelector('.timeline__create-post-audio');
        this.videoBtn = this.element.querySelector('.timeline__create-post-video');
        this.textArea = this.element.querySelector('.timeline__create-post-text');

        this.modal.showModal = this.modal.showModal.bind(this.modal);
        this.modal.createModal = this.modal.createModal.bind(this.modal);
        this.modal.onSaveCoord = this.modal.onSaveCoord.bind(this);
        this.modal.onCancel = this.modal.onCancel.bind(this);
        this.modal.checkFormat = this.modal.checkFormat.bind(this);
    }

    init() {
        this.textArea.addEventListener('keydown', (event) => this.onCreatePost(event));
    }

    onCreatePost(event) {
        this.text = this.textArea.value.trim();

        if (event.key === 'Enter' && this.text) {
            event.preventDefault();

            if (event.currentTarget.value === '') {
                this.showMistake(event.currentTarget, 'Необходимо заполнить поле');
            } else {
                getGeoposition()
                    .then((data) => {
                        const { latitude, longitude } = data;
                        this.latitude = latitude;
                        this.longitude = longitude;
                        const post = this.markupОfThePost(this.text);
                        this.feed.insertBefore(post, this.feed.firstElementChild);


                    })
                    .catch(() => {
                        this.modal.showModal();
                    });


            }
        }
    }

    createTextPost() {
        const post = this.markupОfThePost(this.text);
        this.feed.insertAfter(post, this.feed.firstElementChild);

    }

    markupОfThePost(content) {
        const date = getDate();
        const markup = document.createElement('div');
        markup.classList.add('timeline__feed-post');
        markup.innerHTML = `
    <div class="post-date">${date}</div>
    <div class="post-text">${content}</div>
    <div class="post-geolacation">[${this.latitude}, ${this.longitude}] 🌍</div>
  `;

        return markup;
    }
}