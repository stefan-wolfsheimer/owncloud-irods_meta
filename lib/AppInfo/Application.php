<?php

namespace OCA\irods_meta\AppInfo;
use \OCP\AppFramework\App;

class Application extends App
{
    public function __construct(array $urlParams=array()){
       parent::__construct('irods_meta', $urlParams);
       //$container = $this->getContainer();
       //$backendService = $container->getServer()->getStoragesBackendService();
       //$backendService->registerBackendProvider($this);
    }
};
