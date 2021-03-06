let data_from_JSON;
const httpObj = new XMLHttpRequest();
httpObj.open("get", "./test.json", false);
httpObj.onload = function(){
    data_from_JSON = JSON.parse(this.responseText);
}
httpObj.send(null);

let mousedown_pageX;
let period_to_edit;
let period_end_which;
let period_width_mousedown;
let days_to_change;

const getPeriodWidth = (event) => {
    event.stopPropagation();
    period_end_which = event.target.classList.value;
    period_to_edit = event.target.parentNode;
    period_width_mousedown = period_to_edit.getBoundingClientRect().width;
    document.getElementById('calendar').addEventListener('mousemove', getExtendedPeriodWidth, false);
    document.getElementById('calendar').addEventListener('mouseup', function(){
        document.getElementById('calendar').removeEventListener('mousemove', getExtendedPeriodWidth, false);
    }, false);
}

const getExtendedPeriodWidth = (event) => {
    let item_to_edit = period_to_edit.id.replace('period_', '');
    console.log(item_to_edit);
    if(document.elementFromPoint(event.clientX, event.clientY).id){
        if(period_end_which == 'rightend_period'){
            if(item_to_edit.includes('-')){
                item_to_edit = item_to_edit.split('-');
                app.items[item_to_edit[0]].child[item_to_edit[1]].end_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }else{
                app.items[item_to_edit].end_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }
        }else if(period_end_which == 'leftend_period'){
            if(item_to_edit.includes('-')){
                item_to_edit = item_to_edit.split('-');
                app.items[item_to_edit[0]].child[item_to_edit[1]].start_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }else{
                app.items[item_to_edit].start_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }
        }
        let params = new URLSearchParams();
        params.append('items', JSON.stringify(app.items));
        
        axios.post('sort_item.php', params)
          .then(response => {
              let res = response.data;
              app.setPeriod();
          }).catch(error => {
            // eslint-disable-next-line
            console.log(error);
          });
    }
    event.preventDefault();
}

const echoSelectedPeriodStartDate = (id_of_elem) => {
    if(id_of_elem.includes('period_')){
        let id_to_edit = id_of_elem.replace('period_', '');
        if(id_to_edit.includes('-')){ // process for child item
            id_to_edit = id_to_edit.split('-');
            let start_date_of_data = app.items[id_to_edit[0]].child[id_to_edit[1]].start_date;
            let start_date = new Date(start_date_of_data);
            return start_date;
        }else{
            let start_date_of_data = app.items[id_to_edit].start_date;
            let start_date = new Date(start_date_of_data);
            return start_date;
        }
    }else{
        console.log('UNEXPECTED ERROR: Id is not thrown');
    }
}

const echoSelectedPeriodEndDate = (id_of_elem) => {
    if(id_of_elem.includes('period_')){
        let id_to_edit = id_of_elem.replace('period_', '');
        if(id_to_edit.includes('-')){ // process for child item
            id_to_edit = id_to_edit.split('-');
            let end_date_of_data = app.items[id_to_edit[0]].child[id_to_edit[1]].end_date;
            let end_date = new Date(end_date_of_data);
            return end_date;
        }else{
            let end_date_of_data = app.items[id_to_edit].end_date;
            let end_date = new Date(end_date_of_data);
            return end_date;
        }
    }else{
        console.log('UNEXPECTED ERROR: Id is not thrown');
    }
}


const DateObjToYYYYMMDD = (date_obj) => {
    return String(date_obj.getFullYear() + '-' + ('0' + (date_obj.getMonth() + 1)).slice(-2) + '-' + ('0' + date_obj.getDate()).slice(-2));
}

const movePeriodByDrag = (event) => {
    period_to_edit = event.target;
    mousedown_pageX = event.pageX;
    period_id_to_edit = period_to_edit.id.replace('period_', '');
    period_width_mousedown = event.target.parentNode.id
    console.log(event.pageX);
    let calendar = document.getElementById('calendar');
    calendar.addEventListener('mousemove', letPeriodFollowCursor, false);
    calendar.addEventListener('mouseup', function(){
        calendar.removeEventListener('mousemove', letPeriodFollowCursor);
    }, false);
}

const letPeriodFollowCursor = (event) => {
    let move_days = Math.floor((Math.abs(mousedown_pageX - event.pageX)) / app_cal.width_num);
    let pageX_present = event.pageX;
    let pageX_initial = mousedown_pageX;
    if(move_days != days_to_change){
        if (pageX_present < pageX_initial){
            move_days = - Number(move_days);
        }
        days_to_change = move_days;
        period_to_edit.style.left = move_days * (app_cal.width_num + 1) + 'px';
        document.getElementById('calendar').addEventListener('mouseup', submitMovePeriod, false);
    }
}

const submitMovePeriod = () => {
    console.log(days_to_change);
    document.getElementById('calendar').removeEventListener('mouseup', submitMovePeriod);
    let start_date_Date = echoSelectedPeriodStartDate(period_to_edit.id);
    let end_date_Date = echoSelectedPeriodEndDate(period_to_edit.id);
    start_date_Date.setDate(start_date_Date.getDate() + days_to_change);
    end_date_Date.setDate(end_date_Date.getDate() + days_to_change);
    let new_start_date = DateObjToYYYYMMDD(start_date_Date);
    let new_end_date = DateObjToYYYYMMDD(end_date_Date);
    if(period_to_edit.id.includes('period_')){
        let id_to_edit = period_to_edit.id.replace('period_', '');
        if(id_to_edit.includes('-')){ // process for child item
            id_to_edit = id_to_edit.split('-');
            app.items[id_to_edit[0]].child[id_to_edit[1]].start_date = new_start_date;
            app.items[id_to_edit[0]].child[id_to_edit[1]].end_date = new_end_date;
        }else{
             app.items[id_to_edit].start_date = new_start_date;
             app.items[id_to_edit].end_date = new_end_date;
        }
        let params = new URLSearchParams();
        params.append('items', JSON.stringify(app.items));
        
        axios.post('sort_item.php', params)
          .then(response => {
              app.setPeriod();
          }).catch(error => {
              // eslint-disable-next-line
              console.log(error);
          });
    }
}


const calendar = document.getElementById('calendar');
calendar.innerHTML = `
    <div v-for="n in days_disp" v-bind:id="date_from.add(1, 'days').format('YYYY-MM-DD')" :key="n" :style="{ width: width_num + 'px', height: height_num }" :class="'day day_'+date_from.add(1, 'days').format('DD')+' month_'+date_from.add(-1, 'days').format('MM')">
    </div>`;

const task_disp_area = document.getElementById('tasks');
task_disp_area.innerHTML = `
    <draggable v-model="items" :element="'ul'" @end="dragItem">
        <li v-for="(item, i) in items" class="task" v-bind:id="'item_'+ i">
            <span class="task_name">{{ i }} : {{ item.name }}</span>
            <span class="datetime_start">{{ item.start_date }}</span>
            <span class="datetime_end">{{ item.end_date }}</span>
            <i title="add child task" class="fas fa-plus" @click="addChildMordal(i)"></i>
            <i title="Edit this item" class="far fa-edit" @click="editItem(i, 'parent')"></i>
            <i title="delete this task" class="delete_btn far fa-trash-alt" @click="removeItem(i)"></i>
            <ul> <draggable v-model="item.child" @end="dragItem">
                <li v-for="(child, j) in item.child" class="task childtask" v-bind:id="'item_'+ i + '-' + j">
                    <span class="task_name">{{ i }} - {{ j }} : {{ child.name }}</span>
                    <span class="datetime_start">{{ child.start_date }}</span>
                    <span class="datetime_end">{{ child.end_date }}</span>
                    <i title="Edit this item" class="far fa-edit" @click="editItem(i, 'child', j)"></i>
                    <i title="delete this task" class="delete_btn far fa-trash-alt" @click="removeChildItem(i, j)"></i>
                </li>
            </draggable> </ul>
        </li>
    </draggable>`;

const gray_mask = document.createElement('div');
gray_mask.id = 'gray_mask';
gray_mask.style.width = '100vw';
gray_mask.style.height = '100vh';
gray_mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
gray_mask.style.zIndex = '1';
gray_mask.style.position = 'absolute';
gray_mask.style.top = '0';
gray_mask.style.left = '0';
gray_mask.addEventListener('click', function(){
    document.getElementById('edit_item_mordal').remove();
    document.getElementById('gray_mask').remove();
})

//const Period = Vue.component('period',{
//    template: `<div class="period">
//                 <span class="leftend_period"></span>
//                 <span class="rightend_period"></span>
//               </div>`,
//});

const app = new Vue ({
    el: '#tasks',
    data: ()=>{
        return { items: data_from_JSON }
    },
//    components: {
//        'period': Period
//    },
    methods: {
        dragItem: (event) => {
            let params = new URLSearchParams();
            params.append('items', JSON.stringify(app.items));
            
            axios.post('sort_item.php', params)
              .then(response => {
                  app.setPeriod();
              }).catch(error => {
                // eslint-disable-next-line
                console.log(error);
              });
        },
        editItem: function(i, item_type, j){
            let mordal = document.createElement('div');
            mordal.id = 'edit_item_mordal';
            mordal.classList.add('add_child');
            mordal.style.zIndex = '2';
            let mordal_close = document.createElement('div');
            mordal_close.classList.add('mordal_close');
            mordal_close.textContent = '×';
            mordal_close.addEventListener('click', function(){
                document.getElementById('edit_item_mordal').remove();
                document.getElementById('gray_mask').remove();
            }, false);
            mordal.appendChild(mordal_close);
            let form_mordal = document.createElement('div');
            let new_item_name = document.createElement('input');
            new_item_name.setAttribute('type', 'text');
            new_item_name.setAttribute('placeholder', 'new item name');
            new_item_name.setAttribute('required', true);
            form_mordal.appendChild(new_item_name);
            let new_start_date = document.createElement('input');
            new_start_date.setAttribute('type', 'date');
            new_start_date.setAttribute('required', true);
            form_mordal.appendChild(new_start_date);
            let span_date = document.createElement('span');
            span_date.textContent = '〜';
            form_mordal.appendChild(span_date);
            let new_end_date = document.createElement('input');
            new_end_date.setAttribute('type', 'date');
            new_end_date.setAttribute('required', true);
            form_mordal.appendChild(new_end_date);
            let item_edit_submit = document.createElement('button');
            item_edit_submit.style.display = 'block';
            item_edit_submit.style.margin = '1rem auto';
            item_edit_submit.textContent = 'Submit changes';
            if(item_type === 'parent'){
                new_item_name.value = app.items[i].name;
                new_start_date.value = app.items[i].start_date;
                new_end_date.value = app.items[i].end_date;
            }else if(item_type === 'child'){
                new_item_name.value = app.items[i].child[j].name;
                new_start_date.value = app.items[i].child[j].start_date;
                new_end_date.value = app.items[i].child[j].end_date;
            }
            item_edit_submit.addEventListener('click', { i : i, handleEvent: function handleEvent(event){
                if (new_item_name.value && new_start_date.value < new_end_date.value){
                    let tasks = document.getElementsByClassName('task');
                    if(item_type === 'parent'){
                        app.items[i].name = new_item_name.value;
                        app.items[i].start_date = new_start_date.value;
                        app.items[i].end_date = new_end_date.value;
                    }else if(item_type === 'child'){
                        app.items[i].child[j].name = new_item_name.value;
                        app.items[i].child[j].start_date = new_start_date.value;
                        app.items[i].child[j].end_date = new_end_date.value;
                    }

                    let params = new URLSearchParams();
                    params.append('items', JSON.stringify(app.items));

                    axios.post('sort_item.php', params)
                        .then(response => {
                            document.getElementById('edit_item_mordal').remove();
                            document.getElementById('gray_mask').remove();
                            let res = response.data;
                            app.setPeriod();
                        }).catch(error => {
                            // eslint-disable-next-line
                            console.log(error);
                        });
                }else{
                    alert('period is invalid');
                }
            }}, false);
            form_mordal.appendChild(item_edit_submit);

            mordal.appendChild(form_mordal);
            document.body.appendChild(gray_mask);
            document.body.appendChild(mordal);
        },
        addChildMordal: function(i){
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
                    document.getElementById('gray_mask').remove();
                }
            }, false);
            mordal.appendChild(mordal_close);
            const form_mordal = document.createElement('div');
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
            const add_child_submit = document.createElement('button');
            add_child_submit.style.display = 'block';
            add_child_submit.style.margin = '1rem auto';
            add_child_submit.textContent = 'add childtask';
            add_child_submit.addEventListener('click', { i : i, handleEvent: function handleEvent(event){
                console.log(i);
                let tasks = document.getElementsByClassName('task');
                let self = app;
                if (app.items[i].child){
                    app.$set(app.items[i].child, [app.items[i].child.length], JSON.parse('{"name": "'+ task_name_child.value + '", "start_date": "'+ start_date_child.value +'", "end_date": "'+ end_date_child.value +'" }'));
                } else {
                    app.$set(app.items[i], 'child', []);
                    app.$set(app.items[i].child, [0], JSON.parse('{"name": "'+ task_name_child.value + '", "start_date": "'+ start_date_child.value +'", "end_date": "'+ end_date_child.value +'" }'));
                }
                let params = new URLSearchParams();
                params.append('items', JSON.stringify(app.items));
                
                axios.post('sort_item.php', params)
                  .then(response => {
                      let res = response.data;
                      // console.log(JSON.parse(response.data.text));
                      self.setPeriod();
                      document.getElementById('add_child_mordal').remove();
                      document.getElementById('gray_mask').remove();
                  }).catch(error => {
                    // eslint-disable-next-line
                    console.log(error);
                  });
            }}, false);
            form_mordal.appendChild(add_child_submit);

            mordal.appendChild(form_mordal);
            document.body.appendChild(gray_mask);
            document.body.appendChild(mordal);
        },
        removeItem: (index) => {
            app.items.splice(index,1);
            let params = new URLSearchParams();
            params.append('items', JSON.stringify(app.items));
            axios.post('sort_item.php', params)
              .then(response => {
                  app.setPeriod();
              }).catch(error => {
                // eslint-disable-next-line
                console.log(error);
              });
        },
        removeChildItem: (i, j) => {
            app.items[i].child.splice(j, 1);
            let params = new URLSearchParams();
            params.append('items', JSON.stringify(app.items));
            axios.post('sort_item.php', params)
              .then(response => {
                  app.setPeriod();
              }).catch(error => {
                // eslint-disable-next-line
                console.log(error);
              });
        },
        setPeriod: function(){
            let periods = document.getElementsByClassName('period')
            while(periods.length > 0){
                periods[0].remove();
            }
            let tasks = document.getElementsByClassName('task');
            // console.log(tasks);
            let y_task0 = tasks[0].getBoundingClientRect().top;
            let task_num_total = 0;
            for (let i = 0; i < tasks.length; i++){
                let y_task = tasks[i].getBoundingClientRect().top;
                let start_date = tasks[i].children[1].textContent;
                let end_date = tasks[i].children[2].textContent;
                let span_start = document.getElementById(start_date);
                let span_end = document.getElementById(end_date);

                let start_x = span_start.getBoundingClientRect().left;
                let end_x = span_end.getBoundingClientRect().right;
                let width_period = end_x - start_x;

                let period = document.createElement('div');
                period.classList.add('period');
                period.id = tasks[i].id.replace('item', 'period');
                period.style.width = width_period + 'px';

                let period_end_date = document.createElement('span');
                period_end_date.classList.add('period_end_date');
                period_end_date.textContent = end_date;

                let period_top = y_task - y_task0 + 26;
                period.style.top = period_top + 'px';
                period.addEventListener('mousedown', movePeriodByDrag, false);

                let leftend_period = document.createElement('div');
                leftend_period.classList.add('leftend_period');
                leftend_period.addEventListener('mousedown', getPeriodWidth, false);

                let rightend_period = document.createElement('div');
                rightend_period.classList.add('rightend_period');
                rightend_period.addEventListener('mousedown', getPeriodWidth, false);

                period.appendChild(leftend_period);
                period.appendChild(period_end_date);
                period.appendChild(rightend_period);
                span_start.appendChild(period);

                task_num_total = i;
            }
        }
    }
});

const app_cal = new Vue ({
    el: '#calendar',
    data: ()=>{
        return {
          date_from : moment(),
          date_til : moment(),
          days_disp: Number,
          width_num : 25,
          height_num : '70vh',
          item_list : [],
        }
    },
    methods: {
      getItem: function(){
          this.item_list = app.items;
          let oldest_start_date = moment('2100-12-31');
          let newest_end_date = moment('1970-01-01');

          for (let i = 0; i < this.item_list.length; i++) {
              let date_start = moment(this.item_list[i].start_date);
              let date_end = moment(this.item_list[i].end_date);
              if (date_start < oldest_start_date){
                  oldest_start_date = date_start;
              }
              if (date_end > newest_end_date){
                  newest_end_date = date_end;
              }
          }
          if(oldest_start_date < this.date_from){
              this.date_from = oldest_start_date;
          }else if(newest_end_date > this.date_til){
              this.date_til = newest_end_date;
          }
          this.date_from.add(-1, 'days');
          this.days_disp = newest_end_date.diff(oldest_start_date, 'days');
      }
    },
    created: function(){
        this.getItem();
    },
    mounted: function(){
        app.setPeriod();
    }
});
let tasks = document.getElementsByClassName('task');
let y_task0 = tasks[0].getBoundingClientRect().top;
let task_num_total = tasks.length;

// const calendar = document.getElementById('calendar');
const add_btn = document.getElementById('add_btn');
add_btn.addEventListener('click', function(){
    let input_fields = document.getElementById('add_task');
    let item_to_add = {
        "name": input_fields.children[0].value,
        "start_date": input_fields.children[1].value,
        "end_date": input_fields.children[2].value
    };
    if (input_fields.children[0].value && input_fields.children[1].value && input_fields.children[2].value){
        app.items.push(item_to_add);

        let params = new URLSearchParams();
        params.append('items', JSON.stringify(app.items));
        
        axios.post('sort_item.php', params)
          .then(response => {
              console.log('ajax connection succeeded');
              input_fields.children[0].value = "";
              let res = response.data;
              console.log(JSON.parse(response.data.text));
              app.setPeriod();
          }).catch(error => {
            // eslint-disable-next-line
            console.log(error);
          });
    }else{
        alert('fill all 3 fields');
    }
});
document.getElementById('tasks').addEventListener('scroll', function() {
    document.getElementById('calendar').scrollTop = document.getElementById('tasks').scrollTop;
});
document.getElementById('calendar').addEventListener('scroll', function() {
    document.getElementById('tasks').scrollTop = document.getElementById('calendar').scrollTop;
});

// scroll today column into view
let today = new Date();
today = today.getFullYear() + '-' + (('0' + (today.getMonth() + 1)).slice(-2)) +  '-' +(('0' + today.getDate()).slice(-2));
const span_today = document.getElementById(today);
span_today.classList.add('today');
span_today.scrollIntoView({behavior: "instant", block: "start", inline: "start"});


// border modification
setTimeout(() => {
    const day_div = document.getElementsByClassName('day');
    for (let i = 0; i < day_div.length; i++){
        day_div[i].style.height = (task_num_total * 24 + 72) + 'px';
    }
}, 0);

// function addChildTask(e){
//     const mordal = document.createElement('div');
//     mordal.id = 'add_child_mordal';
//     mordal.classList.add('add_child');
//     const mordal_close = document.createElement('div');
//     mordal_close.classList.add('mordal_close');
//     mordal_close.textContent = '×';
//     mordal_close.addEventListener('click', function(){
//         const mordal_to_remove = document.getElementById('add_child_mordal');
//         if(mordal_to_remove){
//             mordal_to_remove.parentNode.removeChild(mordal_to_remove);
//         }
//     },false);
//     mordal.appendChild(mordal_close);
//     const form_mordal = document.createElement('form');
//     form_mordal.setAttribute('action', './add_childtask.php');
//     form_mordal.setAttribute('method', 'post');
//     const task_name_child = document.createElement('input');
//     task_name_child.setAttribute('type', 'text');
//     task_name_child.setAttribute('name', 'task_name_child');
//     task_name_child.setAttribute('placeholder', 'task name of child');
//     form_mordal.appendChild(task_name_child);
//     const start_date_child = document.createElement('input');
//     start_date_child.setAttribute('type', 'date');
//     start_date_child.setAttribute('name', 'start_date_child');
//     form_mordal.appendChild(start_date_child);
//     const span_date = document.createElement('span');
//     span_date.textContent = '〜';
//     form_mordal.appendChild(span_date);
//     const end_date_child = document.createElement('input');
//     end_date_child.setAttribute('type', 'date');
//     end_date_child.setAttribute('name', 'end_date_child');
//     form_mordal.appendChild(end_date_child);
//     const add_child_submit = document.createElement('input');
//     add_child_submit.setAttribute('type', 'submit');
//     form_mordal.appendChild(add_child_submit);
//     const parent_to_add = document.createElement('input');
//     parent_to_add.id = 'parent_to_add';
//     parent_to_add.setAttribute('type', 'hidden');
//     parent_to_add.setAttribute('name', 'parent_to_add');
//     form_mordal.appendChild(parent_to_add);
// 
//     mordal.appendChild(form_mordal);
//     document.body.appendChild(mordal);
// 
//     id_to_append = e.target.parentNode.id;
//     document.getElementById('parent_to_add').value = id_to_append;
// }
// 
// function taskEdit(event){
//     let item_id_to_edit = event.target.id;
//     if(event.target.tagName == 'SPAN'){
//         item_id_to_edit = event.target.parentNode.id;
//     }
//     item_id_to_edit = item_id_to_edit.replace('period', 'task');
//     const item_to_edit = document.getElementById(item_id_to_edit);
//     const mordal = document.createElement('div');
//     mordal.id = 'edit_item_mordal';
//     mordal.classList.add('add_child');
//     const mordal_close = document.createElement('div');
//     mordal_close.classList.add('mordal_close');
//     mordal_close.textContent = '×';
//     mordal_close.addEventListener('click', function(){
//         const mordal_to_remove = document.getElementById('edit_item_mordal');
//         if(mordal_to_remove){
//             mordal_to_remove.parentNode.removeChild(mordal_to_remove);
//         }
//     },false);
//     mordal.appendChild(mordal_close);
//     const form_mordal = document.createElement('form');
//     form_mordal.setAttribute('action', './edit_item.php');
//     form_mordal.setAttribute('method', 'post');
//     const text_to_rename = document.createElement('input');
//     text_to_rename.setAttribute('type', 'text');
//     text_to_rename.setAttribute('name', 'text_to_rename');
//     text_to_rename.setAttribute('value', item_to_edit.childNodes[0].textContent);
//     form_mordal.appendChild(text_to_rename);
//     const start_date_child = document.createElement('input');
//     start_date_child.setAttribute('type', 'date');
//     start_date_child.setAttribute('name', 'start_date_child');
//     start_date_child.setAttribute('value', item_to_edit.childNodes[1].textContent);
//     form_mordal.appendChild(start_date_child);
//     const span_date = document.createElement('span');
//     span_date.textContent = '〜';
//     form_mordal.appendChild(span_date);
//     const end_date_child = document.createElement('input');
//     end_date_child.setAttribute('type', 'date');
//     end_date_child.setAttribute('name', 'end_date_child');
//     end_date_child.setAttribute('value', item_to_edit.childNodes[2].textContent);
//     form_mordal.appendChild(end_date_child);
//     const add_child_submit = document.createElement('input');
//     add_child_submit.setAttribute('type', 'submit');
//     add_child_submit.setAttribute('value', 'modify');
//     form_mordal.appendChild(add_child_submit);
//     const task_id_to_edit = document.createElement('input');
//     task_id_to_edit.id = 'task_id_to_edit';
//     task_id_to_edit.setAttribute('type', 'hidden');
//     task_id_to_edit.setAttribute('name', 'task_id_to_edit');
//     form_mordal.appendChild(task_id_to_edit);
// 
//     mordal.appendChild(form_mordal);
//     document.body.appendChild(mordal);
// 
//     const id_to_append = item_id_to_edit.replace('task_','');
//     document.getElementById('task_id_to_edit').value = id_to_append;
// }
