const {mix} = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    .styles([
        'resources/assets/css/font-awesome.min.css',
        'resources/assets/css/simple-line-icons.css',
        'resources/assets/css/style.css',
        'public/css/app.css'
    ], 'public/css/app.css')
    .copyDirectory('resources/assets/fonts', 'public/fonts')
    .copyDirectory('resources/assets/img', 'public/img');
