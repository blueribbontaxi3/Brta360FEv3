const LocalStorageService = (function () {
  var _service: any;
  function _getService() {
    if (!_service) {
      _service = {};  // Create a new object to hold the service state
      return _service;
    }
    return _service;
  }
  
  function _setToken(tokenObj: any) {
    localStorage.setItem('brta360_admin', tokenObj.access_token);
    // localStorage.setItem('refresh_token', tokenObj.refresh_token);
  }
  function _getAccessToken() {
    const item = localStorage.getItem('brta360_admin');
    if (item === null) {
      return null;
    }
    return item;
  }
  
  function _getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  function _clearToken() {
    localStorage.removeItem('brta360_admin');
    localStorage.removeItem('brta360_user');
    // localStorage.removeItem('refresh_token');
  }
  return {
    getService: _getService,
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    getRefreshToken: _getRefreshToken,
    clearToken: _clearToken
  }
})();
export default LocalStorageService;