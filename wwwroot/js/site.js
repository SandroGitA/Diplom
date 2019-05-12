// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function isCompleteRequest(editTask) {
    var x = new XMLHttpRequest();
    x.open("POST", "http://37.143.15.111:800/values/edit" + "?jsonstring=" + editTask);
    x.onload = function () {
        var editTaskId = JSON.parse(editTask).id;
        renderIsCompleteTaskChange(editTaskId);
    }
    x.send();
}

function renderIsCompleteTaskChange(idTask) {
    var taskItemLi = document.querySelector(`#task-id-${idTask}`);
    taskItemLi.classList.toggle("tasks__item--complete");
}