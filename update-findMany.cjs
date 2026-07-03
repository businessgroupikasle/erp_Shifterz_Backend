const fs = require('fs');
let content = fs.readFileSync('src/routes/api.ts', 'utf8');

const models = ['lead', 'customer', 'job', 'invoice', 'carIn', 'outPass'];

models.forEach(model => {
  const regex = new RegExp(`db\\.${model}\\.findMany\\(\\{([^{}]*)\\}?\\)`, 'g');
  content = content.replace(regex, (match, inner) => {
    if (inner.includes('where:')) {
      return match.replace('where: {', 'where: { isDeleted: false, ');
    } else {
      return `db.${model}.findMany({ where: { isDeleted: false }, ${inner} })`;
    }
  });
  
  // also findMany() with no args
  const regexEmpty = new RegExp(`db\\.${model}\\.findMany\\(\\)(?!\\s*;)`, 'g');
  content = content.replace(regexEmpty, `db.${model}.findMany({ where: { isDeleted: false } })`);
});

fs.writeFileSync('src/routes/api.ts', content);
console.log("Updated findMany in api.ts");
