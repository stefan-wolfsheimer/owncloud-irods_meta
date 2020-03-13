<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCA\files_irods\iRodsApi\iRodsSession;

class SchemaController extends Controller
{
    public function stripMountPoint($path)
    {
        $tmp = explode('/', ltrim($path, '/'), 2);
        if(count($tmp) > 1)
        {
            return $tmp[1];
        }
        else
        {
            return "";
        }
    }

  /**
   * @NoAdminRequired
   * @NoCSRFRequired
   */
   public function get($path)
   {
       $session = iRodsSession::createFromPath($path);
       $irodsPath = $session->resolve($this->stripMountPoint($path));
       $acl = $irodsPath->acl();
       $schema = SchemaController::getSchema();
       if($acl == "read")
       {
           foreach($schema['properties'] as $k=>&$v)
           {
               $v['readOnly'] = true;
           }
       }
       foreach($schema['properties'] as $k=>&$v)
       {
           if(array_key_exists("enum", $v) && is_string($v["enum"]))
           {
               $enum = $v["enum"];
               $arr = [];
               if(preg_match ("/^{GROUP:(.*?)}$/", $enum, $matches))
               {
                   $groups = array_keys($session->getRoles());
                   foreach($groups as $g)
                   {
                       if(preg_match($matches[1], $g, $matches2))
                       {
                           $arr[] = $matches2[1];
                       }
                   }
               }
               $v["enum"] = $arr;
           }
       }
       return new JSONResponse($schema);
    }

    static public function getSchema()
    {
        $config = \OC::$server->getconfig();
        $json_schema = $config->getAppvalue("irods_meta", "json_schema");
        $ret = json_decode($json_schema, TRUE);
        if(!$ret)
        {
            error_log($json_schema);
            throw new \Exception("could not decode json string");
        }
        return json_decode($json_schema, TRUE);
    }
};
