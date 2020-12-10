<?php

// Simple world floorplan & meta receiver
// Compatible with PHP7 and PHP5

$maxImagePixels = 1048; // if width or height exceeds this value, resize
$targetPath = realpath('./img/plans');
$imageFileName = 'floorplan.png';
$metadataFileName = 'world.json';

// receive, filter and store the metadata
$metaData = array();

foreach (array('dimX', 'dimY', 'zeroX', 'zeroY') as $metaKey) {
    $metaData[$metaKey] = filter_var($_POST[$metaKey], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
}

$metaJson = json_encode($metaData);

file_put_contents($targetPath . '/' . $metadataFileName, $metaJson);

// now deal with the floorplan image
if (!array_key_exists('floorplan', $_FILES)) {
    // no image uploaded, we're done
    output('Floorplan settings saved', 0);
}

$imageInfo = getimagesize($_FILES['floorplan']['tmp_name']);

if ($imageInfo == false) {
    output('Not an image or unsupported image format', 1);
}

$image = imagecreatefromstring(file_get_contents($_FILES['floorplan']['tmp_name']));

$imageWidth = $imageInfo[0];
$imageHeight = $imageInfo[1];

if (($imageWidth > $maxImagePixels) || ($imageHeight > $maxImagePixels)) {
    // resize needed
    $aspectRatio = $imageWidth / $imageHeight;
    if ($imageWidth > $maxImagePixels) {
        $imageWidth = $maxImagePixels;
        $imageHeight = $imageWidth * $aspectRatio;
    }
    if ($imageHeight > $maxImagePixels) {
        $imageHeight = $maxImagePixels;
        $imageWidth = $imageHeight / $aspectRatio;
    }
    $resized = imagecreatetruecolor($imageWidth, $imageHeight);
    imagecopyresampled($resized, $image, 0, 0, 0, 0, $imageWidth, $imageHeight, $imageInfo[0], $imageInfo[1]);
    $image = $resized;
}

if (imagepng($image, $targetPath . '/' . $imageFileName)) {
    output('Image saved', 0);
} else {
    output('Error saving image', 1);
}

function output($message, $code = 0) {
    echo json_encode(array('message' => $message, 'code' => $code));
    die;
}