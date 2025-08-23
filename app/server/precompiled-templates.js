// Arquivo gerado automaticamente. Não edite.
export const compiledTemplates = {
  'pages/home': function anonymous(it,options
) {

let include = (template, data) => this.render(template, data, options);
let includeAsync = (template, data) => this.renderAsync(template, data, options);

let __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction};

function layout(path, data) {
  __eta.layout = path;
  __eta.layoutData = data;
}

__eta.res+=include('/partials/header', it)
__eta.res+='\n<main id="sccont" class="main" data-scroll-container>\n  E ai? O que você vai construir?👀\n  '
__eta.res+=include('/partials/footer', it)
__eta.res+='</main>'

if (__eta.layout) {
  __eta.res = include (__eta.layout, {...it, body: __eta.res, ...__eta.layoutData});
}

return __eta.res;

},
  'partials/header': function anonymous(it,options
) {

let include = (template, data) => this.render(template, data, options);
let includeAsync = (template, data) => this.renderAsync(template, data, options);

let __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction};

function layout(path, data) {
  __eta.layout = path;
  __eta.layoutData = data;
}

__eta.res+='<!DOCTYPE html>\n<html lang="'
__eta.res+=__eta.e(it.lang)
__eta.res+='">\n<head>\n  <meta charset="'
__eta.res+=__eta.e(it.charset)
__eta.res+='">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n  <title>'
__eta.res+=__eta.e(it.site_title)
__eta.res+='</title>\n\n  '
if (it.description) {
__eta.res+='    <meta name="description" content="'
__eta.res+=__eta.e(it.description)
__eta.res+='">\n    <meta property="og:description" content="'
__eta.res+=__eta.e(it.description)
__eta.res+='">\n  '
}
__eta.res+='  <meta property="og:title" content="'
__eta.res+=__eta.e(it.site_title)
__eta.res+='">\n  <meta property="og:image" content="">\n  <meta property="og:url" content="">\n  <meta property="og:locale" content="pt_BR">\n\n  '
/* 
  <link rel="icon" href="<%= it.asset('src/assets/images/favicon.svg') %>" type="image/svg+xml">
  <link rel="apple-touch-icon" href="<%= it.asset('src/assets/images/favicon-180x180.png') %>"> 
  */
__eta.res+='\n  '
if (!it.is_dev) {
__eta.res+='    <link rel="stylesheet" href="'
__eta.res+=__eta.e(it.vite_css)
__eta.res+='">\n  '
}
__eta.res+='</head>\n<body>'

if (__eta.layout) {
  __eta.res = include (__eta.layout, {...it, body: __eta.res, ...__eta.layoutData});
}

return __eta.res;

},
  'partials/footer': function anonymous(it,options
) {

let include = (template, data) => this.render(template, data, options);
let includeAsync = (template, data) => this.renderAsync(template, data, options);

let __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction};

function layout(path, data) {
  __eta.layout = path;
  __eta.layoutData = data;
}

__eta.res+='<footer class="footer">\n\n</footer>\n<script type="module" src="'
__eta.res+=__eta.e(it.vite_js)
__eta.res+='"></script>\n</body>\n</html>'

if (__eta.layout) {
  __eta.res = include (__eta.layout, {...it, body: __eta.res, ...__eta.layoutData});
}

return __eta.res;

}
};
