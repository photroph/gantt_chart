let animals;
const httpObj = new XMLHttpRequest();
httpObj.open("get", "./test.json", false);
httpObj.onload = function(){
    animals = JSON.parse(this.responseText);
}
httpObj.send(null);

const calendar = document.getElementById('calendar');
calendar.innerHTML = `
    <div v-for="n in days_disp" v-bind:id="date_from.add(1, 'days').format('YYYY-MM-DD')" :key="n" :style="{ width: width_num + 'px', height: height_num }" :class="'day day_'+date_from.add(1, 'days').format('DD')+' month_'+date_from.add(-1, 'days').format('MM')">
    </div>`;

const task_disp_area = document.getElementById('tasks');
task_disp_area.innerHTML = `
    <draggable v-model="animals" :element="'ul'" @end="dragItem">
        <li v-for="(animal, i) in animals" class="task" v-bind:id="'item_'+ i">
            <span class="task_name">{{ i }} : {{ animal.name }}</span>
            <span class="datetime_start">{{ animal.start_date }}</span>
            <span class="datetime_end">{{ animal.end_date }}</span>
            <i title="add child task" class="fas fa-plus" @click="displayMordal(i)"></i>
            <i title="delete this task" class="delete_btn far fa-trash-alt" @click="remove(i)"></i>
            <ul> <draggable v-model="animal.child">
                <li v-for="(child, j) in animal.child" class="task childtask" v-bind:id="'item_'+ i + '-' + j">
                    <span class="task_name">{{ i }} - {{ j }} : {{ child.name }}</span>
                    <span class="datetime_start">{{ child.start_date }}</span>
                    <span class="datetime_end">{{ child.end_date }}</span>
                    <i title="delete this task" class="delete_btn far fa-trash-alt" @click="removechild(i, j)"></i>
                </li>
            </draggable> </ul>
        </li>
    </draggable>`;


const app = new Vue ({
    el: '#tasks',
    data: ()=>{
        return {
            animals: animals
        }
    },
    methods: {
        dragItem: function(event){
            console.log(event.item);
            console.log(JSON.stringify(this.animals));
            let params = new URLSearchParams();
            let ob = this;
            params.append('animals', JSON.stringify(this.animals));
            
            axios.post('sort_item.php', params)
              .then(response => {
                  let res = response.data;
                  console.log(JSON.parse(response.data.text));
                  ob.setPeriod();
              }).catch(error => {
                // eslint-disable-next-line
                console.log(error);
              });
        },
        displayMordal: function(i){
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
            add_child_submit.textContent = 'add childtask';
            add_child_submit.addEventListener('click', { i : i, handleEvent: function handleEvent(event){
                console.log(i);
                let items = document.getElementsByClassName('task');
                let self = app;
                if (app.animals[i].child){
                    app.$set(app.animals[i].child, [app.animals[i].child.length], JSON.parse('{"name": "'+ task_name_child.value + '", "start_date": "'+ start_date_child.value +'", "end_date": "'+ end_date_child.value +'" }'));
                } else {
                    app.$set(app.animals[i], 'child', []);
                    app.$set(app.animals[i].child, [0], JSON.parse('{"name": "'+ task_name_child.value + '", "start_date": "'+ start_date_child.value +'", "end_date": "'+ end_date_child.value +'" }'));
                }
                let params = new URLSearchParams();
                params.append('animals', JSON.stringify(app.animals));
                
                axios.post('sort_item.php', params)
                  .then(response => {
                      let res = response.data;
                      // console.log(JSON.parse(response.data.text));
                      self.setPeriod();
                  }).catch(error => {
                    // eslint-disable-next-line
                    console.log(error);
                  });
            }}, false);
            form_mordal.appendChild(add_child_submit);

            mordal.appendChild(form_mordal);
            document.body.appendChild(mordal);
        },
        remove: function(index){
            this.animals.splice(index,1);
            let self = this;
            axios.post('sort_item.php', params)
              .then(response => {
                  let res = response.data;
                  // console.log(JSON.parse(response.data.text));
                  self.setPeriod();
              }).catch(error => {
                // eslint-disable-next-line
                console.log(error);
              });
        },
        removechild: function(i, j){
            this.animals[i].child.splice(j, 1);
            console.log(this.animals);
            let self = this;
            axios.post('sort_item.php', params)
              .then(response => {
                  let res = response.data;
                  // console.log(JSON.parse(response.data.text));
                  self.setPeriod();
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
                let span_start = document.getElementById(String(start_date));
                let span_end = document.getElementById(end_date);

                let start_x = span_start.getBoundingClientRect().left;
                let end_x = span_end.getBoundingClientRect().right;
                let width_period = end_x - start_x;

                let period = document.createElement('div');
                period.classList.add('period');
                period.id = tasks[i].id.replace('item', 'period');
                period.style.width = width_period + 'px';
                let period_top = y_task - y_task0 + 26;
                period.style.top = period_top + 'px';
                // period.addEventListener('click', taskEdit,false);
                let leftend_period = document.createElement('div');
                leftend_period.classList.add('leftend_period');
                leftend_period.addEventListener('mousedown', getPeriodWidth, false);
                let rightend_period = document.createElement('div');
                rightend_period.classList.add('rightend_period');
                rightend_period.addEventListener('mousedown', getPeriodWidth, false);
                period.appendChild(rightend_period);
                period.appendChild(leftend_period);
                span_start.appendChild(period);

                task_num_total = i;
            }
        }
    },
//    mounted: function(){
//        this.setPeriod();
//    }
});

const app_cal = new Vue ({
    el: '#calendar',
    data: ()=>{
        return {
          date_from : moment(),
          date_til : moment(),
          days_disp: Number,
          width_num : 32,
          height_num : '70vh',
          item_list : [],
        }
    },
    methods: {
      getItem: function(){
          this.item_list = app.animals;
          let oldest_start_date = moment('2100-12-31');
          let newest_end_date = moment('1970-01-01');
          // eslint-disable-next-line
          console.log('Calendar.created');
          // eslint-disable-next-line
          console.log(this.item_list);

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
        app.animals.push(item_to_add);

        let params = new URLSearchParams();
        params.append('animals', JSON.stringify(app.animals));
        
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
setTimeout(function(){
    const day_div = document.getElementsByClassName('day');
    for (let i = 0; i < day_div.length; i++){
        day_div[i].style.height = (task_num_total * 24 + 72) + 'px';
    }
}, 0);

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
    calendar.addEventListener('mouseup', function(){
        calendar.removeEventListener('mousemove', getExtendedPeriodWidth,false);
    },false);
}

function getExtendedPeriodWidth(event){
    // console.log(event.clientX, event.clientY);
    // console.log(document.elementFromPoint(event.clientX, event.clientY).id);
    // console.log(period_to_edit);
    let item_to_edit = period_to_edit.id.replace('period_', '');
    // console.log(item_to_edit);
    if(document.elementFromPoint(event.clientX, event.clientY).id){
        if(period_end_which == 'rightend_period'){
            if(item_to_edit.includes('-')){
                item_to_edit = item_to_edit.split('-');
                app.animals[item_to_edit[0]].child[item_to_edit[1]].end_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }else{
                app.animals[item_to_edit].end_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }
        }else if(period_end_which == 'leftend_period'){
            if(item_to_edit.includes('-')){
                item_to_edit = item_to_edit.split('-');
                app.animals[item_to_edit[0]].child[item_to_edit[1]].start_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }else{
                app.animals[item_to_edit].start_date = document.elementFromPoint(event.clientX, event.clientY).id;
            }
        }
        let params = new URLSearchParams();
        params.append('animals', JSON.stringify(app.animals));
        
        axios.post('sort_item.php', params)
          .then(response => {
              let res = response.data;
              // console.log(JSON.parse(response.data.text));
              app.setPeriod();
          }).catch(error => {
            // eslint-disable-next-line
            console.log(error);
          });
    }
    event.preventDefault();
}
