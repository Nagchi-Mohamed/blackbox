const fs = require('fs');
const path = require('path');
const Lesson = require('../models/Lesson');

const downloadPDF = async (lessonId, userId) => {
  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Increment download count
    lesson.pdfDownloads += 1;
    await lesson.save();

    const filePath = path.join(__dirname, '../uploads', lesson.pdfUrl);
    if (!fs.existsSync(filePath)) throw new Error('PDF file not found');

    return {
      filePath,
      fileName: `lesson_${lessonId}.pdf`,
      contentType: 'application/pdf'
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  downloadPDF
};