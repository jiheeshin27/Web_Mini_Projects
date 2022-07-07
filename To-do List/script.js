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

  // 모든 todo 가져오고 렌더링
  const getTodos = () => {
    fetch("http://localhost:1234/todos")
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

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
    });
    $submitButton.addEventListener('click', postTodo);
    $todos.addEventListener('click', deleteTodo);
    $todos.addEventListener('click', toggleTodo);
  }
  init()
})()
