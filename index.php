<?php
ini_set('display_errors', 0);

$row = 0;
$tasks = [];
if (($handle = fopen("./tasks.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $num = count($data); // 2
        for ($c=0; $c < $num; $c++) {
            $tasks[$row][$c] =  trim($data[$c], '"');
        }
        $row++;
    }
    fclose($handle);
}

$year_current = date('Y');
$month_current = date('m');
$day_current = date('d');
$number = cal_days_in_month(CAL_GREGORIAN, $month_current, $year_current); // 31
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
            <div id="tasks" class="tasks sortable">
        <?php
        for ($i = 0; $i < $row; $i++) {
            if($tasks[$i][3]){
            echo '<div id =task_'.$i.' class="task childtask"><span class="task_name">'.$tasks[$i][0].'</span><span class="datetime_start">'.$tasks[$i][1].'</span><span class="datetime_end">'.$tasks[$i][2].'</span></div>';
            }else{
            echo '<div id =task_'.$i.' class="task"><span class="task_name">'.$tasks[$i][0].'</span><span class="datetime_start">'.$tasks[$i][1].'</span><span class="datetime_end">'.$tasks[$i][2].'</span></div>';
            }
        }
        ?>
            </div>

            <form action="./sort_tasks.php" name="sorted" method="post">
                <input type="hidden" id="sorted" name="sorted">
            </form>

            <form action="./register.php" id="add_task" method="post">
                <input type="text" name="task_name" placeholder="name of task">
                <input type="date" name="task_start" placeholder="start date of the task">
                ~
                <input type="date" name="task_end" placeholder="deadline of the task">
                <input type="submit">
            </form>
        </div>
        <div class="calendar_wrapper">
        <div id="calendar" class="calendar">
        <?php
        for ($m = 1; $m <= 12; $m++){
            echo '<div class="month month_'.$m.'"><div class="month_character">'.$m.'</div><div class="day_wrapper">';
            $last_day_of_month = cal_days_in_month(CAL_GREGORIAN, $m, $year_current);
            $m = str_pad($m, 2, '0', STR_PAD_LEFT);
            for ($d = 1; $d <= $last_day_of_month; $d++){
                $d = str_pad($d, 2, '0', STR_PAD_LEFT);
                echo '<div id="'.$year_current.'-'.$m.'-'.$d.'" class="day day_'.$d.'"></div>';
            }
            echo '</div></div>';
        }
        ?>
        </div>
        </div>
    </div>
</div>
<script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
<script src="http://code.jquery.com/ui/1.11.3/jquery-ui.js"></script>
<script src="./index.js"></script>
</body>
</html>
