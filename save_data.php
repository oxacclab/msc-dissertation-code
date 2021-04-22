<?php
    // the $_POST[] array will contain the passed in filename and data
    // the directory "data" is writable by the server (chmod 777)
    // the file path needs to be adjusted accordingly!
    $filename = "data/".$_POST['filename'];
    $data = $_POST['filedata'];
    // write the file to disk
    echo "<script type='text/javascript'>alert('$%_POST['filename']');</script>";
    echo "<script type='text/javascript'>alert('$%_POST['filedata']');</script>";
    file_put_contents($filename, $data);
?>
