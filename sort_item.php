<?php
header('Content-Type: application/json; charset=utf-8');

file_put_contents('test.json', $_POST['items']);

echo json_encode(['text' => $_POST['items']]);
?>
