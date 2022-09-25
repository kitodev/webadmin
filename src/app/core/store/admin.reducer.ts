import { Setting, Account } from './admin.model';
import * as Actions from './admin.action';

export interface AdminState {
  site: string;
  language: string;
  settings: Setting[];
  account?: Account | null;
  route: any;
  rewrite: any;
  token: string | null;
}
const initialState: AdminState = {
  site: '',
  language: '',
  settings: [],
  route: null,
  rewrite: null,
  token: null,
};
export function AdminReducer(
  state: AdminState = initialState,
  action: any
): any {
  switch (action.type) {
    case Actions.ADD_SETTING:
      return {
        ...state,
        settings: [...state.settings, action.payload]
      };
    case Actions.SET_SITE:
      return {
        ...state,
        site: action.payload
      };
    case Actions.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
    case Actions.SET_ROUTE:
      return {
        ...state,
        route: action.payload
      };
    case Actions.SET_REWRITE:
      return {
        ...state,
        rewrite: action.payload
      };
    case Actions.SET_ACCOUNT:
      return {
        ...state,
        account: action.payload
      };
    case Actions.SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    default:
      return state;
  }
}
