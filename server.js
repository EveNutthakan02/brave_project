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
      push_notifications AS pushNotifications,
      id_card AS idCard, title_name AS titleName, first_name AS firstName, last_name AS lastName, 
      war_event AS warEvent, book AS book, pages AS pages, push_option AS pushOption,
      id_heir AS idHeir, title_heir AS titleHeir, first_heir AS firstHeir, last_heir AS lastHeir, 
      affiliation_name AS affiliationName, book_num AS bookNum, book_date AS bookDate, date_verify AS dateVerify
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
      console.log("Data found:", results[0]); 
      return res.status(200).send({ found: true, data: results[0] });
    } else {
      return res.status(404).send({ found: false, message: "ไม่พบข้อมูล" });
    }
  });
});

function validateNameRights(value) {
  // ตรวจสอบว่าค่าที่ส่งมาต้องมี 2 ช่องว่างระหว่าง title_name, first_name และ last_name
  return /^[^\s]+ [^\s]+ [^\s]+$/.test(value);
}
function validategiveRightsNAME(value) {
  // ตรวจสอบว่าค่าที่ส่งมาต้องมี 2 ช่องว่างระหว่าง title_heir, first_heir และ last_heir
  return /^[^\s]+ [^\s]+ [^\s]+$/.test(value);
}

// 📌 API สำหรับอัปเดตข้อมูล
app.post("/update", (req, res) => {
  const { field, value, id } = req.body;

  // ✅ แปลงชื่อฟิลด์จาก Frontend ให้ตรงกับชื่อฟิลด์ในฐานข้อมูล
  const allowedFields = {
    //owner
    idRights: "id_card",
    nameRights: "CONCAT(title_name, ' ', first_name, ' ', last_name)",
    titleName: "title_name",
    firstName: "first_name",
    lastName: "last_name",
    //heir
    giveRightsID: "id_heir",
    giveRightsNAME: "CONCAT(title_heir, ' ', first_heir, ' ', last_heir)",
    titleHeir: "title_heir",
    firstHeir: "first_heir",
    lastHeir: "last_heir",
    //date
    dateVerify: "date_verify",
  };

  console.log("ค่าที่ได้รับจาก Frontend:", req.body);
  console.log("Field ที่ส่งมา (หลังแก้ไข):", field);
  console.log("Allowed Fields:", allowedFields);
  console.log("Check Result:", Object.keys(allowedFields).includes(field)); // ✅ แก้ไขตรงนี้

  // ตรวจสอบความถูกต้องของข้อมูล
  if (!field || !value || !id) {
    return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
  }

  if (!Object.keys(allowedFields).includes(field)) {
    return res.status(400).json({ error: "ฟิลด์ที่ส่งมาไม่ถูกต้อง" });
  }

  // ตรวจสอบกรณีของ nameRights
  if (field === "nameRights") {
    if (!validateNameRights(value)) {
      return res.status(400).json({
        success: false,
        error: "รูปแบบการกรอกข้อมูลไม่ถูกต้อง โปรดเว้นวรรคให้ถูกต้อง",
      });
    }

    const [newTitle, newFirst, newLast] = value.split(" ");
    const updateQuery = `
      UPDATE database_army 
      SET title_name = ?, first_name = ?, last_name = ? 
      WHERE id_card = ?
    `;

    db.query(updateQuery, [newTitle, newFirst, newLast, id], (err, result) => {
      if (err) {
        console.error("อัปเดตข้อมูลล้มเหลว:", err);
        return res
          .status(500)
          .json({ success: false, error: "เกิดข้อผิดพลาดในการอัปเดต" });
      }

      // ป้องกันไม่ให้ส่ง response ซ้ำ
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, error: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
      }

      return res.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ!" });
    });
    return; // ป้องกันไม่ให้โค้ดด้านล่างทำงานต่อ
  }

  // ตรวจสอบกรณีของ giveRightsNAME
  if (field === "giveRightsNAME") {
    if (!validategiveRightsNAME(value)) {
      return res.status(400).json({
        success: false,
        error: "รูปแบบการกรอกข้อมูลไม่ถูกต้อง โปรดเว้นวรรคให้ถูกต้อง",
      });
    }

    const [newTitleHeir, newFirstHeir, newLastHeir] = value.split(" ");
    const updateQuery = `
      UPDATE database_army 
      SET title_heir = ?, first_heir = ?, last_heir = ? 
      WHERE id_card = ?
    `;

    db.query(
      updateQuery,
      [newTitleHeir, newFirstHeir, newLastHeir, id],
      (err, result) => {
        if (err) {
          console.error("อัปเดตข้อมูลล้มเหลว:", err);
          return res
            .status(500)
            .json({ success: false, error: "เกิดข้อผิดพลาดในการอัปเดต" });
        }

        // ป้องกันไม่ให้ส่ง response ซ้ำ
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, error: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
        }

        return res.json({ success: true, message: "อัปเดตข้อมูลสำเร็จ!" });
      }
    );
    return; // ป้องกันไม่ให้โค้ดด้านล่างทำงานต่อ
  }

  // กรณีอัปเดตฟิลด์อื่นๆ
  const dbField = allowedFields[field];
  const updateQuery = `UPDATE database_army SET ${dbField} = ? WHERE id_card = ?`;

  db.query(updateQuery, [value, id], (err, result) => {
    if (err) {
      console.error("อัปเดตข้อมูลล้มเหลว:", err);
      return res
        .status(500)
        .json({ success: false, error: "เกิดข้อผิดพลาดในการอัปเดต" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "ไม่พบข้อมูลที่ต้องการอัปเดต" });
    }

    return res.json({ success: true, message: `อัปเดต ${dbField} สำเร็จ!` });
  });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
