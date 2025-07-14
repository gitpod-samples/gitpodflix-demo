describe('Jest v29 Deprecated Matchers Demo', () => {
  describe('Mock function matchers that will break in Jest v30', () => {
    it('uses toBeCalled instead of toHaveBeenCalled', () => {
      const mockFn = jest.fn();
      mockFn('test');
      
      expect(mockFn).toBeCalled();
    });

    it('uses toBeCalledTimes instead of toHaveBeenCalledTimes', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('second');
      
      expect(mockFn).toBeCalledTimes(2);
    });

    it('uses toBeCalledWith instead of toHaveBeenCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('test-arg');
      
      expect(mockFn).toBeCalledWith('test-arg');
    });

    it('uses lastCalledWith instead of toHaveBeenLastCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('last');
      
      expect(mockFn).lastCalledWith('last');
    });

    it('uses nthCalledWith instead of toHaveBeenNthCalledWith', () => {
      const mockFn = jest.fn();
      mockFn('first');
      mockFn('second');
      
      expect(mockFn).nthCalledWith(1, 'first');
      expect(mockFn).nthCalledWith(2, 'second');
    });
  });

  describe('Return value matchers that will break in Jest v30', () => {
    it('uses toReturn instead of toHaveReturned', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockFn();
      
      expect(mockFn).toReturn();
    });

    it('uses toReturnTimes instead of toHaveReturnedTimes', () => {
      const mockFn = jest.fn().mockReturnValue('result');
      mockFn();
      mockFn();
      
      expect(mockFn).toReturnTimes(2);
    });

    it('uses toReturnWith instead of toHaveReturnedWith', () => {
      const mockFn = jest.fn().mockReturnValue('specific-result');
      mockFn();
      
      expect(mockFn).toReturnWith('specific-result');
    });

    it('uses lastReturnedWith instead of toHaveLastReturnedWith', () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce('first');
      mockFn.mockReturnValueOnce('last');
      mockFn();
      mockFn();
      
      expect(mockFn).lastReturnedWith('last');
    });

    it('uses nthReturnedWith instead of toHaveNthReturnedWith', () => {
      const mockFn = jest.fn();
      mockFn.mockReturnValueOnce('first');
      mockFn.mockReturnValueOnce('second');
      mockFn();
      mockFn();
      
      expect(mockFn).nthReturnedWith(1, 'first');
      expect(mockFn).nthReturnedWith(2, 'second');
    });
  });

  describe('Error matchers that will break in Jest v30', () => {
    it('uses toThrowError instead of toThrow', () => {
      const errorFn = () => {
        throw new Error('Test error');
      };
      
      expect(errorFn).toThrowError('Test error');
    });

    it('uses toThrowError with no message instead of toThrow', () => {
      const errorFn = () => {
        throw new Error('Any error');
      };
      
      expect(errorFn).toThrowError();
    });
  });
});
