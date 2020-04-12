module.exports = fn => {
  if (fn.length <= 3) {
    return (req, res, next) => fn(req, res, next).catch(next)
  } else {
    return (err, req, res, next) => fn(err, req, res, next).catch(next)
  }
}
