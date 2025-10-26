let btnOpenModal = document.querySelector('.open-modal');
let btnCloseModal = document.querySelector('.close-modal');
let modalCont = document.querySelector('.modal-form-bg');
function handleCreateClick(event) {
  event.preventDefault();
  addPost(form);
   modalCont.classList.remove('opened');
}
 btnOpenModal.addEventListener('click',()=>{
    form.reset();
    if(createBtn.classList.contains('create-post')){
        createBtn.textContent = 'Створити';
        createBtn.addEventListener('click',handleCreateClick);
 }
    modalCont.classList.add('opened');
});
btnCloseModal.addEventListener('click',()=>{
    modalCont.classList.remove('opened');
});