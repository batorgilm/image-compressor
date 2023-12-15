const fs = require('fs');
const Airtable = require('airtable');
const axios = require('axios');

const API_KEY = '';
const BASE = '';

const base = new Airtable({ apiKey: API_KEY }).base(BASE);

async function getAllImageDownload() {
  try {
    const students = await base.table('AlumniCopy').select().all();
    const hashmap = new Map();
    fs.readdirSync('./output').forEach(async (file) => {
      const fileNameSplited = file.split('.');
      if (fileNameSplited[1] === 'jpg') {
        hashmap.set(fileNameSplited[0], fileNameSplited[0]);
      }
    });
    students.map(async (student) => {
      if (hashmap.has(student.fields.studentCode)) {
        axios
          .post(
            'https://int-alumni-management-microservice-h0580secn-pinecone-studio.vercel.app/api/upload-alumni-file',
            {
              alumniId: student.fields.alumniId,
              fileName: student.fields.studentCode,
              studentNumber: student.fields.studentCode,
              fieldName: 'profileImageUrl',
              file: fs.createReadStream(
                `./output/${student.fields.studentCode}.jpg.webp`
              ),
            },
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then(({ data }) => console.log(data));
      }
    });
  } catch (error) {
    console.log(error);
  }
}

getAllImageDownload();
