<?php
namespace OCA\irods_meta\AppInfo;

$application = new Application();

$application->registerRoutes($this, [
    'routes' => [
        [
            'name' => 'meta_test#index',
            'url' => '/api/irods_meta',
            'verb' => 'GET'
        ]
    ]
]);
