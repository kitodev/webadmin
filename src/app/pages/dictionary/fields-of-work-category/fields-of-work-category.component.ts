import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { FieldsOfWork, FieldsOfWorkCategory } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-work-category',
  templateUrl: './fields-of-work-category.component.html',
  styleUrls: ['./fields-of-work-category.component.scss']
})
export class FieldsOfWorkCategoryComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  listFieldsOfWork: FieldsOfWork[] = [];
  errors: HttpErrorResponse;
  errorMsg: string = '';
  isNew = false;
  fieldsOfWorkCategoryId: number;
  fieldsOfWorkId: number;

  listFieldsOfWorkCategoryToEdit: FieldsOfWorkCategory;

  public fieldsOfWorkFormCategory: FormGroup;
  public categories: any[] = [];

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
          this.fieldsOfWorkCategoryId = params.id;
        }
      })
  }

  ngOnInit(): void {
    this.loadListFieldsOfWorkCategory();

    if(!this.isNew) {
      this.loopbackService
        .findFieldsOfWorkCategoryById(this.fieldsOfWorkCategoryId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listFieldsOfWorkCategoryToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const fieldsOfWorkFormCategoryModel: FormModel<FieldsOfWorkCategory> = {
      id: [this.listFieldsOfWorkCategoryToEdit ? this.listFieldsOfWorkCategoryToEdit.id : 0, Validators.required],
      name: [this.listFieldsOfWorkCategoryToEdit ? this.listFieldsOfWorkCategoryToEdit.name : '', Validators.required],
      isActive: [this.listFieldsOfWorkCategoryToEdit ? this.listFieldsOfWorkCategoryToEdit.isActive : 0, Validators.required],
    }

    this.fieldsOfWorkFormCategory = this.fb.group(fieldsOfWorkFormCategoryModel);

    this.loopbackService
    .listFieldsOfWorkCategories()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.categories.push(element);
        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }
  
  fieldsOfWork(fieldsOfWorkCategoryId: any): any {
    this.router
    .navigate(['/dictionary/fields-of-works/list/'],{
      queryParams: {fieldsOfWorkCategoryId: fieldsOfWorkCategoryId
    }})
  }

  loadListFieldsOfWorkCategory(): any {
    this.loopbackService
    .listFieldsOfWorks(this.fieldsOfWorkCategoryId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      console.log(response);
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
        this.fieldsOfWorkFormCategory.reset();
        this.router.navigate(['/dictionary/fields-of-work-category/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.fieldsOfWorkFormCategory.value) {
      this.fieldsOfWorkFormCategory.controls['isActive'].value == true 
      ? this.fieldsOfWorkFormCategory.controls['isActive'].setValue(1) 
      : this.fieldsOfWorkFormCategory.controls['isActive'].setValue(0);

      const fieldsOfWorkCategory: FieldsOfWorkCategory = {
        ...this.fieldsOfWorkFormCategory.value,
      };  

      this.loopbackService
      .saveFieldsOfWorkCategory(fieldsOfWorkCategory)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.fieldsOfWorkFormCategory.markAllAsTouched();
        this.router.navigate(['/dictionary/fields-of-work-category/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
        this.toastService.error('Error');
        this.fieldsOfWorkFormCategory.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
