import multer from 'multer';

const storage = multer.memoryStorage();

// For product image uploads — only allows image files
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WEBP images are allowed'));
    }
  },
});

// For bulk import — only allows spreadsheet files (CSV or Excel)
export const uploadSpreadsheet = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max — bigger, since 15,000 rows is a large file
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  },
});