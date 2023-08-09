//週タスクを読んでくる
//水～土は真ん中
//日→実行済みかどうか
//月火は一番古いやつ
function weektask() {

  //各バインダー
  var sheet1 = bbsLib.getSheetByIdGid(id_bb, gid_wtask1);
  var sheet2 = bbsLib.getSheetByIdGid(id_bb, gid_wtask2);
  var sheet3 = bbsLib.getSheetByIdGid(id_bb, gid_wtask3);

  //日付をB3から取り出し（ファイル名は変更できるため保護セルから）
  var sheet1_n = sheet1.getRange(3, 2).getDisplayValue();
  var sheet2_n = sheet2.getRange(3, 2).getDisplayValue();
  var sheet3_n = sheet3.getRange(3, 2).getDisplayValue();
  var sheet1_y = new Date(sheet1_n);
  var sheet2_y = new Date(sheet2_n);
  var sheet3_y = new Date(sheet3_n);

  //一番古いシート→一番新しいシートに、並べ替える
  var ary = [[1, sheet1, sheet1_n, sheet1_y], [2, sheet2, sheet2_n, sheet2_y], [3, sheet3, sheet3_n, sheet3_y]];
  ary.sort((a, b) => { return a[3] - b[3]; });//_yでソートする
  Logger.log(ary);

  var now = 0;//012古い順

  //水木金土
  if (today.getDay() >= 3) {
    now = 1;
    //月火
  } else if (today.getDay() == 1 || today.getDay() == 2) {
    now = 0;
    //日
  } else {

    //あしたの日付
    var today_1 = new Date(today);//この行はなんか必要らしい
    today_1.setDate(today.getDate() + 1);//明日にする
    today_1 = Utilities.formatDate(today_1, "JST", "yyyy/MM/dd")//時間部分をカット（00:00にする）
    today_1 = new Date(today_1);//デフォ形式に戻す
    //真ん中日付
    var ary12k = new Date(ary[1][2]);
    Logger.log(ary12k + " " + today_1);//真ん中日付＝明日だったら、変更済みということ

    if (Number(ary12k) == Number(today_1)) {//Date型はミリ秒（１９７０・１・１～）変換しないと等値比較不可。
      Logger.log("実行済の日曜");
      now = 0;
    } else {
      Logger.log("実行前の日曜");
      now = 1;
    }

  }

  Logger.log(now);
  var sheetary = ary[now][1].getRange(7, 1, 9, 2).getDisplayValues();//タスク１～９行目まで概要として出力

  var wtSt = ary[now][1].getRange(3, 2).getDisplayValue() + "週作業進捗概要";
  for (let r = 0; r <= sheetary.length - 1; r++) {
    wtSt = wtSt + "\n" + sheetary[r][0] + "：" + sheetary[r][1];
  }
  wtSt = wtSt + "\n" + bbsLib.toUrl(id_bb, ary[now][1].getSheetId());//該当週タスクのurl

  return wtSt;

}