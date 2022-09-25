export class Credentials {
  email: string;
  password: string;
  rememberme: boolean;
}

export class City {
  id: number;
  countyId: number;
  isActive?: number;
  name: string;
  zip: string;
  zips?: string[] = [];
}
export class County {
  id: number;
  name: string;
  oldSzotarMegyeId?: number;
  isActive: number;
}

export class Company {
  id: number;
  status?: number;
  name?: string;
  phone?: string;
  fax?: string;
  picture?: string;
  website?: string;
  zip?: string;
  city?: string;
  address?: string;
  countyId?: number;
  countryId?: number;
  registrationNumber?: string;
  taxNumber?: string;
  bankAccountNumber?: string;
  phone_1?: string;
  isForeign?: number;
  isActive?: number;
  email?: string;
}

export class OfficeUserEmployee {
  officeId: number;
  userEmployeeUserId: number;
}
export interface UserEmployee {
  userId: number;
  mobile?: string;
  phone?: string;
  primaryOfficeId: number;
  title?: string;
}
export interface Positions {
  id: number;
  name?: string;
  serviceId: number;
  type: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  lastPublishTime?: string;
  creatorUserId?: number;
  ownerUserId?: number;
  companyId?: number;
  companyText?: string;
  companyUserId?: number;
  officeId?: number;
  fullProfile?: number;
  companyDescription?: string;
  description?: string;
  requirements?: string;
  advantages?: string;
  headcount?: number;
  countryId?: number;
  countyId?: number;
  cityId?: number;
  zip?: string;
  cityText?: string;
  startDate?: string;
  isPublished: number;
  publishStart?: string;
  publishEnd?: string;
  fieldsOfWorkId?: number;
  fieldsOfWorkCategoryId?: number;
  isNewsletterSent: number;
  simpleApplicationAllowed: number;
  spareTimeId?: number;
  shortDescription: string;
  nameMayAppear: number;
  tracking?: string;
  professionId?: number;
  professionUpdatedAt?: string;
  professionAdvId?: number;
  positionMd?: Array<PositionMd>;
  positionHc?: Array<PositionHcs>;
  owner_user_id?: number;
  positionTags?: Array<PositionTag>;
  positionLanguages?: Array<PositionLanguage>;
  positionComputerSkills?: Array<PositionComputerSkill>;
  positionDrivingLicences?: Array<PositionDrivingLicence>;
  positionQualifications?: Array<PositionQualification>;
}
export interface PositionComputerSkill {
  positionId: number;
  computerSkillId: number;
  computerSkillCategoryId: number;
  level: number;
}
export interface PositionDrivingLicence {
  positionId: number;
  drivingLicenceId: number;
}
export interface PositionQualification {
  positionId: number;
  qualificationId: number;
  fieldsOfStudyCategoryId: number;
  fieldsOfStudyId: number;
}
export interface PositionTag {
  id: number;
  positionId: number;
  tag_id: number;
}
export interface PositionLanguage {
  id: number;
  positionId: number;
  languageId: number;
  spokenLevel: number;
  writtenLevel: number;
}

export interface PositionHcs {
  positionId: number;
  employmentStatus?: number;
  workOrder?: number;
  sex?: number;
  ageMin?: number;
  ageMax?: number;
  workTimeType?: number;
  otherBenefits?: string;
  other?: string;
  salaryType?: number;
  salaryMin?: number;
  salaryMax?: number;
  performanceSalaryPercent?: number;
}

export interface PositionMd {
  positionId: number;
  workTypeMdId?: number;
  ageLimit?: number;
  applyType?: number;
  salaryType?: number;
  salary?: number;
  other?: string;
  address?: string;
  logo?: string;
  csakdiakUrl?: string;
}
export interface Status {
  id: number;
  name: string;
  value: number;
}
export interface Users {
  birthDate?: string;
  blacklistComment?: string;
  comment?: string;
  createTime?: string;
  email: string;
  firstName?: string;
  id: number;
  isActive?: number;
  isBlacklisted?: number;
  isSimpleRegistration?: number;
  lastLoginTime?: string;
  lastName?: string;
  password?: string;
  picture?: string;
  professionCreatedAt?: string;
  professionData?: string;
  reminderHash?: string;
  sex?: number;
  status?: number;
  type?: number;
  updateTime?: string;
  username?: string;
  userMd?: UserMd;
  userHc?: UserHc;
}

export interface UserHc {
  address?: string;
  cityId?: number | null;
  countryId?: number | null;
  countyId?: number | null;
  cvFileName?: string;
  cvUrl?: string;
  employmentStatus?: number | null;
  facebook?: string;
  googleplus?: string;
  tiktok?: string;
  highestQualificationId?: number | null;
  isAbroad?: number;
  isMobile?: number;
  linkedin?: string;
  matrialStatus?: number;
  motivation?: string;
  nationalityId?: number | null;
  nativeLanguageId?: number | null;
  other?: string;
  permanentAddress?: string;
  permanentCityId?: number | null;
  permanentCountryId?: number | null;
  permanentCountyId?: number | null;
  permanentZip?: string;
  phone_1Country?: string;
  phone_1Number?: string;
  phone_1Region?: string;
  phone_2Country?: string;
  phone_2Number?: string;
  phone_2Region?: string;
  possibleStartDate?: string;
  preferedRole?: string;
  preferenceCard?: number;
  refererId?: number | null;
  salaryRequestHourly?: number;
  salaryRequestMonthly?: number;
  status?: number;
  twitter?: string;
  userId: number;
  website?: string;
  workExperience?: number;
  youtube?: string;
  zip?: string;
}

export interface UserMd {
  address?: string;
  availabilityCity_1?: number;
  availabilityCity_2?: number;
  cityId?: number | null;
  countryId?: number | null;
  countyId?: number | null;
  cvFileName?: string;
  cvUrl?: string;
  experienceDescription?: string;
  facebook?: string;
  googleplus?: string;
  tiktok?: string;
  highestQualificationId?: number | null;
  inGame?: number;
  linkedin?: string;
  nativeLanguageId?: number | null;
  officeId?: number | null;
  permanentAddress?: string;
  permanentCityId?: number | null;
  permanentCountryId?: number | null;
  permanentCountyId?: number | null;
  permanentZip?: string;ne_1Country?: string | null;
  phone_1Number?: string | null;
  phone_1Region?: string | null;
  phone_2Country?: string | null;
  phone_2Number?: string | null;
  phone_2Region?: string | null;
  refererId?: number | null;
  secondaryOfficeId?: number | null;
  status?: number;
  studentEmploymentStatus?: number | null;
  twitter?: string;
  userId: number;
  website?: string;
  workExperience?: number | null;
  youtube?: string;
  zip?: string;
}

export class Newsletter {
  id: number;
  type: number;
  frequency: number;
  userId?: number;
  email: string;
  name: string;
  token?: string;
  isActive: number;
  createTime?: string;
  updateTime?: string;
}
export class NewsletterCounty {
  newsletterId: number;
  countyId: number;
}
export class DrivingLicence {
  id: number;
  name?: string;
  isActive?: number;
  priority?: number;
}

export class Country {
  id: number;
  name?: string;
  code?: string;
  isActive?: number;
  priority?: number;
  nationality?: string;
}
export class EmailSubscriber {
  id: number;
  name: string;
  siteId?: string;
  createTime?: string;
  email: string;
}

export class NewsletterWorkTypeMd {
  newsletterId: number;
  workTypeMdId: number;
}
export class NewsletterQualification {
  newsletterId: number;
  qualificationId: number;
}

export class NewsletterFieldsOfWorkCategory {
  newsletterId: number;
  fieldsOfWorkCategoryId: number;
}
export interface Office {
  id: number;
  name?: string;
  slug?: string;
  type?: number;
  address?: string;
  phone?: string;
  emailHc?: string;
  emailMd?: string;
  openTime?: string;
  defaultSalesUserId?: number;
  defaultProjectManagerUserId?: number;
  isFeatured: number;
  isActive: number;
  description?: string;
  lat?: string;
  lng?: string;
  isHc?: number;
  isMd?: number;
}
export class UserQualification {
  id?: number;
  userId: number;
  qualificationId: number;
  school?: string;
  skills?: string;
  startDate?: string | null;
  endDate?: string | null;
  inProgress = 0;
  fieldsOfStudyCategoryId?: number | null;
  fieldsOfStudyId?: number | null;
}
export class FieldsOfStudy {
  id: number;
  name: string;
  isActive?: number;
  priority?: number;
  fieldsOfStudyCategoryId: number;
  highlighted?: number;
}
export class FieldsOfStudyCategory {
  id: number;
  name: string;
  isActive?: number;
  priority?: number;
  oldSzotarTeruletId?: string;
  oldSzotarIparagId?: string;
}
export class Qualification {
  id: number;
  name?: string;
  isActive?: number;
  priority?: number;
  level?: number;
  oldSzotarVegzettsegSzintId?: string;
}
export class UserLanguage {
  id?: number;
  userId: number;
  languageId: number;
  spokenLevel?: number | null;
  writtenLevel?: number | null;
}
export class DriverLicense {
  id: number;
  name?: string;
  isActive?: number;
}

export class Language {
  id: number;
  name?: string;
  isActive?: number;
  priority?: number;
  oldSzotarNyelvId?: number;
  oldMdSzotarNyelvId?: number;
}
export class WorkTypeMd {
  id: number;
  name?: string;
  priority?: number;
  isActive?: number;
  oldMdMunkaTipusId?: string;
}
export class ComputerSkill {
  id: number;
  name?: string;
  priority?: number;
  isActive?: number;
  computerSkillCategoryId: number;
  oldSzotarSzgepIsmeretId?: string;
  oldMdSzotarSzgepIsmeretId?: string;
}
export class ComputerSkillCategory {
  id: number;
  name?: string;
  priority?: number;
  isActive?: number;
}
export class UserDeletionLogs {
  id: number;
  createTime?: string;
  email: string;
  name: string;
  type: number;
}
export class UserComputerSkill {
  id?: number;
  userId: number;
  computerSkillCategoryId?: number | null;
  computerSkillId: number;
  level?: number | null;
}
export class UserExperience {
  id?: number;
  userId: number;
  workTypeMdId: number; // md
  fieldsOfWorkCategoryId?: number | null; // hc
  fieldsOfWorkId?: number | null; // hc
  name?: string;
  companyName?: string;
  place?: string;
  startDate?: string | null;
  endDate?: string | null;
  inProgress = 0;
  mainTask?: string; // md
}
export class SpareTime {
  id: number;
  name: string;
  isActive: number;
  createTime?: string;
  updateTime?: string;
}
export class Referers {
  id: number;
  name: string;
  site?: number;
  priority?: number;
  isActive: number;
  oldSzotarHonnanHallottRolaId?: string;
  oldMdRefererId?: string;
}
export class UserSparetime {
  id?: number;
  userId: number;
  officeId?: number | null;
  cityId?: number | null;

  d1p1 = 0;
  d1p2 = 0;
  d1p3 = 0;
  d1p4 = 0;
  d1p5 = 0;
  d1p6 = 0;

  d2p1 = 0;
  d2p2 = 0;
  d2p3 = 0;
  d2p4 = 0;
  d2p5 = 0;
  d2p6 = 0;

  d3p1 = 0;
  d3p2 = 0;
  d3p3 = 0;
  d3p4 = 0;
  d3p5 = 0;
  d3p6 = 0;

  d4p1 = 0;
  d4p2 = 0;
  d4p3 = 0;
  d4p4 = 0;
  d4p5 = 0;
  d4p6 = 0;

  d5p1 = 0;
  d5p2 = 0;
  d5p3 = 0;
  d5p4 = 0;
  d5p5 = 0;
  d5p6 = 0;

  d6p1 = 0;
  d6p2 = 0;
  d6p3 = 0;
  d6p4 = 0;
  d6p5 = 0;
  d6p6 = 0;

  d7p1 = 0;
  d7p2 = 0;
  d7p3 = 0;
  d7p4 = 0;
  d7p5 = 0;
  d7p6 = 0;
}

export class TagCategory {
  id: number;
  name: string;
  createTime?: string;
  updateTime?: string;
}

export interface Count {
  count: number;
}

export class Tag {
  id: number;
  name: string;
  createTime?: string;
  isActive: number;
  updateTime?: string;
  type: number;
  showFrontend?: number;
  tagCategoryId?: number;
}
export class CompanyFieldsOfWorkCategory {
  companyId: number;
  fieldsOfWorkCategoryId: number;
}

export class FieldsOfWork {
  id: number;
  name?: string;
  isActive: number;
  priority?: number;
  fieldsOfWorkCategoryId: number;
  highlighted: number;
}

export class FieldsOfWorkCategory {
  id: number;
  name?: string;
  isActive: number;
  priority?: number;
  oldSzotarTeruletId?: string;
  oldSzotarIparagId?: string;
}