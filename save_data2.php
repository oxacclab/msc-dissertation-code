<?php
    // the $_POST[] array will contain the passed in filename and data
    // the directory "data" is writable by the server (chmod 777)
    // the file path needs to be adjusted accordingly!
    $filename = "data/".$_POST['filename'];
    $data = $_POST['filedata'];
    function crash_and_burn($reason) {
      http_response_code(500);
      die("{error: \"$reason\", message: \"\", filename: \"$filename\"}");
    }
    // Because the above came from the participant's machine, we sanitize the input
    if(!preg_match("/^[0-9a-zA-Z]+$/", $filename)) {
        http_response_code(400);
        crash_and_burn("Invalid filename");
    } else {
      $filename = $filename.".csv";
    }
    // write the file to disk
    if(file_put_contents($filename, $data) === false) {
      crash_and_burn('Could not write file to server');
    } else {
      http_response_code(200);
      die("{error: \"\", message: \"Saved $filename to server.\"}");
    }