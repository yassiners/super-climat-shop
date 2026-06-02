import Link from 'next/link';
import Image from 'next/image';
import { Produit } from '@prisma/client';

const catIcons: Record<string, string> = {
  pieces_rechange: 'fa-gear',
  chaud_froid: 'fa-snowflake',
  joints_frigidaires: 'fa-ring',
};

interface ProductCardProps {
  product: Produit;
}

function formatPrice(price: unknown): string {
  const num = typeof price === 'object' && price !== null
    ? parseFloat(price.toString())
    : Number(price);
  if (num === 0) return 'Sur devis';
  return num.toLocaleString('fr-TN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductCard({ product }: ProductCardProps) {
  const icon = catIcons[product.categorie] ?? 'fa-box';

  return (
    <article className="product-card" data-cat={product.sous_categorie ?? ''}>
      <div className="product-img">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.nom}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div className="product-img-placeholder">
            <i className={`fa-solid ${icon}`}></i>
            <span>Pas d&apos;image</span>
          </div>
        )}
      </div>
      <div className="product-body">
        <div className="product-cat">{product.sous_categorie
          ? product.sous_categorie.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          : product.categorie.replace(/_/g, ' ')
        }</div>
        <h3 className="product-name">{product.nom}</h3>
        <p className="product-desc">{product.description ?? ''}</p>
        <div className="product-footer">
          <div className="product-price">
            {formatPrice(product.prix)} {Number(product.prix) !== 0 && <small>DT</small>}
          </div>
          <div className="product-actions">
            <Link href={`/produit/${product.id}`} className="btn-product btn-product-view" title="Voir détails" aria-label={`Voir ${product.nom}`}>
              <i className="fa-solid fa-eye"></i>
            </Link>
            <button
              className="btn-product btn-product-order btn-quote"
              title="Demander un devis"
              data-product={product.nom}
              aria-label={`Devis pour ${product.nom}`}
            >
              <i className="fa-solid fa-cart-shopping"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
