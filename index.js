const tasks = document.getElementsByClassName('task');
const y_task0 = tasks[0].getBoundingClientRect().top;
let task_num_total = 0;

const task_disp_area = document.getElementById('tasks');
const calendar = document.getElementById('calendar');

task_disp_area.addEventListener('scroll', function() {
    calendar.scrollTop = task_disp_area.scrollTop;
});
calendar.addEventListener('scroll', function() {
    task_disp_area.scrollTop = calendar.scrollTop;
});
calendar.addEventListener('mouseup', extendPeriod,false);

// scroll today column into view
let today = new Date();
today = today.getFullYear() + '-' + (('0' + (today.getMonth() + 1)).slice(-2)) +  '-' +(('0' + today.getDate()).slice(-2));
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
    // period.addEventListener('click', taskEdit,false);
    let leftend_period = document.createElement('div');
    leftend_period.classList.add('leftend_period');
    leftend_period.addEventListener('mousedown', getPeriodWidth,false);
    let rightend_period = document.createElement('div');
    rightend_period.classList.add('rightend_period');
    rightend_period.addEventListener('mousedown', getPeriodWidth,false);
    period.appendChild(rightend_period);
    period.appendChild(leftend_period);
    span_start.appendChild(period);

    // append append button
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
    var result = $(".sortable").sortable("toArray");
    $('#sorted').val(result);
    document.sorted.submit();
})

function deleteTask(event){
    id_to_delete = event.target.parentNode.id;
    if(window.confirm('Delete ' + event.target.parentNode.childNodes[0].textContent)){
        $(function(){
            $.ajax('delete_task.php',{
                type: 'post',
                dataType: 'text',
                data: { 'task_id_to_delete': id_to_delete }
            }).done(function(response, textStatus, xhr) {
                console.log("ajax connection succeeded");
                document.getElementById(id_to_delete).remove();
            }).fail(function(xhr, textStatus, errorThrown) {
                console.log("failed to ajax connection");
            });
        });
    }
    event.preventDefault();
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
    text_to_rename.setAttribute('value', item_to_edit.childNodes[0].textContent);
    form_mordal.appendChild(text_to_rename);
    const start_date_child = document.createElement('input');
    start_date_child.setAttribute('type', 'date');
    start_date_child.setAttribute('name', 'start_date_child');
    start_date_child.setAttribute('value', item_to_edit.childNodes[1].textContent);
    form_mordal.appendChild(start_date_child);
    const span_date = document.createElement('span');
    span_date.textContent = '〜';
    form_mordal.appendChild(span_date);
    const end_date_child = document.createElement('input');
    end_date_child.setAttribute('type', 'date');
    end_date_child.setAttribute('name', 'end_date_child');
    end_date_child.setAttribute('value', item_to_edit.childNodes[2].textContent);
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

let period_edit_flg;
let period_to_edit;
let period_end_which;
let period_width_mousedown;
let day_to_extend;
function getPeriodWidth(event){
    period_end_which = event.target.classList.value;
    period_to_edit = event.target.parentNode;
    period_width_mousedown = period_to_edit.getBoundingClientRect().width;
    calendar.addEventListener('mousemove', getExtendedPeriodWidth,false);
}

function getExtendedPeriodWidth(event){
    if(period_end_which == 'rightend_period'){
        let x_period_rightend = period_to_edit.getBoundingClientRect().right;
        let x_cursor = event.pageX;
        let diff_x = x_cursor - x_period_rightend;
        if (diff_x >= 15){
            period_edit_flg = 'right_ext'
            day_to_extend = Math.floor((diff_x + 15)/ 30);
            console.log('last day_to_extend = ' + day_to_extend);
        }else if(diff_x <= -15){
            period_edit_flg = 'right_shorten'
            day_to_extend = Math.floor((diff_x + 30)/ 30);
            console.log('last day_to_shorten = ' + day_to_extend);
        }
    }else if(period_end_which == 'leftend_period'){
        let x_period_leftend = period_to_edit.getBoundingClientRect().left;
        let x_cursor = event.pageX;
        let diff_x = x_cursor - x_period_leftend;
        if (diff_x >= 15){
            period_edit_flg = 'left_shorten'
            day_to_extend = Math.floor((diff_x)/ 30);
            console.log('first day_to_shorten = ' + day_to_extend);
        }else if(diff_x <= -15){
            period_edit_flg = 'left_ext'
            day_to_extend = Math.floor((diff_x + 15)/ 30);
            console.log('first day_to_extend = ' + day_to_extend);
        }
    }
    event.preventDefault();
}

function extendPeriod(event){
    calendar.removeEventListener('mousemove', getExtendedPeriodWidth,false);
    period_width_mousedown = 0;
    if(Math.abs(day_to_extend) >= 1){
        console.log(Math.abs(day_to_extend));
        const edit_period = document.getElementById('edit_period');
        const period_id_to_edit = period_to_edit.id.replace('period_','');
        edit_period.value = day_to_extend;
        document.getElementById('period_to_edit').value = period_id_to_edit;
        document.getElementById('edit_period_LR').value = period_edit_flg;
        // document.edit_period.submit();
        $(function(){
            $edit_period = day_to_extend;
            console.log($edit_period);
            $.ajax('edit_period.php',{
                type: 'post',
                dataType: 'text',
                data: {
                    'edit_period': day_to_extend,
                    'period_to_edit': period_id_to_edit,
                    'edit_period_LR': period_edit_flg
                }
            }).done(function(response, textStatus, xhr) {
                console.log("ajax connection succeeded");
                console.log(response);
                response_parsed = JSON.parse(response);
                renewTaskAjax(response_parsed[0], response_parsed[1], response_parsed[2], response_parsed[3]);
            }).fail(function(xhr, textStatus, errorThrown) {
                console.log("failed to ajax connection");
            });
        });
    }
}

function renewTaskAjax(item_to_edit, date_modified, day_to_modify, modify_type){
    console.log('item_to_edit = '+item_to_edit);
    console.log('date_modified = '+date_modified);
    console.log('day = '+day_to_modify);
    console.log('modify_type = '+modify_type);
    const task_to_modify = document.getElementById('task_'+item_to_edit);
    const period_to_modify = document.getElementById('period_'+item_to_edit);
    if(modify_type.match('left')){
        task_to_modify.children[1].textContent = date_modified;
        if(modify_type.match('shorten')){
            period_to_modify.style.width = (Number(period_to_modify.style.width.slice(0,-2)) - Number(day_to_modify)*31) + 'px';
            document.getElementById(date_modified).append(period_to_modify);
        }else if(modify_type.match('ext')){
            period_to_modify.style.width = (Number(period_to_modify.style.width.slice(0,-2)) - Number(day_to_modify)*31) + 'px';
            document.getElementById(date_modified).append(period_to_modify);
        }
    } else if(modify_type.match('right')){
        task_to_modify.children[2].textContent = date_modified;
        if(modify_type.match('shorten')){
            period_to_modify.style.width = (Number(period_to_modify.style.width.slice(0,-2)) + Number(day_to_modify)*31) + 'px';
        }else if(modify_type.match('ext')){
            period_to_modify.style.width = (Number(period_to_modify.style.width.slice(0,-2)) + Number(day_to_modify)*31) + 'px';
        }
    }

}
