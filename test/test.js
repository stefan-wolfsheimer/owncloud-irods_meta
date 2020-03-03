let check_meta_collections = require('../src/check_meta_collections');
let checkMetaPermissions = check_meta_collections.checkMetaPermissions;
let getDirectoryLevel = check_meta_collections.getDirectoryLevel;
let assert = require('chai').assert



let mount_point_1 = {
  name: "/ResearchData/",
  type: "Collection",
  path: "{HOME}",
  if_group: "researcher",
  mount_point_config: {
    acl: {
      collection: {
        view: { level: ["2:"], group: ["*"] }, 
        edit: { level: ["1:3"], group: ["researcher"] },
        submit: { level: ["1"], group: ["researcher"] }
      },
      object: {
        view: { level: ["1:"], group: ["steward"] },
        edit: false,
        submit: false
      },
    }
  }
};

let mount_point_2 = {
  name: "/ResearchData/Archive",
  type: "Collection",
  if_group: "researcher",
  mount_point_config: {
    acl: {
      collection: {
        view: { level: ["2"], group: ["*"] }, 
        edit: false,
        submit: false
      },
      object: {
        view: false,
        edit: false,
        submit: false
      },
    }
  }
};


describe('checkDirectoryLevel', function() {
  describe('check level outside mountpoint', function() {
    assert.equal(getDirectoryLevel("/mypath", mount_point_1), -1);
  });
  describe('check level /ResearchData', function() {
    assert.equal(getDirectoryLevel("/ResearchData/", mount_point_1), 0);
    assert.equal(getDirectoryLevel("/ResearchData", mount_point_1), 0);
    assert.equal(getDirectoryLevel("/ResearchData/path", mount_point_1), 1);
    assert.equal(getDirectoryLevel("/ResearchData/path/level/3", mount_point_1), 3);
    assert.equal(getDirectoryLevel("/ResearchData/path/level/3/", mount_point_1), 3);
  });
  describe('check level /ResearchData/Archive', function() {
    assert.equal(getDirectoryLevel("/ResearchData/Archive", mount_point_2), 0);
    assert.equal(getDirectoryLevel("/ResearchData/Archive/", mount_point_2), 0);
    assert.equal(getDirectoryLevel("/ResearchData/Archive/path", mount_point_2), 1);
    assert.equal(getDirectoryLevel("/ResearchData/Archive/path/level/3", mount_point_2), 3);
    assert.equal(getDirectoryLevel("/ResearchData/Archive/path/level/3/", mount_point_2), 3);
  });

});

describe('checkMetaPermissions', function() {
  describe('config 1()', function() {
    it('root directory should not be editable', function() {
      assert.isFalse(checkMetaPermissions("/ResearchData/", "dir", ["researchers"], mount_point_1));         // level 0
    });
    it('collections in level 1 through 3 should be editable for researchers', function() {
      assert.equal(checkMetaPermissions("/ResearchData/abc", "dir", ["researcher"], mount_point_1), "rws"); // level 1
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/", "dir", ["researcher"], mount_point_1), "rw"); // level 2
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/ghi", "dir", ["researcher"], mount_point_1), "rw"); // level 3
    });
    it('collections in level > 4 should not be editable for researchers', function() {
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/ghi/jkl", "dir", ["researchers"], mount_point_1), "r"); // level 4
    });
    it('collections in level 1 through 3 should not be editable for stewards', function() {
      assert.isFalse(checkMetaPermissions("/ResearchData/abc", "dir", ["steward"], mount_point_1));
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/", "dir", ["steward"], mount_point_1), "r");
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/ghi/", "dir", ["steward"], mount_point_1), "r");
      assert.equal(checkMetaPermissions("/ResearchData/abc/def/ghi/jkl", "dir", ["researcher"], mount_point_1), "r");
    });
  });
});
