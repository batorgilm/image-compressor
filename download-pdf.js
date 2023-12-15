const fs = require('fs');
const Airtable = require('airtable');
const axios = require('axios');

const API_KEY = '';
const BASE = '';

const base = new Airtable({ apiKey: API_KEY }).base(BASE);

async function getAllImageDownload() {
  try {
    const students = await base.table('General').select().all();
    students.map(async (student) => {
      if (student.fields['pdf']) {
        const imageUrl = student.fields['pdf'][0].url;
        const filePath = `./temp-pdf/${student.fields['Student Number']}.pdf`;
        downloadImage(imageUrl, filePath)
          .then(() => {
            console.log('Image downloaded successfully!');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const downloadImage = async (url, filePath) => {
  try {
    const response = await axios.get(url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        resolve();
      });
      writer.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    throw new Error(`Image download failed: ${error.message}`);
  }
};

getAllImageDownload();
