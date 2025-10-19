let btnOpenModal = document.querySelector('.open-modal');
let btnCloseModal = document.querySelector('.close-modal');
let modalCont = document.querySelector('.modal-form-bg');
 btnOpenModal.addEventListener('click',()=>{
    modalCont.classList.add('opened');
});
btnCloseModal.addEventListener('click',()=>{
    modalCont.classList.remove('opened');
});

let postList = document.querySelector('#postsContainer');
let loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let perPage = 3;
let template = null;

async function tempalteReady(){
    let temp = await fetch('posts.hbs');
    let res = await temp.text();
    template = Handlebars.compile(res);
}
async function showPosts(){
    if (!template) await tempalteReady();
    const posts = await fetchPost(page, perPage);
    renderPost(posts.hits);
    page++;
}

loadMoreBtn.addEventListener('click', showPosts);
 function fetchPost(page, perPage){
    const params = new URLSearchParams({
        key : '52031155-91d48f629b7cc6501a4f300a5',
        page : page,
        per_page : perPage
    });
    const url = new URL('https://pixabay.com/api/')
    url.search = params.toString()
    return fetch(url)
    .then(res => res.json());
 }

 function renderPost(data){
    const markup = template({ posts: data });
    postList.insertAdjacentHTML('beforeend', markup);


    const imgs = postList.querySelectorAll('#img');
    imgs.forEach(img => {
        img.addEventListener('load', () => {
            if(img.offsetHeight > 200){
                img.style.height = '200px';
                img.style.width = 'auto'; 
            }
        });
    });
 }
document.addEventListener('DOMContentLoaded', showPosts);
