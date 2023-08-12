//特定の★グループトークにプッシュメッセージ
function pushToGroup() {

  var text = `ご無沙汰しています。浦野です。
新システムの入口みたいなbotを作りましたので、私「笠間店スタッフ用bot」を友達に追加お願いします。
（システム自体も試験段階につき強制ではありません）
詳細は友達追加すればあいさつ文で見れますが、しなくても以下から見れます。
https://docs.google.com/document/d/19QqDWvmsijty6YQT8pOHgZtVkd0FY-uWVSeOOVSAYs4/edit
`;

  var groupId = "Cb8d44d7fdf524dc3dcdece2b3422cbbe";//★これはテストグループ。本番は入れ替える

  textAry = [text];
  var pushUrl = "https://api.line.me/v2/bot/message/push";//単独プッシュ
  var msgAry = [];
  for (let n = 0; n <= textAry.length - 1; n++) {
    msgAry[n] = { type: 'text', text: textAry[n] };
  }
  let postData = {
    "to": groupId,
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

//フォロワー全員にプッシュメッセージ
//メンテ通知などに使う？
function pushToAllFollowers() {

  var text = "てｓ";

  textAry = [text];
  var pushUrl = "https://api.line.me/v2/bot/message/broadcast";//ブロードキャスト
  var msgAry = [];
  for (let n = 0; n <= textAry.length - 1; n++) {
    msgAry[n] = { type: 'text', text: textAry[n] };
  }
  let postData = {
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


//メールの件名と内容を統合してプッシュ通知
function pushSB(subject, body) {
  var text = "※自動プッシュ配信\n件名：" + subject + "\n内容：\n" + body;

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

  var pushUrl = "https://api.line.me/v2/bot/message/multicast";//マルチキャスト

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
