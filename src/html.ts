const voidElem = [ 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr', ]

// problem with immediately resulting string:
// cant know if its user inserted value or a html,
// therefor we cant decide to escape it or not
//
// so the drawback is manual escape

/** html builder */
export const H = {

  /// JSX api
  e(tag: tag, attrs: Record<string,any> | null, ...childs: string[] ) {

    // FRAGMENT
    if (tag === undefined) {
      return H.childResolution(tag, '', childs)
    }

    // COMPONENT
    if (typeof tag == 'function') {
      const app = attrs ?? {}
      app.slot = childs
      return tag(app)
    }

    // REGULAR
    let atr = ''

    if (attrs) {
      const entr = Object.entries(attrs)

      for (let i = 0, len = entr.length; i < len; i++) {
        let [attrKey,val]: [string,any] = entr[i];

        if (val === null || val === undefined || val === false)
          continue;

        if (val === true) {
          atr += ` ${attrKey}`;
          continue
        }

        atr += ` ${attrKey}="${val}"`;
      }
    }

    if (voidElem.includes(tag)) {
      return `<${tag}${atr}>`
    }

    return H.childResolution(tag, atr, childs)
  },


  childResolution(tag: tag, atr: string, childs: unknown[]) {
    let content = ''

    for (let i = 0,len = childs.length; i < len; i++) {
      let elem = childs[i]

      if (Array.isArray(elem)) {
        childs.splice(i,1,...elem)
        len = childs.length
        i -= 1
        continue
      }

      if (typeof elem == 'string' || typeof elem == 'number') {
        content += elem
        continue
      }

      if (elem === null || elem === undefined || elem === false) continue

      if (typeof elem == 'object') {
        if ("toString" in elem && typeof elem.toString == 'function') {
          content += elem.toString()
          continue
        }
        content += JSON.stringify(elem)
        continue
      }

      throw new Error(`child typeof "${typeof elem}", unimplemented`);
    }

    if (tag === undefined) {
      return content
    }

    return `<${tag}${atr}>${content}</${tag}>`
  },

  nullOr<T>(val: T | null | undefined, fallback: T) {
    if (val === null || val === undefined) {
      return fallback
    } else {
      return val
    }
  }
}

type tag = string | ((arg:any) => string) | undefined
