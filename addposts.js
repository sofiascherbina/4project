let postList = document.querySelector('#postsContainer');
let pageSelector = document.querySelector('.page-selector');
let loadMoreBtn = document.querySelector('.load-more');
let form = document.querySelector('#createPostForm');
let createBtn = document.querySelector('.create-post');
let page = 1;
let perPage = 3;
let myPage = 1;
let perMyPage = 3;
let template = null;
let myTemplate = null;
let data = [];

async function templateReady(){
    let temp = await fetch('posts.hbs');
    let res = await temp.text();
    template = Handlebars.compile(res);
}

async function showPosts(){
    if (!template) await templateReady();
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

 function renderPost(post){
    const markup = template({ posts: post });
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

async function getPosts(){
    try{
        let getFetch = await fetch('http://localhost:3001/posts');
        let res = await getFetch.json();
        data = res;
        renderMyPost();
        if(data.length === 0 ){
            throw new Error('posts are not found');
        }
    }
    catch{
        return alert('posts are not found');
    }
}

async function renderMyPost(){
    const start = (myPage - 1) * perMyPage;
    const end = start + perMyPage;
    const pageData = data.slice(start,end);
    let markup = pageData
    .map(({title,text,image})=>{
        return `
        <li class="post mypost">
    <h2>${title}</h2>
    <p>${text}</p>
    <img id="img" src="${image}" alt="${title}" height="200px" width="auto">
    <div class="buttons">
        <button class="editPostButton" data-id="changeBtn">Редагувати</button>
        <button class="deletePostButton" data-id="deleteBtn">Видалити</button>
    </div>
    <div class="commentsContainer" data-id="">
        <h3>Коментарі:</h3>
            <ul>
                <li></li>
            </ul>
        <form class="createCommentForm">
            <input type="text" class="commentInput" placeholder="Новий коментар" required>
            <button type="submit">Додати коментар</button>
        </form>
    </div>
</li>`;
    })
    .join('');
    postList.insertAdjacentHTML('beforeend',markup);
};

async function addPost(e){
    try{
        let getFetch = await fetch('http://localhost:3001/posts');
        let res = await getFetch.json();
        async function postCreate(){
            let post = {
                title: e.titleInput.value,
                text:e.contentInput.value,
                image: e.image.value
            };
            const options = {
                 method: 'POST',
                body: JSON.stringify(post),
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            }
            let addedPost = await fetch('http://localhost:3001/posts', options);
            if(!addedPost.ok){
                throw new Error('post is not added');
            }
            return await addedPost.json();
        }
        let result = await postCreate(res);
        data.push(result);
        renderMyPost();
    }
    catch{
        return alert('post is not added');
    }
}
createBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    addPost(form);
});

showPosts();
async function waitLoad(){
    myPage++;
    await getPosts();
}
pageSelector.addEventListener('change', ()=>{
    let selValue = pageSelector.value;

    if(selValue === 'mainPage'){
        postList.innerHTML = "";
        page = 1;
        showPosts();

        loadMoreBtn.removeEventListener('click', waitLoad);
        loadMoreBtn.addEventListener('click', showPosts);
    }
    else if(selValue === 'myPage'){
        postList.innerHTML = "";
        myPage = 1;
        loadMoreBtn.style.display = 'none';
        async function checkData(){
            await getPosts();
             if(data.length > 3){
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.removeEventListener('click', showPosts);
                loadMoreBtn.addEventListener('click',waitLoad);
            }
        }
        checkData();
    }
});
async function searchPost() {
    let inpValue = searchInput.value;
    let search = await fetch(`https://pixabay.com/api/?key=52031155-91d48f629b7cc6501a4f300a5&users=${inpValue}`);
    return search.json();
}
async function showSearchedPosts(){
    if (!template) await templateReady();
    const posts = await searchPost();
    renderPost(posts.hits);
}
let searchInput = document.querySelector('.search');
searchInput.addEventListener('input',_.debounce(()=>{
    postList.innerHTML = '';
    showSearchedPosts();
}, 500));

