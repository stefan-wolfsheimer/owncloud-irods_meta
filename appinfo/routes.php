<?php
/**
* Routes
* Author: Tasneem Rahaman Khan  tasneem.rahaman-khan@surfsara.nl

*/


namespace OCA\irods_meta\AppInfo;
$application = new Application();


$application->registerRoutes($this, [
  'routes' => [
    [
      'name' => 'schema#get',
      'url' => '/api/schema',
      'verb' => 'GET'
    ],
    [
      'name' => 'meta#get',
      'url' => '/api/meta/{path}',
      'verb' => 'GET',
      'requirements' => ['path' => '.*']
    ],
    [
      'name' => 'meta#put',
      'url' => '/api/meta/{path}',
      'verb' => 'PUT',
      'requirements' => ['path' => '.*']
    ]
  ]
]);
