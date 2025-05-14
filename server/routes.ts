import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import { processImage } from "./image-processor";
import { z } from "zod";

// Extend Express User interface
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
    }
  }
}

// Define custom types for authenticated requests
interface AuthenticatedRequest extends Omit<Request, 'isAuthenticated'> {
  user?: Express.User;
  isAuthenticated(): this is { user: Express.User };
}

// Input validation schemas
const resizeSchema = z.object({
  width: z.string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 8000) {
        throw new Error('Width must be between 1 and 8000 pixels');
      }
      return parsed;
    }),
  height: z.string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 8000) {
        throw new Error('Height must be between 1 and 8000 pixels');
      }
      return parsed;
    }),
  format: z.enum(["jpg", "jpeg", "png", "webp"]),
  scale: z.string()
    .optional()
    .transform((val) => {
      if (!val) return 100;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed <= 0 || parsed > 200) {
        throw new Error('Scale must be between 1 and 200 percent');
      }
      return parsed;
    }),
  quality: z.string()
    .optional()
    .transform((val) => {
      if (!val) return 90;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 100) {
        throw new Error('Quality must be between 1 and 100');
      }
      return parsed;
    })
});

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    files: 1
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`));
    }

    // Additional filename sanitization
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    file.originalname = sanitizedFilename;

    cb(null, true);
  },
});

// Error handler middleware
const errorHandler = (err: Error, res: Response) => {
  console.error('Error:', err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  }
  return res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Image resize endpoint
  app.post("/api/resize", upload.single("image"), async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const validatedInput = await resizeSchema.parseAsync(req.query);
      
      const result = await processImage({
        buffer: req.file.buffer,
        width: validatedInput.width,
        height: validatedInput.height,
        format: validatedInput.format,
        scale: validatedInput.scale,
        quality: validatedInput.quality
      });

      // Set appropriate content type and caching headers
      const contentTypeMap: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
      };

      res.set({
        'Content-Type': contentTypeMap[validatedInput.format],
        'Cache-Control': 'public, max-age=31536000',
        'Last-Modified': new Date().toUTCString()
      });

      res.send(result);

      // Save metadata if user is authenticated
      if (req.isAuthenticated()) {
        try {
          await storage.saveResizedImage({
            userId: req.user.id,
            originalFilename: req.file.originalname,
            originalWidth: 0, // Will be calculated in image-processor
            originalHeight: 0, // Will be calculated in image-processor
            resizedWidth: validatedInput.width,
            resizedHeight: validatedInput.height,
            format: validatedInput.format,
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Failed to save image metadata:", error);
        }
      }
    } catch (error) {
      errorHandler(error as Error, res);
    }
  });

  // Get user's resized images history
  app.get("/api/images", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ 
          message: "Authentication required",
          code: "UNAUTHORIZED"
        });
      }

      const images = await storage.getUserImages(req.user.id);
      res.json({
        success: true,
        data: images
      });
    } catch (error) {
      errorHandler(error as Error, res);
    }
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
