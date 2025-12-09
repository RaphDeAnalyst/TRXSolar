import { Product } from './types';

/**
 * Generates a WhatsApp link with pre-filled message containing product details
 */
export function generateWhatsAppLink(product: Product): string {
  // WhatsApp number in international format (Nigerian number)
  // Format: country code (234) + mobile number without leading 0
  // Original local format: 0810 869 8673
  // International format: 234 810 869 8673 (no +, no spaces, no dashes)
  const phoneNumber = '2348108698673';

  const message = `Hi! I'm interested in the ${product.name} by ${product.brand}.

Price: ₦${product.price.toLocaleString('en-NG')}
Category: ${product.category.replace('-', ' ')}

Could you provide more details and a quote?`;

  const encodedMessage = encodeURIComponent(message);

  // Using wa.me format (official WhatsApp click-to-chat link)
  // https://wa.me/<number>?text=<message>
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Generates an email link with pre-filled subject and body containing product details
 */
export function generateEmailLink(product: Product): string {
  const email = 'info@trxsolar.com';
  const subject = `Inquiry: ${product.name} - ${product.brand}`;

  // Get current page URL if in browser environment
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';

  const body = `Hello TRX Solar Team,

I am interested in learning more about:

Product: ${product.name}
Brand: ${product.brand}
Price: ₦${product.price.toLocaleString('en-NG')}
Category: ${product.category.replace('-', ' ')}
${pageUrl ? `\nProduct Page: ${pageUrl}` : ''}

Please provide additional information and a quotation.

Thank you!`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Selects related products using Tier 1 (brand loyalty) and Tier 2 (spec similarity) algorithm
 * Returns up to 4 related products
 */
export function selectRelatedProducts(
  currentProduct: Product,
  allProducts: Product[]
): Product[] {
  const TARGET_COUNT = 4;
  const selected: Product[] = [];

  // Remove current product from consideration
  const candidates = allProducts.filter(p => p.id !== currentProduct.id);

  // TIER 1: Same Brand AND Same Category
  const tier1 = candidates.filter(p =>
    p.brand === currentProduct.brand &&
    p.category === currentProduct.category
  );

  // Add up to 4 from Tier 1
  selected.push(...tier1.slice(0, TARGET_COUNT));

  // If we have 4, return now
  if (selected.length >= TARGET_COUNT) {
    return selected.slice(0, TARGET_COUNT);
  }

  // TIER 2: Same Category, ranked by spec similarity
  const tier2Candidates = candidates.filter(p =>
    p.category === currentProduct.category &&
    !selected.some(s => s.id === p.id) // Not already selected
  );

  // Calculate similarity score for each Tier 2 candidate
  const scoredTier2 = tier2Candidates.map(product => {
    let score = 0;

    // Compare numeric specs (wattage, capacity, power, etc.)
    const currentSpecs = currentProduct.specs;
    const candidateSpecs = product.specs;

    // Find common numeric spec keys
    const numericKeys = ['wattage', 'capacity', 'power', 'output_power', 'max_power'];

    for (const key of numericKeys) {
      if (currentSpecs[key] && candidateSpecs[key]) {
        const current = parseFloat(String(currentSpecs[key]));
        const candidate = parseFloat(String(candidateSpecs[key]));

        if (!isNaN(current) && !isNaN(candidate)) {
          // Closer values = higher score (inverse of difference)
          const difference = Math.abs(current - candidate);
          const maxValue = Math.max(current, candidate);
          // Normalized similarity: 0-100
          const similarity = maxValue > 0
            ? 100 - (difference / maxValue * 100)
            : 100;
          score += similarity;
        }
      }
    }

    return { product, score };
  });

  // Sort by score (highest first)
  scoredTier2.sort((a, b) => b.score - a.score);

  // Get top scorers
  const remainingSlots = TARGET_COUNT - selected.length;
  const topScorers = scoredTier2.slice(0, remainingSlots);

  // Check if multiple products have same score (within threshold)
  const SCORE_THRESHOLD = 5; // Products within 5 points considered equal
  const uniqueScores = new Set(topScorers.map(t =>
    Math.round(t.score / SCORE_THRESHOLD) * SCORE_THRESHOLD
  ));

  // If we need randomization
  if (uniqueScores.size < topScorers.length) {
    // Group by score bucket
    const scoreBuckets = new Map<number, typeof topScorers>();

    topScorers.forEach(item => {
      const bucket = Math.round(item.score / SCORE_THRESHOLD) * SCORE_THRESHOLD;
      if (!scoreBuckets.has(bucket)) {
        scoreBuckets.set(bucket, []);
      }
      scoreBuckets.get(bucket)!.push(item);
    });

    // Randomize within each bucket, then flatten
    const randomized: typeof topScorers = [];
    scoreBuckets.forEach(bucket => {
      // Fisher-Yates shuffle
      const shuffled = [...bucket];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      randomized.push(...shuffled);
    });

    selected.push(...randomized.slice(0, remainingSlots).map(s => s.product));
  } else {
    // No ties, just add in score order
    selected.push(...topScorers.map(s => s.product));
  }

  // If still don't have enough, fill with any remaining products from category
  if (selected.length < TARGET_COUNT) {
    const remaining = candidates.filter(p =>
      p.category === currentProduct.category &&
      !selected.some(s => s.id === p.id)
    );

    // Shuffle remaining
    const shuffled = [...remaining];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    selected.push(...shuffled.slice(0, TARGET_COUNT - selected.length));
  }

  return selected.slice(0, TARGET_COUNT);
}
