describe('Jest v30 Modern Matchers Demo', () => {
  describe('Mock function matchers using modern syntax', () => {
    it('uses toHaveBeenCalled instead of toBeCalled', () => {
      const mockFn = jest.fn();
      mockFn('test');
      
      expect(mockFn).toHaveBeenCalled();
    });

    it('uses toHaveBeenCalledTimes instead of toBeCalledTimes', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('second');
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('uses toHaveBeenCalledWith instead of toBeCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('test-arg');
      
      expect(mockFn).toHaveBeenCalledWith('test-arg');
    });

    it('uses toHaveBeenLastCalledWith instead of lastCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('last');
      
      expect(mockFn).toHaveBeenLastCalledWith('last');
    });

    it('uses toHaveBeenNthCalledWith instead of nthCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('second');
      
      expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
      expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
    });
  });

  describe('Return value matchers using modern syntax', () => {
    it('uses toHaveReturned instead of toReturn', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockFn();
      
      expect(mockFn).toHaveReturned();
    });

    it('uses toHaveReturnedTimes instead of toReturnTimes', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockFn();
      mockFn();
      
      expect(mockFn).toHaveReturnedTimes(2);
    });

    it('uses toHaveReturnedWith instead of toReturnWith', () => {
      const mockFn = jest.fn().mockReturnValue('specific-result');
      mockFn();
      
      expect(mockFn).toHaveReturnedWith('specific-result');
    });

    it('uses toHaveLastReturnedWith instead of lastReturnedWith', () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce('first');
      mockFn.mockReturnValueOnce('last');
      mockFn();
      mockFn();
      
      expect(mockFn).toHaveLastReturnedWith('last');
    });

    it('uses toHaveNthReturnedWith instead of nthReturnedWith', () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce('first');
      mockFn.mockReturnValueOnce('second');
      mockFn();
      mockFn();
      
      expect(mockFn).toHaveNthReturnedWith(1, 'first');
      expect(mockFn).toHaveNthReturnedWith(2, 'second');
    });
  });

  describe('Error matchers using modern syntax', () => {
    it('uses toThrow instead of toThrowError', () => {
      const errorFn = () => {
        throw new Error('Test error');
      };
      
      expect(errorFn).toThrow('Test error');
    });

    it('uses toThrow with no message instead of toThrowError', () => {
      const errorFn = () => {
        throw new Error('Any error');
      };
      
      expect(errorFn).toThrow();
    });
  });
});
