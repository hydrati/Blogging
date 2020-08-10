import * as url from "url";
import _style from "./style";
import $blogging from "./option";

export default async(url: any): Promise<any> => {
  let $p = url.parse(url);
  if ($blogging.debug == true) {
      console.log(
        `%c Debugger %c Debug Info %c`,
        _style.a,
        _style.b,
        _style.c,
        "\n",
        $p
      );
}