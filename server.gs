function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

function uploadFiles(form) {
  
  try {

    if(!form.myId){
      return "請輸入學號!";
    }
    else{
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
    }
  } catch (error) {
    return error.toString();
  }
  
}