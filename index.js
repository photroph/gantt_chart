const tasks = document.getElementsByClassName('task');
const y_task0 = tasks[0].getBoundingClientRect().top;
var task_num_total = 0;

const task_disp_area = document.getElementById('tasks');
const calendar = document.getElementById('calendar');

task_disp_area.addEventListener('scroll', function() {
    calendar.scrollTop = task_disp_area.scrollTop;
});
calendar.addEventListener('scroll', function() {
    task_disp_area.scrollTop = calendar.scrollTop;
});

// scroll today column into view
let today = new Date();
today = today.getFullYear() + '-' + (today.getMonth() + 1) +  '-' +today.getDate();
const span_today = document.getElementById(today);
span_today.classList.add('today');
span_today.scrollIntoView({behavior: "instant", block: "start", inline: "start"});

for (let i = 0; i < tasks.length; i++){
    tasks[i].addEventListener('click', taskEdit, false);
    let y_task = tasks[i].getBoundingClientRect().top;
    let start_date = tasks[i].childNodes[1].textContent;
    let end_date = tasks[i].childNodes[2].textContent;
    let span_start = document.getElementById(start_date);
    let span_end = document.getElementById(end_date);

    let start_x = span_start.getBoundingClientRect().left;
    let end_x = span_end.getBoundingClientRect().right;
    let width_period = end_x - start_x;

    let period = document.createElement('div');
    period.classList.add('period');
    period.id = 'period_' + i;
    period.style.width = width_period + 'px';
    let period_top = y_task - y_task0 + 26;
    period.style.top = period_top + 'px';
    period.addEventListener('click', taskEdit,false);
    span_start.appendChild(period);

    // append delete button
    if (tasks[i].classList.value == 'task'){
        let add_child_btn = document.createElement('i');
        add_child_btn.setAttribute('title', 'add child task');
        add_child_btn.classList.add('fas', 'fa-plus');
        add_child_btn.addEventListener('click', function(e){
            addChildTask(e);
        }, false);
        tasks[i].appendChild(add_child_btn);
    }

    // append delete button
    let delete_btn = document.createElement('i');
    delete_btn.setAttribute('title', 'delete this task');
    delete_btn.classList.add('delete_btn', 'far', 'fa-trash-alt');
    delete_btn.addEventListener('click', function(e){
        deleteTask(e);
    }, false);
    tasks[i].appendChild(delete_btn);
    task_num_total = i;
}

// border modification
setTimeout(function(){
    const day_div = document.getElementsByClassName('day');
    for (let i = 0; i < day_div.length; i++){
        day_div[i].style.height = (task_num_total * 24 + 72) + 'px';
    }
}, 0);

// let tasks can be DnDed
$(function() {
      $(".sortable").sortable();
      $(".sortable").disableSelection();
});

$('.sortable').bind('sortstop', function (event, ui) {
    // ソートが完了したら実行される。
    console.log(event.target);
    var result = $(".sortable").sortable("toArray");
    console.log(result);
    $("#sorted").val(result);
    document.sorted.submit();
})

function deleteTask(e){
    id_to_delete = e.target.parentNode.id;
    document.getElementById('task_id_to_delete').value = id_to_delete;
    if(window.confirm('Delete ' + id_to_delete)){
        document.delete_task.submit();
    }
}

function addChildTask(e){
    const mordal = document.createElement('div');
    mordal.id = 'add_child_mordal';
    mordal.classList.add('add_child');
    const mordal_close = document.createElement('div');
    mordal_close.classList.add('mordal_close');
    mordal_close.textContent = '×';
    mordal_close.addEventListener('click', function(){
        const mordal_to_remove = document.getElementById('add_child_mordal');
        if(mordal_to_remove){
            mordal_to_remove.parentNode.removeChild(mordal_to_remove);
        }
    },false);
    mordal.appendChild(mordal_close);
    const form_mordal = document.createElement('form');
    form_mordal.setAttribute('action', './add_childtask.php');
    form_mordal.setAttribute('method', 'post');
    const task_name_child = document.createElement('input');
    task_name_child.setAttribute('type', 'text');
    task_name_child.setAttribute('name', 'task_name_child');
    task_name_child.setAttribute('placeholder', 'task name of child');
    form_mordal.appendChild(task_name_child);
    const start_date_child = document.createElement('input');
    start_date_child.setAttribute('type', 'date');
    start_date_child.setAttribute('name', 'start_date_child');
    form_mordal.appendChild(start_date_child);
    const span_date = document.createElement('span');
    span_date.textContent = '〜';
    form_mordal.appendChild(span_date);
    const end_date_child = document.createElement('input');
    end_date_child.setAttribute('type', 'date');
    end_date_child.setAttribute('name', 'end_date_child');
    form_mordal.appendChild(end_date_child);
    const add_child_submit = document.createElement('input');
    add_child_submit.setAttribute('type', 'submit');
    form_mordal.appendChild(add_child_submit);
    const parent_to_add = document.createElement('input');
    parent_to_add.id = 'parent_to_add';
    parent_to_add.setAttribute('type', 'hidden');
    parent_to_add.setAttribute('name', 'parent_to_add');
    form_mordal.appendChild(parent_to_add);

    mordal.appendChild(form_mordal);
    document.body.appendChild(mordal);

    id_to_append = e.target.parentNode.id;
    document.getElementById('parent_to_add').value = id_to_append;
}

function taskEdit(event){
    let item_id_to_edit = event.target.id;
    if(event.target.tagName == 'SPAN'){
        item_id_to_edit = event.target.parentNode.id;
    }
    item_id_to_edit = item_id_to_edit.replace('period', 'task');
    const item_to_edit = document.getElementById(item_id_to_edit);
    const mordal = document.createElement('div');
    mordal.id = 'edit_item_mordal';
    mordal.classList.add('add_child');
    const mordal_close = document.createElement('div');
    mordal_close.classList.add('mordal_close');
    mordal_close.textContent = '×';
    mordal_close.addEventListener('click', function(){
        const mordal_to_remove = document.getElementById('edit_item_mordal');
        if(mordal_to_remove){
            mordal_to_remove.parentNode.removeChild(mordal_to_remove);
        }
    },false);
    mordal.appendChild(mordal_close);
    const form_mordal = document.createElement('form');
    form_mordal.setAttribute('action', './edit_item.php');
    form_mordal.setAttribute('method', 'post');
    const text_to_rename = document.createElement('input');
    text_to_rename.setAttribute('type', 'text');
    text_to_rename.setAttribute('name', 'text_to_rename');
    text_to_rename.setAttribute('value', item_to_edit.children[0].textContent);
    form_mordal.appendChild(text_to_rename);
    const start_date_child = document.createElement('input');
    start_date_child.setAttribute('type', 'date');
    start_date_child.setAttribute('name', 'start_date_child');
    start_date_child.setAttribute('value', item_to_edit.children[1].textContent);
    form_mordal.appendChild(start_date_child);
    const span_date = document.createElement('span');
    span_date.textContent = '〜';
    form_mordal.appendChild(span_date);
    const end_date_child = document.createElement('input');
    end_date_child.setAttribute('type', 'date');
    end_date_child.setAttribute('name', 'end_date_child');
    end_date_child.setAttribute('value', item_to_edit.children[2].textContent);
    form_mordal.appendChild(end_date_child);
    const add_child_submit = document.createElement('input');
    add_child_submit.setAttribute('type', 'submit');
    add_child_submit.setAttribute('value', 'modify');
    form_mordal.appendChild(add_child_submit);
    const task_id_to_edit = document.createElement('input');
    task_id_to_edit.id = 'task_id_to_edit';
    task_id_to_edit.setAttribute('type', 'hidden');
    task_id_to_edit.setAttribute('name', 'task_id_to_edit');
    form_mordal.appendChild(task_id_to_edit);

    mordal.appendChild(form_mordal);
    document.body.appendChild(mordal);

    const id_to_append = item_id_to_edit.replace('task_','');
    document.getElementById('task_id_to_edit').value = id_to_append;
}
