<?php
ini_set('display_errors', 1);

$day = $_POST['edit_period'];
$period_to_edit =  $_POST['period_to_edit'];
$edit_period_LR = $_POST['edit_period_LR'];

// read tasks
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

if(strpos($edit_period_LR, 'left') !== false){
    $tasks[$period_to_edit][1] = date('Y-m-d', strtotime($tasks[$period_to_edit][1]." ".$day." day"));
    $modified = $tasks[$period_to_edit][1];
} else {
    $tasks[$period_to_edit][2] = date('Y-m-d', strtotime($tasks[$period_to_edit][2]." ".$day." day"));
    $modified = $tasks[$period_to_edit][2];
}

$renew_csv = fopen('./tasks.csv','w');
foreach($tasks as $task){
    fputcsv($renew_csv, $task);
}
fclose($renew_csv);

header('Content-type:application/json; charset=utf8');
$return_array = array($period_to_edit, $modified, $day, $edit_period_LR);
// return
echo json_encode($return_array);

//header('Location: ./');
//exit();
?>
