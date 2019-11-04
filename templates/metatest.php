<?php

script('irods_meta', 'metatest'); // js/metatest.js

?>
<div id="app" style="padding: 35px;">
    <input type="text" size=255 style="width: 600px" id="irods-meta-test-path"/>
    <br/>
    <textarea style="width: 600px; height: 600px;" id="irods-meta-data"></textarea><br/>
    <div id="irods-meta-error" style="text-color: red;">
    </div>
    <input type="button" name="OP" value="GET" id="irods-meta-test-button-get"/>
    <input type="button" name="OP" value="PUT" id="irods-meta-test-button-put"/>
    <input type="button" name="OP" value="PATCH" id="irods-meta-test-button-patch"/>
    <input type="button" name="OP" value="DELETE" id="irods-meta-test-button-delete"/>
</div>
