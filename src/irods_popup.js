import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';

(function()
 {
   function iRodsMetaDataView(file, context) {
     if(typeof context.fileList._irodsMetaView == 'undefined') {
       let view = new OCA.IRODS_POPUP.View();
       view.$el.insertBefore(context.fileList.$el);
       context.fileList._irodsMetaView = view;
     }
     OC.Apps.showAppSidebar(context.fileList._irodsMetaView.$el);
     context.fileList._irodsMetaView.setPath(context);
     context.fileList._irodsMetaView.load();
   }

   function checkFile(fullPath, dataType, mp) {
     if(mp.mount_point_config) {
       let suffix = fullPath.slice(mp.name.length);
       let depth = suffix.split('/').length - (dataType == "file" ? 1 : 0);
       let cfg = mp.mount_point_config;
       if(dataType == "file") {
         if((cfg.object_edit_meta_data || cfg.collection_read_meta_data) && ((cfg.sub_collection_edit_meta_data || cfg.sub_collection_read_meta_data) || depth < 2)) {
           return true;
         }
       }
       else if(dataType == "dir") {
         if((cfg.collection_edit_meta_data || cfg.collection_read_meta_data) && ((cfg.sub_collection_edit_meta_data || cfg.sub_collection_read_meta_data) || depth < 2)) {
           return true;
         }
       }
     }
     return false;
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
         ret = checkFile(fullPath, dataType, mp);
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
               icon: OC.imagePath('files_irods', 'eye'),
               actionHandler: iRodsMetaDataView
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

       setPath: function(context) {
         this.path = context.dir;
         if(this.path != '/') {
           this.path += '/' + context.fileInfoModel.attributes.name;
         }
         else {
           this.path = '';
         }
         this.apiUrl = OC.generateUrl('/apps/files_irods/api/meta' + this.path);
         if(context.fileInfoModel.isDirectory()) {
           this.iconurl = OC.MimeType.getIconUrl('dir');
         }
         else {
           this.iconurl = OC.MimeType.getIconUrl(context.fileInfoModel.get('mimetype'));
         }
       },

       load: function() {
         const TEMPLATE = <div className="detailFileInfoContainer">
                            <div className="mainFileInfoView">
                              <App url_schema={OC.generateUrl('/apps/irods_meta/api/schema/' + this.path)}
                                   url_data={OC.generateUrl('/apps/irods_meta/api/meta/' + this.path)}
                                   url_submit={OC.generateUrl('/apps/irods_meta/api/submit/' + this.path)} />
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
