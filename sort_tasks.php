<?php
$sorted = $_POST['sorted'];
$item_num = count($sorted);

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

$renew_csv = fopen('./tasks.csv','w');
for($i = 0; $i < $item_num; $i++){
    $sorted[$i] = ltrim($sorted[$i], 'task_');
    fputcsv($renew_csv, $tasks[intval($sorted[$i])]);
}
fclose($renew_csv);
?>
