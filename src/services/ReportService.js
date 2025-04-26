const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const { NotFoundError } = require('../errors');

class ReportService {
  constructor() {
    this.reportsDir = path.join(__dirname, '../../reports');
  }

  async generatePDF(html, filename) {
    try {
      const browser = await puppeteer.launch({
        headless: 'new'
      });
      const page = await browser.newPage();
      
      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Ensure reports directory exists
      await fs.mkdir(this.reportsDir, { recursive: true });

      // Generate PDF
      const pdfPath = path.join(this.reportsDir, filename);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });

      await browser.close();
      return pdfPath;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  async generateStudentReport(studentId, data) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Progress Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="section">
            <h2>Student Information</h2>
            <p>Name: ${data.studentName}</p>
            <p>ID: ${studentId}</p>
          </div>
          <div class="section">
            <h2>Course Progress</h2>
            <table>
              <tr>
                <th>Course</th>
                <th>Progress</th>
                <th>Last Activity</th>
              </tr>
              ${data.courses.map(course => `
                <tr>
                  <td>${course.name}</td>
                  <td>${course.progress}%</td>
                  <td>${course.lastActivity}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          <div class="section">
            <h2>Interventions</h2>
            <table>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Effectiveness</th>
              </tr>
              ${data.interventions.map(intervention => `
                <tr>
                  <td>${intervention.date}</td>
                  <td>${intervention.type}</td>
                  <td>${intervention.status}</td>
                  <td>${intervention.effectiveness || 'N/A'}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </body>
      </html>
    `;

    const filename = `student_report_${studentId}_${Date.now()}.pdf`;
    return this.generatePDF(html, filename);
  }

  async getReport(reportId) {
    const reportPath = path.join(this.reportsDir, reportId);
    try {
      await fs.access(reportPath);
      return reportPath;
    } catch (error) {
      throw new NotFoundError('Report not found');
    }
  }
}

module.exports = new ReportService(); 