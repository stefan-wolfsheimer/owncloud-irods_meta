<?php
namespace OCA\irods_meta\Controller;
use OCP\AppFramework\Controller;

class MetaController extends Controller
{
  public function get()
  {
    $json_payload = array(
      "project"=> "irod",
      "title"=> "Meta",
      "description"=> "dummy",
      "date"=> "10/10/2010",
      "factors"=>"Factors",
      "organism"=> "Organism",
      "issue"=> "no issues",
      "technology"=> "php",
      "related Publications"=> "Creator"
    );
    return $json_payload;

  }
};
