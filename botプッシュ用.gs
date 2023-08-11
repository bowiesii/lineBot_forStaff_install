//メールの件名と内容を統合してプッシュ通知
function pushSB(subject, body) {
  var text = "〇自動プッシュ配信です。";
  text = text + "\n件名：" + subject + "\n内容：\n" + body;

  pushToUsers([text]);
}

//プッシュ登録済みのユーザーにプッシュ通知する（★textAryは配列）
function pushToUsers(textAry) {
  var pushSheet = bbsLib.getSheetByIdGid(id_bbLog, gid_botPush);

  if (pushSheet.getLastRow() >= 2) {//これしないとエラーになる
    var userAry1 = pushSheet.getRange(2, 2, pushSheet.getLastRow() - 1, 1).getDisplayValues();//二次元
    var userAry2 = [];
    for (let row = 0; row <= userAry1.length - 1; row++) {//一次元に変換
      userAry2[row] = userAry1[row][0];
    }

    push(userAry2, textAry);
  }
}

//複数のユーザーにプッシュ通知する（★textAryは配列）
//userAry="U4af4980629..."にたいなuserIdの★配列※最大５００人らしい。
function push(userAry, textAry) {

  var pushUrl = "https://api.line.me/v2/bot/message/multicast";

  var msgAry = [];
  for (let n = 0; n <= textAry.length - 1; n++) {
    msgAry[n] = { type: 'text', text: textAry[n] };
  }

  let postData = {
    "to": userAry,
    "messages": msgAry
  };

  let headers = {
    "Content-Type": "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + channelAccessToken,
  };

  let options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)//送るデータをJSONに変換
  };

  return UrlFetchApp.fetch(pushUrl, options);
}
