//groupIdからgroupNameを取得
function getGroupName(groupId) {
  try {
    var options = {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${channelAccessToken}`,
      },
    };
    var response = UrlFetchApp.fetch(`https://api.line.me/v2/bot/group/${groupId}/summary`, options);
    var responseObj = JSON.parse(response.getContentText());
    return responseObj.groupName;
  } catch (ex) {
    return "";//分からなければ空文字列を返す（★ブロックされている場合やプライバシーポリシーに未同意の場合）
  }
}


//userIdからLINE表示氏名を取得
function getDisplayName(userId) {
  try {
    var options = {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${channelAccessToken}`,
      },
    };
    var response = UrlFetchApp.fetch(`https://api.line.me/v2/bot/profile/${userId}`, options);
    var responseObj = JSON.parse(response.getContentText());
    return responseObj.displayName;
  } catch (ex) {
    return "";//分からなければ空文字列を返す（★ブロックされている場合やプライバシーポリシーに未同意の場合）
  }
}


//botフォロワー数・ブロック数を取得
//集計が「翌日中に完了」なので２日前の日付を指定する。
function getFBNum() {

  var followS = 0;
  var blockS = 0;

  var today_2 = new Date(today);//この行はなんか必要らしい
  today_2.setDate(today.getDate() - 2);//おとといにする
  today_2 = Utilities.formatDate(today_2, "JST", "yyyyMMdd")

  try {
    var options = {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${channelAccessToken}`,
      },
    };
    var response = UrlFetchApp.fetch(`https://api.line.me/v2/bot/insight/followers?date=${today_2}`, options);
    var responseObj = JSON.parse(response.getContentText());

    followS = responseObj.followers;
    blockS = responseObj.blocks;
    Logger.log(today_2 + " followS/blockS " + followS + "/" + blockS);
    return { followS, blockS };

  } catch (ex) {
    followS = -10;
    blockS = 0;
    Logger.log("getFBNum exception");
    return { followS, blockS };//分からなければ-10,0を返す

  }

}
