import { 
  processMovieData, 
  batchProcess, 
  sanitizeInput, 
  parseRating,
  ProcessingResult 
} from '../utils/dataProcessor';

describe('Data Processor', () => {
  describe('processMovieData', () => {
    it('should process all items successfully', () => {
      const items = [1, 2, 3, 4, 5];
      const processor = (item: number) => item * 2;
      
      const result = processMovieData(items, processor);
      
      expect(result.data).toEqual([2, 4, 6, 8, 10]);
      expect(result.processed).toBe(5);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle processor returning null', () => {
      const items = [1, 2, 3, 4, 5];
      const processor = (item: number) => item % 2 === 0 ? item * 2 : null;
      
      const result = processMovieData(items, processor);
      
      expect(result.data).toEqual([4, 8]);
      expect(result.processed).toBe(2);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle processor throwing errors', () => {
      const items = [1, 2, 3, 4, 5];
      const processor = (item: number) => {
        if (item === 3) throw new Error('Processing error');
        return item * 2;
      };
      
      const result = processMovieData(items, processor);
      
      expect(result.data).toEqual([2, 4, 8, 10]);
      expect(result.processed).toBe(4);
      expect(result.errors).toContain('Processing error');
    });

    it('should handle non-Error exceptions', () => {
      const items = [1, 2, 3];
      const processor = (item: number) => {
        if (item === 2) throw 'String error';
        return item * 2;
      };
      
      const result = processMovieData(items, processor);
      
      expect(result.data).toEqual([2, 6]);
      expect(result.processed).toBe(2);
      expect(result.errors).toContain('Unknown error');
    });

    it('should handle empty input array', () => {
      const items: number[] = [];
      const processor = (item: number) => item * 2;
      
      const result = processMovieData(items, processor);
      
      expect(result.data).toEqual([]);
      expect(result.processed).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('batchProcess', () => {
    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const batchSize = 3;
      const processor = async (batch: number[]) => batch.map(item => item * 2);
      
      const result = await batchProcess(items, batchSize, processor);
      
      expect(result).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    });

    it('should handle uneven batch sizes', async () => {
      const items = [1, 2, 3, 4, 5];
      const batchSize = 2;
      const processor = async (batch: number[]) => batch.map(item => item * 2);
      
      const result = await batchProcess(items, batchSize, processor);
      
      expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it('should handle empty input array', async () => {
      const items: number[] = [];
      const batchSize = 3;
      const processor = async (batch: number[]) => batch.map(item => item * 2);
      
      const result = await batchProcess(items, batchSize, processor);
      
      expect(result).toEqual([]);
    });

    it('should handle batch size larger than array', async () => {
      const items = [1, 2, 3];
      const batchSize = 10;
      const processor = async (batch: number[]) => batch.map(item => item * 2);
      
      const result = await batchProcess(items, batchSize, processor);
      
      expect(result).toEqual([2, 4, 6]);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World<div>test</div>';
      const result = sanitizeInput(input);
      
      expect(result).toBe('alert("xss")Hello Worldtest');
    });

    it('should remove script keywords', () => {
      const input = 'Hello script world SCRIPT test';
      const result = sanitizeInput(input);
      
      expect(result).toBe('Hello  world  test');
    });

    it('should trim whitespace', () => {
      const input = '   Hello World   ';
      const result = sanitizeInput(input);
      
      expect(result).toBe('Hello World');
    });

    it('should limit length to 1000 characters', () => {
      const input = 'a'.repeat(1500);
      const result = sanitizeInput(input);
      
      expect(result).toHaveLength(1000);
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });

    it('should handle string with only whitespace', () => {
      const result = sanitizeInput('   ');
      expect(result).toBe('');
    });
  });

  describe('parseRating', () => {
    it('should return number as-is when within range', () => {
      expect(parseRating(5.5)).toBe(5.5);
      expect(parseRating(0)).toBe(0);
      expect(parseRating(10)).toBe(10);
    });

    it('should clamp numbers outside valid range', () => {
      expect(parseRating(15)).toBe(10);
      expect(parseRating(-5)).toBe(0);
    });

    it('should parse valid string numbers', () => {
      expect(parseRating('7.5')).toBe(7.5);
      expect(parseRating('0')).toBe(0);
      expect(parseRating('10')).toBe(10);
    });

    it('should clamp parsed strings outside valid range', () => {
      expect(parseRating('15')).toBe(10);
      expect(parseRating('-5')).toBe(0);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseRating('not-a-number')).toBe(0);
      expect(parseRating('')).toBe(0);
      expect(parseRating('abc')).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(parseRating('10.1')).toBe(10);
      expect(parseRating('-0.1')).toBe(0);
      expect(parseRating('9.99')).toBe(9.99);
    });
  });
});