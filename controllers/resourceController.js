var _ = require('lodash');
var async = require('async');
var jade = require('jade');
var fs = require('fs');

var resources = require('../config/resources.json');
var navigationLinks = require('../config/navigationLinks.json');
var users = require('../config/users.json');
var endpoints = require('../config/endpoints.json');
var environments = require('../config/environments.json');
var options = {};

var resourceController = function() {};

var META_TEMPLATE_PATH = './templates/{{templateType}}/meta.{{templateType}}';
var CSS_TEMPLATE_PATH = './templates/{{templateType}}/stylesheets.{{templateType}}';
var HEADER_TEMPLATE_PATH = './templates/{{templateType}}/header.{{templateType}}';
var FOOTER_TEMPLATE_PATH = './templates/{{templateType}}/footer.{{templateType}}';
var JS_TEMPLATE_PATH = './templates/{{templateType}}/scripts.{{templateType}}';

resourceController.init = function(req, res, next) {
  options.culture = (req.query.culture || req.headers.culture || 'en-us').toString().toLowerCase();
  options.clientId = (req.query.clientid || req.headers.clientid || '').toString().toLowerCase();
  options.environment = (req.query.env ||  req.headers.env || 'prod').toString().toLowerCase();
  options.pointSolutionId = (req.query.psid || req.headers.psid || '').toString().toLowerCase();
  options.templateTypeId = (req.query.ttid || req.headers.ttid || 'jade').toString().toLowerCase();
  options.domain = (req.query.domain || req.headers.domain || '').toString().toLowerCase();
  options.hostOverride = (req.query.hostoverride || req.headers.hostoverride || 'ignitionone').toString().toLowerCase();
  options.pretty = !!((req.query.pretty === '0' || req.query.pretty === 'false' ? null : req.query.pretty) || (req.headers.pretty === '0' || req.headers.pretty === 'false' ? null : req.headers.pretty) || null);
  options.isDemo = !!((req.query.demo === '0' || req.query.demo === 'false' ? null : req.query.demo) || (req.headers.demo === '0' || req.headers.demo === 'false' ? null : req.headers.demo) || null);
  options.userId = req.query.userid || req.headers.userid || '';

  res.header('Access-Control-Allow-Origin', '*');

  next();
};
resourceController.htmlMeta = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getMetaHtml(defaultOptions, function(err, html) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.send(500, err);
      }

      return res.json({html: html});
    });
  });
};
resourceController.htmlCss = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getCssHtml(defaultOptions, function(err, html) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.send(500, err);
      }

      return res.json({html: html});
    });
  });
};
resourceController.htmlJs = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getJsHtml(defaultOptions, function(err, html) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.send(500, err);
      }

      return res.json({html: html});
    });
  });
};
resourceController.htmlHeader = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getHeaderHtml(defaultOptions, function(err, html) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.send(500, err);
      }

      return res.json({html: html});
    });
  });
};
resourceController.htmlFooter = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getFooterHtml(defaultOptions, function(err, html) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.send(500, err);
      }

      return res.json({html: html});
    });
  });
};
resourceController.html = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getHtml(defaultOptions, function(err, data) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.dataMeta = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getMetaData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.dataCss = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getCssData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.dataHeader = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getHeaderData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.dataFooter = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    var currentAccount = _.cloneDeep(_.find(defaultOptions.user.accounts, {id: options.clientId}));

    if(currentAccount) {
      defaultOptions.user.currentAccount = currentAccount;
    }

    getFooterData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.dataJs = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getJsData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.data = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getData(defaultOptions, function(err, data) {
      if(err) {
        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.templateMeta = function(req, res) {
  var templateFile = META_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
  fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
    if(err) {
      if(err.errno && err.errno === 34) {
        err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

        return res.send(404, err);
      }

      return res.send(500, err);
    }

    return res.json({type: options.templateTypeId, template: data});
  });
};
resourceController.templateCss = function(req, res) {
  var templateFile = CSS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
  fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
    if(err) {
      if(err.errno && err.errno === 34) {
        err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

        return res.send(404, err);
      }

      return res.send(500, err);
    }

    return res.json({type: options.templateTypeId, template: data});
  });
};
resourceController.templateHeader = function(req, res) {
  var templateFile = HEADER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
  fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
    if(err) {
      if(err.errno && err.errno === 34) {
        err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

        return res.send(404, err);
      }

      return res.send(500, err);
    }

    return res.json({type: options.templateTypeId, template: data});
  });
};
resourceController.templateFooter = function(req, res) {
  var templateFile = FOOTER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
  fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
    if(err) {
      if(err.errno && err.errno === 34) {
        err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

        return res.send(404, err);
      }

      return res.send(500, err);
    }

    return res.json({type: options.templateTypeId, template: data});
  });
};
resourceController.templateJs = function(req, res) {
  var templateFile = JS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
  fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
    if(err) {
      if(err.errno && err.errno === 34) {
        err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

        return res.send(404, err);
      }

      return res.send(500, err);
    }

    return res.json({type: options.templateTypeId, template: data});
  });
};
resourceController.templates = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getTemplates(defaultOptions, function(err, data) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};
resourceController.endpoints = function(req, res) {
  return res.json(endpoints);
};
resourceController.all = function(req, res) {
  getDefaultOptions(function(err, defaultOptions) {
    getAll(defaultOptions, function(err, data) {
      if(err) {
        if(err.errno && err.errno === 34) {
          err = {message: 'No template of type "' + options.templateTypeId + '"" was found.'};

          return res.send(404, err);
        }

        return res.json(500, err);
      }

      return res.json(data);
    });
  });
};

function getDefaultOptions(callback) {
  async.parallel({
    hubLinks: function(callback) {
      return getHubLinks(options.userId, callback);
    },
    channelLinks: function(callback) {
      return getChannelLinks(options.userId, callback);
    }
  },
  function(err, results) {
    if(err) {
      return callback(err, null);
    }

    return callback(null, {
      isDemo: options.isDemo,
      mainNavLink: null,
      hubLinks: results.hubLinks,
      channelLinks: results.channelLinks
    });
  });
}

function getCssData(data, callback) {
  var group = _.find(resources, {'group': 'head', 'type': 'link'});
  var env = _.cloneDeep(_.find(environments, {id: options.environment})); // Clone so you don't pollute config data

  if(!env) {
    return callback({message: 'No environment defined found for given id "' + options.env + '"'}, null);
  }

  env.domain = getDomain(options.domain || env.domain);

  var filteredItems = _.cloneDeep(group.items);
  // var filteredItems = _.filter(_.cloneDeep(group.items), function(item){ // Clone so you don't pollute config data
  //   return item.attributes && item.attributes.rel && item.attributes.rel.toLowerCase() === 'stylesheet';
  // })
  filterItems = _.map(filteredItems, function(item) {
    item.attributes.href = item.attributes.href.split('{{domain}}').join(env.domain);

    return item;
  });
  filteredItems = _.sortBy(filteredItems, 'sortOrder');

  return callback(null, filteredItems);
}

function getJsData(data, callback) {
  var group = _.find(resources, {'group': 'body', 'type': 'script'});
  var env = _.cloneDeep(_.find(environments, {id: options.environment})); // Clone so you don't pollute config data

  if(!env) {
    return callback({message: 'No environment defined found for given id "' + options.env + '"'}, null);
  }

  env.domain = getDomain(options.domain || env.domain);

  var filteredItems = _.map(_.cloneDeep(group.items), function(item) {// Clone so you don't pollute config data
    item.attributes.src = item.attributes.src.split('{{domain}}').join(env.domain);

    return item;
  });
  filteredItems = _.sortBy(filteredItems, 'sortOrder');

  return callback(null, filteredItems);
}

function getHeaderData(data, callback) {
  data = _.omit(data, 'pretty');
  data.mainNavLink = options.pointSolutionId ? _.find(navigationLinks, {id: options.pointSolutionId}) : null;

  return callback(null, data);
}

function getFooterData(data, callback) {
  return callback(null, {});
}

function getMetaData(data, callback) {
  var group = _.find(resources, {'group': 'head', 'type': 'meta'});
  var filteredItems = _.cloneDeep(group.items);
  filteredItems = _.sortBy(filteredItems, 'sortOrder');

  return callback(null, filteredItems);
}

function getData(defaultOptions, callback) {
  async.parallel({
    meta: function(callback) {
      return getMetaData(defaultOptions, callback);
    },
    css: function(callback) {
      return getCssData(defaultOptions, callback);
    },
    header: function(callback) {
      return getHeaderData(defaultOptions, callback);
    },
    footer: function(callback) {
      return getFooterData(defaultOptions, callback);
    },
    js: function(callback) {
      return getJsData(defaultOptions, callback);
    }
  },
  function(err, results) {
    if(err) {
      return callback(err, null);
    }

    return callback(null, results)
  });
}

function getMetaHtml(data, callback) {
  getMetaData(null, function(err, metadata) {
    var templateFile = META_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
    jade.renderFile(templateFile, {pretty: options.pretty, meta: metadata}, function(err, html) {
      if(err) {
        return callback(err, null);
      }

      return callback(null, html);
    });
  });
}

function getCssHtml(data, callback) {
  getCssData(null, function(err, stylesheets) {
    var templateFile = CSS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
    jade.renderFile(templateFile, {pretty: options.pretty, css: stylesheets}, function(err, html) {
      if(err) {
        return callback(err, null);
      }

      return callback(null, html);
    });
  });
}

function getJsHtml(data, callback) {
  getJsData(null, function(err, scripts) {
    var templateFile = JS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
    jade.renderFile(templateFile, {pretty: options.pretty, js: scripts}, function(err, html) {
      if(err) {
        return callback(err, null);
      }

      return callback(null, html);
    });
  });
}

function getHeaderHtml(data, callback) {
  getHeaderData(data, function(err, data) {
    data.mainNavLink = options.pointSolutionId ? _.find(navigationLinks, {id: options.pointSolutionId}) : null;
    var templateFile = HEADER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
    jade.renderFile(templateFile, {header: _.extend(data, {pretty: options.pretty})}, function(err, html) {
      if(err) {
        console.log(err);

        return callback(err, null);
      }

      return callback(null, html);
    });
  });
}

function getFooterHtml(data, callback) {
  getFooterData(data, function(err, data) {
    var templateFile = FOOTER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
    jade.renderFile(templateFile,  _.extend(data, {pretty: options.pretty}), function(err, html) {
      if(err) {
        return callback(err, null);
      }

      return callback(null, html);
    });
  });
}

function getHtml(data, callback) {
  async.parallel({
    meta: function(callback) {
      return getMetaHtml(data, callback);
    },
    css: function(callback) {
      return getCssHtml(data, callback);
    },
    header: function(callback) {
      return getHeaderHtml(data, callback);
    },
    footer: function(callback) {
      return getFooterHtml(data, callback);
    },
    js: function(callback) {
      return getJsHtml(data, callback);
    }
  },
  function(err, results) {
    if(err) {
      return callback(err, null);
    }

    return callback(null, results)
  });
}

function getMetaTemplate(data, callback) {
  switch(options.templateTypeId){
    case 'jade':
      return callback(null, META_TEMPLATE_PATH);
    default:
      return callback({message: 'No template of type "' + options.templateTypeId + '"" was found.'});
  }
}

function getCssTemplate(data, callback) {
  switch(options.templateTypeId){
    case 'jade':
      return callback(null, CSS_TEMPLATE_PATH);
    default:
      return callback({message: 'No template of type "' + options.templateTypeId + '"" was found.'});
  }
}

function getHeaderTemplate(data, callback) {
  switch(options.templateTypeId){
    case 'jade':
      return callback(null, HEADER_TEMPLATE_PATH);
    default:
      return callback({message: 'No template of type "' + options.templateTypeId + '"" was found.'});
  }
}

function getFooterTemplate(data, callback) {
  switch(options.templateTypeId){
    case 'jade':
      return callback(null, FOOTER_TEMPLATE_PATH);
    default:
      return callback({message: 'No template of type "' + options.templateTypeId + '"" was found.'});
  }
}

function getJsTemplate(data, callback) {
  switch(options.templateTypeId){
    case 'jade':
      return callback(null, JS_TEMPLATE_PATH);
    default:
      return callback({message: 'No template of type "' + options.templateTypeId + '"" was found.'});
  }
}

function getTemplates(data, callback) {
  async.parallel({
    meta: function(callback) {
      var templateFile = META_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
      fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
        if(err) {
          return callback(err, null);
        }

        return callback(null, {type: options.templateTypeId, template: data});
      });
    },
    css: function(callback) {
      var templateFile = CSS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
      fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
        if(err) {
          return callback(err, null);
        }

        return callback(null, {type: options.templateTypeId, template: data});
      });
    },
    header: function(callback) {
      var templateFile = HEADER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
      fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
        if(err) {
          return callback(err, null);
        }

        return callback(null, {type: options.templateTypeId, template: data});
      });
    },
    footer: function(callback) {
      var templateFile = FOOTER_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
      fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
        if(err) {
          return callback(err, null);
        }

        return callback(null, {type: options.templateTypeId, template: data});
      });
    },
    js: function(callback) {
      var templateFile = JS_TEMPLATE_PATH.split('{{templateType}}').join(options.templateTypeId);
      fs.readFile(templateFile, {encoding: 'utf-8'}, function(err, data) {
        if(err) {
          return callback(err, null);
        }

        return callback(null, {type: options.templateTypeId, template: data});
      });
    }
  },
  function(err, results) {
    if(err) {
      return callback(err, null);
    }

    return callback(null, results)
  });
}

function getAll(data, callback) {
  async.parallel({
    data: function(callback) {
      return getData(data, callback);
    },
    templates: function(callback) {
      return getTemplates(data, callback);
    },
    html: function(callback) {
      return getHtml(data, callback);
    }
  },
  function(err, results) {
    if(err) {
      return callback(err, null);
    }

    return callback(null, results)
  });
}

function getDomain(domain) {
  if(domain && domain !== '/' && domain.indexOf('.') !== 0 && domain.indexOf('http') !== 0) {
    domain = '//' + domain;
  }
  else if(domain === '/') {
    domain = '';
  }

  return domain;
}

function getHubLinks(userId, callback) {
  var items = _.first(navigationLinks, 'isHub')
  var envStr = getEnvironmentSubdomain(options.environment);
  items = _.map(items, function(item) {
    item.uri = '//' + item.id + envStr + '.' + options.hostOverride + '.com';

    return item;
  });

  return callback(null, _.sortBy(items, 'sortOrder'));
}

function getChannelLinks(userId, callback) {
  var items = _.reject(navigationLinks, 'isHub');
  var envStr = getEnvironmentSubdomain(options.environment);
  items = _.map(items, function(item) {
    item.uri = '//' + item.id + envStr + '.' + options.hostOverride + '.com';

    return item;
  });

  return callback(null, _.sortBy(items, 'sortOrder'));
}

function getUserInfo(userId, callback) {
  return callback(null, _.find(users, {id: options.userId}));
}

function getEnvironmentSubdomain(env) {
  if(options.environment === 'prod') {
    return '';
  }

  return '-' + env;
}

module.exports = resourceController;
