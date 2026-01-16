<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Define directories relative to this script
// Script is in assets/, so subfolders are just names
$dirs = [
    'logos' => 'logo',
    'conference' => 'conference',
    'hospital' => 'hospital'
];

$response = [];

foreach ($dirs as $key => $subfolder) {
    $response[$key] = [];
    $fullPath = __DIR__ . '/' . $subfolder;
    
    if (is_dir($fullPath)) {
        $files = scandir($fullPath);
        foreach ($files as $file) {
            // Skip . and .. and hidden files
            if ($file === '.' || $file === '..' || strpos($file, '.') === 0) continue;
            
            // Check extensions
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                $response[$key][] = $file;
            }
        }
        // Sort files naturally (like Windows explorer)
        usort($response[$key], 'strnatcasecmp');
    }
}

echo json_encode($response);
?>
