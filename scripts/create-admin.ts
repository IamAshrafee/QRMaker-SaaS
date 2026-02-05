#!/usr/bin/env node

/**
 * Admin Account Creator Script
 * Creates an admin user for QRMaker SaaS
 * 
 * Usage:
 *   npm run admin:create
 *   
 * Or with environment variables:
 *   ADMIN_NAME="John Doe" ADMIN_EMAIL="admin@example.com" ADMIN_USERNAME="admin" ADMIN_PASSWORD="SecurePass123" npm run admin:create
 */

// Load environment variables from .env.local
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: join(__dirname, '..', '.env.local') });

import * as readline from 'readline';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI environment variable is not set');
    console.error('Please add MONGODB_URI to your .env.local file');
    process.exit(1);
}

// User Schema (matching src/models/User.ts)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    password: { type: String },
    role: {
        type: String,
        enum: ["user", "admin", "superadmin"],
        default: "user"
    },
    plan: {
        type: String,
        enum: ["free", "basic", "pro"],
        default: "free"
    },
    provider: { type: String, default: "credentials" },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Validation schema
const AdminSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify question
function question(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

// Hide password input
function questionHidden(query: string): Promise<string> {
    return new Promise((resolve) => {
        const stdin = process.stdin;
        const stdout = process.stdout;

        stdout.write(query);

        // Disable echo
        if ((stdin as any).setRawMode) {
            (stdin as any).setRawMode(true);
        }

        let password = '';

        stdin.on('data', function listener(char) {
            const c = char.toString('utf8');

            switch (c) {
                case '\n':
                case '\r':
                case '\u0004': // Ctrl-D
                    stdin.removeListener('data', listener);
                    if ((stdin as any).setRawMode) {
                        (stdin as any).setRawMode(false);
                    }
                    stdout.write('\n');
                    resolve(password);
                    break;
                case '\u0003': // Ctrl-C
                    process.exit();
                    break;
                case '\u007f': // Backspace
                case '\b':
                    if (password.length > 0) {
                        password = password.slice(0, -1);
                        stdout.write('\b \b');
                    }
                    break;
                default:
                    password += c;
                    stdout.write('*');
                    break;
            }
        });
    });
}

// Main function
async function createAdmin() {
    console.log('\n🔐 QRMaker Admin Account Creator\n');
    console.log('━'.repeat(50));
    console.log('This script will create an admin account with full access.\n');

    try {
        // Get admin details from environment variables or prompt
        let name = process.env.ADMIN_NAME;
        let email = process.env.ADMIN_EMAIL;
        let username = process.env.ADMIN_USERNAME;
        let password = process.env.ADMIN_PASSWORD;

        if (!name || !email || !username || !password) {
            console.log('📝 Please enter admin details:\n');

            if (!name) name = await question('Full Name: ');
            if (!email) email = await question('Email: ');
            if (!username) username = await question('Username: ');
            if (!password) password = await questionHidden('Password (min 8 chars, include uppercase, lowercase, number): ');
        }

        // Validate input
        console.log('\n⏳ Validating input...');
        const validationResult = AdminSchema.safeParse({ name, email, username, password });

        if (!validationResult.success) {
            console.error('\n❌ Validation Error:');
            validationResult.error.issues.forEach((err) => {
                console.error(`   - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
        }

        // Connect to database
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected to database');

        // Check if user already exists
        console.log('🔍 Checking for existing users...');
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                console.error('\n❌ Error: Email already in use');
                console.error(`   An account with email "${email}" already exists`);
            } else if (existingUser.username === username) {
                console.error('\n❌ Error: Username already taken');
                console.error(`   Username "${username}" is already in use`);
            }
            process.exit(1);
        }

        // Hash password
        console.log('🔒 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        console.log('👤 Creating admin account...');
        const adminUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
            role: 'admin',
            plan: 'pro', // Admins get pro plan by default
            provider: 'credentials'
        });

        // Success
        console.log('\n✨ SUCCESS! Admin account created successfully!\n');
        console.log('━'.repeat(50));
        console.log('📋 Admin Details:');
        console.log(`   Name:     ${adminUser.name}`);
        console.log(`   Email:    ${adminUser.email}`);
        console.log(`   Username: ${adminUser.username}`);
        console.log(`   Role:     ${adminUser.role}`);
        console.log(`   Plan:     ${adminUser.plan}`);
        console.log(`   ID:       ${adminUser._id}`);
        console.log('━'.repeat(50));
        console.log('\n🎉 You can now log in with these credentials!\n');

    } catch (error) {
        console.error('\n❌ Error creating admin account:');
        if (error instanceof Error) {
            console.error(`   ${error.message}`);
        } else {
            console.error('   Unknown error occurred');
        }
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.disconnect();
    }
}

// Run the script
createAdmin();
