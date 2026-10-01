function buildMediaUrl(req, relativePath) {
  if (!relativePath) return null;
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  const cleanPath = relativePath.replace(/^\/?media\//, '').replace(/^\/+/, '');
  const host = req ? req.get('host') : '127.0.0.1:8000';
  const protocol = req ? req.protocol : 'http';
  return `${protocol}://${host}/media/${cleanPath}`;
}

module.exports = {
  buildMediaUrl,
};
