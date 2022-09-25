import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { TranslationService } from '../../../../../../modules/i18n';
import { AuthService, UserType } from '../../../../../../modules/auth';
import { Crud, CrudPosition, CrudUser } from '../../../../../../modules/auth/services/auth-http/auth-http.service';

@Component({
  selector: 'app-user-inner',
  templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  language: LanguageFlag;
  user$: Observable<UserType>;
  userRole$: Observable<string[]>;
  langs = languages;
  private unsubscribe: Subscription[] = [];

  officeId: number;
  positionId: number;
  userId: number;

  constructor(
    private auth: AuthService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.userRole$ = this.auth.currentRoleSubject.asObservable();
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }

  selectLanguage(lang: string) {
    this.translationService.setLanguage(lang);
    this.setLanguage(lang);
    // document.location.reload();
  }

  setLanguage(lang: string) {
    this.langs.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
  }

  prevent(evt: any): boolean {
    console.log('prevent', evt);
    evt.preventDefault();
    evt.stopPropagation();
    return false;
  }

  me() {
    const sb = this.auth.me().subscribe((response) => {
      console.log('me', response);
    });
    this.unsubscribe.push(sb);
  }

  roles() {
    const sb = this.auth.roles().subscribe((response) => {
      console.log('roles', response);
    });
    this.unsubscribe.push(sb);
  }

  dictionary(crudChar?: string) {
    let crud: Crud | undefined = undefined;
    switch (crudChar) {
      case 'c':
        crud = Crud.create;
        break;
      case 'r':
        crud = Crud.read;
        break;
      case 'u':
        crud = Crud.update;
        break;
      case 'd':
        crud = Crud.delete;
        break;
    }
    const sb = this.auth.dictionary(crud).subscribe((response) => {
      console.log(`dictionary permission (method:${crud})`, response);
    });
    this.unsubscribe.push(sb);
  }

  office(officeId?: number, crudChar?: string) {
    if (!officeId && this.officeId) {
      officeId = this.officeId;
    }
    let crud: Crud | undefined = undefined;
    switch (crudChar) {
      case 'c':
        crud = Crud.create;
        break;
      case 'r':
        crud = Crud.read;
        break;
      case 'u':
        crud = Crud.update;
        break;
      case 'd':
        crud = Crud.delete;
        break;
    }
    const sb = this.auth.office(officeId, crud).subscribe((response) => {
      console.log(`office permission (id:${officeId}/method:${crud})`, response);
    });
    this.unsubscribe.push(sb);
  }

  company(crudChar?: string) {
    let crud: Crud | undefined = undefined;
    switch (crudChar) {
      case 'c':
        crud = Crud.create;
        break;
      case 'r':
        crud = Crud.read;
        break;
      case 'u':
        crud = Crud.update;
        break;
      case 'd':
        crud = Crud.delete;
        break;
    }
    const sb = this.auth.company(crud).subscribe((response) => {
      console.log(`company permission (method:${crud})`, response);
    });
    this.unsubscribe.push(sb);
  }

  position(positionId?: number, crudChar?: string) {
    if (!positionId && this.positionId) {
      positionId = this.positionId;
    }
    let crud: CrudPosition | undefined = undefined;
    switch (crudChar) {
      case 'c':
        crud = CrudPosition.create;
        break;
      case 'r':
        crud = CrudPosition.read;
        break;
      case 'u':
        crud = CrudPosition.update;
        break;
      case 'd':
        crud = CrudPosition.delete;
        break;
      case 'pu':
        crud = CrudPosition.publish;
        break;
      case 's':
        crud = CrudPosition.status;
        break;
      case 'a':
        crud = CrudPosition.applicants;
        break;
      case 'pe':
        crud = CrudPosition.permission;
        break;
    }
    const sb = this.auth.position(positionId, crud).subscribe((response) => {
      console.log(`position permission (id:${positionId}/method:${crud})`, response);
    });
    this.unsubscribe.push(sb);
  }

  positionOffice() {
    const sb = this.auth.positionOffice().subscribe((response) => {
      console.log('positionOffice', response);
    });
    this.unsubscribe.push(sb);
  }

  user(userId?: number, crudChar?: string) {
    if (!userId && this.userId) {
      userId = this.userId;
    }
    let crud: CrudUser | undefined = undefined;
    switch (crudChar) {
      case 'c':
        crud = CrudUser.create;
        break;
      case 'r':
        crud = CrudUser.read;
        break;
      case 'u':
        crud = CrudUser.update;
        break;
      case 'd':
        crud = CrudUser.delete;
        break;
    }
    const sb = this.auth.user(userId, crud).subscribe((response) => {
      console.log(`user permission (id:${userId}/method:${crud})`, response);
    });
    this.unsubscribe.push(sb);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'en',
    name: 'English',
    flag: './assets/media/flags/united-states.svg',
  },
  {
    lang: 'zh',
    name: 'Mandarin',
    flag: './assets/media/flags/china.svg',
  },
  {
    lang: 'es',
    name: 'Spanish',
    flag: './assets/media/flags/spain.svg',
  },
  {
    lang: 'ja',
    name: 'Japanese',
    flag: './assets/media/flags/japan.svg',
  },
  {
    lang: 'de',
    name: 'German',
    flag: './assets/media/flags/germany.svg',
  },
  {
    lang: 'fr',
    name: 'French',
    flag: './assets/media/flags/france.svg',
  },
];
