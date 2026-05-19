<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | The driver Intervention Image uses to process images. "gd" requires no
    | system dependencies and ships with PHP; "imagick" requires the ImageMagick
    | PHP extension but offers better resampling quality, AVIF output, and
    | proper color-profile handling. Switching drivers needs no code change.
    |
    | Supported: "gd", "imagick"
    |
    */

    'driver' => env('IMAGE_DRIVER', 'gd'),

];
