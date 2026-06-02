import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact & Devis — Super Climat Shop',
  description:
    'Contactez Super Climat Shop à Sousse pour un devis personnalisé sur nos pièces électroménager, équipements froid et joints réfrigérateur sur mesure.',
};

export default function ContactPage() {
  return <ContactClient />;
}
