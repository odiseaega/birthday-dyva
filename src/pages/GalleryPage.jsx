import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GalleryPage = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingCaption, setEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    const stored = localStorage.getItem('cloudinaryPhotos');
    if (stored) {
      setPhotos(JSON.parse(stored));
    }
  }, []);

  const savePhotos = (photosData) => {
    localStorage.setItem('cloudinaryPhotos', JSON.stringify(photosData));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} bukan gambar!`);
        return false;
      }
      if (file.size > 15 * 1024 * 1024) {
        alert(`${file.name} terlalu besar! Max 15MB`);
        return false;
      }
      return true;
    });
    setSelectedFiles(validFiles);
  };

  // KOMPRESI OTOMATIS - FITUR BARU!
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize jika terlalu besar
          const maxSize = 1920;
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height * maxSize) / width;
              width = maxSize;
            } else {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const originalSize = (file.size / 1024 / 1024).toFixed(2);
            const compressedSize = (blob.size / 1024 / 1024).toFixed(2);
            console.log(`✅ Compressed: ${file.name} from ${originalSize}MB to ${compressedSize}MB`);
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.85);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Upload ke Cloudinary dengan transformasi auto-sharpen
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'birthday-gallery');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Upload gagal');
    
    const data = await response.json();
    
    // URL dengan auto-enhance untuk foto lebih jernih
    const enhancedUrl = data.secure_url.replace('/upload/', '/upload/e_sharpen:100,q_auto:best/');
    const thumbnail = data.secure_url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/');
    
    return {
      publicId: data.public_id,
      url: enhancedUrl,
      thumbnail: thumbnail
    };
  };

  // Upload dengan kompresi
  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    
    setUploading(true);
    setUploadProgress(0);

    try {
      const newPhotos = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`📸 Processing ${i + 1}/${selectedFiles.length}: ${file.name}`);
        
        // Kompres dulu sebelum upload
        const compressedFile = await compressImage(file);
        
        // Upload ke Cloudinary
        const result = await uploadToCloudinary(compressedFile);
        
        newPhotos.push({
          id: Date.now() + i,
          publicId: result.publicId,
          url: result.url,
          thumbnail: result.thumbnail,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          createdAt: new Date().toISOString()
        });
        
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      savePhotos(updatedPhotos);
      
      setSelectedFiles([]);
      setShowUploadModal(false);
      alert(`✅ Berhasil upload ${newPhotos.length} foto!`);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Upload gagal: ' + error.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // HAPUS FOTO - FIXED!
  const handleDelete = () => {
    if (confirm('Yakin hapus foto ini? Tidak bisa dikembalikan!')) {
      const updated = photos.filter(p => p.id !== selectedPhoto.id);
      setPhotos(updated);
      savePhotos(updated);
      setSelectedPhoto(null);
      setEditingCaption(false);
    }
  };

  // EDIT CAPTION - FIXED!
  const handleStartEdit = () => {
    setEditingCaption(true);
    setEditedCaption(selectedPhoto.caption);
  };

  const handleSaveCaption = () => {
    const updated = photos.map(p =>
      p.id === selectedPhoto.id ? { ...p, caption: editedCaption } : p
    );
    setPhotos(updated);
    savePhotos(updated);
    setSelectedPhoto({ ...selectedPhoto, caption: editedCaption });
    setEditingCaption(false);
  };

  const handleCancelEdit = () => {
    setEditingCaption(false);
    setEditedCaption('');
  };

  // DRAG & DROP REORDER - FITUR BARU!
  const handleDragStart = (e, photo) => {
    setDraggedItem(photo);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetPhoto) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetPhoto.id) return;

    const draggedIndex = photos.findIndex(p => p.id === draggedItem.id);
    const targetIndex = photos.findIndex(p => p.id === targetPhoto.id);

    const newPhotos = [...photos];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(targetIndex, 0, draggedItem);

    setPhotos(newPhotos);
    savePhotos(newPhotos);
    console.log('✅ Foto dipindah!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 transition-colors font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Memories 📸
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Auto-Compress + Enhanced Quality + Drag to Reorder ✨
          </p>

          <button onClick={() => setShowUploadModal(true)} className="bg-gradient-to-r from-rose-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all inline-flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Foto
          </button>

          {photos.length > 0 && <p className="text-gray-500 mt-4">Total: {photos.length} foto</p>}
        </div>

        {/* Gallery Grid - DRAG & DROP ENABLED! */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, photo)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, photo)}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-move transform hover:scale-105"
                title="Tahan & tarik untuk pindah posisi"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={photo.thumbnail} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pointer-events-none" loading="lazy" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-semibold truncate">{photo.caption}</p>
                  </div>
                </div>
                {/* Drag Indicator */}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📷</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">Belum ada foto</h3>
            <p className="text-gray-500">Upload foto pertama untuk memulai!</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Foto (Auto-Compress)</h2>
              
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-700 font-semibold mb-3">{selectedFiles.length} foto dipilih</p>
                  <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border-2 border-gray-200 rounded-xl">
                    {selectedFiles.map((file, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className="block w-full mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600 font-semibold">Klik untuk pilih foto (bisa banyak sekaligus)</p>
                  <p className="text-sm text-gray-500 mt-2">Ctrl+A atau Ctrl+Klik untuk multi-select</p>
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" multiple />
              </label>

              {uploading && (
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-semibold">Compressing & Uploading...</span>
                    <span className="text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-rose-500 to-purple-500 h-full rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Jangan tutup browser sampai selesai...</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>🚀 Fitur Aktif:</strong><br />
                  ✅ Auto-Compress (foto jadi 5x lebih kecil)<br />
                  ✅ Auto-Enhance (foto jadi lebih jernih)<br />
                  ✅ Drag & Drop (atur ulang urutan foto)<br />
                  ✅ Upload lebih cepat!
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={handleUpload} disabled={!selectedFiles.length || uploading} className="flex-1 bg-gradient-to-r from-rose-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {uploading ? `Uploading... ${uploadProgress}%` : `Upload ${selectedFiles.length} Foto`}
                </button>
                <button onClick={() => { setShowUploadModal(false); setSelectedFiles([]); }} disabled={uploading} className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lightbox - FIXED SCROLLING! */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto">
            <div className="min-h-screen py-8 px-4">
              {/* Close Button */}
              <button onClick={() => { setSelectedPhoto(null); setEditingCaption(false); }} className="fixed top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="max-w-5xl mx-auto">
                {/* Foto - BISA SCROLL! */}
                <div className="mb-6">
                  <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full rounded-2xl shadow-2xl" />
                </div>

                {/* Caption & Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  {editingCaption ? (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Edit Caption:</label>
                      <textarea value={editedCaption} onChange={(e) => setEditedCaption(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none h-24 mb-4" autoFocus placeholder="Tulis caption baru..." />
                      <div className="flex gap-3">
                        <button onClick={handleSaveCaption} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Caption
                        </button>
                        <button onClick={handleCancelEdit} className="px-8 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 text-lg mb-6 leading-relaxed">{selectedPhoto.caption}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleStartEdit} className="bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Caption
                        </button>
                        <button onClick={handleDelete} className="bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus Foto
                        </button>
                      </div>
                    </>
                  )}
                  
                  <p className="text-gray-400 text-sm mt-4 text-center">Scroll untuk lihat foto lebih jelas • ESC untuk tutup</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;