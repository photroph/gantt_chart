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

echo 'showing from ';
echo $oldest_start_date;
echo ' to ';
echo $newest_end_date;
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
    <link rel="stylesheet" href="./styyle.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
</head>

<body>
<div class="wrapper">
    <h1 class="title">gantt chart</h1>
    <div class="task_display_area">
        <form action="./delete_task.php" name="delete_task" method="post">
            <input type="hidden" name="task_id_to_delete" id="task_id_to_delete" value="">
        </form>
        <table>
            <thead>
                <tr>
                    <th class="task_name">task name</th>
                    <th class="datetime_start">start date</th>
                    <th class="datetime_end">end date</th>
                    <th class="append_child">appendChild</th>
                    <th class="delete">delete</th>
                    <?php
                    for ($i = $oldest_start_date; $i <= $newest_end_date; $i = date('Y-m-d', strtotime($i . '+1 day'))) {
                        $day = substr($i, -2);
                        echo '<th class="day day'.$day.'">'.$day.'</th>';
                    }
                    ?>
                </tr>
            </thead>
            <tbody>
        <?php
        for ($i = 0; $i < $row; $i++) {
            if($tasks[$i][3]){
            // echo '<tr id =task_'.$i.' class="task childtask">'.$tasks[$i][0].'<span class="datetime_start">'.$tasks[$i][1].'</span><span class="datetime_end">'.$tasks[$i][2].'</span></tr>';
                echo '<tr id =task_'.$i.' class="task childtask"><td class="task_name">'.$tasks[$i][0].'</td><td class="datetime_start">'.$tasks[$i][1].'</td><td class="datetime_end">'.$tasks[$i][2].'</td><td class="append_child"></td><td class="delete"></td>';
                for ($j = $oldest_start_date; $j <= $newest_end_date; $j = date('Y-m-d', strtotime($j . '+1 day'))) {
                    if ($tasks[$i][1] <= $j && $j <= $tasks[$i][2] ){
                        echo '<td id="col_'.$i.'_'.$j.'" class="day period"></td>';
                    }else{
                        echo '<td id="col_'.$i.'_'.$j.'" class="day"></td>';
                    }
                }
                echo '</tr>';
            }else{
            // echo '<tr id =task_'.$i.' class="task">'.$tasks[$i][0].'<span class="datetime_start">'.$tasks[$i][1].'</span><span class="datetime_end">'.$tasks[$i][2].'</span></tr>';
                echo '<tr id =task_'.$i.' class="task"><td class="task_name">'.$tasks[$i][0].'</td><td class="datetime_start">'.$tasks[$i][1].'</td><td class="datetime_end">'.$tasks[$i][2].'</td><td class="append_child"></td><td class="delete"></td>';
                for ($j = $oldest_start_date; $j <= $newest_end_date; $j = date('Y-m-d', strtotime($j . '+1 day'))) {
                    if ($tasks[$i][1] <= $j && $j <= $tasks[$i][2] ){
                        echo '<td id="col_'.$i.'_'.$j.'" class="day period"></td>';
                    }else{
                        echo '<td id="col_'.$i.'_'.$j.'" class="day"></td>';
                    }
                }
                echo '</tr>';
            }
        }
        ?>
            </tbody>
        </table>
    </div>

    <form action="./register.php" id="add_task" method="post">
        <input type="text" name="task_name" placeholder="name of task">
        <input type="date" name="task_start" placeholder="start date of the task">
        ~
        <input type="date" name="task_end" placeholder="deadline of the task">
        <input type="submit">
    </form>
</div>
<script src="./index.js"></script>
</body>
</html>
