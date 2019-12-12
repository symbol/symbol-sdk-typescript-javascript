import {AppState} from './types';
import {Store} from 'vuex';

export enum NoticeType {
  success = 'success',
  error = 'error',
  warning = 'warning',
}

export class Notice {
  private constructor(
    public message: string,
    public type: NoticeType,
  ) {}

  public static trigger(
    message: string,
    type: NoticeType,
    store: Store <AppState>,
  ): void {
    store.commit('TRIGGER_NOTICE', new Notice(message, type))
  }
}