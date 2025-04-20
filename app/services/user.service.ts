// app/services/user.service.ts
import { hashPassword } from "../utils/auth.server";

export interface User {
  userId: string;
  username: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  referCode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  profileId: string;
  userId: string;
  bio?: string;
  profilePictureId?: string;
  createdAt: Date;
  updatedAt: Date;
}

let users: User[] = [];
let userProfiles: UserProfile[] = [];

export const userService = {
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    phoneNumber?: string;
    referCode?: string;
  }) {
    const existingUser = users.find(
      (u) => u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) throw new Error("User already exists");

    const newUser: User = {
      userId: crypto.randomUUID(),
      ...userData,
      passwordHash: await hashPassword(userData.password),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    return newUser;
  },

  async findUserById(userId: string) {
    return users.find((u) => u.userId === userId);
  },

  async findUserByEmail(email: string) {
    return users.find((u) => u.email === email);
  },

  async updateUser(userId: string, updateData: Partial<User>) {
    const index = users.findIndex((u) => u.userId === userId);
    if (index === -1) throw new Error("User not found");
    
    users[index] = {
      ...users[index],
      ...updateData,
      updatedAt: new Date(),
    };
    
    return users[index];
  },

  async createUserProfile(userId: string, profileData: Partial<UserProfile>) {
    const existingProfile = userProfiles.find((p) => p.userId === userId);
    if (existingProfile) throw new Error("Profile already exists");

    const newProfile: UserProfile = {
      profileId: crypto.randomUUID(),
      userId,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userProfiles.push(newProfile);
    return newProfile;
  },

  async getUserProfile(userId: string) {
    return userProfiles.find((p) => p.userId === userId);
  },
};
