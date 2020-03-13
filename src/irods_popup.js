import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import check_meta_collections from './check_meta_collections';

(function()
 {
   function iRodsMetaDataView(file, context, mountPoints) {
     if(typeof context.fileList._irodsMetaView == 'undefined') {
       let view = new OCA.IRODS_POPUP.View();
       view.$el.insertBefore(context.fileList.$el);
       context.fileList._irodsMetaView = view;
     }
     OC.Apps.showAppSidebar(context.fileList._irodsMetaView.$el);
     let path = (context.dir == '/' ? '' : context.dir + '/' + context.fileInfoModel.attributes.name);
     let iconurl = context.fileInfoModel.isDirectory() ?
       OC.MimeType.getIconUrl('dir-external') :
       OC.MimeType.getIconUrl(context.fileInfoModel.get('mimetype'));
     context.fileList._irodsMetaView.setIconUrl(iconurl);
     context.fileList._irodsMetaView.setPath(path);
     let cansubmit = false;
     for(let i=0; i < mountPoints.length; i++) {
       let mp = mountPoints[i];
       if(path.startsWith(mp.name)) {
         cansubmit = check_meta_collections.checkMetaPermissions(path,
                                                                 (context.fileInfoModel.isDirectory() ? 'dir' : 'file'),
                                                                 mp.groups,
                                                                 mp);
         cansubmit = (cansubmit.indexOf("s") != -1);
         break;
       }
     }
     context.fileList._irodsMetaView.enableSubmit(cansubmit);
     context.fileList._irodsMetaView.load();
   }

   function fileListFilter(actions, attributes, mountPoints) {
     let ret = false;
     let path = attributes.getNamedItem('data-path');
     let file = attributes.getNamedItem('data-file');
     let dataType = attributes.getNamedItem('data-type');
     if(!path || !file || !dataType) {
       return false;
     }
     dataType = dataType.value;
     let fullPath = path.value + "/" + file.value;
     for(let i=0; i < mountPoints.length; i++) {
       let mp = mountPoints[i];
       if(fullPath.startsWith(mp.name)) {
         let c = check_meta_collections.checkMetaPermissions(fullPath, dataType, mp.groups, mp);
         ret = c ? true : false;
         break;
       }
     }
     if(!ret) {
       delete actions['irods_metadata'];
     }
     return actions;
   }

   if (!OCA.IRODS_POPUP) {
     OCA.IRODS_POPUP = {
       template_html: '',

       attach: function(fileList) {
         var url = OC.generateUrl('/apps/files_irods/api/mountpoints');
         $.getJSON(url)
           .done(function(data) {
             let mountPoints = data.mount_points;
             fileList.fileActions.registerAction({
               name: 'irods_metadata',
               displayName: 'Metadata',
               mime: 'all',
               permissions: OC.PERMISSION_READ,
               icon: OC.imagePath('irods_meta', 'eye'),
               actionHandler: (file, context) =>{ iRodsMetaDataView(file, context, mountPoints); }
             });
             fileList.fileActions.addAdvancedFilter(function(actions, context) {
               return fileListFilter(actions, context.$file[0].attributes, mountPoints);
             });
           });
       }
     };

     /////////////////////////////////////////////////////////////
     // View
     /////////////////////////////////////////////////////////////
     OCA.IRODS_POPUP.View =  OC.Backbone.View.extend({
       id: 'app-sidebar',
       tabName: 'div',
       className: 'detailsView scroll-container',
       events: { 'click a.close': '_onClose' },

       setIconUrl: function(iconurl) {
         this.iconurl = iconurl;
       },

       setPath: function(path) {
         this.path = path;
         this.encodedPath = OC.encodePath(path);
       },


       enableSubmit: function(enable) {
         this.submitEnabled = enable;
       },

       load: function() {
         let url_submit = this.submitEnabled ? OC.generateUrl('/apps/irods_meta/api/submit' + this.encodedPath) : null;
         let name = this.path.substring(this.path.lastIndexOf('/') + 1);
         const divStyle = {
          backgroundImage: 'url("' + this.iconurl + '")',
         };

         const TEMPLATE = <div className="detailFileInfoContainer">
                           <div className="mainFileInfoView">
                            <div className="thumbnailContainer">
                             <a href= {OC.generateUrl('/apps/files/?dir=' + this.encodedPath)} className="thumbnail action-default" style={divStyle}>
                              <div className="stretcher"></div>
                             </a>
                            </div>
                            <div className="file-details-container">
                             <div className="fileName">
                              <h3 title={name} className="ellipsis">{name}</h3>
                             </div>
                            </div>
                           <div className="mainFileInfoView">
                            <div className="tabsContainer">
                             <App url_schema={OC.generateUrl('/apps/irods_meta/api/schema' + this.encodedPath)}
                                 url_data={OC.generateUrl('/apps/irods_meta/api/meta' + this.encodedPath)}
                                 url_submit={url_submit} />
                            </div>
                           </div>
                          </div>
                            <a className="close icon-close" href="#" alt="Close"/>
                         </div>;
         ReactDOM.unmountComponentAtNode(this.$el[0]);
         ReactDOM.render(TEMPLATE, this.$el[0]);
       },

       _onClose: function(event) {
         ReactDOM.unmountComponentAtNode(this.$el[0]);
         OC.Apps.hideAppSidebar(this.$el);
         event.preventDefault();
       },
     });
   }
})();

OC.Plugins.register('OCA.Files.FileList', OCA.IRODS_POPUP);
