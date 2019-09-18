function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}


/* 驗證 */
function auth(id,pw){
  
  Logger.log(id+"，正在嘗試登入！");
  
  var pwUrl = 'https://docs.google.com/spreadsheets/d/1XHY-aWsop519Pr2rFHK0D7-g_yciA4Vfwkg3aDWm9OM/edit#gid=0'
  var pwSheet = SpreadsheetApp.openByUrl(pwUrl);
  var pwTable = pwSheet.getSheetByName("工作表1");

  var pwGroup = pwTable.getRange(1, 1, 26, 2).getValues().filter(function(x){
   return x[0] == id;
  });

  if(pwGroup[0]){
    
    if(pw == pwGroup[0][1]){
      Logger.log("登入成功！");
      return {status: true ,message: "登入成功！"};
    }
    else{
      Logger.log("驗證碼錯誤！");
      return {status: false ,message: "驗證碼錯誤！"};
    }
    
  }
  else{
    
    Logger.log("學號錯誤！");
    return {status: false ,message: "學號錯誤！"};
    
  }
  
}


function uploadFiles(form) {
  
  try {

    if(!form.myId){
      return "請輸入學號!";
    }
    if(!form.myPw){
      return "請輸入驗證碼!";
    }
    
    // 驗證碼驗證
    var authResult = auth(form.myId,form.myPw);
    if(!authResult.status){
      return authResult.message;
    }
    
    var newFolder = 'CGUIM/TA/程式設計(一)/108年度/108-1/作業/作業三/' + form.myId;
    var paths = newFolder.split("/");
    var folders = DriveApp.getRootFolder();
    var foldersList = DriveApp.getRootFolder().getFolders();
    var folder;
    var folderList;
      
      for(path in paths){
        var hasFolder = false;
        while(!hasFolder && foldersList.hasNext()){
          folder = foldersList.next();    
          if(paths[path] == folder.getName()){
            hasFolder = true;
          }
          if(hasFolder){
            folders = folder;
            foldersList = folder.getFolders();
          } 
        } 
        if(!hasFolder){
          folders = folders.createFolder(paths[path]);
          foldersList = folders.getFolders();
        }
      }
      
      var blob1 = form.myFile1;
      var file1 = folders.createFile(blob1);    
      file1.setDescription("上傳者： " + form.myId);
      
      
      return "檔案上傳成功！ 共上傳了 "  + 1 + " 個檔案";

  } catch (error) {
    Logger.log(error.toString());
    return error.toString();
  }
  
}