<?php
$key_to_edit = $_POST['task_id_to_edit'];

// load from csv
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

// rewrite csv
if(is_numeric($key_to_edit)){
    $tasks[$key_to_edit][0] = $_POST['text_to_rename'];
    $tasks[$key_to_edit][1] = $_POST['start_date_child'];
    $tasks[$key_to_edit][2] = $_POST['end_date_child'];
    $renew_csv = fopen('./tasks.csv','w');
    foreach($tasks as $task){
        fputcsv($renew_csv, $task);
    }
    fclose($renew_csv);
}

header('Location: ./');
exit();
?>
