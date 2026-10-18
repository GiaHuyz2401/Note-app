const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const Note = require("./models/Note");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Note App API",
    version: "1.0.0",
    description: "API quan ly ghi chu"
  },
  servers: [
    {
      url: "http://localhost:5000"
    }
  ],
  paths: {
    "/api/notes": {
      get: {
        summary: "Lay danh sach ghi chu",
        responses: {
          "200": {
            description: "Lay danh sach thanh cong"
          },
          "500": {
            description: "Loi server"
          }
        }
      },
      post: {
        summary: "Tao ghi chu moi",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: {
                    type: "string",
                    example: "Ghi chu dau tien"
                  },
                  content: {
                    type: "string",
                    example: "Noi dung ghi chu"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Tao ghi chu thanh cong"
          },
          "400": {
            description: "Du lieu khong hop le"
          },
          "500": {
            description: "Loi server"
          }
        }
      }
    }
  }
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// GET /api/notes
// Lay tat ca ghi chu, moi nhat len dau
app.get("/api/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// POST /api/notes
// Tao ghi chu moi
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content || ""
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// Connect MongoDB Atlas and start server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Chua cau hinh MONGO_URI trong file .env");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Da ket noi MongoDB Atlas!");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server dang chay tai http://localhost:${PORT}`);
      console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Loi khoi dong server:", error.message);
  }
}

startServer();
