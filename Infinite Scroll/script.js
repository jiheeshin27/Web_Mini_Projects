;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  let page = 1;
  const limit = 10;
  const $posts = get(".posts");
  const end = 100;
  let total = 10;

  const $loader = get('.loader');

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error('에러가 발생했습니다!');
    }
    return await response.json();
  }

  const showPost = (posts) => {
    posts.forEach(post => {
      const $post = document.createElement('div');
      $post.classList.add('post');
      $post.innerHTML = `
      <div class="header">
        <div class="id">${post.id}</div>
        <div class="title">${post.title}</div>
      </div>
      <div class="body">
        ${post.body}
      </div>
      `

      $posts.appendChild($post);
    });
  }

  // 로더의 클래스리스트에 show를 추가해줌. 보이는 건 css가 제어 
  const showLoader = () => {
    $loader.classList.add('show');
  }

  const hideLoader = () => {
    $loader.classList.remove('show');
  }

  const loadPost = async () => {
    // 로딩 엘레먼트를 보여줌
    showLoader();
    try {
      const response = await getPost();
      showPost(response);
    } catch (error) {
      console.error(error);
    } finally {
      // 로딩 엘레먼트를 사라지게 함
      hideLoader();
    }
  }

  const onScroll = () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    
    if (total === end) {
      window.removeEventListener('scroll', onScroll);
      return;
    }

    if ( scrollTop + clientHeight >= scrollHeight - 5 ) {
      page++;
      total += 10;
      loadPost();
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    loadPost();
    window.addEventListener('scroll', onScroll);
  });
})()

