//bot受信したとき動作
function doPost(e) {
  let data = JSON.parse(e.postData.contents);
  let events = data.events;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    if (event.type == 'message') {
      if (event.message.type == 'text') {//受信したのが普通のテキストメッセージだったとき

        if (event.source.groupId == null) {//★グループトークには返信はしない
          //送信
          makeText(event);
        }

        //一時ログ
        var logary = [today_ymddhm, event.message.text, event.source.userId, getDisplayName(event.source.userId), event.source.groupId, getGroupName(event.source.groupId)];
        var tempLogSheet = bbsLib.getSheetByIdGid(id_bbLog, gid_botTemp);
        bbsLib.addLogLast(tempLogSheet, [logary], 6);

      }
    }
  }
}

//botにおくるテキストなどを定義して送信に渡す
function makeText(event) {
  var recText = event.message.text;//受信したテキスト

  if (recText == "マニュアル") {
    let text = "マニュアル類フォルダ\n" + "https://drive.google.com/drive/folders/1WuT2ODP78F1Z3Vik3JZE5OQo388h3vHz";
    reply(event, [text]);

  } else if (recText == "発注") {
    let text = ordertask() + "\n" + "https://docs.google.com/spreadsheets/d/1sEKCFs6oNzbEkRgt2Z2aq_4mOGQXMU7dcFTXPNYf-wg/edit#gid=648587868";
    reply(event, [text]);

  } else if (recText == "週タスク") {
    let text = weektask();//url埋め込み済み式
    reply(event, [text]);

  } else if (recText == "鮮度") {
    let text = freshness() + "\n" + "https://docs.google.com/spreadsheets/d/1sEKCFs6oNzbEkRgt2Z2aq_4mOGQXMU7dcFTXPNYf-wg/edit#gid=1405667253";
    reply(event, [text]);

  } else if (recText == "清掃") {
    let text = cleanliness() + "\n" + "https://docs.google.com/spreadsheets/d/1sEKCFs6oNzbEkRgt2Z2aq_4mOGQXMU7dcFTXPNYf-wg/edit#gid=672501890";
    reply(event, [text]);

  } else if (recText == "新人") {
    var sinjinAry = sinjin();//情報をとってくる
    if (sinjinAry[0][0][0] == "新人はいない") {
      let text = "現在新人表はありません。\n作成フォームはこちら↓\n" + "https://docs.google.com/forms/d/e/1FAIpQLSc0yBXDQc6dxrZxiMApc5tT0KgOCCHvvKeQuMmowoUGxQXPKw/viewform";
      reply(event, [text]);

    } else {//新人がいる場合
      let textAry = [];

      for (let na = 0; na <= sinjinAry.length - 1; na++) {//新人の数だけ送信
        let text = "(" + (na + 1) + "/" + sinjinAry.length + ")" + sinjinAry[na][0][0];//シート名など
        text = text + "\n最終更新：" + sinjinAry[na][0][2];
        text = text + "\n各カテゴリ習得度";
        for (let nb = 1; nb <= sinjinAry[na].length - 1; nb++) {//カテゴリの数だけテキストを追加
          text = text + "\n" + sinjinAry[na][nb][0] + "：" + sinjinAry[na][nb][2] + "/" + sinjinAry[na][nb][1] + "(" + sinjinAry[na][nb][3] + "%)";
        }
        text = text + "\n" + sinjinAry[na][0][1] + "";//最後にURL
        textAry[na] = text;
      }

      reply(event, textAry);
    }

  } else if (recText == "新人作成") {
    let text = "新人作成フォーム\n" + "https://docs.google.com/forms/d/e/1FAIpQLSc0yBXDQc6dxrZxiMApc5tT0KgOCCHvvKeQuMmowoUGxQXPKw/viewform";
    reply(event, [text]);

  } else if (recText == "新人削除") {
    let text = "新人削除フォーム\n" + "https://docs.google.com/forms/d/e/1FAIpQLSe04FTp2UNkWXTZdRXgjNb-BPGxMm6l35SfvYyiBFifqmyIzw/viewform";
    reply(event, [text]);

  } else if (recText == "ファイル共有登録") {
    let text = "ファイル共有登録フォーム\n" + "https://docs.google.com/forms/d/e/1FAIpQLSexh7ngMQJqgerMn4OK3QFNwTFKLCMilmEWj4dmp1MS7vwi5Q/viewform";
    reply(event, [text]);

  } else if (recText == "ファイル共有解除") {
    let text = "ファイル共有解除フォーム\n" + "https://docs.google.com/forms/d/e/1FAIpQLSerdV5RtN2fb5h_nSeBQkZSEFzcWM4tYKWJshPxhZI8YiMiBw/viewform";
    reply(event, [text]);

  } else if (recText == "統計") {
    let text = "▼この内容は通常毎朝４～５時に更新されるものです。";
    text = text + "\n\n" + bbsLib.getSheetByIdGid(id_bbLog, gid_useSumDay).getRange(1, 1).getNote();//メールの内容をメモしておいた
    reply(event, [text]);

  } else if (recText == "プッシュ通知登録") {
    let pushSheet = bbsLib.getSheetByIdGid(id_bbLog, gid_botPush);
    let uid = event.source.userId;
    let row = bbsLib.searchInCol(pushSheet, 2, uid);//登録済みかどうか

    if (row != -1) {//登録ずみだったら
      let text = "あなたは既にプッシュ通知に登録済みです。";
      reply(event, [text]);

    } else {//未登録なら登録
      let logary = [today_ymddhm, uid, getDisplayName(uid)];
      bbsLib.addLogFirst(pushSheet, 2, [logary], 3, 501);//MAX500人なので古いのは削除しちゃう

      let text = "プッシュ通知登録を行いました。";
      text = text + "\n\n※通知タイミング：";
      text = text + "\n・発注が未報告だった時の警告（朝４～５時）";
      text = text + "\n・日報（朝４～５時）";
      text = text + "\n・新人表作成時・手動削除時";
      text = text + "\n・ファイル共有登録時・氏名変更時・解除時";
      text = text + "\n\n※解除したい場合は、「プッシュ通知解除」コマンドを送信して下さい。";
      reply(event, [text]);
    }

  } else if (recText == "プッシュ通知解除") {
    let pushSheet = bbsLib.getSheetByIdGid(id_bbLog, gid_botPush);
    let uid = event.source.userId;
    let row = bbsLib.searchInCol(pushSheet, 2, uid);//登録済みかどうか

    if (row != -1) {//登録ずみだったら
      pushSheet.deleteRow(row);
      let text = "プッシュ通知登録を解除しました。";
      reply(event, [text]);

    } else {//未登録だったら
      let text = "あなたは元々プッシュ通知登録していないようです。";
      reply(event, [text]);

    }

  } else {
    let text = "次のいずれかのテキストを入力して下さい。\n\nマニュアル\n発注\n週タスク\n鮮度\n清掃\n新人\n新人作成\n新人削除\nファイル共有登録\nファイル共有解除\n統計\nプッシュ通知登録\nプッシュ通知解除";
    text = text + "\n\nこのbot、スプシの説明書▼\n" + "https://docs.google.com/document/d/19QqDWvmsijty6YQT8pOHgZtVkd0FY-uWVSeOOVSAYs4/edit";
    reply(event, [text]);

  }

}

//返信する（★textAryは配列）
function reply(event, textAry) {

  let replyUrl = "https://api.line.me/v2/bot/message/reply";

  var msgAry = [];
  for (let n = 0; n <= textAry.length - 1; n++) {
    msgAry[n] = { type: 'text', text: textAry[n] };
  }

  let contents = {
    replyToken: event.replyToken,
    messages: msgAry
  };

  let options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + channelAccessToken
    },
    payload: JSON.stringify(contents) //送るデータをJSONに変換
  };

  UrlFetchApp.fetch(replyUrl, options);
}


