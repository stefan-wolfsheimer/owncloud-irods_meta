$(function() {
  var baseurl = '/apps/files_irods/api/meta';

  function ajax(url, type, data=null) {
    if(data) {
      data = JSON.stringify(data, null, 2);
    }
    return new Promise(function(resolve, reject) {
      $.ajax({ url: url,
               type: type,
               data: {entries: data},
               success: resolve,
               error: reject});
    });
  }

  function resetError() {
    $("#irods-meta-error").empty();
  }
  
  function handleError(response) {
    $("#irods-meta-error").html(
      "status: " + response.status + " (" + response.statusText + ")");
  }

  function refresh(data) {
    $("#irods-meta-data").text(JSON.stringify(data.meta, null, 2));
  }

  function getData() {
    var text = $("#irods-meta-data").text();
    return JSON.parse(text);
  }

  function getPath() {
    var path = $("#irods-meta-test-path").val();
    if(!path.startsWith("/"))
    {
      path = "/" + path;
    }
    return path;
  }

  $("#irods-meta-test-button-get").on('click', function(event) {
    var path = getPath();
    var url = OC.generateUrl(baseurl + path);
    resetError();
    ajax(url, 'GET')
      .then(refresh)
      .catch(handleError);
   });

  $("#irods-meta-test-button-put").on('click', function(event) {
    var path = getPath();
    var url = OC.generateUrl(baseurl + path);
    resetError();
    var data = getData();
    ajax(url, 'PUT', data)
      .then(refresh)
      .catch(handleError);
   });
  $("#irods-meta-test-button-patch").on('click', function(event) {
    var path = getPath();
    var url = OC.generateUrl(baseurl + path);
    resetError();
    ajax(url, 'PATCH')
      .then(refresh)
      .catch(handleError);
   });
  $("#irods-meta-test-button-delete").on('click', function(event) {
    var path = getPath();
    var url = OC.generateUrl(baseurl + path);
    resetError();
    ajax(url, 'DELETE')
      .then(refresh)
      .catch(handleError);
   });
});
