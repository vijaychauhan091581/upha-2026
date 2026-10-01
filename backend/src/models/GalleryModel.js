const db = require('../config/database');
const { buildMediaUrl } = require('../utils/mediaUtils');

class GalleryModel {
  static findAlbums(req) {
    const albums = db.prepare('SELECT * FROM gallery_galleryalbum ORDER BY id DESC').all();
    return albums.map((a) => this.formatAlbum(a, req));
  }

  static findAlbumById(id, req) {
    const album = db.prepare('SELECT * FROM gallery_galleryalbum WHERE id = ?').get(id);
    return album ? this.formatAlbum(album, req) : null;
  }

  static findPhotos(albumId, req) {
    const photos = db.prepare('SELECT * FROM gallery_galleryphoto WHERE album_id = ? ORDER BY id DESC').all(albumId);
    return photos.map((p) => ({
      id: p.id,
      image: buildMediaUrl(req, p.image),
      is_cover: Boolean(p.is_cover),
      created_at: p.created_at,
    }));
  }

  static createAlbum({ title, date = null, description = '', event_id = null, category = 'General', youtube_link = '' }) {
    const now = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO gallery_galleryalbum (title, date, description, created_at, updated_at, event_id, category, youtube_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(title, date, description, now, now, event_id, category, youtube_link);
    return db.prepare('SELECT * FROM gallery_galleryalbum WHERE id = ?').get(info.lastInsertRowid);
  }

  static deleteAlbum(id) {
    db.prepare('DELETE FROM gallery_galleryphoto WHERE album_id = ?').run(id);
    return db.prepare('DELETE FROM gallery_galleryalbum WHERE id = ?').run(id);
  }

  static addPhoto({ album_id, image, is_cover = 0 }) {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO gallery_galleryphoto (album_id, image, is_cover, created_at) VALUES (?, ?, ?, ?)');
    const info = stmt.run(album_id, image, is_cover ? 1 : 0, now);
    return db.prepare('SELECT * FROM gallery_galleryphoto WHERE id = ?').get(info.lastInsertRowid);
  }

  static deletePhoto(id) {
    return db.prepare('DELETE FROM gallery_galleryphoto WHERE id = ?').run(id);
  }

  static formatAlbum(a, req) {
    if (!a) return null;
    const photos = this.findPhotos(a.id, req);
    const coverPhoto = photos.find((p) => p.is_cover) || photos[0] || null;

    return {
      id: a.id,
      title: a.title,
      date: a.date,
      description: a.description,
      category: a.category,
      youtube_link: a.youtube_link,
      created_at: a.created_at,
      updated_at: a.updated_at,
      cover_image: coverPhoto ? coverPhoto.image : null,
      photos,
      photo_count: photos.length,
    };
  }
}

module.exports = GalleryModel;
