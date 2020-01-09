<?php

namespace OCA\irods_meta\AppInfo;
use \OCP\AppFramework\App;
use \OCP\Util;

$app = new Application();

\OC::$server->getEventDispatcher()->addListener(
	'OCA\Files::loadAdditionalScripts',
	function() {
        Util::addScript('irods_meta', 'bundle');
	}
);


