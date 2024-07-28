export enum BadRequestMessage {
  InValidLoginData = 'اطلاعات ارسال شده برای احراز هویت صحیح نمی باشد',
  InValidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
  someWrong = 'خطایی پیش آمده است' , 
  invalidEmail = 'پست الکترونیک وارد شده صحیح نمی باشد' ,
  invalidPhone = 'شماره تماس وارد شده صحیح نمی باشد'
}
export enum AuthMessage {
  notFoundAccount = 'حساب کاربری پیدا نشد',
  alreadyExistAccount = 'حساب کاربری با این مشخصات ثبت شده است',
  expiredCode = 'کد تایید منقضی شده است',
  tryAgain = 'دوباره تلاش کنید',
  loginAgain = 'مجدد وارد حساب کاربری خود شوید',
}
export enum NotFoundMessage {
  notFound = 'موردی یافت نشد',
}
export enum ValidationMessage {
  InvalidImageFormat = 'فرمت فایل معتبر نمی باشد',
}

export enum PublicMessage {
  login = 'ورود موفقیت آمیز بود',
  created = 'با موفقیت ایجاد شد',
  deleted = 'با موفقیت حذف شد',
  updated = 'با موفقیت ویرایش شد',
}

export enum ConfilictMessage {
  categoryTitle = 'عنوان دسته بندی تکراری می باشد',
  email = 'پست الکترونیک خود را مجدد بررسی کنید',
  phone = 'شماره تماس خود را مجدد بررسی کنید',
  username = 'نام کاربری خود را مجدد بررسی کنید',
}
