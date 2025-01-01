import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ message: 'Token is required' }, { status: 400 });
  }  

  try {
    // אימות הטוקן
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ isValid: true, decoded });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ isValid: false, message: 'Invalid or expired token' }, { status: 400 });
  }
}
