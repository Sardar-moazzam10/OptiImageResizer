import { users, type User, type InsertUser, Image, InsertImage } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Create memory store
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveResizedImage(image: InsertImage): Promise<Image>;
  getUserImages(userId: number): Promise<Image[]>;
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private images: Map<number, Image>;
  public sessionStore: session.SessionStore;
  private currentUserId: number;
  private currentImageId: number;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    this.currentUserId = 1;
    this.currentImageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveResizedImage(imageData: InsertImage): Promise<Image> {
    const id = this.currentImageId++;
    const image: Image = { ...imageData, id };
    this.images.set(id, image);
    return image;
  }

  async getUserImages(userId: number): Promise<Image[]> {
    return Array.from(this.images.values()).filter(
      (image) => image.userId === userId,
    );
  }
}

export const storage = new MemStorage();
