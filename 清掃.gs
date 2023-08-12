//清掃表を読んでくる
function cleanliness() {

  //清掃表
  const sheet = bbsLib.getSheetByIdGid(id_bb, gid_clean);
  var maxrow = sheet.getLastRow();
  var maxcol = sheet.getLastColumn();
  var sheet_val = sheet.getRange(1, 1, maxrow, maxcol).getDisplayValues();
  var sheet_note = sheet.getRange(1, 1, maxrow, maxcol).getNotes();
  var n_white = 0;
  var n_sky = 0;
  var n_blue = 0;

  for (var r = 0; r <= maxrow - 1; r++) {
    for (var c = 0; c <= maxcol - 1; c++) {
      if (sheet_val[r][c] != "未") {//ログ用とか氏名入力用セルは気にしなくてよい。
        continue;
      }
      //セルの色ではなく、現在のnoteの日付から判断
      if (sheet_note[r][c] != "") {
        var notestr = sheet_note[r][c];
        var string_date = notestr.match(/\d{4}\/\d{1,2}\/\d{1,2}/);//マッチしなければnullを返す、複数あれば最初のにマッチする
        if (string_date != null) {
          var ddate = new Date(string_date);
          var ddate_t = new Date(today_ymd);
          var dd = (ddate_t - ddate) / 86400000;//経過日数（ミリ秒を日に変換）

          if (dd <= 15) {
            n_white = n_white + 1;
          } else if (dd >= 45) {
            n_blue = n_blue + 1;
          } else {
            n_sky = n_sky + 1;
          }
        } else {//メモはあるが日付にマッチしない場合真っ赤
          n_blue = n_blue + 1;
        }
      } else {//メモがない場合真っ赤
        n_blue = n_blue + 1;
      }
    }
  }

  var n_all = n_white + n_sky + n_blue;
  var r_white = Math.round((n_white / n_all) * 100);
  var r_sky = Math.round((n_sky / n_all) * 100);
  var r_blue = Math.round((n_blue / n_all) * 100);

  var out = "清掃進捗状況";
  out = out + "\n本日：" + today_ymdd;
  out = out + "\n白：" + n_white + "箇所（" + r_white + "%）";
  out = out + "\n水色：" + n_sky + "箇所（" + r_sky + "%）";
  out = out + "\n青：" + n_blue + "箇所（" + r_blue + "%）";

  return out;

}
