"use strict"

window.onload = function () {

  //плавная прокрутка страницы
  let scrollEffect = () => {
    const anchors = document.querySelectorAll('a[href*="#a"]')

    for (let anchor of anchors) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const blockID = anchor.getAttribute('href').substr(1)
        let heightMenu = document.getElementsByTagName('header')[0].getBoundingClientRect().height;
        let position = document.getElementById(blockID).getBoundingClientRect();

        window.scrollTo({
          top: position.top + window.scrollY - heightMenu - 10,
          left: position.left,
          behavior: "smooth"
        })
      })
    }
  };
  scrollEffect();


  //маска для телефона
  $("._tel").mask("+7 (999) 999-9999", {autoclear: false});


  //установка курсора в начальное положение маски телефона
  const tel = document.querySelectorAll('._tel');

  tel.forEach(el => {
    el.addEventListener('click', () => {
      if (el.value === '+7 (___) ___-____') {
        el.setSelectionRange(4, 4)
      }
    })
  })


  //функция окон ответов попап
  function popupAnswer(text) {
    const popupAnswer = document.querySelector('.popupAnswer');
    const popupTitle = document.querySelector('.popupAnswer__title');

    popupTitle.innerHTML = text;
    popupAnswer.style.display = 'flex';
    setTimeout(() => {
      popupAnswer.style.display = 'none'
    }, 2000);
  }


  //работа с попап окном
  let popupForm = () => {
    const form = document.querySelector('.popup__form');
    const tel = document.querySelector('.popup__input._tel');
    const name = document.querySelector('.popup__input._name');
    const btn = document.querySelector('.front__btn');
    const close = document.querySelector('.popup__close');

    function clean() {
      tel.classList.remove('_error');
      tel.value = "";
      name.value = "";
    }

    btn.addEventListener('click', evt => {
      evt.preventDefault();
      form.parentElement.style.display = 'flex';
    })

    close.addEventListener('click', evt => {
      evt.preventDefault();
      clean();
      form.parentElement.style.display = 'none';
    })

    form.addEventListener('submit', formSend);

    async function formSend(e) {
      e.preventDefault();

      let formData = new FormData(form);

      //валидации телефона
      if (tel.value.indexOf('_') !== -1 || tel.value.length === 0) {
        tel.classList.add('_error');
      } else {
        console.log('валидация телефона пройдена');

        let response = await fetch('', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          console.log('ответ получен', form.elements.name.value, form.elements.tel.value);
          clean();
          form.parentElement.style.display = 'none';
          popupAnswer('Ожидайте звонка')
        } else {
          console.log('что-то пошло не так');
          form.parentElement.style.display = 'none';
          popupAnswer('Что-то пошло не так. Попробуйте снова.')
        }
      }
    }
  };
  popupForm();


  //работа с формой
  let mainForm = () => {
    const form = document.querySelector('.form');

    function clean() {
      let formReq = document.querySelectorAll('._req');

      for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];

        formRemoveError(input);
        formRemoveSuccess(input);
      }

      form.elements.name.value = '';
      form.elements.tel.value = '';
      form.elements.email.value = '';
      form.elements.text.value = '';
    }

    form.addEventListener('submit', formSend);

    //отправка формы
    async function formSend(e) {
      e.preventDefault();

      let error = formValidate(form);
      let formData = new FormData(form);

      if (error === 0) {
        console.log('валидация формы пройдена');

        const data = {
          name: form.elements.name.value,
          tel: form.elements.tel.value,
          email: form.elements.email.value,
          text: form.elements.text.value
        }

        let response = await fetch('', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          console.log('ответ получен', data);
          clean();
          popupAnswer('Заявка успешно отправлена');
        } else {
          popupAnswer('Что-то пошло не так. Попробуйте снова');
        }
      }
    }

    function formValidate(form) {
      let error = 0;
      let formReq = document.querySelectorAll('._req');

      for (let i = 0; i < formReq.length; i++) {
        const input = formReq[i];

        formRemoveError(input);
        formRemoveSuccess(input);

        //валидации email
        if (input.classList.contains('_email')) {
          if (emailTest(input)) {
            formAddError(input);
            error++;
          } else {
            formAddSuccess(input);
          }
        }

        //валидации имени
        if (input.classList.contains('_name')) {
          if (input.value.length < 2) {
            formAddError(input);
            error++;
          } else {
            formAddSuccess(input);
          }
        }

        //валидации поля
        if (input.classList.contains('_text')) {
          if (input.value.length < 10) {
            formAddError(input);
            error++;
          } else {
            formAddSuccess(input);
          }
        }

        //валидации телефона
        if (input.classList.contains('_tel')) {
          if (input.value.indexOf('_') !== -1 || input.value.length === 0) {
            formAddError(input);
            error++;
          } else {
            formAddSuccess(input);
          }
        }
      }

      return error;
    }

    //4 функции стилизации полей ввода
    function formAddError(input) {
      input.classList.add('_error');
      input.nextElementSibling.classList.add('_error')
    }

    function formRemoveError(input) {
      input.classList.remove('_error');
      input.nextElementSibling.classList.remove('_error')
    }

    function formAddSuccess(input) {
      input.classList.add('_success');
      input.nextElementSibling.classList.add('_success')
    }

    function formRemoveSuccess(input) {
      input.classList.remove('_success');
      input.nextElementSibling.classList.remove('_success')
    }

    //функция регулярного выражения валидации email
    function emailTest(input) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return !re.test(input.value);
    }
  };
  mainForm();


  //замена текста в заголовке в секции why
  let changeText = () => {
    let title = document.querySelector('.why__title');
    let clientWidth = window.innerWidth;

    if (clientWidth <= 768) {
      title.innerHTML = 'Наши приемущетва'
    } else {
      title.innerHTML = 'Почему вам стоит обратиться к нам?'
    }
  }
  changeText();

  //гамбергер меню
  let hamburger = () => {
    const menuIcon = document.querySelector('.hamburger__icon');
    const hamburgerItem = document.querySelectorAll('.hamburger__item');

    function toggleMenuIcon() {
      menuIcon.classList.toggle('_active');
    }

    function overflow() {
      if (menuIcon.classList.contains('_active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    }

    menuIcon.addEventListener('click', ()=> {
      toggleMenuIcon();
      overflow();
    });
    hamburgerItem.forEach(el => el.addEventListener('click', ()=> {
      toggleMenuIcon();
      overflow();
    }));
  }
  hamburger();
}