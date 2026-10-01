const path = require('path');
const db = require('../config/database');
const GalleryModel = require('../models/GalleryModel');

function getRelativePath(file) {
  if (!file) return null;
  return path.relative(path.resolve(__dirname, '../../../backend/media'), file.path).replace(/\\/g, '/');
}

class GalleryController {
  static async listAlbums(req, res) {
    try {
      const albums = GalleryModel.findAlbums(req);
      return res.json({ success: true, albums });
    } catch (err) {
      console.error('List albums error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve albums.' });
    }
  }

  static async createAlbum(req, res) {
    try {
      const { title, description, category, date, youtube_link } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Album title is required.' });
      }

      const album = GalleryModel.createAlbum({
        title,
        description: description || '',
        category: category || 'General',
        date: date || null,
        youtube_link: youtube_link || '',
      });

      // Handle photos if uploaded
      const files = req.files || [];
      for (let i = 0; i < files.length; i++) {
        const p = getRelativePath(files[i]);
        GalleryModel.addPhoto({ album_id: album.id, image: p, is_cover: i === 0 ? 1 : 0 });
      }

      return res.status(201).json({
        success: true,
        message: 'Album created successfully.',
        album: GalleryModel.findAlbumById(album.id, req),
      });
    } catch (err) {
      console.error('Create album error:', err);
      return res.status(500).json({ success: false, message: 'Failed to create album.' });
    }
  }

  static async deleteAlbum(req, res) {
    try {
      const { album_id } = req.params;
      GalleryModel.deleteAlbum(album_id);
      return res.json({ success: true, message: 'Album deleted successfully.' });
    } catch (err) {
      console.error('Delete album error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete album.' });
    }
  }

  static async addPhotosToAlbum(req, res) {
    try {
      const { album_id } = req.params;
      const files = req.files || [];
      for (const file of files) {
        GalleryModel.addPhoto({ album_id, image: getRelativePath(file) });
      }
      return res.status(201).json({ success: true, message: 'Photos added successfully.' });
    } catch (err) {
      console.error('Add photos error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add photos.' });
    }
  }

  static async deletePhoto(req, res) {
    try {
      const { photo_id } = req.params;
      GalleryModel.deletePhoto(photo_id);
      return res.json({ success: true, message: 'Photo deleted successfully.' });
    } catch (err) {
      console.error('Delete photo error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete photo.' });
    }
  }
}

module.exports = GalleryController;
