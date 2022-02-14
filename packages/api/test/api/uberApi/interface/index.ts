/* eslint-disable */
// @ts-nocheck

/**
 * generated by free-swagger
 * @see https://www.npmjs.com/package/free-swagger
 * @title Uber API
 * @description Move your app forward with the Uber API
 * @version 1.0.0
 * @date 2016-12-22 07:36
 **/

export interface Product {
  /** Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles. */
  product_id?: string;
  /** Description of product. */
  description?: string;
  /** Display name of product. */
  display_name?: string;
  /** Capacity of product. For example, 4 people. */
  capacity?: string;
  /** Image URL representing the product. */
  image?: string;
}

export interface PriceEstimate {
  /** Unique identifier representing a specific product for a given latitude & longitude. For example, uberX in San Francisco will have a different product_id than uberX in Los Angeles */
  product_id?: string;
  /** [ISO 4217](http://en.wikipedia.org/wiki/ISO_4217) currency code. */
  currency_code?: string;
  /** Display name of product. */
  display_name?: string;
  /** Formatted string of estimate in local currency of the start location. Estimate could be a range, a single number (flat rate) or "Metered" for TAXI. */
  estimate?: string;
  /** Lower bound of the estimated price. */
  low_estimate?: number;
  /** Upper bound of the estimated price. */
  high_estimate?: number;
  /** Expected surge multiplier. Surge is active if surge_multiplier is greater than 1. Price estimate already factors in the surge multiplier. */
  surge_multiplier?: number;
}

export interface Profile {
  /** First name of the Uber user. */
  first_name?: string;
  /** Last name of the Uber user. */
  last_name?: string;
  /** Email address of the Uber user */
  email?: string;
  /** Image URL of the Uber user. */
  picture?: string;
  /** Promo code of the Uber user. */
  promo_code?: string;
  role?: RoleType;
}

export interface Activity {
  /** Unique identifier for the activity */
  uuid?: string;
}

export interface Activities {
  /** Position in pagination. */
  offset?: number;
  /** Number of items to retrieve (100 max). */
  limit?: number;
  /** Total number of items available. */
  count?: number;
  history?: Activity[];
}

/** Enumeration of Role Type */
export type RoleType = "Admin" | "User" | "SetSms";

export interface CreateOrUpdateUserInput {
  /** 用户ID(ID来自User表) */
  userId?: number;
  /** 用户权限 */
  userRights?: (
    | "View"
    | "Operate"
    | "Auth"
    | "Search"
    | "Delete"
    | "UserManage"
    | "UserConfig"
    | "SetTime"
    | "SetNetwork"
    | "SetSms"
    | "SystemManage"
  )[];
}

export interface Abc {
  id?: string;
  isLow?: boolean;
}

export type ArrayOfAbc = Abc[];

export interface NumberArrayEnumModel {
  foo?: ("0" | "1" | "2" | "4" | "8")[];
  bar?: ("0" | "1" | "2" | "3")[];
}

export interface Error {
  code?: number;
  message?: string;
  fields?: string;
}

export interface PagedResultDto<T> {
  totalCount?: number;
  items?: T[];
}

export interface AuditLogListDto {
  userId?: number;
  id?: number;
}

/** 接口返回结果 */
export interface JsonResult<T> {
  /** 结果 */
  result?: boolean;
  /** 代码 */
  code?:
    | "Success"
    | "Timeout"
    | "Fail"
    | "Expired"
    | "Error"
    | "InternalServerError"
    | "InvalidAnonymousAccess"
    | "UserSessionExpired"
    | "UserIsBinded";
  /** 数据 */
  data?: string;
  /** 消息 */
  message?: string;
}