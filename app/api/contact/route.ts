import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, email, telephone, sujet, message, produit_ref } = body;

    if (!nom || !email || !message) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants (nom, email, message).' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      );
    }

    await prisma.contact.create({
      data: {
        nom: String(nom).trim(),
        email: String(email).trim(),
        telephone: telephone ? String(telephone).trim() : null,
        sujet: sujet ? String(sujet).trim() : null,
        message: String(message).trim(),
        produit_ref: produit_ref ? String(produit_ref).trim() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
