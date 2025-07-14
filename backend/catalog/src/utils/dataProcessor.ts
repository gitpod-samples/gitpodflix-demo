export interface ProcessingResult<T> {
  data: T[];
  processed: number;
  errors: string[];
}

export function processMovieData<T>(
  items: T[],
  processor: (item: T) => T | null
): ProcessingResult<T> {
  const result: ProcessingResult<T> = {
    data: [],
    processed: 0,
    errors: []
  };

  for (const item of items) {
    try {
      const processed = processor(item);
      if (processed !== null) {
        result.data.push(processed);
        result.processed++;
      }
    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  return result;
}

export function batchProcess<T, R>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const batches: T[][] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  return Promise.all(batches.map(processor)).then(results => 
    results.flat()
  );
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/script/gi, '')
    .substring(0, 1000);
}

export function parseRating(rating: string | number): number {
  if (typeof rating === 'number') {
    return Math.max(0, Math.min(10, rating));
  }
  
  const parsed = parseFloat(rating);
  if (isNaN(parsed)) {
    return 0;
  }
  
  return Math.max(0, Math.min(10, parsed));
}
