import "./register"

/** html api */
export const Html = {
  /**
   * wrap response with layout if no pr-request header exist
   */
  postProcess(content: string, headers: Headers, opt: HTMLConfig) {
    let result: JSX.Element
    const isPr = headers.has('pr-request')

    // used for pr-module response
    let moduleHeaders = [] as string[]

    for (let i = 0, len = opt.modules.length; i < len; i++) {
      const [src,_] = opt.modules[i]
      const moduleOption = new URLSearchParams(_).toString()

      if (isPr) {
        moduleHeaders.push(`${src}${moduleOption == '' ? '' : ` ${moduleOption}`}`)
      } else {
        opt.heads.push(`<script src="${src}" type="module"${moduleOption == '' ? '' : ` opt="${moduleOption}"`}></script>`)
      }
    }

    if (isPr && moduleHeaders.length != 0) {
      headers.set('pr-module',moduleHeaders.join('; '))
    }


    // assign layout if browser request
    if (!isPr && opt.layout) {
      result = opt.layout(Object.assign({ slot: content }, opt.layoutArgument))
    } else {
      result = content
    }

    if (!isPr) {
      result = Html.base({ slot: result, heads: opt.heads.join('') })
    }

    return result
  },

  globalHeader: '',

  base({ slot, heads }: { slot: string, heads: string }) {
    return `<html><head>${this.globalHeader}${heads}</head><body>${slot}</body></html>`
  },

  /** assign header element globally */
  assignHeader(...headers: string[]) {
    for (let i = 0, len = headers.length; i < len; i++) {
      this.globalHeader += headers[i]
    }
  },
}

type ModuleConfig = {
  global?: string, 
  exec?: 'always' 
}

type HTMLConfig = {
  heads: string[]
  modules: [string,ModuleConfig][]
  layout?: (arg: { slot: JSX.Element } & EnhanceLayoutArgument) => JSX.Element
  layoutArgument?: EnhanceLayoutArgument
}

