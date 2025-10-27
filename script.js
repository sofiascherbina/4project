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
        myPage = 1;
 }
    modalCont.classList.add('opened');
});
btnCloseModal.addEventListener('click',()=>{
    modalCont.classList.remove('opened');
});

let comData = [];
let postsList = document.querySelector('#postsContainer');

async function renderComments(comPost,data) {
    let comList = comPost.querySelector('.comment-list');
    let markup = data
    .map(({text})=>{
        return `<li>
        <p>${text}</p></li>`
    })
    .join('');
    comList.insertAdjacentHTML('beforeend',markup);
}

async function getComment(){
    try{
        let getFetch = await fetch('http://localhost:3001/comments');
        let res = await getFetch.json();
        comData = res;
    }
    catch{
         return alert('comments are not found');
    }
}
async function addComent(e) {
    try{
        const postElement = e.closest('.commentsContainer');
        const postId = postElement.dataset.id;
        async function commentCreate() {
            let comment={
                text:e.value,
                postId : postId
            };
            let options={
                method: 'POST',
                body: JSON.stringify(comment),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            }
            let addedComment = await fetch('http://localhost:3001/comments', options);
             if(!addedComment.ok){
                throw new Error('comment is not added');
            }
            return await addedComment.json();
        }
         let resp =  await commentCreate();
        return resp;
    }
    catch{
         return alert('comment is not added');
    }
}
postsList.addEventListener('click', async (event) => {
  event.preventDefault();

  if (event.target.classList.contains('add-comment')) {
    const targetPost = event.target.closest('.post')
    let input = targetPost.querySelector('.commentInput');
    let addedcom = await addComent(input);
    renderComments(targetPost,[addedcom]);
    input.value = '';
  }
});
async function showComments() {
await getComment();
let posts = document.querySelectorAll('.commentsContainer');
posts.forEach(el=>{
    let targetPostId = el.dataset.id;
    let postComments = comData.filter(com => com.postId === targetPostId);
    renderComments(el,postComments)
});
};