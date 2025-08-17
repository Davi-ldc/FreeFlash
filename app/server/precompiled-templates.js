import Handlebars from "handlebars/runtime";

const template = Handlebars.template;
const templates = {};

templates['home'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = container.invokePartial(lookupProperty(partials,"header"),depth0,{"name":"header","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\r\n<main id=\"sccont\" class=\"main\" data-scroll-container>\r\n  E ai? O que você vai construir?\r\n"
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

  return "<footer class=\"footer\">\r\n\r\n</footer>\r\n<script type=\"module\" src=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"vite_js") || (depth0 != null ? lookupProperty(depth0,"vite_js") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"vite_js","hash":{},"data":data,"loc":{"start":{"line":4,"column":27},"end":{"line":4,"column":40}}}) : helper)))
    + "\"></script>\r\n</body>\r\n</html>";
},"useData":true});
templates['header'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <meta name=\"description\" content=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":10,"column":38},"end":{"line":10,"column":53}}}) : helper)))
    + "\">\r\n    <meta property=\"og:description\" content=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":11,"column":45},"end":{"line":11,"column":60}}}) : helper)))
    + "\">\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <link rel=\"stylesheet\" href=\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"vite_css") || (depth0 != null ? lookupProperty(depth0,"vite_css") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"vite_css","hash":{},"data":data,"loc":{"start":{"line":22,"column":33},"end":{"line":22,"column":45}}}) : helper)))
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
    + "</title>\r\n\r\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"description") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":12,"column":9}}})) != null ? stack1 : "")
    + "  <meta property=\"og:title\" content=\"\">\r\n  <meta property=\"og:image\" content=\"\">\r\n  <meta property=\"og:url\" content=\"\">\r\n  <meta property=\"og:locale\" content=\"pt_BR\">\r\n\r\n  <!-- <link rel=\"icon\" href=\""
    + alias4((lookupProperty(helpers,"asset")||(depth0 && lookupProperty(depth0,"asset"))||alias2).call(alias1,"src/assets/images/favicon.svg",{"name":"asset","hash":{},"data":data,"loc":{"start":{"line":18,"column":30},"end":{"line":18,"column":71}}}))
    + "\" type=\"image/svg+xml\"> -->\r\n  <!-- <link rel=\"apple-touch-icon\" href=\""
    + alias4((lookupProperty(helpers,"asset")||(depth0 && lookupProperty(depth0,"asset"))||alias2).call(alias1,"src/assets/images/favicon-180x180.png",{"name":"asset","hash":{},"data":data,"loc":{"start":{"line":19,"column":42},"end":{"line":19,"column":91}}}))
    + "\"> -->\r\n\r\n"
    + ((stack1 = lookupProperty(helpers,"unless").call(alias1,(depth0 != null ? lookupProperty(depth0,"is_dev") : depth0),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":21,"column":2},"end":{"line":23,"column":13}}})) != null ? stack1 : "")
    + "</head>\r\n<body>\r\n\r\n<header>\r\n</header>\r\n";
},"useData":true});

export default templates;
