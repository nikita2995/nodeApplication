module.exports =  {
  
  info : (req, res, next) => {

    let url                 = _.get(req, ['url'], ''),
        method              = _.get(req, ['method'], ''),
        body                = _.get(req, ['body'], {}),
        query               = _.get(req, ['query'], {});

    console.log('');
    return next();

  }
}