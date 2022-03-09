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
  // 色の数取得
  const COLOR_AMT = document.getElementById('COLOR_AMT').value
  
  // 明度の分割数取得
  const GRP_CNT = document.getElementById('GRP_CNT').value
  
  // 要素を埋める対象の初期化
  const TBODY = document.getElementById('target')
  TBODY.innerHTML = ''

  // カラーリスト
  // ソート前のオリジナルリスト
  const colorListOriginal = new Array()

  // 単純に色相と彩度でソートするリスト
  const colorListSorted = new Array()

  // 一定の明度ごとにソートして結合するリスト
  const colorListGroupBy = new Array(GRP_CNT)
  for (var i=0;i<GRP_CNT;i++) { colorListGroupBy[i] = new Array() }

  // ランダムに色を決定
  for(var i=0;i<COLOR_AMT;i++) {
    var color = new MyColor()
    color.setRandomRGB()
    color.calcHSV()
    colorListOriginal.push(color)
    colorListSorted.push(color)
    // 明度の分割数で明度を等分して明度別のソート用リストに入れる
    for(var j=0;j<GRP_CNT;j++) {
      if (Math.round(255/GRP_CNT*j) <= color.V && color.V <= Math.round(255/GRP_CNT*(j+1))) {
        colorListGroupBy[j].push(color)
      }
    }
  }

  // 単純ソート
  colorListSorted.sort((a,b)=>{
    if (a.H < b.H) return 1
    if (a.H > b.H) return -1
    if (a.S < b.S) return 1
    if (a.S > b.S) return -1
    return 1
  })

  // 明度別ソートと結合
  colorListGroupBy.map(cl=>{
    cl.sort((a,b)=>{
      if (a.H < b.H) return 1
      if (a.H > b.H) return -1
      if (a.S < b.S) return 1
      if (a.S > b.S) return -1
      return 1
    })
  })
  const colorListGroupBySorted = colorListGroupBy[0].concat(...colorListGroupBy.slice(1))

  // 各カラーリストを表示
  for(var i=0;i<COLOR_AMT;i++) {
    var hexes = [
      colorListOriginal[i].getHex(),
      colorListSorted[i].getHex(),
      colorListGroupBySorted[i].getHex()
    ]
    var tds = hexes.map(hex => `<td class="cell" style="background-color: ${hex};">${hex}</td>`).reduce((prev,crnt)=>prev+crnt)
    TBODY.innerHTML += `<tr>${tds}</tr>`
  }

  await btn.finish()
}
