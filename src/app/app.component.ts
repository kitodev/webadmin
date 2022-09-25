import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {TranslationService} from './modules/i18n';
// language list
import {locale as enLang} from './modules/i18n/vocabs/en';
import {locale as chLang} from './modules/i18n/vocabs/ch';
import {locale as esLang} from './modules/i18n/vocabs/es';
import {locale as jpLang} from './modules/i18n/vocabs/jp';
import {locale as deLang} from './modules/i18n/vocabs/de';
import {locale as frLang} from './modules/i18n/vocabs/fr';
import {locale as huLang} from './modules/i18n/vocabs/hu';
import { isPlatformBrowser } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isBrowser: boolean;

  constructor(
      private translationService: TranslationService,
      @Inject(PLATFORM_ID) platformId: any,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    // register translations
    this.translationService.loadTranslations(
      enLang,
      huLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {}
}
