function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('form.html');
}

/* 時辰表列表 */
function getItemList(){

  try{
    var result = [];
    
    // 時辰表檔案
    var dateUrl = "https://docs.google.com/spreadsheets/d/1YbvSgFX2Nei88p3_r4FBmTW-yBcYlql4CCaiYD75s_E/edit#gid=0";
    var dateSheet = SpreadsheetApp.openByUrl(dateUrl);
    var dateTable = dateSheet.getSheetByName("工作表1");
    var dateGroup = dateTable.getRange(1, 1, 50, 4).getValues().filter(function(x){
      return x[3] == "v";
    });
    
    dateGroup.sort(function (a, b) {
      return a[2] - b[2];
    });
    
    dateGroup.forEach(function(item){
      result.push(item[0]);
    });
    
    if(result.length != 0){
      return {isOk: true, data: result};
    }
    else{
      return {isOk: false, data: "現在沒有作業需要上傳！"};
    }
  }
  catch(error){
    writeLog("","",error.toString(),"失敗"); 
    return {isOk: false, data: error.toString()};
  }
  
}

/* Log檔 */
function writeLog(time,id,description,status){
  
  var data = [];
  
  data.push(time);
  data.push(id);
  data.push(description);
  data.push(status);
  
  // 驗證碼檔案
  var logUrl = 'https://docs.google.com/spreadsheets/d/1v5z2Q3eyLSo1SnrokZqvhi4lIxL45heUZQbX-XqpsX0/edit#gid=0'
  var logSheet = SpreadsheetApp.openByUrl(logUrl);
  var logTable = logSheet.getSheetByName("工作表1");
  
  var LastRow = logTable.getLastRow();
  
  data.forEach(function(item,index){
    logTable.getRange(LastRow+1, index+1).setValue(item);
  });

}

/* 統整檔 */
function writeComplete(id,task,message){
  
  // 驗證碼檔案
  var url = 'https://docs.google.com/spreadsheets/d/1F-Sz0HmNsLkSI3daJzIPqzehGmCRshzf9tjDJe6hUGo/edit#gid=0'
  var sheet = SpreadsheetApp.openByUrl(url);
  var dataTable = sheet.getSheetByName("工作表1");
  
  var dataGroup = dataTable.getRange(1, 1, 28, 50).getValues();
  
  // 判斷是否有該作業項目標籤
  var checkResult = false;
  var checkColumeIndex = 49; //指表格Colume，並非陣列index
  dataGroup[0].forEach(function(item,index){
    if(item == task){
      checkResult = true;
      checkColumeIndex = index+1;
  }})
  
  if(!checkResult){
    var LastColumn = dataTable.getLastColumn();
    // 寫進作業項目標籤
    dataTable.getRange(1, LastColumn+1).setValue(task);
    checkColumeIndex = LastColumn+1;
  }
  
  // 取得學生列數
  var checkRowIndex = 49;
  var userData = dataGroup.forEach(function(item,index){
    if(item[0] == id){
      checkRowIndex = index+1;
    }
  });
  
  // 寫進訊息
  dataTable.getRange(checkRowIndex, checkColumeIndex).setValue(message);
  
}


/* 驗證 */
function auth(id,pw){
  
  // 驗證碼檔案
  var pwUrl = 'https://docs.google.com/spreadsheets/d/1XHY-aWsop519Pr2rFHK0D7-g_yciA4Vfwkg3aDWm9OM/edit#gid=0'
  var pwSheet = SpreadsheetApp.openByUrl(pwUrl);
  var pwTable = pwSheet.getSheetByName("工作表1");

  var pwGroup = pwTable.getRange(1, 1, 29, 2).getValues().filter(function(x){
   return x[0] == id;
  });

  if(pwGroup[0]){
    
    if(pw == pwGroup[0][1]){
      return {status: true ,message: "登入成功！"};
    }
    else{
      return {status: false ,message: "驗證碼錯誤！"};
    }
    
  }
  else{
    return {status: false ,message: "學號錯誤！"};
  }
  
}

/* 遲交確認 */
function timeCheck(task){

  var nowTime = new Date();
  
  // 時辰表檔案
  var dateUrl = "https://docs.google.com/spreadsheets/d/1YbvSgFX2Nei88p3_r4FBmTW-yBcYlql4CCaiYD75s_E/edit#gid=0";
  var dateSheet = SpreadsheetApp.openByUrl(dateUrl);
  var dateTable = dateSheet.getSheetByName("工作表1");
  
  var dateGroup = dateTable.getRange(1, 1, 18, 4).getValues().filter(function(x){
   return x[0] == task;
  });
  
  if(dateGroup[0]){
    var onTime = dateGroup[0][1];
    
    if( nowTime <= new Date(onTime) ){
      return {status: true, message: "準時繳交", count: 0};
    }
    else if( nowTime <= new Date(onTime).setDate(new Date(onTime).getDate() + 1) ){
      return {status: true, message: "遲交1天", count: 1};
    }
    else if( nowTime <= new Date(onTime).setDate(new Date(onTime).getDate() + 2) ){
      return {status: true, message: "遲交2天", count: 2};
    }
    else if( nowTime <= new Date(onTime).setDate(new Date(onTime).getDate() + 3) ){
      return {status: true, message: "遲交3天", count: 3};
    }
    else if( nowTime <= new Date(onTime).setDate(new Date(onTime).getDate() + 4) ){
      return {status: true, message: "遲交4天", count: 4};
    }
    else{
      return {status: true, message: "遲交5天或以上", count: 5};
    } 
  }
  else{
    return {status: false ,message: "未設定作業截止日期，請通知助教！", count: 0};
  }
}


function uploadFiles(form) {
  
  try {
    
    Logger.log(form);
    
    // 現在時間
    var nowTime = new Date();
    
    if(!form.myId){
      return "請輸入學號!";
    }
    if(!form.myPw){
      return "請輸入驗證碼!";
    }
    
    var id = form.myId.trim().toUpperCase();
    var pw = form.myPw.trim().toLowerCase();

    // 驗證碼驗證
    var authResult = auth(id,pw);
    
    writeLog(nowTime.toLocaleString(),id,authResult.message, (authResult.status?"":"失敗"));        
    // Logger.log(id + "，" +authResult.message);
    
    if(!authResult.status){
      return authResult.message;
    }
    
    var task = form.select;
    
    var newFolder = 'CGUIM/TA/程式設計(一)/108年度/108-1/作業/' + task + '/';
    
    // 遲交確認
    var timeResult = timeCheck(task);
    
    if(!timeResult.status){
      writeLog(nowTime.toLocaleString(),id,timeResult.message, (authResult.status?"":"失敗")); 
      // Logger.log(task + "，" + timeResult.message);
      return task + "，" +timeResult.message;
    }
    else{
      newFolder = newFolder + timeResult.message + '/' + id;
    }
    
    
    var paths = newFolder.split("/");
    var folders = DriveApp.getRootFolder();
    var foldersList = DriveApp.getRootFolder().getFolders();
    var folder;
    
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
    
    var blob1 = form.myFile;
    var file1 = folders.createFile(blob1);    
    file1.setDescription( "上傳者：" + id + "，上傳時間：" + nowTime.toLocaleString());
    
    writeLog(nowTime.toLocaleString(),id,"繳交"+task+"，"+timeResult.message, (authResult.status?"":"失敗"));
    writeComplete(id,task,timeResult.message);
    // Logger.log(id + "，繳交" + task + "，" + timeResult.message + "，上傳成功！");
    return id + "，繳交" + task + "，" + timeResult.message + "，上傳成功！";

  } catch (error) {
    writeLog("","",error.toString(),"失敗"); 
    // Logger.log(error.toString());
    return "錯誤訊息："+error.toString();
  }
  
}