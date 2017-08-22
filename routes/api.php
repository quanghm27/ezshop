<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/products', 'ProductController@index');
Route::get('/productsInEvent', 'ProductController@getProductInEvent');
Route::post('/products', 'ProductController@create');
Route::patch('/products/{id}', 'ProductController@update')->where('id', '[0-9]+');
Route::patch('/products/{id}/quantity', 'ProductController@updateQuantity')->where('id', '[0-9]+');
Route::patch('/products/event', 'ProductController@updateDiscountEvent');
Route::patch('/products/closeEvent', 'ProductController@closeDiscountEvent');
Route::patch('/products/{id}/closeDiscountProduct', 'ProductController@closeDiscountProduct')->where('id', '[0-9]+');
Route::delete('/products/{id}', 'ProductController@delete')->where('id', '[0-9]+');
Route::get('/products/{id}', 'ProductController@findOrder')->where('id', '[0-9]+');

Route::get('/customers', 'CustomerController@index');
Route::get('/customers/search', 'CustomerController@search');
Route::post('/customers', 'CustomerController@create');
Route::get('/customers/{id}', 'CustomerController@find')->where('id', '[0-9]+');
Route::patch('/customers/{id}', 'CustomerController@update')->where('id', '[0-9]+');
Route::delete('/customers/{id}', 'CustomerController@delete')->where('id', '[0-9]+');
Route::get('/customers/findOrder/{id}', 'CustomerController@findOrder')->where('id', '[0-9]+');

Route::get('/orders', 'OrderController@index');
Route::get('/orders/{fromDate}/{toDate}/getWithDate', 'OrderController@getOrderWithDate');
Route::get('/orders/{id}', 'OrderController@find')->where('id', '[0-9]+');
Route::post('/orders', 'OrderController@create');
Route::delete('/orders/{id}', 'OrderController@delete')->where('id', '[0-9]+');
Route::patch('/orders/{id}', 'OrderController@update')->where('id', '[0-9]+');