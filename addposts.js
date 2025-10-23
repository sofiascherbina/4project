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
    .map(({title,text,image,id})=>{
        return `
        <li class="post mypost">
    <h2>${title}</h2>
    <p>${text}</p>
    <img id="img" src="${image}" alt="${title}" height="200px" width="auto">
    <div class="buttons">
        <button class="editPostButton" id="${id}">Редагувати</button>
        <button class="deletePostButton" id="${id}">Видалити</button>
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

async function waitLoad(){
    myPage++;
    await getPosts();
}

async function showSearchedPosts() {
  if (!template) await templateReady();
   const inpValue = searchInput.value;

    // if(inpValue.length === 0){
    //     postList.innerHTML = '';
    // }
  
  const data = await fetch(`https://pixabay.com/api/?key=52031155-91d48f629b7cc6501a4f300a5`);
  const posts = await data.json();

  const filtered = posts.hits.filter(post => post.user.includes(inpValue));

  renderPost(filtered);
}

let searchInput = document.querySelector('.search');
let currentPage = 'mainPage'; 

searchInput.addEventListener('input', _.debounce(async () => {
  const inpValue = searchInput.value.trim();
  postList.innerHTML = '';

  if (currentPage === 'mainPage') {
    if (inpValue === '') {
      page = 1;
      showPosts();
      return;
    }

    if (!template) await templateReady();
    const data = await fetch(`https://pixabay.com/api/?key=52031155-91d48f629b7cc6501a4f300a5`);
    const posts = await data.json();
    const filtered = posts.hits.filter(post => post.user.includes(inpValue));
    renderPost(filtered);

  } else if (currentPage === 'myPage') {
    if (inpValue === '') {
        postList.innerHTML = '';
        await getPosts();
        // renderMyPost();
        return;
    }

    const myData = await fetch(`http://localhost:3001/posts?title=${inpValue}`);
    const myPosts = await myData.json();
    data = myPosts;
    renderMyPost();
  }
}, 500));

pageSelector.addEventListener('change', () => {
  let selValue = pageSelector.value;
  postList.innerHTML = "";

  if (selValue === 'mainPage') {
    currentPage = 'mainPage';
    page = 1;
    showPosts();

    loadMoreBtn.style.display = 'block';
    loadMoreBtn.removeEventListener('click', waitLoad);
    loadMoreBtn.addEventListener('click', showPosts);

  } else if (selValue === 'myPage') {
    currentPage = 'myPage';
    myPage = 1;
    loadMoreBtn.style.display = 'none';

    async function checkData() {
      await getPosts();
      if (data.length > 3) {
        loadMoreBtn.style.display = 'block';
        loadMoreBtn.removeEventListener('click', showPosts);
        loadMoreBtn.addEventListener('click', waitLoad);
      }
    }
    checkData();
  }
});

async function detetePost(id){
    try{
        let options={
            method: 'DELETE'
        }
        let delFetch = await fetch(`http://localhost:3001/posts/${id}`, options);
        let res = await delFetch.json();
        data.splice(data.indexOf(res),1);
        postList.innerHTML = '';
        getPosts();
    }
    catch{
        return alert('error');
    }
}
postList.addEventListener('click',(event)=>{
    event.preventDefault();
    if(event.target.classList.contains('deletePostButton')){
        detetePost(event.target.id);
    };
 });

showPosts();