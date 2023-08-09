//新人シートの情報
//新人のURL、名前、最終更新、中身（５カテゴリくらい）
function sinjin() {

  var sinjinNum = 0;//新人の人数-1
  var sinjinAry = [[["新人はいない"]]];//新人０人のときこれが残る

  var sheetS = bbSpreadSheet.getSheets();//すべてのシートが配列に
  for (let na = 0; na <= sheetS.length - 1; na++) {
    if (sheetS[na].getSheetName().includes("【新】")) {//新人シートだった場合

      sinjinAry[sinjinNum] = [[]];
      sinjinAry[sinjinNum][0][0] = sheetS[na].getSheetName();//０にシート名
      sinjinAry[sinjinNum][0][1] = bbsLib.toUrl(id_bb, sheetS[na].getSheetId());//シートURL
      sinjinAry[sinjinNum][0][2] = sheetS[na].getRange(3, 4).getDisplayValue();//最終更新
      Logger.log("another sinjin " + sinjinAry[sinjinNum]);

      var catNum = 0;//カテゴリは１～

      var colorAry = sheetS[na].getRange(6, 1, sheetS[na].getLastRow() - 5, 1).getFontColorObjects();//Colorクラスで取得される
      var valueAry = sheetS[na].getRange(6, 1, sheetS[na].getLastRow() - 5, 2).getDisplayValues();

      for (let row = 0; row <= colorAry.length - 1; row++) {
        if (colorAry[row][0].asRgbColor().asHexString() == "#ffff00") {//文字色が黄色

          catNum = catNum + 1;
          sinjinAry[sinjinNum][catNum] = [];
          sinjinAry[sinjinNum][catNum][0] = valueAry[row][0];//カテゴリ名
          sinjinAry[sinjinNum][catNum][1] = 0;//スキルの数
          sinjinAry[sinjinNum][catNum][2] = 0;//済（〇、◎）の数
          sinjinAry[sinjinNum][catNum][3] = 0;//済の割合
          Logger.log("another category " + sinjinAry[sinjinNum][catNum][0]);

        } else {//文字色が黄色ではない
          valueAry[row][0] = valueAry[row][0].replace(/\s/g, "");//スキル列：空白改行削除

          if (valueAry[row][0] != "") {//スキル欄が空白セルだったらスルー
            sinjinAry[sinjinNum][catNum][1] = sinjinAry[sinjinNum][catNum][1] + 1;//スキル数＋１

            if (valueAry[row][1] == "◎" || valueAry[row][1] == "〇") {//〇は漢数字
              sinjinAry[sinjinNum][catNum][2] = sinjinAry[sinjinNum][catNum][2] + 1;//完了数＋１
            }

            sinjinAry[sinjinNum][catNum][3] = Math.round((sinjinAry[sinjinNum][catNum][2] / sinjinAry[sinjinNum][catNum][1]) * 100);//割合更新
          }

        }
      }

      sinjinNum = sinjinNum + 1;
    }
  }

  Logger.log(sinjinAry);
  return sinjinAry;

}
