import { ActionReducerMap } from '@ngrx/store';
import { AdminReducer, AdminState } from './admin.reducer';

export const rootReducer = {};

export interface AppState {
  adminStore: AdminState;
}

export const reducers: ActionReducerMap<AppState, any> = {
  adminStore: AdminReducer
};
