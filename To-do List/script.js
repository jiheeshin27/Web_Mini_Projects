;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const $todos = get('.todos');
  const $todoInput = get('.todo_input');
  const $submitButton = get('.todo_submit_button');
  const $pagination = get('.pagination');

  const limit = 5; // 한 page에 나타낼 데이터의 개수
  let currentPage = 1; // 현재 페이지
  const totalCount = 53; // 총 데이터의 개수 
  const pageCount = 5; // 화면에 나타날 페이지의 개수 

  const pagination = () => {
    let totalPage = Math.ceil(totalCount / limit); // 총 페이지 개수
    let pageGroup = Math.ceil(currentPage / pageCount); // 현재 페이지가 몇번째 그룹에 속해있는지 
    console.log(totalPage, pageGroup);

    let lastNumber = pageGroup * pageCount; // 현재 페이지 그룹의 마지막 숫자
    if (lastNumber > totalPage) {
      lastNumber = totalPage;
    }
    let firstNumber = lastNumber - (pageCount - 1); // 현재 페이지 그룹의 첫번째 숫자 

    const next = lastNumber + 1;
    const prev = firstNumber - 1;

    console.log({lastNumber, firstNumber, next, prev})

    let html = ''
    if (prev > 0) {
      html += `<button class="prev" data-fn="prev">이전</button>`;
    }
    for (let i = firstNumber; i <= lastNumber; i++) {
        html += `<button class="pageNumber" id="page_${i}">${i}</button>`;
    }
    if (lastNumber < totalPage) {
        html += `<button class="next" data-fn="next">다음</button>`;
    }
    $pagination.innerHTML = html;

    const $currentPageNumber = get(`.pageNumber#page_${currentPage}`);
    $currentPageNumber.style.color = '#9dc0e9';

    const $currentPageNumbers = document.querySelectorAll('.pagination button');
    $currentPageNumbers.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.fn === 'prev') {
          currentPage = prev;
        } else if (button.dataset.fn === 'next') {
          currentPage = next;
        } else {
          currentPage = button.innerText;
        }
        pagination();
        getTodos();
      })
    })
  };

  const createTodoElement = (item) => {
    const { id, content, completed } = item;
    const $todoItem = document.createElement('div');
    const isChecked = completed ? 'checked' : '';
    $todoItem.classList.add('item');
    $todoItem.dataset.id = id;
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `
    return $todoItem;
  }

  // json server : paginate
  // 모든 todo 가져오고 렌더링
  const getTodos = () => {
    fetch(`http://localhost:1234/todos?_page=${currentPage}&_limit=${limit}`)
      .then((res) => res.json())
      .then((todos) => {renderAllTodos(todos)})
      .catch((err) => console.error(err))
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '';
    todos.forEach( (todo) => {
      const todoElement = createTodoElement(todo);
      $todos.appendChild(todoElement);
    });
  }

  // 입력한 todo post
  const postTodo = (event) => {
    event.preventDefault();
    try {
      const content = $todoInput.value;
      const todo = {
        "content": content,
        "completed": false
      };
      fetch("http://localhost:1234/todos", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(todo)
      })
        .then(getTodos)
        .then(() => {
          $todoInput.value = '';
          $todoInput.focus();
        })
    } catch (err) {
      console.log(err);
    }
  }

  const deleteTodo = (event) => {
    // event.preventDefault();
    if(event.target.className === "todo_remove_button") {
      const $item = event.target.closest('.item');
      const $id = $item.dataset.id;
      fetch(`http://localhost:1234/todos/${$id}`, {
        method: 'DELETE',
      })
        .then((res) => console.log(res))
    }
  }

  // 체크박스 핸들
  const toggleTodo = (event) => {
    if (event.target.className !== 'todo_checkbox') return;
    const $item = event.target.closest('.item');
    const $id = $item.dataset.id;
    const completed = event.target.checked;
    console.log(completed);
    
    fetch(`http://localhost:1234/todos/${$id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({completed})
    })
      .then(getTodos)
      .catch(error => console.error(error))

  }

  const changeEditMode = (event) => {
    const $item = event.target.closest('.item');
    const $label = $item.querySelector('label');
    const $editInput = $item.querySelector('input[type="text"]');
    const $contentButtons = $item.querySelector('.content_buttons');
    const $editButtons = $item.querySelector('.edit_buttons');
    const value = $editInput.value;

    if (event.target.className === 'todo_edit_button') {
      $label.style.display = 'none';
      $editInput.style.display = 'block';
      $contentButtons.style.display = 'none';
      $editButtons.style.display = 'block';
      $editInput.focus();
      $editInput.value = '';
      $editInput.value = value;
    }
    if (event.target.className === 'todo_edit_cancel_button') {
      $label.style.display = 'block';
      $editInput.style.display = 'none';
      $contentButtons.style.display = 'block';
      $editButtons.style.display = 'none';
      $editInput.value = $label.innerText;
    }
  }

  const editTodo = (event) => {
    if (event.target.className !== 'todo_edit_confirm_button') return;
    const $item = event.target.closest('.item');
    const $id = $item.dataset.id;
    const $editInput = $item.querySelector('input[type="text"]');
    const content = $editInput.value;
    
    fetch(`http://localhost:1234/todos/${$id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content})
    })
      .then(getTodos)
      .catch((err) => {console.log(err)})
  }

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
      pagination();
    });
    $submitButton.addEventListener('click', postTodo);
    $todos.addEventListener('click', deleteTodo);
    $todos.addEventListener('click', toggleTodo);
    $todos.addEventListener('click', changeEditMode);
    $todos.addEventListener('click', editTodo);
  }
  init()
})()
