<?php
ini_set('display_errors', 1);

$parent_to_add = $_POST['parent_to_add'];
$task_name_child = $_POST['task_name_child'];
$start_date_child = $_POST['start_date_child'];
$end_date_child = $_POST['end_date_child'];

echo 'add '.$parent_to_add.'<br>';

$row = 0;
$tasks = [];
if (($handle = fopen("./tasks.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
        $num = count($data);
        for ($c=0; $c < $num; $c++) {
            $tasks[$row][$c] =  trim($data[$c], '"');
        }
        $row++;
    }
    fclose($handle);
}

$key_to_insert = ltrim($parent_to_add, 'task_') + 1;
if(is_numeric($key_to_insert)){
    array_splice($tasks, $key_to_insert, 0, array(array($task_name_child, $start_date_child, $end_date_child, $parent_to_add)));
    $renew_csv = fopen('./tasks.csv','w');
    foreach($tasks as $task){
        fputcsv($renew_csv, $task);
    }
    fclose($renew_csv);
}

header('Location: ./');
exit();
 ?>
