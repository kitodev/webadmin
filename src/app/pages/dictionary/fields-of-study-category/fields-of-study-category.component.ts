import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FieldsOfStudyCategory } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-study-category',
  templateUrl: './fields-of-study-category.component.html',
  styleUrls: ['./fields-of-study-category.component.scss']
})
export class FieldsOfStudyCategoryComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  fieldsOfStudyCategory: FieldsOfStudyCategory[] = [];
  errors: HttpErrorResponse;
  errorMsg: string = '';
  isNew = false;
  fieldsOfStudyId: number;

  listFieldsOfWorkToEdit: FieldsOfStudyCategory;

  public fieldsOfStudyForm: FormGroup;

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  
  constructor(private cdr: ChangeDetectorRef,
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
          this.fieldsOfStudyId = params.id;
        }
      })
  }

  ngOnInit(): void {
    this.loadListFieldsOfStudyCategory();

    if(!this.isNew) {
      this.loopbackService
        .findFieldsOfStudyCategoryById(this.fieldsOfStudyId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listFieldsOfWorkToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const fieldsOfStudyFormModel: FormModel<FieldsOfStudyCategory> = {
      id: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.id : 0, Validators.required],
      //fieldsOfWorkCategoryId: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit. fieldsOfWorkCategoryId : 0, Validators.required],
      name: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.name : '', Validators.required],
      isActive: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.isActive : 0, Validators.required],
      //highlighted: [this.listFieldsOfWorkToEdit ? this.listFieldsOfWorkToEdit.highlighted : 0, Validators.required],

  }

    this.fieldsOfStudyForm = this.fb.group(fieldsOfStudyFormModel);
    this.loadingSubject.next(false);
  }

  loadListFieldsOfStudyCategory(): any {
    this.loopbackService
    .listFieldsOfStudyCategories()
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
        this.fieldsOfStudyForm.reset();
        this.buildForm();
        this.router.navigate(['/dictionary/fields-of-study-category/list'])
            .then();
      }
    })
  }

  saveSettings(): void {
    if (this.fieldsOfStudyForm.value) {
      this.fieldsOfStudyForm.controls['isActive'].value == true 
      ? this.fieldsOfStudyForm.controls['isActive'].setValue(1) 
      : this.fieldsOfStudyForm.controls['isActive'].setValue(0);

      const fieldsOfStudyCategory: FieldsOfStudyCategory = {
        ...this.fieldsOfStudyForm.value,
      };  

      this.loopbackService
      .saveFieldsOfStudyCategory(fieldsOfStudyCategory)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.fieldsOfStudyForm.markAllAsTouched();
        this.router.navigate(['/dictionary/fields-of-study-category/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.fieldsOfStudyForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
