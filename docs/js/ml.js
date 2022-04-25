// @ts-check
// 某アイドルゲームの各アイドルのイメージカラーのソート
// 参考：https://docs.google.com/spreadsheets/d/1lXWbXpV-yUtC15A6sAizl07uMoIc_kbqTamCzbE6RrY
/** @type {Object.<string, string>} */
const IDOLs = {
  "#e22b30" : "天海春香",
  "#2743d2" : "如月千早",
  "#b4e04b" : "星井美希",
  "#d3dde9" : "萩原雪歩",
  "#f39939" : "高槻やよい",
  "#515558" : "菊地真",
  "#fd99e1" : "水瀬伊織",
  "#a6126a" : "四条貴音",
  "#01a860" : "秋月律子",
  "#9238be" : "三浦あずさ",
  "#ffe43f" : "双海亜美・真美",
  // "#ffe43f" : "双海真美",
  "#01adb9" : "我那覇響",
  "#ea5b76" : "春日未来",
  "#6495cf" : "最上静香",
  "#fed552" : "伊吹翼",
  "#92cfbb" : "田中琴葉",
  "#9bce92" : "島原エレナ",
  "#58a6dc" : "佐竹美奈子",
  "#454341" : "所恵美",
  "#5abfb7" : "徳川まつり",
  "#ed90ba" : "箱崎星梨花",
  "#eb613f" : "野々原茜",
  "#7e6ca8" : "望月杏奈",
  "#fff03c" : "ロコ",
  "#c7b83c" : "七尾百合子",
  "#7f6575" : "高山紗代子",
  "#b54461" : "松田亜利沙",
  "#e9739b" : "高坂海美",
  "#f7e78e" : "中谷育",
  "#bee3e3" : "天空橋朋花",
  "#554171" : "ｴﾐﾘｰ ｽﾁｭｱｰﾄ",
  "#afa690" : "北沢志保",
  "#e25a9b" : "舞浜歩",
  "#d1342c" : "木下ひなた",
  "#f5ad3b" : "矢吹可奈",
  "#788bc5" : "横山奈緒",
  "#f19557" : "二階堂千鶴",
  "#f1becb" : "馬場このみ",
  "#ee762e" : "大神環",
  "#7278a8" : "豊川風花",
  "#d7a96b" : "宮尾美也",
  "#eceb70" : "福田のり子",
  "#99b7dc" : "真壁瑞希",
  "#b63b40" : "篠宮可憐",
  "#f19591" : "百瀬莉緒",
  "#aeb49c" : "永吉昴",
  "#6bb6b0" : "北上麗花",
  "#efb864" : "周防桃子",
  "#d7385f" : "ジュリア",
  "#ebe1ff" : "白石紬",
  "#274079" : "桜守歌織"
}


const show = async (btn) => {
  await btn.start()

  // 要素と中身の設定
  /** @type {number} */
  let PARAM_GRP_CNT
  /** @type {HTMLTableElement} */
  let TBODY

  try {
    // 明度の分割数
    PARAM_GRP_CNT = parseInt(/** @type {HTMLInputElement} */(document.getElementById('PARAM_GRP_CNT')).value)

    // 要素を埋める対象の初期化
    TBODY = /** @type {HTMLTableElement} */(document.getElementById('target'))
    TBODY.innerHTML = ''
  } catch (error) {
    console.error(error)
    throw error
  }

  // カラーリスト
  // ソート前のオリジナルリスト
  /** @type {Array<Color>} */
  const colorList = new Array()

  // IDOLsのhexをColorに変換
  for (const hex in IDOLs) {
    const color = new Color()
    color.setFromHex(hex)
    colorList.push(color)
  }

  // 単純ソート配列の取得
  const colorListSimpleSorted = Color.sorted(colorList)

  // 明度別ソート配列の取得
  const colorListSortedByValue = Color.sorted(colorList, PARAM_GRP_CNT)

  // 各カラーリストを表示
  for(let i = 0; i < Object.keys(IDOLs).length; i++) {
    const hexes = [
      colorList[i].getHex(),
      colorListSimpleSorted[i].getHex(),
      colorListSortedByValue[i].getHex()
    ]
    var tds = hexes.map(hex => `<td class="cell" style="background-color: ${hex};">${IDOLs[hex]}</td>`).reduce((prev,crnt)=>prev+crnt)
    TBODY.innerHTML += `<tr>${tds}</tr>`
  }

  await btn.finish()
}
