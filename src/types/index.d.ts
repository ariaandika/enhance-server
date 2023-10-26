/// <reference types="@deuzo/enhance/types"/>
/// <reference path="./jsx.d.ts"/>

import { H } from "../html";

declare global {
  var H: typeof H

  interface EnhanceLayoutArgument { }
}



