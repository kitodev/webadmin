import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Language } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent implements OnInit {

  
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  languageId: number;
  listLanguageToEdit: Language;
  listLanguage: Language[] = [];
  editMode = false;
  isNew = false;
  public site: any[] = [];
  public languageForm: FormGroup;

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private router: Router
  ) {
    this.loadingSubject.next(true);

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      if(params.id == 'new') {
        this.isNew = true;
      } else {
        this.languageId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListLanguages();

    if(!this.isNew) {
      this.loopbackService
        .findLanguageById(this.languageId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listLanguageToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const languageFormModel: FormModel<Language> = {
      id: [this.listLanguageToEdit ? this.listLanguageToEdit.id : 0, Validators.required],
      name: [this.listLanguageToEdit ? this.listLanguageToEdit.name : '', Validators.required],
      isActive: [this.listLanguageToEdit ? this.listLanguageToEdit.isActive : 0, Validators.required],
    }

    this.languageForm = this.fb.group(languageFormModel);
    
    this.loadingSubject.next(false);
  }

  loadListLanguages(): any {
    this.loopbackService
    .listLanguages()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.cdr.detectChanges();
    });
  }

  reset(): void {
    Swal.fire({
      title: 'Biztos elveted a műveletet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem'
    }).then((result) => {
      if (result.value) {
        this.languageForm.reset();
        this.router.navigate(['/dictionary/languages/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.languageForm.value) {

      this.languageForm.controls['isActive'].value == true 
      ? this.languageForm.controls['isActive'].setValue(1) 
      : this.languageForm.controls['isActive'].setValue(0);

      const languages: Language = {
        ...this.languageForm.value,
      };

      this.loopbackService
      .saveLanguage(languages)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.languageForm.markAllAsTouched();
        this.router.navigate(['/dictionary/languages/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.languageForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
