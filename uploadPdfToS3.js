const fs = require('fs');
const Airtable = require('airtable');
const axios = require('axios');

const API_KEY = '';
const BASE = '';

const base = new Airtable({ apiKey: API_KEY }).base(BASE);

async function getAllPdf() {
  try {
    const students = await base.table('AlumniCopy').select().all();
    const hashmap = new Map();
    fs.readdirSync('./output-pdf').forEach(async (file) => {
      const fileNameSplited = file.split('-');
      if (fileNameSplited[1].split('.')[1] === 'pdf') {
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
              fileName: `${student.fields.studentCode}.pdf`,
              studentNumber: student.fields.studentCode,
              fieldName: 'projectIntroduction',
              file: fs.createReadStream(
                `./output-pdf/${student.fields.studentCode}-min.pdf`
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

getAllPdf();
