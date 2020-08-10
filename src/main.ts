import axios from "axios";
import ejs from "ejs";
import _style from "./style";
import $blogging from "./option";
import * as qs from "qs";
import * as showdown from "showdown";
var mdc = new showdown.Converter({
  tables: true,
  emoji: true,
  underline: true,
  literalMidWordUnderscores: true,
  strikethrough: true,
  tasklists: true,
  simpleLineBreaks: true,
  encodeEmails: true,
});
(async () => {
  try {
    let querystr = qs.parse(window.location.search.substr(1));
    await hrefIndex(querystr);
    console.log(
      `%c Blogging %c v${$blogging.version} %c`,
      _style.a,
      _style.b,
      _style.c
    );
    console.log(
      `%c Blogging %c Loading Config... %c`,
      _style.a,
      _style.b,
      _style.c
    );
    let $config = await axios({
      url: "./$blogging/config.json",
      method: "GET",
    });
    let $theme = await axios({
      url: `./$blogging/themes/${$config.data.theme}/theme.json`,
      method: "GET",
    });
    if ($blogging.debug == true) {
      console.log(
        `%c Debugger %c Debug Info %c`,
        _style.a,
        _style.b,
        _style.c,
        "\n",
        $config,
        $theme
      );
    }
    document.title = $config.data.title;
    if (querystr.page == "index" || querystr.page == null) {
      document.body.appendChild(
        createDocumentFragment(
          await renderIndex(
            await axios.get(
              `./$blogging/themes/${$config.data.theme}/${$theme.data.theme.index}`
            ),
            $config
          )
        )
      );
      loadArts($theme.data, $config.data);
    } else {
      let $page = await loadPage(querystr.page, $config.data, $theme.data);
      if ($page.nopage == true) {
        console.log("404");
        window.location.href = "./";
      }
    }
  } catch (e) {
    throw e;
  }
})();

async function hrefIndex(q: any): Promise<void> {
  if (qs.page == "") {
    window.location.href = "./?page=index";
  }
}

async function renderIndex(d: any, c: any): Promise<string> {
  try {
    console.log(
      `%c Renderer %c Rendering "index" %c`,
      _style.a,
      _style.b,
      _style.c
    );
    if ($blogging.debug == true) {
      console.log(
        `%c Debugger %c Debug Info %c`,
        _style.a,
        _style.b,
        _style.c,
        "\n",
        d,
        c
      );
    }
    let ctx = ejs.render(d.data, {
      $bl: { title: c.data.title },
    });
    if ($blogging.debug == true) {
      console.log(
        `%c Debugger %c Debug Info %c`,
        _style.a,
        _style.b,
        _style.c,
        "\n",
        ctx
      );
    }
    return ctx;
  } catch (e) {
    throw e;
  }
}

async function loadArts(t: any, c: any): Promise<void> {
  try {
    c.a.forEach(async (e: any, i: any) => {
      console.log(
        `%c Renderer %c Rendering Title Block #${i} %c`,
        _style.a,
        _style.b,
        _style.c
      );
      let b = await axios.get(`./$blogging/themes/${c.theme}/${t.theme.block}`);
      document.getElementById("bl_postblock").appendChild(
        createDocumentFragment(
          ejs.render(b.data, {
            $bl: {
              title: e.title,
              desc: e.desc,
              url: `./?page=${i}`,
              date: e.date,
            },
          })
        )
      );
    });
  } catch (e) {
    throw e;
  }
}

function createDocumentFragment(txt) {
  const template = `${txt}`;
  let frag = document.createRange().createContextualFragment(template);
  return frag;
}

async function loadPage(h: any, c: any, t: any): Promise<any> {
  try {
    console.log(
      `%c Renderer %c Rendering Page ${h} %c`,
      _style.a,
      _style.b,
      _style.c
    );
    let post = c.a[h];
    let ctx = await axios.get(`./$blogging/posts/${post.file}`);
    let e = await axios.get(`./$blogging/themes/${c.theme}/${t.theme.post}`);

    let r_ctx = mdc.makeHtml(ctx.data);
    let e_ctx = ejs.render(e.data, {
      $bl: {
        title: c.title,
        post_title: post.title,
        date: post.date,
      },
    });
    document.body.innerHTML = e_ctx;
    document.getElementById("bl_post").innerHTML = r_ctx;
    return {
      nopage: false,
    };
  } catch (e) {
    throw e;
    return {
      nopage: true,
    };
  }
}
