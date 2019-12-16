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
        'url' => 'app/irods_meta/api/schema',
        'verb' => 'GET'
     ],
     [
            'name' => 'meta_test#index',
            'url' => '/api/irods_meta',
            'verb' => 'GET'
     ]
   ]
]);
