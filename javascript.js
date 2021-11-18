let todoItemsContainer = document.getElementById('todoItemsContainer');

function gettodoListV2FromLocalStorage() {
    let stringifiedtodoListV2 = localStorage.getItem("todoListV2");
    let parsedtodoListV2 = JSON.parse(stringifiedtodoListV2);

    if (parsedtodoListV2 === null) {
        return [];
    } else {
        return parsedtodoListV2;
    }
}

let todoListV2 = gettodoListV2FromLocalStorage();



function getUniqueNumberFromLocalStorage() {
    let stringifiedUniqueNumber = localStorage.getItem("lastUniqueNo");
    let parsedUniqueNumber = JSON.parse(stringifiedUniqueNumber);

    if (parsedUniqueNumber === null) {
        return 0;
    } else {
        return parsedUniqueNumber;
    }
}

let todoCount = getUniqueNumberFromLocalStorage();

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkBoxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    //identify the the idex from todo list 
    let requiredIndex = todoListV2.findIndex(function(todo) {
        let currentId = "todo" + todo.uniqueNo;
        if (currentId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoListV2[requiredIndex];
    if (todoObject.isChecked == true) {
        todoObject.isChecked = false;
    } else {
        todoObject.isChecked = true;
    }

    localStorage.setItem("todoListV2", JSON.stringify(todoListV2));
}

function onViewTodo(todoId) {
    let todoElement = document.getElementById(todoId);

    let viewingIndex = todoListV2.findIndex(function(todo) {
        let currentId = "todo" + todo.uniqueNo;
        if (currentId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    let todoObject = todoListV2[viewingIndex];
    console.log(viewingIndex);

    let title = todoObject.todoTitle;
    let description = todoObject.todoDescription;
    console.log(description);

    let modalTitleElement = document.getElementById("viewModalTitle");
    modalTitleElement.textContent = title;

    let modalDescriptionElement = document.getElementById("viewModalDescription");
    modalDescriptionElement.textContent = description;
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    /*
    appropriately update the todoListV2 using
    splice() method -- replace item at a specific index
    arr.splice(start, Delete Count) returns the array of "elements which got deleted
    arr.splice(start,Deletr Count, addItem1, addItem2)

    first we need to find the index of the element
    we need to pass a testing function
    arr.findIndex(testingFunction)"
    */

    let deletingIndex = todoListV2.findIndex(function(todo) {
        let currentId = "todo" + todo.uniqueNo;
        if (currentId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    todoListV2.splice(deletingIndex, 1);

    localStorage.setItem("todoListV2", JSON.stringify(todoListV2));

    if (todoListV2.length === 0) {
        todoCount = 0;
        localStorage.setItem("lastUniqueNo", JSON.stringify(todoCount));
    }
}

function createAndAppendTodo(todo) {
    let todoElement = document.createElement("li");
    let todoId = "todo" + todo.uniqueNo;
    todoElement.id = todoId;
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoItemsContainer.appendChild(todoElement);

    let inputELement = document.createElement("input");
    let checkboxId = "checkbox" + todo.uniqueNo;
    inputELement.type = "checkbox";
    inputELement.id = checkboxId; //id should be unique
    inputELement.checked = todo.isChecked;
    inputELement.classList.add("checkbox-input");
    todoElement.appendChild(inputELement);

    let labelContainerElement = document.createElement("div");
    labelContainerElement.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainerElement);

    let labelElement = document.createElement("label");
    let labelElementId = "label" + todo.uniqueNo;
    labelElement.id = labelElementId;
    labelElement.setAttribute("for", checkboxId);
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.todoTitle;
    console.log(todo.todoTitle);
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainerElement.appendChild(labelElement);

    inputELement.onclick = function() {
        onTodoStatusChange(checkboxId, labelElementId, todoId);
    };

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainerElement.appendChild(deleteIconContainer);

    let viewIconElement = document.createElement("i");
    viewIconElement.classList.add("fas", "fa-eye", "view-icon");
    viewIconElement.setAttribute("data-toggle", "modal");
    viewIconElement.setAttribute("data-target", "#viewTodo");

    deleteIconContainer.appendChild(viewIconElement);

    viewIconElement.onclick = function() {
        onViewTodo(todoId);
    };

    let deleteIconElement = document.createElement("i");
    deleteIconElement.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIconContainer.appendChild(deleteIconElement);

    deleteIconElement.onclick = function() {
        onDeleteTodo(todoId);
    };
}

for (let todo of todoListV2) {
    createAndAppendTodo(todo);
}

let closingAttributeSet = false;

let modalOpenerButton = document.getElementById("modalOpener");

function setClosingAttribute() {
    let addTodoButton = document.getElementById("addTodoButton");
    if (closingAttributeSet === true) {
        addTodoButton.removeAttribute("data-dismiss", "modal");
        closingAttributeSet = false;
    }
}

modalOpenerButton.onclick = function() {
    setClosingAttribute();
}

function onAddTodo() {
    let todoTitleInputElement = document.getElementById("todoTitle");
    let todoTitleValue = todoTitleInputElement.value;

    let todoDescriptionELement = document.getElementById("todoDescription");
    let todoDescriptionValue = todoDescriptionELement.value;

    todoCount = todoCount + 1;

    let warningElement = document.getElementById("warningMessage");
    if (todoTitleValue === "" || todoDescriptionValue === "") {
        console.log("return");
        warningElement.textContent = "Please Enter A Valid Input";
        return;
    }
    addTodoButton.setAttribute("data-dismiss", "modal");
    closingAttributeSet = true;

    warningElement.textContent = "";

    let newTodo = {
        todoTitle: todoTitleValue,
        todoDescription: todoDescriptionValue,
        uniqueNo: todoCount,
        isChecked: false
    };

    todoListV2.push(newTodo);

    createAndAppendTodo(newTodo);
    todoTitleInputElement.value = "";
    todoDescriptionELement.value = "";

    //saving to local storage
    localStorage.setItem("lastUniqueNo", JSON.stringify(todoCount));
    localStorage.setItem("todoListV2", JSON.stringify(todoListV2));
}

let addTodoButton = document.getElementById("addTodoButton");

addTodoButton.onclick = function() {
    onAddTodo();
}