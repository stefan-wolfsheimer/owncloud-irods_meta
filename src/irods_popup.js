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

   function isIrodsData(attributes, mp) {
     var path = attributes.getNamedItem('data-path');
     if(!path)
     {
       return false;
     }
     var arr = path.value.split('/');
     var file = attributes.getNamedItem('data-file');
     if(!file)
     {
       return false;
     }
     arr.push(file.value);
     if(arr.length >= 3)
     {
       return (mp.indexOf('/' + arr[1]) != -1);
     }
     else
     {
       return false;
     }
   }

   if (!OCA.IRODS_POPUP)
   {
     OCA.IRODS_POPUP = {
       template_html: '',

       attach: function(fileList) {
         var url = OC.generateUrl('/apps/files_irods/api/mountpoints');
         $.getJSON(url)
           .done(function(data) {
             fileList.fileActions.registerAction({
               name: 'irods_metadata',
               displayName: 'Metadata',
               mime: 'all',
               permissions: OC.PERMISSION_READ,
               icon: OC.imagePath('files_irods', 'eye'),
               actionHandler: iRodsMetaDataView
             });
             fileList.fileActions.addAdvancedFilter(function(actions, context) {
               if(!isIrodsData(context.$file[0].attributes,
                               data['mount_points']))
               {
                 delete actions['irods_metadata'];
               }
               return actions;
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
                              <App url_schema={OC.generateUrl('/apps/irods_meta/api/schema')}
                                   url_data={OC.generateUrl('/apps/irods_meta/api/meta/' + this.path)} />
                            </div>
                            <a className="close icon-close" href="#" alt="Close"/>
                          </div>;
         ReactDOM.render(TEMPLATE, this.$el[0]);
       },

       _onClose: function(event) {
         OC.Apps.hideAppSidebar(this.$el);
         event.preventDefault();
       },
     });
   }
})();

OC.Plugins.register('OCA.Files.FileList', OCA.IRODS_POPUP);
