var util = require('./util.js');
var cons = require('../constants.js');
Parse.Cloud.define("app", function(request, response) {
                   
                   
                   
                   
                   
                   
                   /*
                   var appId = request.headers['app-id']
                   var userId = request.params.userId;
                   var phoneNos = request.params.phoneNos;
                   
                   var User = Parse.Object.extend("_User");
                   var user = new User();
                   user.id = userId;
                
                   var app = new(Parse.Object.extend("Admin_App"))
                   app.id = appId;
                   var query = new Parse.Query("_User");
                   query.equalTo("app",app)
                   query.notEqualTo("objectId",userId)
                   */
                   
                   //response.send(JSON.stringify(request.body, null, 4));
                   
                   

                   //var actionType = request.object.get("objectId1").id;

    var objectId = request.params.adminId;
                   
                   //console.log('*** Cloud function\'s request = ', objectId , request.params );
                   debugger;

    var query = new Parse.Query("Admin_App")
                   
//                   var userId = request.params.userId;
//                   var addedBy = request.params.addedBy;
                   //var user = new(Parse.Object.extend("_User"))
                   //user.id = objectId;
                   
                   //var unitPointer = {"__type":"Pointer","className":"_User","id":"UFMT2jo906"};
                   
                   var unitPointer = {"__type":"Pointer","className":"_User","objectId":objectId};


                  // query.include("user")
                   //query.equalTo("addedBy",user)
                   
                    query.include("_User")
                   query.equalTo("addedBy", unitPointer);

    query.ascending("name");
    query.exists("name")
    query.limit(1000);
                   /* //edit
    if (objectId) {
                   var user = new(Parse.Object.extend("_User"))
                   user.id = objectId
                   
        var object = new(Parse.Object.extend("Admin_App"))
        object.addedBy = user
        util.fetch(object, response)
    } else {
          */
        util.find(query, response)
    //}
});



Parse.Cloud.define("addApp", function(request, response) {
                   
                   //response.error(request)
                   //var superAdminId = request.params.superAdminId;

    var name = request.params.name;
    var defaultType = request.params.defaultType;
    var fileName = request.params.fileName;
    var appVersion = request.params.appVersion;
    var companyName = request.params.companyName;
    var addedBy = request.params.addedBy;
    var facebookAccessToken = request.params.facebookAccessToken;
    var facebookPostPath = request.params.facebookPostPath;
    var media = undefined
                   
//                   if (!superAdminId) {
//                   response.error("please supply the superAdminId")
//                   }
    if (!name) {
        response.error("please supply the name")
    }else if (!defaultType) {
        response.error("please supply the defaultType")
    }else{
        var object = new(Parse.Object.extend("Admin_App"))
        object.set("name", name)
        object.set("defaultType", defaultType)
        if(fileName){
            var url = cons.FILE_URL + "/" + fileName
            media = new Parse.File()
            media['_name'] = fileName
            media['_url'] = url
            object.set("icon", media)
        }
                   
                   if(addedBy){
                   var user = new(Parse.Object.extend("_User"))
                   user.id = addedBy;
                   object.set("addedBy",user)
                   }

        if(facebookAccessToken)
            object.set("facebookAccessToken", facebookAccessToken)
        if(facebookPostPath)
            object.set("facebookPostPath", facebookPostPath)
        if(appVersion)
            object.set("appVersion", appVersion)
        if(companyName)
            object.set("companyName", companyName)
                   
//                   if(addedBy)
//                   object.set("addedBy", addedBy)
                   
                   //alert(object)
                   //console.log(object)
            
        util.save(object, response)
    }
});
Parse.Cloud.define("updateApp", function(request, response) {
    var objectId = request.params.objectId;
    var name = request.params.name;
    var defaultType = request.params.defaultType;
    var fileName = request.params.fileName;
    var appVersion = request.params.appVersion;
    var companyName = request.params.companyName;
                   
                   var addedBy = request.params.addedBy;

    var facebookAccessToken = request.params.facebookAccessToken;
    var facebookPostPath = request.params.facebookPostPath;
    var media = undefined

    if (!objectId) {
        response.error("please supply the objectId")
    }
    else {
        var object = new(Parse.Object.extend("Admin_App"))
        object.id = objectId
        object.fetch().then(function(object) {
            if (name)
                object.set("name", name)
            if(defaultType)
                object.set("defaultType", defaultType)
            if (fileName) {
                var url = cons.FILE_URL + "/" + fileName
                media = new Parse.File()
                media['_name'] = fileName
                media['_url'] = url
                object.set("icon", media)
            }
                            
//                            if(addedBy){
//                            var user = new(Parse.Object.extend("_User"))
//                            user.id = addedBy;
//                            object.set("addedBy",user)
//                            }

            if(facebookAccessToken || !(facebookAccessToken === object.get("facebookAccessToken")))
                object.set("facebookAccessToken", facebookAccessToken)
            if(facebookPostPath || !(facebookPostPath === object.get("facebookPostPath")))
                object.set("facebookPostPath", facebookPostPath)
            if(appVersion || !(appVersion === object.get("appVersion")))
                object.set("appVersion", appVersion)
            if(companyName || !(companyName === object.get("companyName")))
                object.set("companyName", companyName)
                            
                            if(addedBy || !(addedBy === object.get("addedBy")))
                            object.set("addedBy", addedBy)
                            
            util.save(object, response)
        }, function(error) {
            response.error(error)
        }); 
    } 
});
Parse.Cloud.define("deleteApp", function(request, response) {
    var objectId = request.params.objectId;
    if (objectId) {
        var object = new(Parse.Object.extend("Admin_App"))
        object.id = objectId
        util.fetchAndDestroy(object, response)
    } else {
        response.error("please supply the objectId");
    }
});
