const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/galleryController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { createUploader } = require('../middleware/uploadMiddleware');

const albumUpload = createUploader('gallery').array('photos', 20);

// Public Gallery Routes
router.get(['/gallery/albums', '/gallery/albums/'], GalleryController.listAlbums);
router.post(['/gallery/albums/create', '/gallery/albums/create/'], authenticate(true), albumUpload, GalleryController.createAlbum);

// Admin Gallery Routes
router.post(['/admin/gallery/albums/create', '/admin/gallery/albums/create/'], authenticate(true), requireAdmin, albumUpload, GalleryController.createAlbum);
router.delete(['/admin/gallery/albums/:album_id/delete', '/admin/gallery/albums/:album_id/delete/'], authenticate(true), requireAdmin, GalleryController.deleteAlbum);
router.post(['/admin/gallery/albums/:album_id/photos', '/admin/gallery/albums/:album_id/photos/'], authenticate(true), requireAdmin, albumUpload, GalleryController.addPhotosToAlbum);
router.delete(['/admin/gallery/photos/:photo_id/delete', '/admin/gallery/photos/:photo_id/delete/'], authenticate(true), requireAdmin, GalleryController.deletePhoto);

module.exports = router;
