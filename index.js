import http from "http";
import { v4 } from "uuid";

const port = 3000;

const grades = [
  // { studentName: "John Doe", subject: "English", grade: 90 },
  // { studentName: "Jane Smith", subject: "English", grade: 85 },
  // { studentName: "Alice Johnson", subject: "English", grade: 78 },
  // { studentName: "Bob Brown", subject: "English", grade: 95 },
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const id = url.split("/")[2];

    if (url === "/grades" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(grades));
      return;
    }

    if (url === "/grades" && method === "POST") {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: v4(), studentName, subject, grade };
      grades.push(newGrade);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newGrade));
      return;
    }

    if (url.startsWith("/grades/") && method === "PUT") {
      const { studentName, subject, grade } = JSON.parse(body);
      const gradeToUpdate = grades.find((g) => g.id === id);
      if (gradeToUpdate) {
        gradeToUpdate.studentName = studentName;
        gradeToUpdate.subject = subject;
        gradeToUpdate.grade = grade;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(gradeToUpdate));
        return;
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Grade not found" }));
      return;
    }

    if (url.startsWith("/grades/") && method === "DELETE") {
      const index = grades.findIndex((g) => g.id === id);
      if (index!== -1) {
        grades.splice(index, 1);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        return;
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Grade not found" }));
      return;
    }


    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
