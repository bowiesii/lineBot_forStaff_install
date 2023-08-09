//発注状況を読んでくる
function ordertask() {

  //発注表
  const sheet = bbsLib.getSheetByIdGid(id_bb, gid_order);

  var ary = sheet.getRange(6, 1, 1, 6).getDisplayValues();
  var botst = ary[0][0] + " 朝〆の発注進捗";
  botst = botst + "\n" + "流し：" + ary[0][1];
  botst = botst + "\n" + "設定手：" + ary[0][3];
  botst = botst + "\n" + "デイ管：" + ary[0][5];

  Logger.log(botst);
  return botst;

}
