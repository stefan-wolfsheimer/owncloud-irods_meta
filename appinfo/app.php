<?php

namespace OCA\irods_meta\AppInfo;
use \OCP\AppFramework\App;
use \OCP\Util;

$app = new Application();

\OC::$server->getNavigationManager()->add(array(
    // the string under which your app will be referenced in owncloud
    'id' => 'irods_meta',
    // sorting weight for the navigation. The higher the number, the higher
    // will it be listed in the navigation
    'order' => 10,
    // the route that will be shown on startup
    'href' => \OC::$server->getURLGenerator()->linkToRoute('irods_meta.meta_test.index'),
    // the icon that will be shown in the navigation
    // this file needs to exist in img/
    //'icon' => \OC::$server->getURLGenerator()->imagePath('ownnote', 'app.svg'),
    // the title of your application. This will be used in the
    // navigation or on the settings page of your app
    'name' => \OCP\Util::getL10N('irods_meta')->t('TestIRodsMeta')
));

\OC::$server->getEventDispatcher()->addListener(
	'OCA\Files::loadAdditionalScripts',
	function() {
        Util::addScript('irods_meta', 'bundle');
	}
);


