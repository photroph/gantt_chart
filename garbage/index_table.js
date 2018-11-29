const tasks = document.getElementsByClassName('task');
const y_task0 = tasks[0].getBoundingClientRect().top;

// scroll today column into view
let today = new Date();
today = 'col_0_' + today.getFullYear() + '-' + (today.getMonth() + 1) +  '-' +today.getDate();
const span_today = document.getElementById(today);
span_today.classList.add('today');
span_today.scrollIntoView({behavior: "instant", block: "start", inline: "start"});

for (let i = 0; i < tasks.length; i++){
    // append delete button
    let add_child_btn = document.createElement('i');
    add_child_btn.setAttribute('title', 'add child task');
    add_child_btn.classList.add('fas', 'fa-plus');
    add_child_btn.addEventListener('click', function(e){
        addChildTask(e);
    }, false);
    tasks[i].appendChild(add_child_btn);

    // append delete button
    let delete_btn = document.createElement('i');
    delete_btn.setAttribute('title', 'delete this task');
    delete_btn.classList.add('delete_btn', 'far', 'fa-trash-alt');
    delete_btn.addEventListener('click', function(e){
        deleteTask(e);
    }, false);
    tasks[i].appendChild(delete_btn);
}

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
