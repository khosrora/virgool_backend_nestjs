export enum BadRequestMessage {
  InValidLoginData = 'اطلاعات ارسال شده برای احراز هویت صحیح نمی باشد',
  InValidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}
export enum AuthMessage {
  notFoundAccount = 'حساب کاربری پیدا نشد',
  alreadyExistAccount = 'حساب کاربری با این مشخصات ثبت شده است',
  expiredCode = 'کد تایید منقضی شده است',
  tryAgain = 'دوباره تلاش کنید',
  loginAgain = 'مجدد وارد حساب کاربری خود شوید',
}
export enum NotFoundMessage {}
export enum ValidationMessage {}
export enum PublicMessage {
  login = 'ورود موفقیت آمیز بود'
}
