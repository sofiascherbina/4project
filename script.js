let btnOpenModal = document.querySelector('.open-modal');
let btnCloseModal = document.querySelector('.close-modal');
let modalCont = document.querySelector('.modal-form-bg');
 btnOpenModal.addEventListener('click',()=>{
    modalCont.classList.add('opened');
});
btnCloseModal.addEventListener('click',()=>{
    modalCont.classList.remove('opened');
});