<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;
//use OCP\AppFramework\Http\TemplateResponse;

class SchemaController extends Controller
{
    public function get()
    {

	$config = \OC::$server->getconfig();
        $json_schema = $config->getAppvalue(
                                    "irods_meta","json_schema");
	error_log ($json_schema);			    

        return $json_schema;
    }

               

};