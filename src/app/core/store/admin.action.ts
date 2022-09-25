import { Action } from '@ngrx/store';
import { Account, Setting } from './admin.model';

export const ADD_SETTING = 'ADD_SETTING';
export const SET_SITE = 'SET_SITE';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_ROUTE = 'SET_ROUTE';
export const SET_REWRITE = 'SET_REWRITE';
export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_TOKEN = 'SET_TOKEN';
export const SET_ME = 'SET_ME';

export class AddSettingAction implements Action {
  readonly type = ADD_SETTING;
  // payload: SiteSetting;
  constructor(public payload: Setting) { }
}

export class SetSiteAction implements Action {
  readonly type = SET_SITE;
  constructor(public payload: string) { }
}

export class SetLanguageAction implements Action {
  readonly type = SET_LANGUAGE;
  constructor(public payload: string) { }
}

export class SetRouteAction implements Action {
  readonly type = SET_ROUTE;
  constructor(public payload: any) { }
}

export class SetRewriteAction implements Action {
  readonly type = SET_REWRITE;
  constructor(public payload: any) { }
}

export class SetAccountAction implements Action {
  readonly type = SET_ACCOUNT;
  constructor(public payload: Account | null) { }
}

export class SetTokenAction implements Action {
  readonly type = SET_TOKEN;
  constructor(public payload: string | null) { }
}
