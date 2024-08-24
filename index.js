import http from "http";
import {v4} from "uuid"

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
    if (url === "/grades" && method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(grades));
      return;
    }

    if (url === "/grades" && method === "POST") {
      const { studentName, subject, grade } = JSON.parse(body);
      const newGrade = { id: v4(), studentName, subject, grade }
      grades.push(newGrade);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newGrade));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route Not Found" }));
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
