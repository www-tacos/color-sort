//@ts-check

class RGB {
  /** @type {number} */
  R
  /** @type {number} */
  G
  /** @type {number} */
  B
  /** @type {number} */
  RGB_MAX = 255

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  constructor(r=null, g=null, b=null) {
    if (r && g && b) {
      this.set(r, g, b)
    } else {
      this.setRandom()
    }
  }

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
  set(r, g, b) {
    const valid =
      0 <= r && r <= this.RGB_MAX &&
      0 <= g && g <= this.RGB_MAX &&
      0 <= b && b <= this.RGB_MAX
    if (!valid) {
      throw new Error(`Invalid arguments: RGB(${r}, ${g}, ${b})`)
    }
    this.R = r
    this.G = g
    this.B = b
  }

  setRandom() {
    const r = Math.floor(Math.random() * this.RGB_MAX)
    const g = Math.floor(Math.random() * this.RGB_MAX)
    const b = Math.floor(Math.random() * this.RGB_MAX)
    this.set(r, g, b)
  }

  toString() {
    return `RGB(${this.R}, ${this.G}, ${this.B})`
  }
}

class HSV {
  /** @type {number} */
  H
  /** @type {number} */
  S
  /** @type {number} */
  V
  /** @type {number} */
  H_MAX = 359  // 0 ~ 359
  /** @type {number} */
  S_MAX = 255  // 0 ~ 255
  /** @type {number} */
  V_MAX = 255  // 0 ~ 255


  /**
   * @param {number} h
   * @param {number} s
   * @param {number} v
   */
  constructor(h=null, s=null, v=null) {
    if (h && s && v) {
      this.set(h, s, v)
    } else {
      this.setRandom()
    }
  }

  /**
   * @param {number} h
   * @param {number} s
   * @param {number} v
   */
  set(h, s, v) {
    h = h == this.H_MAX + 1 ? 0 : h
    const valid =
      0 <= h && h <= this.H_MAX &&
      0 <= s && s <= this.S_MAX &&
      0 <= v && v <= this.V_MAX
    if (!valid) {
      throw new Error(`Invalid arguments: HSV(${h}, ${s}, ${v})`)
    }
    this.H = h
    this.S = s
    this.V = v
  }

  setRandom() {
    const h = Math.floor(Math.random() * this.H_MAX)
    const s = Math.floor(Math.random() * this.S_MAX)
    const v = Math.floor(Math.random() * this.V_MAX)
    this.set(h, s, v)
  }

  toString() {
    return `HSV(${this.H}, ${this.S}, ${this.V})`
  }
}


// 変換式の参考：https://www.peko-step.com/tool/hsvrgb.html
class Color {
  /** @type {RGB} */
  RGB
  /** @type {HSV} */
  HSV

  constructor(){
    this.RGB = new RGB()
    this.HSV = this.getHSVFromRGB(this.RGB)
  }

  toString() {
    // ex) [#ffffff][RGB(255, 255, 255)][HSV(0, 0, 255)]
    return `[${this.getHex()}][${this.RGB}][${this.HSV}]`
  }

  getHex() {
    let hex = '#'
    for(const c of [this.RGB.R, this.RGB.G, this.RGB.B]) {
      hex += c.toString(16).padStart(2, '0')
    }
    return hex
  }

  /**
   * @param {number} r
   * @param {number} g
   * @param {number} b
   */
   setFromRGB(r, g, b) {
    this.RGB.set(r, g, b)
    this.HSV = this.getHSVFromRGB(this.RGB)
  }

  /**
   * @param {number} h
   * @param {number} s
   * @param {number} v
   */
   setFromHSV(h, s, v) {
    this.HSV.set(h, s, v)
    this.RGB = this.getRGBFromHSV(this.HSV)
  }

  /**
   * @param {string} hex The hexadecimal expression string which starts with '#', like `#d2ff9e`
   */
  setFromHex(hex) {
    hex = hex.slice(1)
    const r = parseInt(hex.substring(0,2), 16)
    const g = parseInt(hex.substring(2,4), 16)
    const b = parseInt(hex.substring(4,6), 16)
    this.RGB.set(r, g, b)
    this.HSV = this.getHSVFromRGB(this.RGB)
  }

  /**
   * @param {RGB} rgb
   * @returns {HSV}
   */
  getHSVFromRGB(rgb) {
    const hsv = new HSV()
    const max = Math.max(rgb.R, rgb.G, rgb.B)
    const min = Math.min(rgb.R, rgb.G, rgb.B)

    let h = 0
    if (rgb.R == rgb.G && rgb.G == rgb.B) {
      h = 0
    } else if (max == rgb.R) {
      h = 60 * ((rgb.G - rgb.B) / (max - min))
    } else if (max == rgb.G) {
      h = 60 * ((rgb.B - rgb.R) / (max - min)) + 120
    } else if (max == rgb.B) {
      h = 60 * ((rgb.R - rgb.G) / (max - min)) + 240
    }
    h = Math.round(h < 0 ? h + 360 : h)
    const s = Math.round((max - min) / max * hsv.S_MAX)
    const v = Math.round(max)

    hsv.set(h, s, v)
    return hsv
  }

  /**
   * @param {HSV} hsv
   * @returns {RGB}
   */
  getRGBFromHSV(hsv) {
    const rgb = new RGB()
    const max = hsv.V
    const min = max - ((hsv.S / hsv.S_MAX) * max)
    const rank = Math.floor(hsv.H / 60)  // 0~5
    const H_ = Math.abs(hsv.H - (rank + rank % 2) * 60)
    const [r, g, b] = {
      0 : [max, (H_ / 60) * (max - min) + min, min],
      1 : [(H_ / 60) * (max - min) + min, max, min],
      2 : [min, max, (H_ / 60) * (max - min) + min],
      3 : [min, (H_ / 60) * (max - min) + min, max],
      4 : [(H_ / 60) * (max - min) + min, min, max],
      5 : [max, min, (H_ / 60) * (max - min) + min]
    }[rank]

    rgb.set(r, g, b)
    return rgb
  }

  /**
   * @param {Array<Color>} colorList
   * @param {number} valueSplitCount
   * @returns {Array<Color>}
   */
  static sorted(colorList, valueSplitCount = 1) {
    /** @type {Array<Array<Color>>} */
    const colorListSorteds = new Array(valueSplitCount)
    for(let i = 0; i < valueSplitCount; i++) {
      colorListSorteds[i] = new Array()
    }
    for(const c of colorList) {
      const i = Math.floor(valueSplitCount * c.HSV.V / c.HSV.V_MAX)
      colorListSorteds[i].push(c)
    }
    for(const cls of colorListSorteds) {
      cls.sort((a,b) => {
        if (a.HSV.H < b.HSV.H) return  1
        if (a.HSV.H > b.HSV.H) return -1
        if (a.HSV.S < b.HSV.S) return  1
        if (a.HSV.S > b.HSV.S) return -1
        return 0
      })
    }
    return colorListSorteds[0].concat(...colorListSorteds.slice(1))
  }
}
