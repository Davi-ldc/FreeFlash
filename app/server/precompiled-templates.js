import Handlebars from "handlebars/runtime";

const template = Handlebars.template;
const templates = {};

templates['home'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"colecoes") : depth0)) != null ? lookupProperty(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":8},"end":{"line":42,"column":15}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          <div class=\"ano-wrapper\" data-ano=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"ano") || (depth0 != null ? lookupProperty(depth0,"ano") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"ano","hash":{},"data":data,"loc":{"start":{"line":22,"column":45},"end":{"line":22,"column":52}}}) : helper)))
    + "\">\r\n            <div class=\"colecoes-grid\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"colecoes") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":24,"column":14},"end":{"line":39,"column":23}}})) != null ? stack1 : "")
    + "            </div>\r\n          </div>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "                <div class=\"colecao-item\">\r\n                  <a class=\"webgl-container\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"slug") || (depth0 != null ? lookupProperty(depth0,"slug") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"slug","hash":{},"data":data,"loc":{"start":{"line":27,"column":51},"end":{"line":27,"column":59}}}) : helper)))
    + "\">\r\n                    <img class=\"webgl-image\" \r\n                         src=\""
    + alias4(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"imagemPrincipal") : depth0)) != null ? lookupProperty(stack1,"url") : stack1), depth0))
    + "\" \r\n                         alt=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"titulo") || (depth0 != null ? lookupProperty(depth0,"titulo") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titulo","hash":{},"data":data,"loc":{"start":{"line":30,"column":30},"end":{"line":30,"column":40}}}) : helper)))
    + "\" />\r\n                  </a>\r\n                  <div class=\"colecao-info\">\r\n                    <div class=\"colecao-meta\">\r\n                      <span class=\"colecao-local\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"local") || (depth0 != null ? lookupProperty(depth0,"local") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"local","hash":{},"data":data,"loc":{"start":{"line":34,"column":50},"end":{"line":34,"column":59}}}) : helper)))
    + "</span>\r\n                      <span class=\"colecao-data\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"data") || (depth0 != null ? lookupProperty(depth0,"data") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"data","hash":{},"data":data,"loc":{"start":{"line":35,"column":49},"end":{"line":35,"column":57}}}) : helper)))
    + "</span>\r\n                    </div>\r\n                  </div>\r\n                </div>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"header"),depth0,{"name":"header","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\r\n<div class=\"preloader\">\r\n  <div class=\"preloader-grid\">\r\n    <div class=\"preloader-logo\">Renato Vaz</div>\r\n    <div class=\"preloader-line\"></div>\r\n    <div class=\"preloader-text\">Um olhar além das lentes</div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"colecoes-titulo-wrapper\">\r\n  <h1 class=\"colecoes-titulo\">COLEÇÕES - "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"latest_year") || (depth0 != null ? lookupProperty(depth0,"latest_year") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"latest_year","hash":{},"data":data,"loc":{"start":{"line":13,"column":41},"end":{"line":13,"column":56}}}) : helper)))
    + "</h1>\r\n</div>\r\n\r\n<main id=\"sccont\" class=\"main\" data-scroll-container>\r\n  <section class=\"sec padding\">\r\n    <div class=\"container\">\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"colecoes") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":6},"end":{"line":43,"column":15}}})) != null ? stack1 : "")
    + "    </div>\r\n  </section>\r\n"
    + ((stack1 = container.invokePartial(lookupProperty(partials,"footer"),depth0,{"name":"footer","data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</main>\r\n\r\n";
},"usePartial":true,"useData":true});
templates['footer'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\r\n<footer class=\"footer\">\r\n    <div class=\"footer-grid\">\r\n        <div class=\"footer-colum\">\r\n            <div class=\"colum-title\">Nav</div>\r\n            <div class=\"colum-content\">\r\n                <a href=\"/\">Home</a>\r\n                <a href=\"/sobre\">Sobre</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"footer-colum\">\r\n            <div class=\"colum-title\">Nav</div>\r\n            <div class=\"colum-content\">\r\n                <a href=\"/\">Home</a>\r\n                <a href=\"/sobre\">Sobre</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"footer-colum\">\r\n            <div class=\"colum-title\">Nav</div>\r\n            <div class=\"colum-content\">\r\n                <a href=\"/\">Home</a>\r\n                <a href=\"/sobre\">Sobre</a>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n    <div class=\"credits\">\r\n        <div class=\"credits-text\">© 2025 Renato vaz</div>\r\n        <div class=\"Davi-wraper\">\r\n            <div>por&nbsp;</div>\r\n            <a class=\"Davi-link\" href=\"https://www.linkedin.com/in/davi-lima-4b771b241/\">Davi Lima</a>\r\n        </div>\r\n    </div>\r\n</footer>\r\n<script type=\"module\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"vite_js") || (depth0 != null ? lookupProperty(depth0,"vite_js") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"vite_js","hash":{},"data":data,"loc":{"start":{"line":35,"column":27},"end":{"line":35,"column":40}}}) : helper)))
    + "\"></script>\r\n</body>\r\n</html>";
},"useData":true});
templates['header'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <link rel=\"stylesheet\" href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"vite_css") || (depth0 != null ? lookupProperty(depth0,"vite_css") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"vite_css","hash":{},"data":data,"loc":{"start":{"line":21,"column":33},"end":{"line":21,"column":45}}}) : helper)))
    + "\">\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<!DOCTYPE html>\r\n<html lang=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"lang") || (depth0 != null ? lookupProperty(depth0,"lang") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lang","hash":{},"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":20}}}) : helper)))
    + "\">\r\n<head>\r\n  <meta charset=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"charset") || (depth0 != null ? lookupProperty(depth0,"charset") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"charset","hash":{},"data":data,"loc":{"start":{"line":4,"column":17},"end":{"line":4,"column":28}}}) : helper)))
    + "\">\r\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n\r\n  <title>"
    + alias4(((helper = (helper = lookupProperty(helpers,"site_title") || (depth0 != null ? lookupProperty(depth0,"site_title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"site_title","hash":{},"data":data,"loc":{"start":{"line":7,"column":9},"end":{"line":7,"column":23}}}) : helper)))
    + "</title>\r\n\r\n  <meta name=\"description\" content=\"Renato Vaz, um olhar além das lentes\">\r\n\r\n  <meta property=\"og:title\" content=\"Renato Vaz Portifólio\">\r\n  <meta property=\"og:description\" content=\"Renato Vaz, um olhar além das lentes\">\r\n  <meta property=\"og:locale\" content=\"pt_BR\">\r\n\r\n  <link rel=\"icon\" href=\""
    + alias4((lookupProperty(helpers,"asset")||(depth0 && lookupProperty(depth0,"asset"))||alias2).call(alias1,"src/assets/images/favicon.svg",{"name":"asset","hash":{},"data":data,"loc":{"start":{"line":17,"column":25},"end":{"line":17,"column":66}}}))
    + "\" type=\"image/svg+xml\">\r\n  <link rel=\"apple-touch-icon\" href=\""
    + alias4((lookupProperty(helpers,"asset")||(depth0 && lookupProperty(depth0,"asset"))||alias2).call(alias1,"src/assets/images/favicon-180x180.png",{"name":"asset","hash":{},"data":data,"loc":{"start":{"line":18,"column":37},"end":{"line":18,"column":86}}}))
    + "\">\r\n\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"is_dev") : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":2},"end":{"line":22,"column":13}}})) != null ? stack1 : "")
    + "</head>\r\n<body>\r\n\r\n<header>\r\n  <div class=\"global\">\r\n    <nav class=\"nav\">\r\n      <div class=\"navlink-wrap\">\r\n        <a href=\"/\" class=\"navlink\">Renato Vaz</a>\r\n      </div>\r\n      <div class=\"navlink-wrap\">\r\n        <a href=\"/sobre\" class=\"navlink\">Sobre</a>\r\n      </div>\r\n      <div class=\"navlink-wrap\">\r\n        <a href=\"mailto:oi@renatovaz.com.br\" class=\"navlink\">Contato</a>\r\n        <a href=\"https://linkedin.com/\" target=\"_blank\" class=\"navlink\">Linkedin</a>\r\n        <a href=\"https://instagram.com/\" target=\"_blank\" class=\"navlink\">Instagram</a>\r\n      </div>\r\n    </nav>\r\n  </div>\r\n</header>\r\n";
},"useData":true});

export default templates;
