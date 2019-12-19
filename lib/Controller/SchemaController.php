<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;

class SchemaController extends Controller
{

  /**
   * @NoAdminRequired
   * @NoCSRFRequired
   */

   public function get()
    {
        $config = \OC::$server->getconfig();
        $json_schema = $config->getAppvalue(
            "irods_meta","json_schema");
        return $json_schema;
    }
};
