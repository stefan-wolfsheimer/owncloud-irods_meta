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

   if (!OCA.IRODS_POPUP)
   {
     OCA.IRODS_POPUP = {
       template_html: '',

       attach: function(fileList) {
         fileList.fileActions.registerAction({
           name: 'irods_metadata',
           displayName: 'Metadata',
           mime: 'all',
           permissions: OC.PERMISSION_READ,
           icon: OC.imagePath('files_irods', 'eye'),
           actionHandler: iRodsMetaDataView
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
       },

       load: function() {
         const TEMPLATE = <div className="detailFileInfoContainer">
                            <div className="mainFileInfoView">
                              <App/>
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
