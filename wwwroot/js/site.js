// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const backendAddress = "http://37.143.15.111:800";
let currentDate = new Date(); // DATE NOT DATA

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
            renderTasks(tasks, currentDate);
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

        if (inputText.value.trim()) {
            clearTasks();
            addTask(inputText.value);
        }

        inputText.value = "";
    })

    const container = document.querySelector(".container");
    container.appendChild(elementFormAdd);
}

function renderTasks(tasks, renderDate) {
    const ulTasks = document.createElement("ul");
    ulTasks.classList.add("tasks");

    tasks.forEach(item => {

        const dayTask = renderDate.getDate();
        const dayNow = new Date(item.dateBind).getDate();

        const monthTask = renderDate.getMonth();
        const monthNow = new Date(item.dateBind).getMonth();

        const yearTask = renderDate.getYear();
        const yearNow = new Date(item.dateBind).getYear();

        const isValidDate = dayTask == dayNow && monthTask == monthNow && yearTask == yearNow;

        if (isValidDate) {

            const label = document.createElement("label");
            const li = getHtmlElement("li", null, "tasks__item");
            const title = getHtmlElement("p", item.title, "tasks__item-title");

            const taskOption = getHtmlElement("div", null, "task-option");
            const taskOptionButton = getHtmlElement("button", "Меню задачи", "task-option-button");
            const taskOptionListUl = getHtmlElement("ul", null, "task-option-list-ul");

            const taskOptionDeleteBtn = getHtmlElement("button", "Удалить", null);
            const taskOptionEditBtn = getHtmlElement("button", "Редактировать", null);
            const taskOptionPinBtn = getHtmlElement("button", "Закрепить", null);

            const editingForm = getHtmlElement("form", null, "editing-form");
            const editingFormInput = getHtmlElement("input", null, "editing-form-input");
            editingFormInput.value = item.descr;
            const editignFormBtn = getHtmlElement("button", "Редактировать описание", "editing-form-input-submit");

            editingForm.appendChild(editingFormInput);
            editingForm.appendChild(editignFormBtn);

            const taskOptionListLiDelete = getHtmlElement("li", null, "task-option-list-li");
            taskOptionListLiDelete.appendChild(taskOptionDeleteBtn);

            const taskOptionListLiEdit = getHtmlElement("li", null, "task-option-list-li");
            taskOptionListLiEdit.appendChild(taskOptionEditBtn);

            const taskOptionListLiPin = getHtmlElement("li", null, "task-option-list-li");
            taskOptionListLiPin.appendChild(taskOptionPinBtn);

            taskOptionListUl.appendChild(taskOptionListLiDelete);
            taskOptionListUl.appendChild(taskOptionListLiEdit);
            taskOptionListUl.appendChild(taskOptionListLiPin);

            editignFormBtn.addEventListener("click", (evt) => {
                const editDescr = { id: item.id, propName: "descr", value: editingFormInput.value };
                evt.preventDefault();
                clearTasks();
                editTaskDescr(editDescr);
                editingFormInput.value = "";
            })

            taskOptionButton.addEventListener("mouseenter", () => {
                taskOptionListUl.classList.add("task-option--show");
                taskOptionListUl.classList.remove("task-option--unshow");
            })
            taskOptionButton.addEventListener("mouseleave", () => {
                taskOptionListUl.classList.toggle("task-option--unshow");
                taskOptionListUl.classList.remove("task-option--show");
            })

            taskOption.appendChild(taskOptionButton);
            taskOption.appendChild(taskOptionListUl);

            taskOptionDeleteBtn.addEventListener("click", () => {
                const deleteObj = { id: item.id };
                clearTasks();
                deleteTask(deleteObj);
            });

            taskOptionEditBtn.addEventListener("click", () => {
                li.appendChild(editingForm);
            })

            taskOptionPinBtn.addEventListener("click", () => {
                const pinObj = { id: item.id, propName: "isPin", value: !item.isPin };
                clearTasks();
                changePinTask(pinObj);
                if (task.item) {
                    taskOptionPinBtn.textContent = "Открепить";
                } else if (!item.isPin) {
                    taskOptionPinBtn.textContent = "Закрепить";
                }
            })

            label.appendChild(title);
            li.id = `task-item-${item.id}`;

            label.addEventListener("click", () => {
                const propObj = { id: item.id, propName: "isComplete", value: !item.isComplete };
                clearTasks();
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

            if (item.isPin) {
                li.classList.add("tasks__item--pin");
                taskOptionPinBtn.textContent = "Открепить";
            }

            li.appendChild(label);
            li.appendChild(taskOption);
            ulTasks.appendChild(li);
        } else {
            return;
        }
    });

    const container = document.querySelector(".container");
    container.appendChild(ulTasks);
};

function editTaskDescr(input) {
    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values/edit`;
    const body = JSON.stringify(input);

    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 & xhr.status <= 210) {
            const li = document.querySelector(`#task-item-${input.id}`);
            li.classList.toggle("tasks__item--editing");
        } else {
            console.error("error");
        }
    })

    xhr.open("POST", url + "?jsonstring=" + body);
    xhr.send();
    getTasks();
}

function deleteTask(deleteObj) {
    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values/delete`;
    const body = JSON.stringify(deleteObj);
    xhr.open("POST", url + "?jsonstring=" + body);
    xhr.send();
    getTasks();
}

function changePinTask(pinObj) {
    const xhr = new XMLHttpRequest();
    const url = `${backendAddress}/values/edit`;
    const body = JSON.stringify(pinObj);

    xhr.addEventListener("load", () => {
        if (xhr.status >= 200 & xhr.status <= 210) {
            const li = document.querySelector(`#task-item-${pinObj.id}`);
            li.classList.toggle("tasks__item--pin");
        } else {
            console.error("error");
        }
    })

    xhr.open("POST", url + "?jsonstring=" + body);
    xhr.send();
    getTasks();
}

function changeCompleteTask(propObj) {

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
    getTasks();
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
    if (tasksUl == null) {
        return;
    } else {
        container.removeChild(tasksUl);
    }
}

function renderSliderDay() {

    const btnNext = getHtmlElement("button", "Следущий день", null);
    const btnPrev = getHtmlElement("button", "Предыдущий день", null);
    let myDate = new Date();

    btnNext.addEventListener("click", () => {
        const year = myDate.getYear() + 1900;
        const month = myDate.getMonth();
        const day = myDate.getDate() + 1; 

        myDate = new Date(year, month, day);
        currentDate = myDate;

        clearTasks();
        getTasks();    
    });

    btnPrev.addEventListener("click", () => {
        const year = myDate.getYear() + 1900;
        const month = myDate.getMonth();
        const day = myDate.getDate() - 1;

        myDate = new Date(year, month, day);
        currentDate = myDate;

        clearTasks();
        getTasks();
    });

    const container = document.querySelector(".container");
    container.appendChild(btnPrev);
    container.appendChild(btnNext);
}

document.addEventListener('DOMContentLoaded', getTasks);
renderSliderDay();
renderAddTaskForm();