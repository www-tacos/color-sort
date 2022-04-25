// @ts-check

/*====================================================================================================
参考
ベースにした記事
http://webdesign-dackel.com/2015/08/29/javascript-sort-colors/
RGBとHSVの関係や変換式の参照
https://www.peko-step.com/tool/hsvrgb.html

HSVは色相・彩度・明度
彩度：下げるとモノクロになる
明度：下げると黒っぽく、上げると白っぽくなる
RGB(255,0,0)の赤はHSV(0,255,255)で、Sを下げるとGBが上がっていき、Vを下げるとRが下がっていく
====================================================================================================*/
const show = async (btn) => {
  await btn.start()

  // 要素と中身の設定
  /** @type {number} */
  let PARAM_COLOR_AMT
  /** @type {number} */
  let PARAM_GRP_CNT
  /** @type {HTMLTableElement} */
  let TBODY

  try {
    // 色の数
    PARAM_COLOR_AMT = parseInt(/** @type {HTMLInputElement} */(document.getElementById('PARAM_COLOR_AMT')).value)

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

  // ランダムに色を決定
  for(let i = 0; i < PARAM_COLOR_AMT; i++) {
    colorList.push(new Color())
  }

  // 単純ソート配列の取得
  const colorListSimpleSorted = Color.sorted(colorList)

  // 明度別ソート配列の取得
  const colorListSortedByValue = Color.sorted(colorList, PARAM_GRP_CNT)

  // 各カラーリストを表示
  for(let i = 0; i < PARAM_COLOR_AMT; i++) {
    const hexes = [
      colorList[i].getHex(),
      colorListSimpleSorted[i].getHex(),
      colorListSortedByValue[i].getHex()
    ]
    var tds = hexes.map(hex => `<td class="cell" style="background-color: ${hex};">${hex}</td>`).reduce((prev,crnt)=>prev+crnt)
    TBODY.innerHTML += `<tr>${tds}</tr>`
  }

  await btn.finish()
}
