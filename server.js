const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

// การตั้งค่าการเชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost", // ชื่อโฮสต์ของ MySQL
  user: "root", // ชื่อผู้ใช้ MySQL
  password: "root", // รหัสผ่านของ MySQL
  database: "database_army", // ชื่อฐานข้อมูลที่คุณต้องการใช้
  port: 3306, // พอร์ต MySQL (ค่าเริ่มต้นของ MAMP)
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
  if (err) {
    console.error("ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:", err);
  } else {
    console.log("เชื่อมต่อฐานข้อมูลสำเร็จ!");
  }
});

// API สำหรับบันทึกข้อมูล
app.post("/submit", (req, res) => {
  const data = req.body;

  console.log(data); // เช็คข้อมูลที่รับเข้ามา
  const sql = `
    INSERT INTO database_army 
    (push_notifications, id_card, title_name, first_name, last_name, war_event, book, pages, push_option, id_heir, title_heir, first_heir, last_heir, affiliation_name, book_num, book_date, date_verify) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.pushNotifications,
    data.idCard,
    data.titleName,
    data.firstName,
    data.lastName,
    data.warEvent,
    data.book,
    data.pages,
    data.pushOption,
    data.idHeir,
    data.titleHeir,
    data.firstHeir,
    data.lastHeir,
    data.affiliationName,
    data.bookNum,
    data.bookDate,
    data.dateVerify,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } else {
      res.status(200).send("บันทึกข้อมูลสำเร็จ!");
    }
  });
});

// API สำหรับค้นหาข้อมูลโดย idCard
app.get("/search", (req, res) => {
  const idCard = req.query.id;

  if (!idCard) {
    return res.status(400).send({ found: false, message: "กรุณาระบุ idCard" });
  }

  const sql = `
    SELECT 
      id_card AS idCard, title_name AS titleName, first_name AS firstName, last_name AS lastName, 
      id_heir AS idHeir, title_heir AS titleHeir, first_heir AS firstHeir, last_heir AS lastHeir ,
      date_verify AS dateVerify
    FROM database_army 
    WHERE id_card = ?
  `;

  db.query(sql, [idCard], (err, results) => {
    if (err) {
      console.error("Error retrieving data:", err);
      return res
        .status(500)
        .send({ found: false, message: "เกิดข้อผิดพลาดในการค้นหาข้อมูล" });
    }

    if (results.length > 0) {
      return res.status(200).send({ found: true, data: results[0] });
    } else {
      return res.status(404).send({ found: false, message: "ไม่พบข้อมูล" });
    }
  });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
