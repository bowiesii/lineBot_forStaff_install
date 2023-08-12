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
function getFBNum() {

  var followS = 0;
  var blockS = 0;

  try {
    var options = {
      "method": "GET",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${channelAccessToken}`,
      },
    };
    var response = UrlFetchApp.fetch(`https://api.line.me/v2/bot/insight/followers?date=${today_forApi}`, options);
    var responseObj = JSON.parse(response.getContentText());

    followS = responseObj.followers;
    blockS = responseObj.blocks;

    return { followS, blockS };

  } catch (ex) {

    Logger.log("getFBNum exception");
    return { followS, blockS };//分からなければ0を返す
  }

}


/*

//以下は認証済みアカウントでないと動作しない。

//botに登録ずみの全てのユーザーIdと表示名を取得※ログ用
//[[userId,displayName]]をreturn
//★未認証だと空配列が返される
function getAllFollowerIdAndName() {
  var ary = getFollowerIds();
  if (ary == [null]) {return ary;}

  if (ary.length >= 1) {
    for (let r = 0; r <= ary.length - 1; r++) {
      ary[r][1] = getDisplayName(ary[r][0]);
    }
  }
  return ary;
}

//botに登録ずみの全てのユーザーIdを取得（全員）
function getFollowerIds() {
  var userIds = [];
  var continuationToken = "";
  while (true) {
    response = getFollowerIds_300(continuationToken)
    userIds = userIds.concat(response.userIds)//配列をどんどん追加していく
    continuationToken = response.next;
    if (continuationToken == undefined) break
  }
  return userIds;
}

//botに登録ずみのユーザーIdを取得（最大３００人）★認証済みアカウントでしか使えない
function getFollowerIds_300(continuationToken = "") {
  start_param = (continuationToken.length == 0) ? "" : `?start=${continuationToken}`;
  var options = {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${channelAccessToken}`,
    },
  };

  try {
    var response = UrlFetchApp.fetch(`https://api.line.me/v2/bot/followers/ids${start_param}`, options);//これが★認証済みアカウントでしか使えない
    return JSON.parse(response.getContentText());

  } catch (ex) {
    return [null];//（未認証で）getできなければ空配列を返す

  }
}

*/