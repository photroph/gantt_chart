<?php
ini_set('display_errors', 0);

$row = 0;
$tasks = [];
if (($handle = fopen("./tasks.csv", "r")) !== FALSE) {
    $oldest_start_date = '9999-12-31';
    $newest_end_date = '1900-01-01';
    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $num = count($data);
        for ($c=0; $c < $num; $c++) {
            $tasks[$row][$c] =  trim($data[$c], '"');
        }
        if($tasks[$row][1] < $oldest_start_date){
            $oldest_start_date = $tasks[$row][1];
        }
        if($tasks[$row][2] > $newest_end_date){
            $newest_end_date = $tasks[$row][2];
        }
        $row++;
    }
    fclose($handle);
}

$today = date('Y-m-d');
if($today > $newest_end_date){
    $newest_end_date = $today;
}else if ($today < $oldest_start_date){
    $oldest_start_date = $today;
}
$y = date('Y', strtotime($oldest_start_date));
$m = date('m', strtotime($oldest_start_date));
$d = date('d', strtotime($oldest_start_date));
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
    <p>showing from <?php echo $oldest_start_date; ?> to <?php echo $newest_end_date; ?></p>
    <div class="task_display_area">
        <form action="./delete_task.php" name="delete_task" method="post">
            <input type="hidden" name="task_id_to_delete" id="task_id_to_delete" value="">
        </form>
        <div class="task_title_area">
            <div id="tasks" class="tasks sortable">
        <?php
        for ($i = 0; $i < $row; $i++) {
            if($tasks[$i][3]){
                echo '<div id =task_'.$i.' class="task childtask">
                    <span class="task_name">'.$tasks[$i][0].'</span>
                    <span class="datetime_start">'.$tasks[$i][1].'</span>
                    <span class="datetime_end">'.$tasks[$i][2].'</span></div>';
            }else{
                echo '<div id =task_'.$i.' class="task">
                    <span class="task_name">'.$tasks[$i][0].'</span>
                    <span class="datetime_start">'.$tasks[$i][1].'</span>
                    <span class="datetime_end">'.$tasks[$i][2].'</span></div>';
            }
        }
        ?>
            </div>

            <form action="" id="add_task" name="add_task">
                <input type="text" name="task_name" placeholder="name of task" required>
                <input type="date" name="task_start" placeholder="start date of the task" required>
                ~
                <input type="date" name="task_end" placeholder="deadline of the task" required>
                <button id="add_btn">add</button>
            </form>
        </div>
        <div class="calendar_wrapper">
            <form action="./edit_period.php" name="edit_period" method="post">
                <input type="hidden" id="edit_period_LR" name="edit_period_LR">
                <input type="hidden" id="edit_period" name="edit_period">
                <input type="hidden" id="period_to_edit" name="period_to_edit">
            </form>
            <div id="calendar" class="calendar">
                <div class="year year_<?php echo $y;?>">
                    <div class="year_character"><?php echo $y;?></div>
                    <div class="month month_<?php echo $m;?>">
                        <div class="month_character"><?php echo $m;?></div>
                        <div class="day_wrapper">
                        <?php
                        for ($i = $oldest_start_date; $i <= $newest_end_date; $i = date('Y-m-d', strtotime($i . '+1 day'))) {
                            $y = date('Y', strtotime($i));
                            $m = date('m', strtotime($i));
                            $d = date('d', strtotime($i));
                            if($d === '01'){
                                if($m === '01'){
                                    echo '</div></div><!--year--><div class="year year_'.$y.'"><div class="year_character">'.$y.'<div>';
                                }
                                echo '</div></div><!--month--><div class="month month_'.$m.'"><div class="month_character">'.$m.'</div><div class="day_wrapper">';
                            }
                            echo '<div id="'.$y.'-'.$m.'-'.$d.'" class="day day_'.$d.'"></div>';
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form action="./sort_tasks.php" name="sorted" method="post">
        <input type="hidden" id="sorted" name="sorted">
    </form>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.21/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.6.1/Sortable.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.17.0/vuedraggable.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
<script src="./index.js"></script>
</body>
</html>
