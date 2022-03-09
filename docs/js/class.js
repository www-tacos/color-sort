// MyColorクラス
// SとVは0~255で表現
class MyColor {
  R
  G
  B
  H
  S
  V

  setRGB(r,g,b) {
    this.R = r
    this.G = g
    this.B = b
  }
  setRandomRGB() {
    const random = () => Math.floor(Math.random() * 255)
    this.R = random()
    this.G = random()
    this.B = random()
  }
  calcHSV(r=this.R,g=this.G,b=this.B) {
    const max = Math.max(r,g,b)
    const min = Math.min(r,g,b)
    let h,s,v

    // H
    if (r == g && g == b) {
      h = 0
    } else if (max == r) {
      h = 60 * ((g - b) / (max - min))
      if (h < 0) { h += 360 }
    } else if (max == g) {
      h = 60 * ((b - r) / (max - min)) + 120
      if (h < 0) { h += 360 }
    } else if (max == b) {
      h = 60 * ((r - g) / (max - min)) + 240
      if (h < 0) { h += 360 }
    }
    this.H = Math.round(h)

    // S
    s = (max - min) / max * 255
    this.S = Math.round(s)

    // V
    v = max
    this.V = Math.round(v)
  }
  getHex() {
    const r = Number(this.R).toString(16).padStart(2,'0')
    const g = Number(this.G).toString(16).padStart(2,'0')
    const b = Number(this.B).toString(16).padStart(2,'0')
    return `#${r}${g}${b}`
  }
}



class ButtonWithLoad {
  constructor(elm) {
    if(elm.tagName.toLowerCase() == 'button') {
      this.button = elm;
      this.button.classList.remove("button-with-load--loading");
      this.txt = this.button.firstElementChild.innerText;
      this.func = this.button.onclick;
    } else {
      return false;
    }
  }

  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async start() {
    this.button.classList.add("button-with-load--loading");
    this.button.onclick = '';
    await this.sleep(1);  /* なぜか、待ちを入れないと画面が更新されない */
  }

  async finish() {
    this.button.classList.remove("button-with-load--loading");
    this.button.firstElementChild.innerText = 'Complete';
    await this.sleep(2000);
    this.button.firstElementChild.innerText = this.txt;
    this.button.onclick = this.func;
  }
  
  async error() {
    this.button.classList.remove("button-with-load--loading");
    this.button.firstElementChild.innerText = 'Error';
    await this.sleep(2000);
    this.button.firstElementChild.innerText = this.txt;
    this.button.onclick = this.func;
  }

  static async alertWrap(f, elm) {
    const btn = elm && new ButtonWithLoad(elm);
    try {
      btn ? await f(btn) : await f();
    } catch (error) {
      console.error(error);
      alert('Errorです。詳細はデベロッパーツール（Ctrl + Shift + I）のコンソールから確認してください。');
      await btn.error();
    }
  }
}
