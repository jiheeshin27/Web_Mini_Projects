;(function () {
  'use strict'

  const get = (target) => {
    return document.querySelector(target)
  }

  const $todos = get('.todos');
  const $todoForm = get('.todo_form');
  const $todoInput = get('.todo_input');
  const $submitButton = get('.todo_submit_button');
  const $contentButtons = get('.content_buttons');
  const $editButtons = get('.edit_buttons');
  const $editButton = get('.todo_edit_button');

  const createTodoElement = (item) => {
    const { id, content } = item
    const $todoItem = document.createElement('div')
    $todoItem.classList.add('item')
    $todoItem.dataset.id = id
    $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox' 
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
    return $todoItem
  }

  // 모든 todo 가져오고 렌더링
  const getTodos = () => {
    fetch("http://localhost:1234/todos")
      .then((res) => res.json())
      .then((todos) => {renderAllTodos(todos)})
  }

  const renderAllTodos = (todos) => {
    $todos.innerHTML = '';
    console.log(todos);
    todos.forEach( todo => {
      $todos.appendChild(createTodoElement(todo));
    });
  }

  // 입력한 todo post
  const postTodo = (event) => {
    event.preventDefault();
    try {
      const content = $todoInput.value;
      const todo = {
        "content": content
      };
      fetch("http://localhost:1234/todos", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(todo)
      })
        .then((res) => res.json())
        .then(getTodos)
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

  const modifyTodo = () => {
    
  }

  const init = () => {
    // getTodos();
    getTodos();
    $submitButton.addEventListener('click', postTodo);
    $todos.addEventListener('click', deleteTodo);
    $todos.addEventListener('click', modifyTodo);
  }
  init()
})()
