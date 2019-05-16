// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const backendAddress = "http://37.143.15.111:800";

function getHtmlElement(tagName, textContent, className) {
    const element = document.createElement(tagName);

    if (textContent) {
        element.textContent = textContent;
    }

    if (className) {
        element.classList.add(className);
    }

    return element;
};

function getTasks() {
    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values`;

    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status <= 210) {
            const tasks = JSON.parse(xhr.response);
            renderTasks(tasks);
        } else {
            console.error(`Получить данные с ${url} не удалось`);
        }
    });

    xhr.open("GET", url);
    xhr.send();
}

function renderAddTaskForm() {
    const elementFormAdd = getHtmlElement("form", null, "add-task");
    const inputText = getHtmlElement("input", null, "add-task__input");
    const submitButton = getHtmlElement("button", "Добавить задачу", "add-task__submit");
    elementFormAdd.appendChild(inputText);
    elementFormAdd.appendChild(submitButton);

    submitButton.addEventListener("click", (evt) => {
        evt.preventDefault();
        clearTasks();
        addTask(inputText.value);
        inputText.value = "";
        //console.log();
    })

    const container = document.querySelector(".container");
    container.appendChild(elementFormAdd);
}

function renderTasks(tasks) {
    const ulTasks = document.createElement("ul");
    ulTasks.classList.add("tasks");

    tasks.forEach(item => {
        console.log(item);
        const label = document.createElement("label");
        const li = getHtmlElement("li", null, "tasks__item");
        const title = getHtmlElement("p", item.title, "tasks__item-title");

        label.appendChild(title);
        //console.log(label);
        li.id = `task-item-${item.id}`;

        label.addEventListener("click", () => {
            const propObj = { id: item.id, propName: "isComplete", value: !item.isComplete };
            changeCompleteTask(propObj);
        });

        const isDescrEmpty = !item.descr.length;
 
        if (!isDescrEmpty) {
            const descr = getHtmlElement("p", item.descr, "tasks__item-descr");
            label.appendChild(descr);
        }

        if (item.isComplete) {
            li.classList.add("tasks__item--done");
        }

        li.appendChild(label);
        ulTasks.appendChild(li);
    });
    const container = document.querySelector(".container");
    container.appendChild(ulTasks);
};

function changeCompleteTask(propObj) {
    //console.log(propObj);

    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values/edit`;
    const body = JSON.stringify(propObj);

    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 & xhr.status <= 210) {
            const li = document.querySelector(`#task-item-${propObj.id}`);
            li.classList.toggle("tasks__item--done");
        } else {
            console.error("error");
        }
    })

    xhr.open("POST", url + "?jsonstring=" + body);
    xhr.send();
}

function addTask(input) {
    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values`;

    const newTask = {
        id: new Date().getTime(),
        dateBind: new Date(),
        dateCreate: new Date(),
        title: input,
        descr: "",
        isPin: false,
        isComplete: false,
    };
    const body = JSON.stringify(newTask);
    xhr.open("POST", url + "?jsonstring=" + body);
    xhr.send();
    getTasks();
}

function clearTasks() {
    const tasksUl = document.querySelector(".tasks");
    const container = document.querySelector(".container");
    container.removeChild(tasksUl);
}

document.addEventListener('DOMContentLoaded', getTasks);
renderAddTaskForm();