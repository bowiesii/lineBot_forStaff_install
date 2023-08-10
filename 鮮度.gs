//鮮度表を読んでくる
function freshness() {

  //鮮度表
  const sheet = bbsLib.getSheetByIdGid(id_bb, gid_fcheck);
  var maxrow = sheet.getLastRow();
  var maxcol = sheet.getLastColumn();
  var sheet_val = sheet.getRange(1, 1, maxrow, maxcol).getDisplayValues();
  var sheet_note = sheet.getRange(1, 1, maxrow, maxcol).getNotes();
  var n_white = 0;
  var n_pink = 0;
  var n_red = 0;

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
          Logger.log(r + " " + c + " " + string_date + " " + dd);
          if (dd <= 15) {
            n_white = n_white + 1;
          } else if (dd >= 45) {
            n_red = n_red + 1;
          } else {
            n_pink = n_pink + 1;
          }
        } else {//メモはあるが日付にマッチしない場合真っ赤
          n_red = n_red + 1;
        }
      } else {//メモがない場合真っ赤
        n_red = n_red + 1;
      }
    }
  }

  var n_all = n_white + n_pink + n_red;
  var r_white = Math.round((n_white / n_all) * 100);
  var r_pink = Math.round((n_pink / n_all) * 100);
  var r_red = Math.round((n_red / n_all) * 100);

  var out = "鮮度チェック進捗状況";
  out = out + "\n本日：" + today_ymdd;
  out = out + "\n白：" + n_white + "箇所（" + r_white + "%）";
  out = out + "\nピンク：" + n_pink + "箇所（" + r_pink + "%）";
  out = out + "\n赤：" + n_red + "箇所（" + r_red + "%）";

  Logger.log(out);
  return out;

}
