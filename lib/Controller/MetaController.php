<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;
use OCA\files_irods\iRodsApi\iRodsSession;

class MetaController extends Controller
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
        $schema = SchemaController::getSchema();
        $properties = array_key_exists("properties", $schema) ? $schema["properties"] : array();
        if($irodsPath)
        {
            $json_payload = array();
            $meta = $irodsPath->getMeta();
            foreach($meta as $alu)
            {
                if(array_key_exists($alu->name, $properties))
                {
                    $json_payload[$alu->name] = $alu->value;
                }
            }
            return $json_payload;
        }
        else
        {
            throw new \Exception("invalid iRODS path");
        }
    }

    /**
     * @NoAdminRequired
     *
     * @param string $path
     * @param string $attr
     * @param string $value
     */
    public function put($path, $attr, $value)
    {
        $session = iRodsSession::createFromPath($path);
        $irodsPath = $session->resolve($this->stripMountPoint($path));
        $schema = SchemaController::getSchema();
        $properties = array_key_exists("properties", $schema) ? $schema["properties"] : array();
        if(array_key_exists($attr, $properties))
        {
            $irodsPath->setMeta($attr, $value);
        }
        else
        {
            throw new \Exception("$attr not in Schema");
        }
    }

    /**
     * @NoAdminRequired
     *
     * @param string $path
     */
    public function submit($path)
    {
        $session = iRodsSession::createFromPath($path);
        $irodsPath = $session->resolve($this->stripMountPoint($path));
        $irodsPath->setMeta("IBRIDGES_STATE", "SUBMITTED");
    }
};
