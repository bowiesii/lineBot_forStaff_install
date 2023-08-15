//基本バインダー
const id_bb = "1sEKCFs6oNzbEkRgt2Z2aq_4mOGQXMU7dcFTXPNYf-wg";
const bbSpreadSheet = SpreadsheetApp.openById(id_bb);
const gid_order = "648587868";//発注
const gid_wtask1 = "1616634719";//週タスク１のGID
const gid_wtask2 = "2097376321";//週タスク２
const gid_wtask3 = "1024816661";//週タスク３
const gid_fcheck = "1405667253";//鮮度
const gid_clean = "672501890";//清掃

//基本バインダーログ
const id_bbLog = "17bZ83U_NeHXLT__NOV0zfHd2B8XZIBEgKfd_akNZDuY";
const gid_botTemp = "947575838";//bot一時
const gid_botPush = "1503321267";//botプッシュ登録者リスト
const gid_useSumDay = "733648789";//使用統計数日ごと

//本日日付定義
//const today = new Date("2023/8/7");
//やっぱり本当の日付
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDate = today.getDate();
const wary = ["日", "月", "火", "水", "木", "金", "土"];
const today_wjpn = wary[today.getDay()];
const today_ymd = Utilities.formatDate(today, 'JST', 'yyyy/MM/dd');
const today_ymdd = today_ymd + " " + today_wjpn;
const today_hm = Utilities.formatDate(today, 'JST', 'HH:mm');
const today_ymddhm = today_ymdd + " " + today_hm;

//スクリプトプロパティに保管されているLineのトークン
const channelAccessToken = PropertiesService.getScriptProperties().getProperty("channel_access_token");



