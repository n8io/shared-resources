module.exports = function(express){
  var resourceRouter = express.Router();
  var resourceController = require('../controllers/resourceController');

  resourceRouter.use(function(req, res, next) {
    for (var key in req.query){
      req.query[key.toLowerCase()] = req.query[key];
    }
    next();
  });
  resourceRouter.get('*', resourceController.init);
  resourceRouter.get('/favicon.*', function(req,res){ return res.send(200); });
  resourceRouter.get('/html/meta', resourceController.htmlMeta);
  resourceRouter.get('/html/css', resourceController.htmlCss);
  resourceRouter.get('/html/js', resourceController.htmlJs);
  resourceRouter.get('/html/header', resourceController.htmlHeader);
  resourceRouter.get('/html/footer', resourceController.htmlFooter);
  resourceRouter.get('/html', resourceController.html);
  resourceRouter.get('/data/meta', resourceController.dataMeta);
  resourceRouter.get('/data/css', resourceController.dataCss);
  resourceRouter.get('/data/js', resourceController.dataJs);
  resourceRouter.get('/data/header', resourceController.dataHeader);
  resourceRouter.get('/data/footer', resourceController.dataFooter);
  resourceRouter.get('/templates/meta', resourceController.templateMeta);
  resourceRouter.get('/templates/css', resourceController.templateCss);
  resourceRouter.get('/templates/header', resourceController.templateHeader);
  resourceRouter.get('/templates/footer', resourceController.templateFooter);
  resourceRouter.get('/templates/js', resourceController.templateJs);
  resourceRouter.get('/templates', resourceController.templates);
  resourceRouter.get('/data', resourceController.data);
  resourceRouter.get('/endpoints', resourceController.endpoints);
  resourceRouter.get('*', resourceController.all);

  return resourceRouter;
};