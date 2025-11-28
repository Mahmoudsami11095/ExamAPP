export class AuthEndPoint {
  static readonly REGISTER = '/auth/signup';
  static readonly LOGIN = '/auth/signin';
  static readonly CHANGEPASSWORD = '/auth/changePassword';
  static readonly DELETEMYACCOUNT = '/auth/deleteMe';
  static readonly EDITPROFILE = '/auth/editProfile';
  static readonly LOGOUT = '/auth/logout';
  static readonly GETLOGGEDUSERINFO = '/auth/profileData';
  static readonly FORGOTPASSWORD = '/auth/forgotPassword';
  static readonly VERIFYRESETCODE = '/auth/verifyResetCode';
  static readonly RESETPASSWORD = '/auth/resetPassword';
}