<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;

class MetaTestController extends Controller
{

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index()
    {
        $parameters = [];
        $templateName = "metatest";
        return new TemplateResponse($this->appName,
                                    $templateName,
                                    $parameters);
    }    
};

