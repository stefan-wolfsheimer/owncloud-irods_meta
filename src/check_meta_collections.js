
function findConfig(path, mountPoints) {
  if(!path.endsWith('/'))
  {
    path = path + '/';
  }
  var filteredMountPoints = mountPoints.filter(mp => path.startsWith(mp.name)).sort((mp1, mp2) =>
                                                                                    {
                                                                                      if(mp1.name > mp2.name) return -1;
                                                                                      else if(mp1.name < mp2.name) return 1;
                                                                                      else return 0;
                                                                                    });
  console.log(path);
  console.log(mountPoints);
  console.log(filteredMountPoints);
  for(let i = 0; i < filteredMountPoints.length; i++) {
    return filteredMountPoints[i];
  }
  return null;
}

function getDirectoryLevel(fullPath, mp) {
  let root = mp.name.replace(/\/+$/g, "") + "/";
  let fp = fullPath.replace(/\/+$/g, "/") + "/";
  if(fp.startsWith(root)) {
    fp = fp.substring(root.length).replace(/^\/+/g, "").replace(/\/+$/g, "/");
    return fp.split('/').length - 1;
  }
  else {
    return -1;
  }
}

function checkPermissionHelper(level, groups, config) {
  if(!config) {
    return false;
  }
  if(typeof(config.level) != "undefined") {
    for(let i = 0; i < config.level.length; i++) {
      let inrange = true;
      let range = config.level[i].split(':');
      if(range.length == 1) {
        // exactly one level
        inrange &= (level == parseInt(range));
      }
      else {
        if(range[0] != "") {
          inrange &= (level >= parseInt(range[0]));
        }
        if(range[1] != "") {
          inrange &= (level <= parseInt(range[1]));
        }
      }
      if(!inrange) {
        return false;
      }
    }
  }
  if(typeof(config.group) != "undefined") {
    for(let i = 0; i < config.group.length; i++) {
      let group = config.group[i];
      if(group == "*" || groups.indexOf(group) != -1) {
        return true;
      }
    }
  }
  return false;
}

function checkMetaPermissions(fullPath, dataType, groups, mp) {
  if(mp.mount_point_config && mp.mount_point_config.acl) {
    let acl = mp.mount_point_config.acl;
    let edit_meta;
    let view_meta;
    let details = false;
    if(dataType == "dir") {
      details = acl.collection;
    }
    else {
      details = acl.object;
    }
    if(!details) {
      return false;
    } 
    let level = getDirectoryLevel(fullPath, mp);
    let ret = "";
    if(checkPermissionHelper(level, groups, details.edit)) {
      ret = "rw";
    }
    else if(checkPermissionHelper(level, groups, details.view)) {
      ret = "r";
    }
    if(checkPermissionHelper(level, groups, details.submit)) {
      ret = ret + "s";
    }
    if(ret === "") {
      return false;
    }
    else {
      return ret;
    }
  }
  return false;
}


exports.checkMetaPermissions = checkMetaPermissions;
exports.getDirectoryLevel = getDirectoryLevel;
exports.findConfig = findConfig;
