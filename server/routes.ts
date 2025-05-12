import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import { processImage } from "./image-processor";
import fs from "fs";
import path from "path";
import { z } from "zod";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (_req, file, cb) => {
    // Accept only image files
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes (/api/login, /api/register, etc.)
  setupAuth(app);
  
  // Image resize endpoint
  app.post("/api/resize", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      
      // Validate query parameters
      const schema = z.object({
        width: z.string().transform(val => parseInt(val, 10)),
        height: z.string().transform(val => parseInt(val, 10)),
        format: z.enum(["jpg", "png", "webp"]),
        scale: z.string().optional().transform(val => val ? parseInt(val, 10) : 100),
      });
      
      const { width, height, format, scale } = schema.parse(req.query);
      
      const result = await processImage({
        buffer: req.file.buffer,
        width,
        height,
        format,
        scale: scale || 100,
      });
      
      // Set appropriate content type
      const contentTypeMap: Record<string, string> = {
        jpg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };
      
      res.contentType(contentTypeMap[format]);
      res.send(result);
      
      // If user is logged in, save resized image data
      if (req.isAuthenticated()) {
        try {
          storage.saveResizedImage({
            userId: req.user.id,
            originalFilename: req.file.originalname,
            originalWidth: 0, // Will be calculated in image-processor
            originalHeight: 0, // Will be calculated in image-processor
            resizedWidth: width,
            resizedHeight: height,
            format,
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to save image metadata:", error);
          // Continue processing even if metadata saving fails
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ 
        message: error instanceof Error 
          ? error.message 
          : "Failed to process image" 
      });
    }
  });
  
  // Get user's resized images history
  app.get("/api/images", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const images = await storage.getUserImages(req.user.id);
      res.json(images);
    } catch (error) {
      console.error("Error fetching user images:", error);
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
