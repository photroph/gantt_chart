<?php
ini_set('display_errors', 1);

$task_to_delete = $_POST['task_id_to_delete'];

echo 'delete '.$task_to_delete.'<br>';

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

$key_to_delete = ltrim($task_to_delete, 'task_');
if(is_numeric($key_to_delete)){
    unset($tasks[$key_to_delete]);
    $renew_csv = fopen('./tasks.csv','w');
    foreach($tasks as $task){
        fputcsv($renew_csv, $task);
    }
    fclose($renew_csv);
}

header('Location: ./');
exit();
 ?>
