export default class ModalWindow {
    showModal() {
        this.createModal();
        document.body.appendChild(this.modal);

        this.buttonOk = this.modal.querySelector('.button-ok');
        this.buttonOk.addEventListener('click', this.onSaveCoord);

        this.buttoncancel = this.modal.querySelector('.button-cancel');
        this.buttoncancel.addEventListener('click', this.onCancel);
    }

    onCancel(event) {
        event.preventDefault();
        let { modal } = this.modal;
        document.body.removeChild(modal);
        modal = null;
    }

    onSaveCoord(event) {
        event.preventDefault();
        let { modal } = this.modal;

        const formText = modal.querySelector('.form__text');
        this.coord = formText.value;
        const checkFormat = this.modal.checkFormat(this.coord);

        if (!checkFormat) {
            const warning = modal.querySelector('.warning');
            warning.textContent = this.warning;
            formText.style.background = '#dba1a1';
            setTimeout(() => {
                warning.textContent = '';
            }, 2000);
            return;
        }

        this.createTextPost();
        document.body.removeChild(modal);
        modal = null;
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        this.modal.innerHTML = `
        <div class="modal__wrapper">
          <div class="modal__content">
            <h3 class="modal__title">Ошибочка</h3>
            <p class="modal__text">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
            <textarea type="text" class="form__text" required></textarea>
            <button class="form__button button button-cancel">Отмена</button>
            <button class="form__button button button-ok">Подтвердить</button>
            <div class='warning'></div>
          </div>
        </div>
        `;
    }

    checkFormat(position) {
        const coords = position.split(',').map((coord) => coord.match(/[+|−|-|—|-]?\d{1,3}\.\d+/));
        if (!coords[0] || !coords[1]) {
            this.warning = 'Введите данные в формате 00.00000, 00.00000';
            return false;
        }
        this.latitude = coords[0][0];
        this.longitude = coords[1][0];
        return true;
    }
}