export type Option = {
  value: string;
  label: string;
  selected?: boolean;
};

export interface InputField {
  type:
  | "text"
  | "url"
  | "number"
  | "email"
  | "password"
  | "select"
  | "textarea"
  | "phone"
  | "checkbox"
  | "time"
  | "calendar"
  | "file"
  | "switch"
  | "editor";
  value: string | boolean;
  placeholder?: string;
  options?: { label: string; value: string; selected?: boolean }[];
  label?: string | React.ReactNode;
  labelDescription?: string | React.ReactNode;
  setValue?: (value: any) => void;
  required?: boolean;
  containerClassName?: string;
  rows?: number;
  inputFieldBottomArea?: React.ReactNode;
}

export interface NavLinkProps {
  label: string;
  href: string;
  icon: React.ReactElement;
}

export interface StatsCardProps {
  icon: React.ReactElement;
  value: string;
  label: string;
  color?: string;
}

export interface GraphStatsCardProps {
  label: string;
  value: string;
  color?: string;
}

export interface ListCardProps {
  title?: string;
  icon?: React.ReactElement;
  list: {
    icon?: React.ReactElement;
    label: string;
    value: string | React.ReactElement;
  }[];
  color?: string;
}

export interface LinkCardProps {
  title: string;
  icon?: React.ReactElement;
  link?: string;
  className?: string;
}

export interface FormValueProps {
  [key: string]: { value: any; setValue?: (value: any) => void };
}

export interface CategoryFormProps {
  categoryId: string;
  categoryData: Category;
  isEdit: boolean;
}

export interface ServiceFormProps {
  serviceId: string;
  serviceData: Service;
  isEdit: boolean;
}

export interface PaginationProps {
  totalPages: number;
  totalRecords: number;
}

export interface FileDialogProps {
  multiple?: boolean;
  files?: any;
  setFiles?: (value: any) => void;
}

export interface CouponFormProps {
  couponId: string;
  couponData: Coupon;
  isEdit: boolean;
}

export interface EmployeeFormProps {
  employeeId: string;
  employeeData: Employee;
  isEdit: boolean;
}

export interface PaymentMethodCardProps {
  name?: string;
  value?: {
    value: string | number | boolean;
    setValue: (value: any) => void;
  };
  method: {
    name: string;
    icon: string;
  };
  inputFields?: {
    [key: string]: InputField;
  };
}

export interface ManualPaymentMethodCardProps {
  data: manualPaymentMethod;
  setReload?: (value: number) => void;
}

export interface ManualPaymentMethodFormProps {
  children: React.ReactNode;
  isEdit?: boolean;
  data?: manualPaymentMethod;
  setReload?: (value: number) => void;
}

export interface AvailableAreaCardProps {
  color?: string;
  data: availableArea;
}

export interface AvailableAreaFormProps {
  isEdit?: boolean;
  data?: availableArea;
}

export interface PageFormProps {
  isEdit?: boolean;
  data?: Page;
}

export interface CustomerOverviewCardProps {
  value: string;
  label: string;
  icon: React.ReactElement;
  color?: string;
}

export type Appointment = {
  id: number;
  appointmentId: string;
  userId: number;
  customerId: number;
  serviceId: number;
  employeeId: number;
  name: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  amount: string;
  charges: string;
  gstNumber: string;
  gstType: string;
  gstPercentage: number | null;
  paymentMethod: string;
  paymentId: string;
  area: string;
  postalCode: string;
  address: string;
  remark: string;
  status: string;
  paymentStatus: string;
  paidAt: Date;
  createdAt: Date;
  user: User;
  employee: Employee;
  service: Service;
  customer: Customer;
  employeeCommission: number;
};

export type Customer = {
  id: number;
  customerId: number;
  userId: number;
  name: string;
  photo: string;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  countData: {
    totalSpent: number;
    appointments: number;
    completed: number;
    cancelled: number;
    unpaid: number;
    booked: number;
    paid: number;
    processing: number;
  };
  user: User;
};

export type Employee = {
  id: number;
  user_id: number;
  employee_id: string;
  name: string;
  position: string;
  image: string | null;
  phone: string;
  email: string;
  address: string;
  created_at: string;
};


export type User = {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  image: string;
  siteName: string;
  siteSlug: string;
  createdAt: Date;
  siteSettings: siteSettings[];
};

export type siteSettings = {
  id: number;
  userId: number;
  logo: string;
  favicon: string;
  phone: string;
  whatsapp: string;
  email: string;
  currency: string;
  country: string;
  state: string;
  address: string;
  metaTitle: string;
  metaDescription: string;
  sharingImagePreview: string;
  gstNumber: string;
  gstType: string;

  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  pinterest: string;

  cashInHand: boolean;
  razorpayKeyId: string;
  phonepeSaltKey: string;
  phonepeSaltIndex: string;
  phonepeMerchantId: string;
  payuApiKey: string;
  payuSalt: string;

  sunday: boolean;
  sundayStarts: string;
  sundayEnds: string;
  monday: boolean;
  mondayStarts: string;
  mondayEnds: string;
  tuesday: boolean;
  tuesdayStarts: string;
  tuesdayEnds: string;
  wednesday: boolean;
  wednesdayStarts: string;
  wednesdayEnds: string;
  thursday: boolean;
  thursdayStarts: string;
  thursdayEnds: string;
  friday: boolean;
  fridayStarts: string;
  fridayEnds: string;
  saturday: boolean;
  saturdayStarts: string;
  saturdayEnds: string;
};

export type Category = {
  id: number;
  categoryId: string;
  userId: number;
  name: string;
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: Date;
};

export type AdditionalImage = { id: number; image: string; createdAt: Date };

export type Service = {
  id: number;
  serviceId: string;
  userId: number;
  name: string;
  slug: string;
  amount: string;
  previousAmount: string;
  image: string;
  categoryId: number;
  timeSlotInterval: string;
  intervalType: string;
  description: string;
  gstPercentage: number;
  metaTitle: string;
  metaDescription: string;
  status: boolean;
  createdAt: Date;
  category: Category;
  additionalImages: AdditionalImage[];
  user: User;
};

export type registerUserData = {
  name: string;
  email: string;
  phone: string;
  country: string;
  siteName: string;
  password: string;
};

export type sendOtp = {
  phone: string;
  unique?: boolean;
  registered?: boolean;
};

export type loginUserData = {
  user: string;
  password: string;
};

export type forgotPasswordData = {
  user: string;
  password: string;
};

export type categoriesParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type categoryData = {
  name: string;
  slug: string;
  image: string;
  metaTitle: string;
  metaDescription: string;
};

export type servicesParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type serviceData = {
  name: string;
  slug: string;
  amount: string;
  previousAmount: string;
  image: string;
  categoryId: number | null;
  timeSlotInterval: string;
  intervalType: string;
  description: string;
  gstPercentage: string | number | null;
  metaTitle: string;
  metaDescription: string;
  status: boolean;
  additionalImages: string[];
};

export type File = {
  type: string;
  name: string;
  path: string;
};

export type couponsParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type pagesParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type couponData = {
  name: string;
  code: string;
  discountType: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  minBookingAmount: number;
};

export type pageData = {
  name: string;
  slug: string;
  content: string;
};

export type Coupon = {
  id: number;
  couponId: string;
  user: User;
  name: string;
  code: string;
  discountType: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  minBookingAmount: number;
  createdAt: Date;
};

export type Page = {
  id: number;
  pageId: string;
  name: string;
  slug: string;
  content: string;
  createdAt: Date;
};

export type employeeParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type employeeData = {
  user_id: number;
  employee_id?: string;
  name: string;
  position?: string;
  email?: string;
  phone: string;
  address?: string;
  image?: string;
};


export type siteSettingsData = {
  logo?: string;
  favicon?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  currency?: string;
  country?: string;
  state?: string;
  address?: string;
  metaTitle?: string;
  metaDescription?: string;
  sharingImagePreview?: string;
  gstNumber?: string | null;
  gstType?: string | null;

  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;

  cashInHand?: boolean;
  razorpayKeyId?: string;
  phonepeSaltKey?: string;
  phonepeSaltIndex?: string;
  phonepeMerchantId?: string;
  payuApiKey?: string;
  payuSalt?: string;

  sunday?: boolean;
  sundayStarts?: string;
  sundayEnds?: string;
  monday?: boolean;
  mondayStarts?: string;
  mondayEnds?: string;
  tuesday?: boolean;
  tuesdayStarts?: string;
  tuesdayEnds?: string;
  wednesday?: boolean;
  wednesdayStarts?: string;
  wednesdayEnds?: string;
  thursday?: boolean;
  thursdayStarts?: string;
  thursdayEnds?: string;
  friday?: boolean;
  fridayStarts?: string;
  fridayEnds?: string;
  saturday?: boolean;
  saturdayStarts?: string;
  saturdayEnds?: string;
};

export type manualPaymentMethodsParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type manualPaymentMethodData = {
  name: string;
  icon: string;
  instructions: string;
  image: string;
};

export type manualPaymentMethod = {
  id: number;
  userId: string;
  name: string;
  icon: string;
  instructions: string;
  image: string;
  createdAt: Date;
};

export type availableAreasParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type availableArea = {
  id: number;
  areaId: string;
  area: string;
  charges: string;
  createdAt: Date;
  user: User;
};

export type availableAreaData = {
  area: string;
  charges: string;
};

export type appointmentsParams = {
  limit?: number;
  page?: number;
  q?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  customerId?: number;
  fromDate?: string;
  toDate?: string;
};

export type updateAppointmentData = {
  status: string;
  paymentStatus: string;
  employeeId: number;
  employeeCommission: string;
};

export type updateUserData = {
  name: string;
  email: string;
  phone: string;
  country: string;
  image: string;
};

export type changePasswordData = {
  currentPassword: string;
  password: string;
};

export type customerParams = {
  limit?: number;
  page?: number;
  q?: string;
};

export type Plugin = {
  id: number;
  name: string;
  description: string;
  icon: string;
  fieldLabel: string;
  fieldPlaceholder: string;
};

export interface PluginCardProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  fieldLabel: string;
  fieldPlaceholder: string;
}

export interface PluginFormProps {
  id: number;
  title: string;
  fieldLabel: string;
  fieldPlaceholder: string;
  children: React.ReactNode;
}

export interface ReportOverviewCardProps {
  label: string;
  number: number;
  index: number;
}

export interface RevenueGraph {
  date: string;
  revenue: number;
  appointments: number;
}

export interface WebsiteSettingsData {
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  navLinks?: NavLink[];
}

export interface WebsiteSettings {
  id: number;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  navLinks: NavLink[];
}

export interface NavLink {
  label: string;
  link: string;
}
