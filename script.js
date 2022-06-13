const todos = document.querySelectorAll(".todo");
const all_status = document.querySelectorAll(".status");
let draggableTodo = null;
let prevActions = []; //  will create an array
let nextActions = []; //  will create an array



todos.forEach((todo) => {
  todo.addEventListener("dragstart", dragStart);
  todo.addEventListener("dragend", dragEnd);
});

function dragStart() {
  draggableTodo = this;
  setTimeout(() => {
    this.style.display = "none";
  }, 0);
  console.log("dragStart");
}

function dragEnd() {
  draggableTodo = null;
  setTimeout(() => {
    this.style.display = "block";
  }, 0);
  console.log("dragEnd");
}

function generateID () {
   
  let m = new Date();
  return  String(m.getMinutes() +  String(m.getSeconds()) + String(m.getMilliseconds()));
}



all_status.forEach((status) => {
  status.addEventListener("dragover", dragOver);
  status.addEventListener("dragenter", dragEnter);
  status.addEventListener("dragleave", dragLeave);
  status.addEventListener("drop", dragDrop);
});

function dragOver(e) {
  e.preventDefault();
  //   console.log("dragOver");
}

function dragEnter() {
  this.style.border = "1px dashed #ccc";
  console.log("dragEnter");
}

function dragLeave() {
  this.style.border = "none";
  console.log("dragLeave");
  let column = this.id;
  let todoid = draggableTodo.id

  prevActions.push({"todoId": todoid, "columnId": column}); // will push the object to the array
 console.log(prevActions)
}



function dragDrop() {
  this.style.border = "none";
  this.appendChild(draggableTodo);
  console.log("dropped");
}

/* modal */
const btns = document.querySelectorAll("[data-target-modal]");
const close_modals = document.querySelectorAll(".close-modal");
const overlay = document.getElementById("overlay");

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(btn.dataset.targetModal).classList.add("active");
    overlay.classList.add("active");
  });
});

close_modals.forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal");
    modal.classList.remove("active");
    overlay.classList.remove("active");
  });
});

window.onclick = (event) => {
  if (event.target == overlay) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => modal.classList.remove("active"));
    overlay.classList.remove("active");
  }
};

/* create todo  */
const todo_submit = document.getElementById("todo_submit");

todo_submit.addEventListener("click", createTodo);

function createTodo() {
  let todo_div = document.createElement("div");
  todo_div.id = generateID();
  console.log(todo_div.id)
  const input_val = document.getElementById("todo_input").value;
  const txt = document.createTextNode(input_val);

  todo_div.appendChild(txt);
  todo_div.classList.add("todo");
  todo_div.setAttribute("draggable", "true");

  /* create span */
  const span = document.createElement("span");
  let span_txt = document.createElement("p.close");
  span_txt.innerHTML = '-';
  span.classList.add("close");
  span.appendChild(span_txt);

  todo_div.appendChild(span);

  in_progress.appendChild(todo_div);

  span.addEventListener("click", () => {
    span.parentElement.style.display = "none";
  });
  //   console.log(todo_div);

  todo_div.addEventListener("dragstart", dragStart);
  todo_div.addEventListener("dragend", dragEnd);

  document.getElementById("todo_input").value = "";
  todo_form.classList.remove("active");
  overlay.classList.remove("active");
}

const close_btns = document.querySelectorAll(".close");

close_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.parentElement.style.display = "none";
  });
});

/* move todo */

document.onkeydown = function (event) {
  if (event.code == 'KeyZ' && 'ControlLeft') {
    if (prevActions.length > 0) {
 
   var lastAction = prevActions.at(-1);
   var lastActionParentId = lastAction.columnId;
   var lastActionTodoId = lastAction.todoId;
   
   const lastActionTodo = document.getElementById(lastActionTodoId);

   document.getElementById(lastActionParentId).appendChild(lastActionTodo);

   nextActions.push(lastAction)
   prevActions.pop();

 } else {
   console.log("nothing to undo");
   }
 }
  // начинается второй блядский блок

  if (event.code == 'KeyY' && 'ControlLeft') {
    if (nextActions.length > 0)
    {
      var lastAction = nextActions.at(-1);
      var lastActionParentId = lastAction.columnId;
      var lastActionTodoId = lastAction.todoId;
      const lastActionTodo = document.getElementById(lastActionTodoId);
      
      document.getElementById(lastActionParentId).appendChild(lastActionTodo);
      prevActions.push(lastAction)
      nextActions.pop();
    }
    else {
      console.log("nothing to redo");
    }
  }
}