<?php
ini_set('display_errors', 0);

?>
<!DOCTYPE html>
<html>
<head>
    <title>gantt chart</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
</head>

<body>
<div class="wrapper">
    <h1 class="title">gantt chart</h1>
    <div class="task_display_area">
        <form action="./delete_task.php" name="delete_task" method="post">
            <input type="hidden" name="task_id_to_delete" id="task_id_to_delete" value="">
        </form>
        <div class="task_title_area">
            <div id="tasks" class="tasks sortable"> </div>

            <div id="add_task" name="add_task">
                <input type="text" name="task_name" placeholder="name of task" required>
                <input type="date" name="task_start" placeholder="start date of the task" required>
                ~
                <input type="date" name="task_end" placeholder="deadline of the task" required>
                <button id="add_btn">add</button>
            </div>
        </div>
        <div class="calendar_wrapper">
            <div id="calendar" class="calendar">
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.17.0/vuedraggable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.23.0/moment.min.js"></script>
<script src="./index.js"></script>
</body>
</html>
