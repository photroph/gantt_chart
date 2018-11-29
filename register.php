<?php
ini_set('display_errors', 1);

$task_name = $_POST['task_name'];
$task_start = $_POST['task_start'];
$task_end = $_POST['task_end'];


$loaded_csv = fopen('./tasks.csv','a+');
$stock_list = fgetcsv($loaded_csv);
$columns_to_post = ['"'.$task_name.'"', $task_start, $task_end];

fputcsv($loaded_csv, $columns_to_post);

fclose($loaded_csv);

header('Location: ./');
exit();
?>
